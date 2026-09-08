import time
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from optimizer.models import (
    OptimizationRequest, OptimizationResult, ComparisonResult,
    Depot, Vehicle, Delivery
)
from optimizer.demo_data import get_demo_depot, get_demo_vehicles, get_demo_deliveries
from optimizer.classical_vrp import ClassicalVRPSolver
from optimizer.qubo_vrp import QuantumInspiredVRPSolver
from optimizer.metrics import build_comparison_metrics

app = FastAPI(
    title="RouteQ API — Intelligent Vehicle Routing Optimizer",
    description="Quantum-Inspired and Classical Optimization Engine for CVRPTW",
    version="1.0.0"
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "RouteQ Optimization Engine",
        "solvers": [
            {
                "id": "quantum_inspired",
                "name": "Quantum-Inspired Simulated Annealing (QUBO)",
                "type": "Quantum-Inspired Metaheuristic"
            },
            {
                "id": "classical_baseline",
                "name": "Classical Clarke-Wright Savings + 2-Opt",
                "type": "Classical Heuristic"
            },
            {
                "id": "hybrid",
                "name": "Hybrid Quantum-Classical Ensemble",
                "type": "Hybrid Pipeline"
            }
        ],
        "version": "1.0.0"
    }

@app.get("/api/demo-data")
def get_demo():
    """Returns realistic 25 delivery stops, 5 vehicles, and central hub depot."""
    return {
        "depot": get_demo_depot(),
        "vehicles": get_demo_vehicles(),
        "deliveries": get_demo_deliveries()
    }

@app.post("/api/optimize", response_model=OptimizationResult)
def optimize_routes(req: OptimizationRequest):
    depot = req.depot or get_demo_depot()
    
    if not req.vehicles:
        raise HTTPException(status_code=400, detail="At least one vehicle must be provided.")
    if not req.deliveries:
        raise HTTPException(status_code=400, detail="At least one delivery must be provided.")

    if req.solver_type == "classical_baseline":
        solver = ClassicalVRPSolver(
            depot=depot,
            vehicles=req.vehicles,
            deliveries=req.deliveries,
            objective=req.objective,
            traffic_level=req.traffic_level
        )
        return solver.solve()
    elif req.solver_type == "hybrid":
        # Run quantum-inspired, then compare with classical and return the strictly best result
        q_solver = QuantumInspiredVRPSolver(
            depot=depot,
            vehicles=req.vehicles,
            deliveries=req.deliveries,
            objective=req.objective,
            traffic_level=req.traffic_level,
            random_seed=req.random_seed
        )
        c_solver = ClassicalVRPSolver(
            depot=depot,
            vehicles=req.vehicles,
            deliveries=req.deliveries,
            objective=req.objective,
            traffic_level=req.traffic_level
        )
        q_res = q_solver.solve()
        c_res = c_solver.solve()
        # Return best
        if q_res.total_distance_km <= c_res.total_distance_km:
            q_res.solver_name = "Hybrid Quantum-Classical (Quantum Winner)"
            return q_res
        else:
            c_res.solver_name = "Hybrid Quantum-Classical (Classical Winner)"
            return c_res
    else:  # quantum_inspired default
        solver = QuantumInspiredVRPSolver(
            depot=depot,
            vehicles=req.vehicles,
            deliveries=req.deliveries,
            objective=req.objective,
            traffic_level=req.traffic_level,
            random_seed=req.random_seed
        )
        return solver.solve()

@app.post("/api/compare", response_model=ComparisonResult)
def compare_solvers(req: OptimizationRequest):
    depot = req.depot or get_demo_depot()

    if not req.vehicles:
        raise HTTPException(status_code=400, detail="At least one vehicle must be provided.")
    if not req.deliveries:
        raise HTTPException(status_code=400, detail="At least one delivery must be provided.")

    # 1. Unoptimized baseline
    c_solver = ClassicalVRPSolver(
        depot=depot,
        vehicles=req.vehicles,
        deliveries=req.deliveries,
        objective=req.objective,
        traffic_level=req.traffic_level
    )
    unopt_res = c_solver.generate_unoptimized_baseline()

    # 2. Classical baseline
    classic_res = c_solver.solve()

    # 3. Quantum-Inspired solver
    q_solver = QuantumInspiredVRPSolver(
        depot=depot,
        vehicles=req.vehicles,
        deliveries=req.deliveries,
        objective=req.objective,
        traffic_level=req.traffic_level,
        random_seed=req.random_seed
    )
    q_res = q_solver.solve()

    unopt_dict = {
        "total_distance_km": unopt_res.total_distance_km,
        "total_time_mins": unopt_res.total_time_mins,
        "total_fuel_l": unopt_res.total_fuel_l,
        "total_co2_kg": unopt_res.total_co2_kg,
        "late_deliveries_count": float(unopt_res.late_deliveries_count),
        "fleet_utilization_pct": unopt_res.fleet_utilization_pct,
    }

    classic_dict = {
        "total_distance_km": classic_res.total_distance_km,
        "total_time_mins": classic_res.total_time_mins,
        "total_fuel_l": classic_res.total_fuel_l,
        "total_co2_kg": classic_res.total_co2_kg,
        "late_deliveries_count": float(classic_res.late_deliveries_count),
        "fleet_utilization_pct": classic_res.fleet_utilization_pct,
    }

    q_dict = {
        "total_distance_km": q_res.total_distance_km,
        "total_time_mins": q_res.total_time_mins,
        "total_fuel_l": q_res.total_fuel_l,
        "total_co2_kg": q_res.total_co2_kg,
        "late_deliveries_count": float(q_res.late_deliveries_count),
        "fleet_utilization_pct": q_res.fleet_utilization_pct,
    }

    improvements_over_unopt = build_comparison_metrics(unopt_dict, q_dict)
    improvements_over_classic = build_comparison_metrics(classic_dict, q_dict)

    dist_saved_km = round(unopt_res.total_distance_km - q_res.total_distance_km, 1)
    fuel_saved_l = round(unopt_res.total_fuel_l - q_res.total_fuel_l, 1)
    co2_saved_kg = round(unopt_res.total_co2_kg - q_res.total_co2_kg, 1)

    summary_msg = (
        f"Quantum-Inspired QUBO Optimization yielded a {dist_saved_km} km reduction in total travel distance, "
        f"saving approximately {fuel_saved_l} L of fuel and cutting {co2_saved_kg} kg of CO2 emissions compared "
        f"to unoptimized logistics operations. On-time delivery compliance reached {q_res.on_time_percentage}%."
    )

    return ComparisonResult(
        classical=classic_res,
        quantum_inspired=q_res,
        improvements_over_classical=improvements_over_classic,
        improvements_over_unoptimized=improvements_over_unopt,
        unoptimized_summary=unopt_dict,
        summary_analysis=summary_msg
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
