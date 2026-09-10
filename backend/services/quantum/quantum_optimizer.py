"""
Quantum VRP Optimizer for RouteQ.
Orchestrates high-level routing optimization using genuine Qiskit QAOA circuits.
"""
import time
import math
from typing import List, Dict, Tuple, Optional, Any
import numpy as np

from models.schemas import (
    OptimizationRequestInput,
    OptimizationResponseOutput,
    RouteOutput,
    SolverInfo,
    DepotInput,
    VehicleInput,
    DeliveryInput,
    QuantumCircuitInfo,
)
from utils.distance import haversine_distance, calculate_travel_time
from services.metrics import build_route_details
from .qiskit_service import execute_qiskit_qaoa_routing, QiskitExecutionResult

MAX_QUANTUM_DELIVERIES = 10  # Statevector simulation supports up to 10 qubits comfortably


def build_vrp_cost_matrix(
    depot: DepotInput,
    deliveries: List[DeliveryInput],
    objective: str = "balanced",
    traffic_level: str = "medium",
    distance_matrix: Optional[Dict[Tuple[str, str], float]] = None,
    time_matrix: Optional[Dict[Tuple[str, str], float]] = None,
    distance_weight: float = 1.0,
    time_weight: float = 1.0,
    fuel_weight: float = 1.0,
    co2_weight: float = 1.0,
) -> Tuple[List[str], np.ndarray]:
    """
    Constructs the weighted cost matrix C[i][j] between all nodes (Depot + deliveries).
    When real road distance_matrix and time_matrix from Mappls are available,
    uses exact road distance and live traffic durations.
    """
    nodes = [depot.id] + [d.id for d in deliveries]
    n = len(nodes)
    coords = {depot.id: (depot.lat, depot.lng)}
    for d in deliveries:
        coords[d.id] = (d.lat, d.lng)

    obj = (objective or "balanced").lower().replace("min_", "")
    avg_demand = sum(d.get_demand() for d in deliveries) / max(1, len(deliveries)) if deliveries else 10.0

    cost_matrix = np.zeros((n, n), dtype=float)

    for i in range(n):
        for j in range(n):
            if i == j:
                cost_matrix[i, j] = 0.0
            else:
                id_i = nodes[i]
                id_j = nodes[j]

                p1 = coords[id_i]
                p2 = coords[id_j]

                if distance_matrix and (id_i, id_j) in distance_matrix:
                    dist = distance_matrix[(id_i, id_j)]
                else:
                    dist = haversine_distance(p1[0], p1[1], p2[0], p2[1]) * 1.3

                mid_lat = (p1[0] + p2[0]) / 2.0
                mid_lng = (p1[1] + p2[1]) / 2.0
                dist_to_center = haversine_distance(depot.lat, depot.lng, mid_lat, mid_lng)

                cong_mult = 1.0
                if traffic_level in ("heavy", "rush_hour", "high"):
                    cong_mult = 2.25 if dist_to_center < 6.0 else 1.15
                elif traffic_level in ("moderate", "medium"):
                    cong_mult = 1.45 if dist_to_center < 6.0 else 1.05

                base_speed = 36.0 / cong_mult
                t_mins = (
                    time_matrix.get((id_i, id_j), (dist / max(8.0, base_speed)) * 60.0)
                    if time_matrix
                    else (dist / max(8.0, base_speed)) * 60.0
                )

                v_demand = deliveries[j - 1].get_demand() if j > 0 else 0.0

                if obj in ("distance", "min_distance"):
                    cost = dist
                elif obj in ("travel_time", "time", "min_travel_time"):
                    cost = t_mins
                elif obj in ("fuel", "min_fuel"):
                    weight_benefit = (v_demand / max(1.0, avg_demand)) * 0.40
                    cost = dist * (1.25 - weight_benefit)
                elif obj in ("co2", "min_co2"):
                    cost = dist * 0.70 + t_mins * 0.60
                else:  # balanced multi-objective
                    fuel = (dist / 12.0) * (1.0 + (v_demand / max(1.0, avg_demand)) * 0.15)
                    co2 = fuel * 2.68
                    cost = (
                        distance_weight * dist
                        + time_weight * t_mins
                        + fuel_weight * fuel
                        + co2_weight * co2
                    )

                cost_matrix[i, j] = cost

    return nodes, cost_matrix


class QuantumVRPOptimizer:
    """
    End-to-End Quantum VRP Optimizer executing genuine Qiskit QAOA circuits.
    """
    def __init__(
        self,
        request: OptimizationRequestInput,
        distance_matrix: Optional[Dict[Tuple[str, str], float]] = None,
        time_matrix: Optional[Dict[Tuple[str, str], float]] = None,
        is_live_traffic_used: bool = False,
        traffic_provider: str = "Mappls",
        traffic_status: str = "unavailable",
        traffic_last_updated: Optional[str] = None,
    ):
        self.request = request
        self.depot = request.depot or DepotInput(id="DEPOT", lat=12.9279, lng=77.6271)
        self.vehicles = request.vehicles
        self.deliveries = request.deliveries
        self.objective = request.objective or "balanced"
        self.traffic_level = request.traffic_level or "medium"
        self.deliveries_map = {d.id: d for d in self.deliveries}

        self.distance_matrix = distance_matrix
        self.time_matrix = time_matrix
        self.is_live_traffic_used = is_live_traffic_used
        self.traffic_provider = traffic_provider
        self.traffic_status = traffic_status
        self.traffic_last_updated = traffic_last_updated

    def optimize(self) -> OptimizationResponseOutput:
        start_time = time.perf_counter()

        if not self.deliveries:
            raise ValueError("No deliveries provided for quantum optimization.")
        if not self.vehicles:
            raise ValueError("No vehicles provided for quantum optimization.")

        num_deliveries = len(self.deliveries)
        shots = 1024
        p_layers = 1

        if num_deliveries <= MAX_QUANTUM_DELIVERIES:
            # 1. Build cost matrix for single QAOA circuit
            nodes, cost_matrix = build_vrp_cost_matrix(
                depot=self.depot,
                deliveries=self.deliveries,
                objective=self.objective,
                traffic_level=self.traffic_level,
                distance_matrix=self.distance_matrix,
                time_matrix=self.time_matrix,
                distance_weight=float(getattr(self.request, "distance_weight", 1.0) or 1.0),
                time_weight=float(getattr(self.request, "time_weight", 1.0) or 1.0),
                fuel_weight=float(getattr(self.request, "fuel_weight", 1.0) or 1.0),
                co2_weight=float(getattr(self.request, "co2_weight", 1.0) or 1.0),
            )

            # 2. Execute genuine Qiskit QAOA Circuit on StatevectorSampler / AerSimulator
            qiskit_result: QiskitExecutionResult = execute_qiskit_qaoa_routing(
                cost_matrix=cost_matrix,
                shots=shots,
                p_layers=p_layers,
                gamma=0.52,
                beta=0.38,
            )
            optimal_perm_indices = qiskit_result.optimal_sequence_indices
            ordered_delivery_ids = [nodes[idx] for idx in optimal_perm_indices if idx < len(nodes)]
        else:
            # 1. Multi-Cluster QAOA Quantum Circuit Solver for > 10 delivery stops
            # Partitions stops into sub-clusters of <= 8 stops each, executing Qiskit QAOA circuits per cluster
            ordered_delivery_ids = []
            chunk_size = 8
            delivery_chunks = [self.deliveries[i:i + chunk_size] for i in range(0, num_deliveries, chunk_size)]

            total_qubits = 0
            total_depth = 0
            merged_counts: Dict[str, int] = {}
            last_diagram = ""
            backend_name = "Qiskit StatevectorSampler (Multi-Cluster QAOA)"

            for chunk in delivery_chunks:
                nodes_chunk, cost_matrix_chunk = build_vrp_cost_matrix(
                    depot=self.depot,
                    deliveries=chunk,
                    objective=self.objective,
                    traffic_level=self.traffic_level,
                    distance_matrix=self.distance_matrix,
                    time_matrix=self.time_matrix,
                    distance_weight=float(getattr(self.request, "distance_weight", 1.0) or 1.0),
                    time_weight=float(getattr(self.request, "time_weight", 1.0) or 1.0),
                    fuel_weight=float(getattr(self.request, "fuel_weight", 1.0) or 1.0),
                    co2_weight=float(getattr(self.request, "co2_weight", 1.0) or 1.0),
                )
                chunk_res = execute_qiskit_qaoa_routing(
                    cost_matrix=cost_matrix_chunk,
                    shots=shots,
                    p_layers=p_layers,
                    gamma=0.52,
                    beta=0.38,
                )
                total_qubits += chunk_res.qubits
                total_depth = max(total_depth, chunk_res.depth)
                merged_counts.update(chunk_res.counts)
                last_diagram = chunk_res.circuit_diagram
                backend_name = chunk_res.backend_name

                chunk_ordered_ids = [nodes_chunk[idx] for idx in chunk_res.optimal_sequence_indices if idx < len(nodes_chunk)]
                ordered_delivery_ids.extend(chunk_ordered_ids)

            qiskit_result = QiskitExecutionResult(
                qubits=total_qubits,
                depth=total_depth,
                gate_counts={"qaoa_circuit_clusters": len(delivery_chunks)},
                shots=shots,
                counts=merged_counts,
                optimal_bitstring="qaoa_multi_cluster",
                optimal_sequence_indices=[],
                gamma=0.52,
                beta=0.38,
                p_layers=p_layers,
                backend_name=backend_name,
                circuit_diagram=last_diagram,
                execution_time_seconds=0.0,
            )

        # 4. Multi-Vehicle Fleet Capacity & Stop Partitioning
        num_vehicles = len(self.vehicles)
        vehicle_assignments: List[List[str]] = [[] for _ in range(num_vehicles)]
        vehicle_loads = [0.0 for _ in range(num_vehicles)]

        target_stops = max(1, math.ceil(len(ordered_delivery_ids) / num_vehicles))
        total_demand = sum(self.deliveries_map[did].get_demand() for did in ordered_delivery_ids)
        target_load = max(
            max(self.deliveries_map[did].get_demand() for did in ordered_delivery_ids),
            (total_demand / num_vehicles) * 1.25
        )

        current_veh = 0
        for did in ordered_delivery_ids:
            demand = self.deliveries_map[did].get_demand()
            if (
                current_veh < num_vehicles - 1
                and (
                    len(vehicle_assignments[current_veh]) >= target_stops
                    or vehicle_loads[current_veh] + demand > min(self.vehicles[current_veh].capacity, target_load)
                )
            ):
                current_veh += 1

            vehicle_assignments[current_veh].append(did)
            vehicle_loads[current_veh] += demand

        # 5. Build route details
        vehicle_colors = ["#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"]
        route_outputs: List[RouteOutput] = []

        for idx, (veh, assigned_ids) in enumerate(zip(self.vehicles, vehicle_assignments)):
            color = vehicle_colors[idx % len(vehicle_colors)]
            if assigned_ids:
                full_seq = [self.depot.id] + assigned_ids + [self.depot.id]
            else:
                full_seq = [self.depot.id, self.depot.id]

            r_out = build_route_details(
                vehicle=veh,
                stop_ids=full_seq,
                depot=self.depot,
                deliveries_map=self.deliveries_map,
                traffic_level=self.traffic_level,
                color=color,
                distance_matrix=self.distance_matrix,
                time_matrix=self.time_matrix,
            )
            route_outputs.append(r_out)

        exec_time = round(time.perf_counter() - start_time, 3)
        total_dist = round(sum(r.distance_km for r in route_outputs), 2)
        total_time = round(sum(r.travel_time_minutes for r in route_outputs), 1)
        total_fuel = round(sum(r.fuel_liters for r in route_outputs), 2)
        total_co2 = round(sum(r.co2_kg for r in route_outputs), 2)

        total_late = sum(
            sum(1 for wp in (r.waypoints or []) if wp.is_late)
            for r in route_outputs
        )
        total_delivered = sum(len(r.deliveries) for r in route_outputs)
        on_time_pct = (
            round(((total_delivered - total_late) / max(1, total_delivered)) * 100.0, 1)
            if total_delivered > 0 else 100.0
        )

        traffic_note = (
            "Live Mappls real-time road & traffic data successfully integrated into QAOA Hamiltonian."
            if self.is_live_traffic_used
            else "Live traffic data unavailable; Hamiltonian constructed using non-traffic road estimates."
        )

        # Top bitstrings sorted by count
        top_counts = dict(
            sorted(qiskit_result.counts.items(), key=lambda item: item[1], reverse=True)[:10]
        )

        circuit_info = QuantumCircuitInfo(
            backend_name=qiskit_result.backend_name,
            qubits=qiskit_result.qubits,
            depth=qiskit_result.depth,
            gate_counts=qiskit_result.gate_counts,
            shots=qiskit_result.shots,
            counts=top_counts,
            optimal_bitstring=qiskit_result.optimal_bitstring,
            gamma=qiskit_result.gamma,
            beta=qiskit_result.beta,
            p_layers=qiskit_result.p_layers,
            circuit_diagram=qiskit_result.circuit_diagram,
        )

        return OptimizationResponseOutput(
            status="success",
            method="qiskit",
            routes=route_outputs,
            total_distance_km=total_dist,
            estimated_time_minutes=total_time,
            estimated_fuel_liters=total_fuel,
            estimated_co2_kg=total_co2,
            on_time_delivery_percentage=on_time_pct,
            execution_time_seconds=exec_time,
            solver=SolverInfo(
                name="Qiskit",
                backend=qiskit_result.backend_name,
                algorithm="QAOA (Quantum Approximate Optimization Algorithm)",
                status="completed",
                notes=f"Executed genuine {qiskit_result.qubits}-qubit QAOA circuit with StatevectorSampler ({shots} shots). {traffic_note}",
            ),
            unassigned_deliveries=[],
            traffic_status=self.traffic_status,
            traffic_provider=self.traffic_provider,
            traffic_last_updated=self.traffic_last_updated,
            is_live_traffic_used=self.is_live_traffic_used,
            quantum_circuit_info=circuit_info,
        )
