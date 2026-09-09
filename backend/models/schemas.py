from typing import List, Optional, Literal, Dict, Any, Union
from pydantic import BaseModel, Field

class DepotInput(BaseModel):
    id: str = "DEPOT-BLR"
    name: Optional[str] = "RouteQ Bengaluru Central Hub (Koramangala)"
    lat: float = 12.9279
    lng: float = 77.6271
    operating_hours_start: Optional[str] = "08:00"
    operating_hours_end: Optional[str] = "18:00"

class VehicleInput(BaseModel):
    id: str
    name: Optional[str] = None
    capacity: float = Field(default=500.0, description="Payload capacity in kg")
    fuel_efficiency: float = Field(default=12.0, description="km per liter")
    fuel_type: Optional[str] = "diesel"  # "diesel", "electric", "hybrid"
    max_route_distance: Optional[float] = 150.0

class DeliveryInput(BaseModel):
    id: str
    customer: Optional[str] = None
    customer_name: Optional[str] = None
    lat: float
    lng: float
    demand: Optional[float] = 5.0
    demand_kg: Optional[float] = None
    priority: Optional[Union[int, str]] = "medium"
    time_window_start: Optional[str] = "09:00"
    time_window_end: Optional[str] = "17:00"
    service_time_mins: Optional[int] = 15
    address: Optional[str] = ""

    def get_customer_name(self) -> str:
        return self.customer or self.customer_name or f"Customer {self.id}"

    def get_demand(self) -> float:
        if self.demand_kg is not None:
            return float(self.demand_kg)
        return float(self.demand or 5.0)

class TrafficStatusResponse(BaseModel):
    status: str  # "live_connected" or "traffic_unavailable"
    provider: str = "Mappls"
    is_live: bool = False
    message: str
    last_updated: Optional[str] = None
    api_configured: bool = False

class OptimizationRequestInput(BaseModel):
    depot: Optional[DepotInput] = None
    vehicles: List[VehicleInput]
    deliveries: List[DeliveryInput]
    optimization_method: Optional[str] = "qiskit"  # "qiskit" or "classical"
    traffic_level: Optional[str] = "medium"        # "low", "medium", "high"
    objective: Optional[str] = "balanced"          # "distance", "time", "fuel", "co2", "balanced"
    time_window_mode: Optional[str] = "soft"       # "strict", "soft", "ignore"
    capacity_mode: Optional[str] = "strict"        # "strict", "relaxed"
    quantum_backend: Optional[str] = "aer_simulator"
    use_live_traffic: Optional[bool] = True
    allow_non_traffic_fallback: Optional[bool] = True
    distance_weight: Optional[float] = 1.0
    time_weight: Optional[float] = 1.0
    fuel_weight: Optional[float] = 1.0
    co2_weight: Optional[float] = 1.0

class RefreshTrafficRequest(BaseModel):
    locations: Optional[List[Dict[str, Any]]] = []

class RouteRequest(BaseModel):
    origin: List[float]
    destination: List[float]


class RouteWaypoint(BaseModel):
    sequence_index: int
    stop_id: str
    location_name: str
    lat: float
    lng: float
    arrival_time: str
    departure_time: str
    demand_delivered_kg: float
    remaining_capacity_kg: float
    distance_from_prev_km: float
    travel_time_mins: float
    is_depot: bool = False
    is_late: bool = False
    time_window_start: Optional[str] = None
    time_window_end: Optional[str] = None

class RouteOutput(BaseModel):
    vehicle_id: str
    vehicle_name: Optional[str] = None
    color: Optional[str] = "#06b6d4"
    stops: List[str]                  # Sequence e.g. ["DEPOT", "D1", "D2", "DEPOT"]
    deliveries: List[str]             # Delivery IDs visited
    distance_km: float
    travel_time_minutes: float
    fuel_liters: float
    co2_kg: float
    capacity_used: float
    capacity_utilization: float       # Percentage 0 to 100
    waypoints: Optional[List[RouteWaypoint]] = None

class SolverInfo(BaseModel):
    name: str
    backend: str
    algorithm: str
    status: str
    notes: Optional[str] = None

class QuantumCircuitInfo(BaseModel):
    backend_name: str
    qubits: int
    depth: int
    gate_counts: Dict[str, int]
    shots: int
    counts: Dict[str, int]
    optimal_bitstring: str
    gamma: float
    beta: float
    p_layers: int
    circuit_diagram: Optional[str] = None

class OptimizationResponseOutput(BaseModel):
    status: str = "success"
    method: str
    routes: List[RouteOutput]
    total_distance_km: float
    estimated_time_minutes: float
    estimated_fuel_liters: float
    estimated_co2_kg: float
    on_time_delivery_percentage: float
    execution_time_seconds: float
    solver: SolverInfo
    unassigned_deliveries: Optional[List[str]] = []
    comparison: Optional[Dict[str, Any]] = None
    traffic_status: Optional[str] = "unavailable"  # "live_connected" or "unavailable"
    traffic_provider: Optional[str] = "Mappls"
    traffic_last_updated: Optional[str] = None
    is_live_traffic_used: bool = False
    quantum_circuit_info: Optional[QuantumCircuitInfo] = None

