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
    RefreshTrafficRequest,
    RouteRequest,
)
from services.classical_optimizer import ClassicalOptimizer
from services.quantum import QuantumVRPOptimizer
from services.qiskit_optimizer import QiskitVRPOptimizer

try:
    import qiskit
    QISKIT_AVAILABLE = True
    QISKIT_VERSION = qiskit.__version__
except ImportError:
    QISKIT_AVAILABLE = False
    QISKIT_VERSION = None

try:
    import qiskit_aer
    AER_AVAILABLE = True
except ImportError:
    AER_AVAILABLE = False
from services.route_optimizer import run_route_optimization, run_comparison_benchmark
from services.traffic_service import (
    get_traffic_status,
    get_distance_matrix,
    get_route,
    get_live_eta,
    refresh_traffic,
    get_ist_timestamp,
    TRAFFIC_PROVIDER_NAME,
)
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
# Helper: Collect Coordinates & Build Traffic Matrix
# -------------------------------------------------------------------
def prepare_traffic_matrix(req: OptimizationRequestInput):
    """
    1. Collects depot and delivery coordinates.
    2. Requests real road travel information from Mappls / routing API.
    3. Builds distance matrix & travel-time matrix.
    4. If traffic API is unavailable and allow_non_traffic_fallback is False, raises HTTP 503.
    """
    depot_loc = {
        "id": req.depot.id if req.depot else "DEPOT",
        "lat": req.depot.lat if req.depot else 12.9279,
        "lng": req.depot.lng if req.depot else 77.6271,
    }
    locations = [depot_loc] + [{"id": d.id, "lat": d.lat, "lng": d.lng} for d in req.deliveries]

    if req.use_live_traffic:
        traffic_res = get_distance_matrix(locations)
        if traffic_res.get("status") == "success":
            return (
                traffic_res.get("distance_matrix"),
                traffic_res.get("time_matrix"),
                True,
                "live_connected",
                TRAFFIC_PROVIDER_NAME,
                traffic_res.get("last_updated", get_ist_timestamp()),
            )
        else:
            if not req.allow_non_traffic_fallback:
                raise HTTPException(
                    status_code=503,
                    detail={
                        "status": "traffic_unavailable",
                        "message": "Live traffic data is currently unavailable.",
                    },
                )

    # Fallback to non-traffic road estimation
    return (
        None,
        None,
        False,
        "traffic_unavailable",
        TRAFFIC_PROVIDER_NAME,
        get_ist_timestamp(),
    )

# -------------------------------------------------------------------
# Core API Endpoints (as requested)
# -------------------------------------------------------------------

@app.get("/health")
@app.get("/api/health")
def health_check():
    """Returns system status, active quantum simulator backend, and available solvers."""
    traffic_status = get_traffic_status()
    return {
        "status": "healthy",
        "service": "RouteQ Optimization Engine",
        "version": "2.0.0",
        "qiskit_installed": QISKIT_AVAILABLE,
        "qiskit_version": QISKIT_VERSION,
        "qiskit_aer_installed": AER_AVAILABLE,
        "quantum_backend": "StatevectorSampler (Qiskit Local Quantum Simulator)",
        "supported_methods": ["classical", "qiskit", "quantum"],
        "traffic_provider": TRAFFIC_PROVIDER_NAME,
        "traffic_status": traffic_status.get("status"),
        "traffic_is_live": traffic_status.get("is_live"),
        "traffic_last_updated": traffic_status.get("last_updated"),
        "solvers": [
            {
                "id": "qiskit",
                "name": "Qiskit QAOA Quantum Simulator",
                "backend": "Qiskit StatevectorSampler",
                "algorithm": "QAOA",
                "max_deliveries": 10,
                "notes": f"Genuine Qiskit {QISKIT_VERSION or '1.0+'} parameterized QAOA quantum circuits executed on StatevectorSampler"
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

# -------------------------------------------------------------------
# Traffic Endpoints (India / Mappls API)
# -------------------------------------------------------------------
@app.get("/api/traffic/status")
def api_traffic_status():
    """Returns real-time connection status of Mappls Traffic & Routing API."""
    return get_traffic_status()

@app.post("/api/traffic/matrix")
def api_traffic_matrix(req: RefreshTrafficRequest):
    """Fetches real road distance and travel-time matrix for locations."""
    return get_distance_matrix(req.locations)

@app.post("/api/traffic/route")
def api_traffic_route(req: RouteRequest):
    """Fetches real road turn-by-turn route and geometry between origin and destination."""
    if len(req.origin) < 2 or len(req.destination) < 2:
        raise HTTPException(status_code=400, detail="Invalid origin or destination coordinates.")
    return get_route((req.origin[0], req.origin[1]), (req.destination[0], req.destination[1]))

@app.post("/api/traffic/live-eta")
def api_traffic_live_eta(req: RouteRequest):
    """Calculates live traffic-aware ETA and arrival timestamp in IST."""
    if len(req.origin) < 2 or len(req.destination) < 2:
        raise HTTPException(status_code=400, detail="Invalid origin or destination coordinates.")
    return get_live_eta((req.origin[0], req.origin[1]), (req.destination[0], req.destination[1]))

@app.post("/api/traffic/refresh")
def api_traffic_refresh(req: RefreshTrafficRequest):
    """Refreshes live traffic travel matrix and returns current IST timestamp."""
    return refresh_traffic(req.locations)

@app.get("/optimization/status")
@app.get("/api/optimization/status")
def get_optimization_status():
    """Returns real-time status of the optimization engine."""
    return _last_optimization_status

@app.post("/optimize/classical", response_model=OptimizationResponseOutput)
@app.post("/api/optimize/classical", response_model=OptimizationResponseOutput)
def optimize_classical(req: OptimizationRequestInput):
    """Executes the classical Clarke-Wright savings + 2-opt optimizer with real road matrices."""
    req.optimization_method = "classical"
    try:
        _last_optimization_status["status"] = "running"
        _last_optimization_status["last_method"] = "classical"

        # ─── Debug: log every request parameter so UI changes are verifiable ─
        print(f"[RouteQ CLASSICAL] "
              f"objective={req.objective!r}, "
              f"traffic={req.traffic_level!r}, "
              f"vehicles={len(req.vehicles)}, "
              f"deliveries={len(req.deliveries)}, "
              f"time_window_mode={req.time_window_mode!r}, "
              f"capacity_mode={req.capacity_mode!r}, "
              f"weights=(d={req.distance_weight}, t={req.time_weight}, f={req.fuel_weight}, co2={req.co2_weight})")

        dist_matrix, time_matrix, is_live, tr_status, tr_provider, tr_updated = prepare_traffic_matrix(req)

        optimizer = ClassicalOptimizer(
            request=req,
            distance_matrix=dist_matrix,
            time_matrix=time_matrix,
            is_live_traffic_used=is_live,
            traffic_provider=tr_provider,
            traffic_status=tr_status,
            traffic_last_updated=tr_updated,
        )
        result = optimizer.optimize()

        print(f"[RouteQ CLASSICAL RESULT] "
              f"routes={len(result.routes)}, "
              f"total_dist={result.total_distance_km}km, "
              f"time={result.estimated_time_minutes}min")

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
    except HTTPException:
        raise
    except Exception as e:
        _last_optimization_status["status"] = "error"
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/quantum/optimize", response_model=OptimizationResponseOutput)
@app.post("/api/quantum/optimize", response_model=OptimizationResponseOutput)
@app.post("/optimize/qiskit", response_model=OptimizationResponseOutput)
@app.post("/api/optimize/qiskit", response_model=OptimizationResponseOutput)
def optimize_quantum(req: OptimizationRequestInput):
    """
    Executes genuine Qiskit QAOA quantum circuits via StatevectorSampler
    with real road distance and travel-time matrices.
    If instance size > 10 stops or simulator error occurs, gracefully falls back to classical heuristic.
    """
    req.optimization_method = "qiskit"
    allow_fb = getattr(req, "allow_classical_fallback", True)
    if allow_fb is None:
        allow_fb = True

    # Multi-cluster Qiskit QAOA execution handled inside QuantumVRPOptimizer for any dataset size

    try:
        _last_optimization_status["status"] = "running"
        _last_optimization_status["last_method"] = "qiskit"

        # ─── Debug: log every request parameter so UI changes are verifiable ─
        print(f"[RouteQ QUANTUM] "
              f"objective={req.objective!r}, "
              f"traffic={req.traffic_level!r}, "
              f"vehicles={len(req.vehicles)}, "
              f"deliveries={len(req.deliveries)}, "
              f"time_window_mode={req.time_window_mode!r}, "
              f"capacity_mode={req.capacity_mode!r}, "
              f"weights=(d={req.distance_weight}, t={req.time_weight}, f={req.fuel_weight}, co2={req.co2_weight})")

        dist_matrix, time_matrix, is_live, tr_status, tr_provider, tr_updated = prepare_traffic_matrix(req)

        optimizer = QuantumVRPOptimizer(
            request=req,
            distance_matrix=dist_matrix,
            time_matrix=time_matrix,
            is_live_traffic_used=is_live,
            traffic_provider=tr_provider,
            traffic_status=tr_status,
            traffic_last_updated=tr_updated,
        )
        result = optimizer.optimize()

        print(f"[RouteQ QUANTUM RESULT] "
              f"routes={len(result.routes)}, "
              f"total_dist={result.total_distance_km}km, "
              f"solver={result.solver.name}")

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
    except HTTPException:
        if allow_fb:
            classical_res = optimize_classical(req)
            classical_res.solver.notes = (
                f"Classical Fallback Active: Qiskit quantum solver encountered an issue. "
                f"Falling back to Classical Clarke-Wright + 2-Opt baseline."
            )
            return classical_res
        raise
    except ValueError as ve:
        if allow_fb:
            classical_res = optimize_classical(req)
            classical_res.solver.notes = (
                f"Classical Fallback Active: {str(ve)}. "
                f"Falling back to Classical Clarke-Wright + 2-Opt baseline."
            )
            return classical_res
        _last_optimization_status["status"] = "error"
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        if allow_fb:
            classical_res = optimize_classical(req)
            classical_res.solver.notes = (
                f"Classical Fallback Active: Qiskit quantum solver error ({str(e)}). "
                f"Falling back to Classical Clarke-Wright + 2-Opt baseline."
            )
            return classical_res
        _last_optimization_status["status"] = "error"
        raise HTTPException(status_code=500, detail=f"Quantum optimization error: {str(e)}")

@app.post("/optimize", response_model=OptimizationResponseOutput)
@app.post("/api/optimize", response_model=OptimizationResponseOutput)
def optimize_generic(req: OptimizationRequestInput):
    """
    Unified optimize endpoint with explicit fallback architecture:
    Qiskit quantum optimizer -> fallback Classical baseline if unavailable or problem size exceeds quantum limits.
    """
    method = (req.optimization_method or "qiskit").lower()
    if method in ("qiskit", "quantum", "qaoa"):
        try:
            return optimize_quantum(req)
        except (HTTPException, Exception) as he:
            allow_fb = getattr(req, "allow_classical_fallback", True)
            if allow_fb is None:
                allow_fb = True
            if allow_fb:
                detail = getattr(he, "detail", str(he))
                classical_res = optimize_classical(req)
                classical_res.solver.notes = (
                    f"Classical Fallback Active: Qiskit quantum solver ({detail}). "
                    f"Falling back to Classical Clarke-Wright + 2-Opt baseline."
                )
                return classical_res
            raise
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
