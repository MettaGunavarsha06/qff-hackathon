export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Depot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  operating_hours_start: string;
  operating_hours_end: string;
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
}

export interface VehicleRoute {
  vehicle_id: string;
  vehicle_name: string;
  color: string;
  assigned_delivery_ids: string[];
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
}

export interface ConvergencePoint {
  iteration: number;
  energy: number;
  best_energy: number;
}

export interface OptimizationResult {
  solver_type: string;
  solver_name: string;
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
}
