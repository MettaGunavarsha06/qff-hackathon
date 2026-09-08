from typing import Dict, Any, Tuple
from models.schemas import OptimizationRequestInput, OptimizationResponseOutput
from services.classical_optimizer import ClassicalOptimizer
from services.qiskit_optimizer import QiskitVRPOptimizer

def run_route_optimization(request: OptimizationRequestInput) -> OptimizationResponseOutput:
    """
    Main dispatching entrypoint. Routes the optimization request
    to either the classical baseline optimizer or the Qiskit quantum optimizer.
    """
    method = (request.optimization_method or "classical").lower()

    if method == "qiskit":
        optimizer = QiskitVRPOptimizer(request)
        return optimizer.optimize()
    else:
        optimizer = ClassicalOptimizer(request)
        return optimizer.optimize()

def run_comparison_benchmark(request: OptimizationRequestInput) -> Dict[str, Any]:
    """
    Runs both Classical and Qiskit optimizers on the same problem instance
    and calculates actual empirical improvements without hard-coded numbers.
    """
    classic_opt = ClassicalOptimizer(request)
    classic_res = classic_opt.optimize()

    # For quantum comparison, ensure problem size constraint is respected
    if len(request.deliveries) <= 6:
        qiskit_opt = QiskitVRPOptimizer(request)
        qiskit_res = qiskit_opt.optimize()
    else:
        # If too large for quantum, return message
        qiskit_res = None

    comparison_data = {
        "classical": classic_res,
        "qiskit": qiskit_res,
        "improvements": None
    }

    if qiskit_res:
        dist_diff = round(classic_res.total_distance_km - qiskit_res.total_distance_km, 2)
        dist_pct = round((dist_diff / max(0.1, classic_res.total_distance_km)) * 100.0, 1)

        time_diff = round(classic_res.estimated_time_minutes - qiskit_res.estimated_time_minutes, 1)
        time_pct = round((time_diff / max(0.1, classic_res.estimated_time_minutes)) * 100.0, 1)

        fuel_diff = round(classic_res.estimated_fuel_liters - qiskit_res.estimated_fuel_liters, 2)
        fuel_pct = round((fuel_diff / max(0.1, classic_res.estimated_fuel_liters)) * 100.0, 1)

        co2_diff = round(classic_res.estimated_co2_kg - qiskit_res.estimated_co2_kg, 2)
        co2_pct = round((co2_diff / max(0.1, classic_res.estimated_co2_kg)) * 100.0, 1)

        comparison_data["improvements"] = {
            "distance_km_saved": dist_diff,
            "distance_percent_saved": dist_pct,
            "time_minutes_saved": time_diff,
            "time_percent_saved": time_pct,
            "fuel_liters_saved": fuel_diff,
            "fuel_percent_saved": fuel_pct,
            "co2_kg_saved": co2_diff,
            "co2_percent_saved": co2_pct,
            "classical_time_sec": classic_res.execution_time_seconds,
            "qiskit_time_sec": qiskit_res.execution_time_seconds,
        }

    return comparison_data
