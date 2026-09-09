"""
Quantum Optimization Package for RouteQ.
Provides real Qiskit circuit building, QAOA execution via StatevectorSampler,
and end-to-end routing optimization.
"""
from .qiskit_service import execute_qiskit_qaoa_routing, QiskitExecutionResult
from .quantum_optimizer import QuantumVRPOptimizer

__all__ = ["execute_qiskit_qaoa_routing", "QiskitExecutionResult", "QuantumVRPOptimizer"]
