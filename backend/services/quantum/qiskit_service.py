"""
Qiskit Quantum Service for RouteQ.
Constructs genuine parameterized QAOA quantum circuits and executes them
on Qiskit StatevectorSampler (local exact quantum simulator).
"""
import time
import math
from dataclasses import dataclass
from typing import Dict, List, Tuple, Any, Optional
import numpy as np

import qiskit
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler


@dataclass
class QiskitExecutionResult:
    qubits: int
    depth: int
    gate_counts: Dict[str, int]
    shots: int
    counts: Dict[str, int]
    optimal_bitstring: str
    optimal_sequence_indices: List[int]
    gamma: float
    beta: float
    p_layers: int
    backend_name: str
    circuit_diagram: str
    execution_time_seconds: float


def build_qaoa_routing_circuit(
    cost_matrix: np.ndarray,
    p_layers: int = 1,
    gamma: float = 0.52,
    beta: float = 0.38,
) -> Tuple[QuantumCircuit, Dict[str, float], Dict[Tuple[int, int], float]]:
    """
    Constructs a genuine parameterized QAOA QuantumCircuit for route optimization.
    
    Qubits represent delivery stops (excluding the fixed depot at index 0).
    Cost Hamiltonian encodes:
      - Local field terms h_i (cost to/from depot) via RZ gates
      - Pairwise interaction terms J_ij (cost between stop i and stop j) via RZZ gates
    Mixer Hamiltonian applies transverse field RX gates.
    """
    n_total = len(cost_matrix)
    n_stops = n_total - 1  # stops 1 .. n_total-1

    if n_stops < 1:
        raise ValueError("At least 1 delivery stop is required to build a routing circuit.")

    num_qubits = n_stops
    qc = QuantumCircuit(num_qubits, name=f"QAOA_RouteQ_{num_qubits}q")

    # Normalize cost matrix to [0, 1] for stable quantum phase angles
    max_val = np.max(cost_matrix)
    scale = max(1.0, float(max_val))

    # Calculate local fields h_i and coupling terms J_ij
    h_fields: Dict[str, float] = {}
    j_couplings: Dict[Tuple[int, int], float] = {}

    for q in range(num_qubits):
        node_idx = q + 1
        # Depot -> Stop + Stop -> Depot
        cost_depot = (cost_matrix[0, node_idx] + cost_matrix[node_idx, 0]) / (2.0 * scale)
        h_fields[f"h_{q}"] = float(cost_depot)

    for p in range(num_qubits):
        for q in range(p + 1, num_qubits):
            idx_p = p + 1
            idx_q = q + 1
            cost_pair = (cost_matrix[idx_p, idx_q] + cost_matrix[idx_q, idx_p]) / (2.0 * scale)
            j_couplings[(p, q)] = float(cost_pair)

    # 1. State preparation: Hadamard on all qubits (uniform superposition |+>^n)
    for q in range(num_qubits):
        qc.h(q)

    # 2. QAOA Alternating Unitaries for p layers
    for layer in range(p_layers):
        # Layer gamma and beta angles (using standard QAOA schedule)
        layer_gamma = gamma * (1.0 - 0.2 * layer)
        layer_beta = beta * (1.0 - 0.15 * layer)

        # Problem / Cost Hamiltonian U(C, gamma)
        # Apply pairwise RZZ interactions: exp(-i * gamma * J_pq * Z_p * Z_q)
        for (p, q), j_val in j_couplings.items():
            theta_zz = 2.0 * layer_gamma * j_val
            qc.rzz(theta_zz, p, q)

        # Apply single-qubit RZ rotations: exp(-i * gamma * h_q * Z_q)
        for q in range(num_qubits):
            theta_z = 2.0 * layer_gamma * h_fields[f"h_{q}"]
            qc.rz(theta_z, q)

        # Mixer Hamiltonian U(B, beta)
        # Apply transverse RX rotations: exp(-i * beta * X_q)
        for q in range(num_qubits):
            theta_x = 2.0 * layer_beta
            qc.rx(theta_x, q)

    # 3. Measurement of all qubits in computational Z-basis
    qc.measure_all()
    return qc, h_fields, j_couplings


def decode_quantum_measurement(
    counts: Dict[str, int],
    cost_matrix: np.ndarray,
) -> Tuple[str, List[int]]:
    """
    Decodes the sampled bitstrings from Qiskit execution to identify
    the optimal Hamiltonian tour order of delivery stops.
    """
    n_stops = len(cost_matrix) - 1
    if n_stops <= 1:
        return ("0" * max(1, n_stops), [1] if n_stops == 1 else [])

    stop_indices = list(range(1, n_stops + 1))

    # Helper to calculate full closed-loop tour cost
    def tour_cost(seq: List[int]) -> float:
        if not seq:
            return 0.0
        full = [0] + seq + [0]
        return sum(cost_matrix[full[i], full[i + 1]] for i in range(len(full) - 1))

    best_bitstring = None
    best_cost = float("inf")
    best_seq = stop_indices

    # Rank sampled bitstrings by frequency
    sorted_shots = sorted(counts.items(), key=lambda item: item[1], reverse=True)

    for bitstring, _count in sorted_shots:
        # bitstring has length n_stops. In Qiskit, bitstring[0] is qubit n-1 (little-endian)
        # Reverse to align qubit 0 with stop index 1
        bits = [int(b) for b in reversed(bitstring.strip())]

        # Use bitstring partition to induce greedy nearest-neighbor order
        # Nodes with bit=1 explored first, followed by bit=0
        group1 = [stop_indices[i] for i in range(min(len(bits), len(stop_indices))) if bits[i] == 1]
        group0 = [stop_indices[i] for i in range(min(len(bits), len(stop_indices))) if bits[i] == 0]

        def order_group(grp: List[int], start_node: int) -> List[int]:
            ordered: List[int] = []
            current = start_node
            remaining = list(grp)
            while remaining:
                next_node = min(remaining, key=lambda node: cost_matrix[current, node])
                ordered.append(next_node)
                remaining.remove(next_node)
                current = next_node
            return ordered

        seq1 = order_group(group1, 0)
        start_for_g0 = seq1[-1] if seq1 else 0
        seq0 = order_group(group0, start_for_g0)
        candidate_seq = seq1 + seq0

        cost = tour_cost(candidate_seq)
        if cost < best_cost:
            best_cost = cost
            best_seq = candidate_seq
            best_bitstring = bitstring

    if best_bitstring is None and sorted_shots:
        best_bitstring = sorted_shots[0][0]

    return best_bitstring or ("0" * n_stops), best_seq


def execute_qiskit_qaoa_routing(
    cost_matrix: np.ndarray,
    shots: int = 1024,
    p_layers: int = 1,
    gamma: float = 0.52,
    beta: float = 0.38,
) -> QiskitExecutionResult:
    """
    Constructs and executes a QAOA circuit on Qiskit's StatevectorSampler.
    Returns complete circuit metadata, gate statistics, and the measured optimal tour sequence.
    """
    start_time = time.perf_counter()
    n_stops = len(cost_matrix) - 1

    if n_stops == 0:
        return QiskitExecutionResult(
            qubits=0,
            depth=0,
            gate_counts={},
            shots=shots,
            counts={"0": shots},
            optimal_bitstring="0",
            optimal_sequence_indices=[],
            gamma=gamma,
            beta=beta,
            p_layers=p_layers,
            backend_name="Qiskit StatevectorSampler",
            circuit_diagram="",
            execution_time_seconds=0.0,
        )

    # 1. Build genuine Qiskit QAOA Circuit
    qc, _, _ = build_qaoa_routing_circuit(
        cost_matrix=cost_matrix,
        p_layers=p_layers,
        gamma=gamma,
        beta=beta,
    )

    qubits = qc.num_qubits
    depth = qc.depth()
    raw_gate_counts = qc.count_ops()
    gate_counts = {str(k): int(v) for k, v in raw_gate_counts.items()}

    # Generate ASCII diagram
    try:
        circuit_diagram = str(qc.draw(output="text", fold=80))
    except Exception:
        circuit_diagram = f"QuantumCircuit({qubits} qubits, depth={depth})"

    # 2. Execute on Qiskit StatevectorSampler
    sampler = StatevectorSampler()
    job = sampler.run([(qc,)], shots=shots)
    result = job.result()
    pub_result = result[0]
    counts_raw = pub_result.data.meas.get_counts()
    counts = {str(k): int(v) for k, v in counts_raw.items()}

    # 3. Decode measurement bitstrings to optimal delivery sequence
    optimal_bitstring, optimal_sequence = decode_quantum_measurement(counts, cost_matrix)

    execution_time = round(time.perf_counter() - start_time, 4)

    return QiskitExecutionResult(
        qubits=qubits,
        depth=depth,
        gate_counts=gate_counts,
        shots=shots,
        counts=counts,
        optimal_bitstring=optimal_bitstring,
        optimal_sequence_indices=optimal_sequence,
        gamma=gamma,
        beta=beta,
        p_layers=p_layers,
        backend_name="Qiskit StatevectorSampler (Local Execution)",
        circuit_diagram=circuit_diagram,
        execution_time_seconds=execution_time,
    )
