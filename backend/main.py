import os
import time
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import (
    OptimizationRequestInput,
    OptimizationResponseOutput,
    DepotInput,
    VehicleInput,
    DeliveryInput,
)
from services.classical_optimizer import ClassicalOptimizer
from services.qiskit_optimizer import QiskitVRPOptimizer, QISKIT_AVAILABLE, AER_AVAILABLE
from services.route_optimizer import run_route_optimization, run_comparison_benchmark
from optimizer.demo_data import get_demo_depot, get_demo_vehicles, get_demo_deliveries

app = FastAPI(
    title="RouteQ — Intelligent Vehicle Routing Optimizer (Qiskit QAOA + Classical)",
    description="Full-stack CVRPTW optimizer powered by Qiskit Aer quantum simulation and classical heuristics.",
    version="2.0.0"
)

# Enable CORS for localhost development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory tracking of last optimization run status
_last_optimization_status = {
    "status": "idle",
    "last_run_time": None,
    "last_method": None,
    "last_solver": None,
    "last_execution_seconds": 0.0,
    "deliveries_count": 0,
    "vehicles_count": 0
}

# -------------------------------------------------------------------
# Core API Endpoints (as requested)
# -------------------------------------------------------------------

@app.get("/health")
@app.get("/api/health")
def health_check():
    """Returns system status, active quantum simulator backend, and available solvers."""
    return {
        "status": "healthy",
        "service": "RouteQ Optimization Engine",
        "version": "2.0.0",
        "qiskit_installed": QISKIT_AVAILABLE,
        "qiskit_aer_installed": AER_AVAILABLE,
        "quantum_backend": os.getenv("QUANTUM_BACKEND", "aer_simulator"),
        "supported_methods": ["classical", "qiskit"],
        "solvers": [
            {
                "id": "qiskit",
                "name": "Qiskit QAOA Simulator",
                "backend": "AerSimulator",
                "algorithm": "QAOA",
                "max_deliveries": 6,
                "notes": "Simulated on local Qiskit Aer / Statevector quantum simulator"
            },
            {
                "id": "classical",
                "name": "Classical Clarke-Wright + 2-Opt",
                "backend": "Local CPU",
                "algorithm": "Clarke-Wright Savings & 2-Opt",
                "max_deliveries": 50,
                "notes": "Fast classical baseline supporting full fleet sizes"
            }
        ]
    }

@app.get("/optimization/status")
@app.get("/api/optimization/status")
def get_optimization_status():
    """Returns real-time status of the optimization engine."""
    return _last_optimization_status

@app.post("/optimize/classical", response_model=OptimizationResponseOutput)
@app.post("/api/optimize/classical", response_model=OptimizationResponseOutput)
def optimize_classical(req: OptimizationRequestInput):
    """Executes the classical Clarke-Wright savings + 2-opt optimizer."""
    req.optimization_method = "classical"
    try:
        _last_optimization_status["status"] = "running"
        _last_optimization_status["last_method"] = "classical"
        
        optimizer = ClassicalOptimizer(req)
        result = optimizer.optimize()

        _last_optimization_status.update({
            "status": "completed",
            "last_run_time": time.strftime("%Y-%m-%d %H:%M:%S"),
            "last_method": "classical",
            "last_solver": result.solver.name,
            "last_execution_seconds": result.execution_time_seconds,
            "deliveries_count": len(req.deliveries),
            "vehicles_count": len(req.vehicles)
        })
        return result
    except Exception as e:
        _last_optimization_status["status"] = "error"
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/optimize/qiskit", response_model=OptimizationResponseOutput)
@app.post("/api/optimize/qiskit", response_model=OptimizationResponseOutput)
def optimize_qiskit(req: OptimizationRequestInput):
    """
    Executes the Qiskit QAOA / QUBO quantum optimizer using AerSimulator.
    Demonstration supports small instances (3 to 6 delivery locations).
    """
    req.optimization_method = "qiskit"
    try:
        _last_optimization_status["status"] = "running"
        _last_optimization_status["last_method"] = "qiskit"

        optimizer = QiskitVRPOptimizer(req)
        result = optimizer.optimize()

        _last_optimization_status.update({
            "status": "completed",
            "last_run_time": time.strftime("%Y-%m-%d %H:%M:%S"),
            "last_method": "qiskit",
            "last_solver": result.solver.name,
            "last_execution_seconds": result.execution_time_seconds,
            "deliveries_count": len(req.deliveries),
            "vehicles_count": len(req.vehicles)
        })
        return result
    except ValueError as ve:
        _last_optimization_status["status"] = "error"
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        _last_optimization_status["status"] = "error"
        raise HTTPException(status_code=500, detail=f"Quantum optimization error: {str(e)}")

@app.post("/optimize", response_model=OptimizationResponseOutput)
@app.post("/api/optimize", response_model=OptimizationResponseOutput)
def optimize_generic(req: OptimizationRequestInput):
    """
    Unified optimize endpoint. Dispatches to either Classical or Qiskit
    based on the 'optimization_method' field in the request.
    """
    method = (req.optimization_method or "classical").lower()
    if method == "qiskit":
        return optimize_qiskit(req)
    else:
        return optimize_classical(req)

@app.post("/compare")
@app.post("/api/compare")
def compare_endpoints(req: OptimizationRequestInput):
    """Runs head-to-head empirical comparison between Classical and Qiskit."""
    return run_comparison_benchmark(req)

# Demo data endpoint for instant 1-click loading
@app.get("/api/demo-data")
def get_demo_datasets():
    """Returns both full classical demo dataset (25 stops) and small quantum demo dataset (4 stops)."""
    depot = get_demo_depot()
    vehicles = get_demo_vehicles()
    deliveries = get_demo_deliveries()

    # Small 4-stop quantum demo dataset
    quantum_deliveries = deliveries[:4]

    return {
        "depot": depot,
        "vehicles": vehicles,
        "deliveries": deliveries,
        "quantum_demo": {
            "depot": depot,
            "vehicles": vehicles[:2],
            "deliveries": quantum_deliveries
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
