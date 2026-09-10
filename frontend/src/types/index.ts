export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  district?: string;
  state?: string;
}

export interface Depot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  operating_hours_start: string;
  operating_hours_end: string;
  district?: string;
  state?: string;
}

export interface Delivery {
  id: string;
  customer_name: string;
  lat: number;
  lng: number;
  demand_kg: number;
  priority: Priority;
  time_window_start: string;
  time_window_end: string;
  service_time_mins: number;
  address?: string;
  district?: string;
  state?: string;
}

export type FuelType = 'diesel' | 'electric' | 'hybrid';

export interface Vehicle {
  id: string;
  name?: string;
  capacity_kg: number;
  starting_depot_id: string;
  max_route_distance_km: number;
  fuel_efficiency_km_per_l: number;
  fuel_type: FuelType;
}

export type OptimizationObjective =
  | 'min_distance'
  | 'min_travel_time'
  | 'min_fuel'
  | 'min_co2'
  | 'balanced';

export type TrafficLevel = 'clear' | 'moderate' | 'heavy' | 'rush_hour';

export type SolverType =
  | 'classical'
  | 'qiskit'
  | 'quantum_inspired'
  | 'classical_baseline'
  | 'hybrid';

export interface Waypoint {
  sequence_index: number;
  stop_id: string;
  location_name: string;
  lat: number;
  lng: number;
  arrival_time: string;
  departure_time: string;
  demand_kg: number;
  remaining_capacity_kg: number;
  distance_from_prev_km: number;
  travel_time_mins: number;
  is_depot: boolean;
  is_late: boolean;
  time_window_start?: string;
  time_window_end?: string;
  district?: string;
  state?: string;
}

export interface VehicleRoute {
  vehicle_id: string;
  vehicle_name: string;
  color: string;
  assigned_delivery_ids: string[];
  stops?: string[];
  waypoints: Waypoint[];
  total_distance_km: number;
  total_time_mins: number;
  capacity_used_kg: number;
  capacity_max_kg: number;
  capacity_utilization_pct: number;
  fuel_consumed_l: number;
  co2_emissions_kg: number;
  deliveries_count: number;
  on_time_rate_pct: number;
  geometry?: [number, number][]; // Street road network coordinates [lat, lng][]
}

export interface ConvergencePoint {
  iteration: number;
  energy: number;
  best_energy: number;
}

export interface TrafficStatus {
  status: 'live_connected' | 'traffic_unavailable';
  provider: string;
  is_live: boolean;
  message: string;
  last_updated?: string;
  api_configured?: boolean;
}

export interface QuantumCircuitInfo {
  backend_name: string;
  qubits: number;
  depth: number;
  gate_counts: Record<string, number>;
  shots: number;
  counts: Record<string, number>;
  optimal_bitstring: string;
  gamma: number;
  beta: number;
  p_layers: number;
  circuit_diagram?: string;
}

export interface OptimizationResult {
  solver_type: string;
  solver_name: string;
  solver?: {
    name: string;
    backend: string;
    algorithm: string;
    status: string;
    notes?: string;
  };
  execution_time_ms: number;
  routes: VehicleRoute[];
  unassigned_deliveries: string[];
  total_distance_km: number;
  total_time_mins: number;
  total_fuel_l: number;
  total_co2_kg: number;
  fleet_utilization_pct: number;
  late_deliveries_count: number;
  on_time_percentage: number;
  convergence_history: ConvergencePoint[];
  objective_score: number;
  traffic_status?: string;
  traffic_provider?: string;
  traffic_last_updated?: string;
  is_live_traffic_used?: boolean;
  quantum_circuit_info?: QuantumCircuitInfo;
}

export interface MetricComparison {
  metric: string;
  label: string;
  before: number;
  after: number;
  difference: number;
  improvement_pct: number;
  unit: string;
  is_favorable_direction_down: boolean;
}

export interface ComparisonResult {
  classical: OptimizationResult;
  quantum_inspired: OptimizationResult;
  improvements_over_classical: MetricComparison[];
  improvements_over_unoptimized: MetricComparison[];
  unoptimized_summary: Record<string, number>;
  summary_analysis: string;
}

export interface OptimizationRequest {
  depot?: Depot;
  vehicles: Vehicle[];
  deliveries: Delivery[];
  objective: OptimizationObjective;
  traffic_level: TrafficLevel;
  time_window_mode: 'strict' | 'soft' | 'ignore';
  capacity_mode: 'strict' | 'relaxed';
  solver_type: SolverType;
  random_seed?: number;
  use_live_traffic?: boolean;
  allow_non_traffic_fallback?: boolean;
  distance_weight?: number;
  time_weight?: number;
  fuel_weight?: number;
  co2_weight?: number;
}

export interface IndiaHubInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  district: string;
  depot: Depot;
  vehicles: Vehicle[];
  deliveries: Delivery[];
}


