from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

class Location(BaseModel):
    lat: float
    lng: float
    address: Optional[str] = ""

class Depot(BaseModel):
    id: str = "DEPOT-01"
    name: str = "Central Logistics Hub"
    lat: float = 37.7749
    lng: float = -122.4194
    operating_hours_start: str = "08:00"
    operating_hours_end: str = "18:00"

class Delivery(BaseModel):
    id: str
    customer_name: str
    lat: float
    lng: float
    demand_kg: float = Field(default=15.0, description="Weight/demand in kg")
    priority: Literal["low", "medium", "high", "urgent"] = "medium"
    time_window_start: str = "09:00"
    time_window_end: str = "13:00"
    service_time_mins: int = 15
    address: Optional[str] = ""

class Vehicle(BaseModel):
    id: str
    name: Optional[str] = None
    capacity_kg: float = 500.0
    starting_depot_id: str = "DEPOT-01"
    max_route_distance_km: float = 120.0
    fuel_efficiency_km_per_l: float = 8.5
    fuel_type: Literal["diesel", "electric", "hybrid"] = "diesel"

OptimizationObjective = Literal[
    "min_distance",
    "min_travel_time",
    "min_fuel",
    "min_co2",
    "balanced"
]

TrafficLevel = Literal["clear", "moderate", "heavy", "rush_hour"]

SolverType = Literal["quantum_inspired", "classical_baseline", "hybrid"]

class OptimizationRequest(BaseModel):
    depot: Optional[Depot] = None
    vehicles: List[Vehicle]
    deliveries: List[Delivery]
    objective: OptimizationObjective = "balanced"
    traffic_level: TrafficLevel = "moderate"
    time_window_mode: Literal["strict", "soft", "ignore"] = "soft"
    capacity_mode: Literal["strict", "relaxed"] = "strict"
    solver_type: SolverType = "quantum_inspired"
    random_seed: Optional[int] = 42

class Waypoint(BaseModel):
    sequence_index: int
    stop_id: str
    location_name: str
    lat: float
    lng: float
    arrival_time: str
    departure_time: str
    demand_kg: float
    remaining_capacity_kg: float
    distance_from_prev_km: float
    travel_time_mins: float
    is_depot: bool = False
    is_late: bool = False
    time_window_start: Optional[str] = None
    time_window_end: Optional[str] = None

class VehicleRoute(BaseModel):
    vehicle_id: str
    vehicle_name: str
    color: str
    assigned_delivery_ids: List[str]
    waypoints: List[Waypoint]
    total_distance_km: float
    total_time_mins: float
    capacity_used_kg: float
    capacity_max_kg: float
    capacity_utilization_pct: float
    fuel_consumed_l: float
    co2_emissions_kg: float
    deliveries_count: int
    on_time_rate_pct: float

class ConvergencePoint(BaseModel):
    iteration: int
    energy: float
    best_energy: float

class OptimizationResult(BaseModel):
    solver_type: str
    solver_name: str
    execution_time_ms: float
    routes: List[VehicleRoute]
    unassigned_deliveries: List[str]
    total_distance_km: float
    total_time_mins: float
    total_fuel_l: float
    total_co2_kg: float
    fleet_utilization_pct: float
    late_deliveries_count: int
    on_time_percentage: float
    convergence_history: List[ConvergencePoint] = []
    objective_score: float

class MetricComparison(BaseModel):
    metric: str
    label: str
    before: float
    after: float
    difference: float
    improvement_pct: float
    unit: str
    is_favorable_direction_down: bool = True

class ComparisonResult(BaseModel):
    classical: OptimizationResult
    quantum_inspired: OptimizationResult
    improvements_over_classical: List[MetricComparison]
    improvements_over_unoptimized: List[MetricComparison]
    unoptimized_summary: Dict[str, float]
    summary_analysis: str
