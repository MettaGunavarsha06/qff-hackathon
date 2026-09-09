"""
Qiskit VRP Optimizer Service Adapter.
Delegates directly to the genuine Qiskit QAOA QuantumVRPOptimizer service.
All fake classical permutation mocks and simulated quantum states have been removed.
"""
from typing import Dict, Tuple, Optional
from models.schemas import OptimizationRequestInput, OptimizationResponseOutput
from services.quantum.quantum_optimizer import QuantumVRPOptimizer


class QiskitVRPOptimizer(QuantumVRPOptimizer):
    """
    Backwards-compatible adapter for QuantumVRPOptimizer executing genuine Qiskit circuits.
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
        super().__init__(
            request=request,
            distance_matrix=distance_matrix,
            time_matrix=time_matrix,
            is_live_traffic_used=is_live_traffic_used,
            traffic_provider=traffic_provider,
            traffic_status=traffic_status,
            traffic_last_updated=traffic_last_updated,
        )
