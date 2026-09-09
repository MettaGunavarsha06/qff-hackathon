import time
import math
from typing import List, Dict, Any, Tuple, Optional
from models.schemas import (
    OptimizationRequestInput,
    OptimizationResponseOutput,
    RouteOutput,
    SolverInfo,
    DepotInput,
    VehicleInput,
    DeliveryInput,
)
from utils.distance import haversine_distance, calculate_travel_time
from services.metrics import build_route_details, parse_time_to_minutes

VEHICLE_COLORS = [
    "#FF5B37",  # RouteQ Coral Orange
    "#3B82F6",  # Blue
    "#10B981",  # Emerald
    "#8B5CF6",  # Violet
    "#F59E0B",  # Amber
    "#EC4899",  # Rose
    "#06B6D4",  # Cyan
    "#14B8A6",  # Teal
]


class ClassicalOptimizer:
    """
    Classical baseline optimizer using Capacity-aware & Multi-Vehicle Clarke-Wright Savings
    with time-window constrained 2-Opt local search refinement.
    Differentiates routes by objective (distance, travel time, fuel, CO2, balanced),
    traffic conditions (congestion multipliers on central corridors), and time window SLAs.
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
        self.request = request
        self.depot = request.depot or DepotInput(id="DEPOT", lat=12.9279, lng=77.6271)
        self.vehicles = request.vehicles or []
        self.deliveries = request.deliveries or []
        self.traffic_level = (request.traffic_level or "medium").lower()
        self.time_window_mode = (request.time_window_mode or "soft").lower()
        self.capacity_mode = (request.capacity_mode or "strict").lower()
        self.objective = (request.objective or "balanced").lower()

        self.deliveries_map = {d.id: d for d in self.deliveries}
        self.avg_demand = (
            sum(d.get_demand() for d in self.deliveries) / max(1, len(self.deliveries))
            if self.deliveries else 10.0
        )

        self.distance_matrix = distance_matrix
        self.time_matrix = time_matrix
        self.is_live_traffic_used = is_live_traffic_used
        self.traffic_provider = traffic_provider
        self.traffic_status = traffic_status
        self.traffic_last_updated = traffic_last_updated

        self.coords: Dict[str, Tuple[float, float]] = {
            self.depot.id: (self.depot.lat, self.depot.lng)
        }
        for d in self.deliveries:
            self.coords[d.id] = (d.lat, d.lng)

    def get_edge_distance(self, u: str, v: str) -> float:
        if u == v:
            return 0.0
        if self.distance_matrix and (u, v) in self.distance_matrix:
            return self.distance_matrix[(u, v)]
        p1 = self.coords.get(u, (self.depot.lat, self.depot.lng))
        p2 = self.coords.get(v, (self.depot.lat, self.depot.lng))
        return haversine_distance(p1[0], p1[1], p2[0], p2[1]) * 1.3

    def get_edge_time(self, u: str, v: str) -> float:
        if u == v:
            return 0.0
        if self.time_matrix and (u, v) in self.time_matrix:
            return self.time_matrix[(u, v)]
        dist = self.get_edge_distance(u, v)

        # Calculate congestion delay based on proximity to city center/depot
        p1 = self.coords.get(u, (self.depot.lat, self.depot.lng))
        p2 = self.coords.get(v, (self.depot.lat, self.depot.lng))
        mid_lat = (p1[0] + p2[0]) / 2.0
        mid_lng = (p1[1] + p2[1]) / 2.0
        dist_to_center = haversine_distance(self.depot.lat, self.depot.lng, mid_lat, mid_lng)

        cong_multiplier = 1.0
        if self.traffic_level in ("heavy", "rush_hour", "high"):
            cong_multiplier = 2.25 if dist_to_center < 6.0 else 1.15
        elif self.traffic_level in ("moderate", "medium"):
            cong_multiplier = 1.45 if dist_to_center < 6.0 else 1.05
        else:  # clear, low
            cong_multiplier = 1.0

        base_speed = 36.0 / cong_multiplier
        return (dist / max(8.0, base_speed)) * 60.0

    def get_edge_cost(self, u: str, v: str) -> float:
        """
        Calculates multi-objective traffic-aware edge cost based on the chosen objective.
          min_distance    -> pure physical distance in km
          min_travel_time -> travel duration with heavy urban congestion slowdowns
          min_fuel        -> fuel consumption with cargo mass shedding incentive
          min_co2         -> eco-routing penalizing high-emission stop-and-go congestion
          balanced        -> weighted combination
        """
        if u == v:
            return 0.0

        dist = self.get_edge_distance(u, v)
        t_mins = self.get_edge_time(u, v)
        v_demand = self.deliveries_map[v].get_demand() if v in self.deliveries_map else 0.0

        obj = self.objective.replace("min_", "")

        if obj in ("distance", "min_distance"):
            return dist

        elif obj in ("travel_time", "time", "min_travel_time"):
            return t_mins

        elif obj in ("fuel", "min_fuel"):
            # Delivering heavier items early sheds mass, saving fuel over subsequent legs
            weight_benefit = (v_demand / max(1.0, self.avg_demand)) * 0.40
            return dist * (1.25 - weight_benefit)

        elif obj in ("co2", "min_co2"):
            # Emissions spike heavily in stop-and-go congestion
            return dist * 0.70 + t_mins * 0.60

        else:  # balanced (default)
            w_d = float(getattr(self.request, "distance_weight", 1.0) or 1.0)
            w_t = float(getattr(self.request, "time_weight", 0.5) or 0.5)
            w_f = float(getattr(self.request, "fuel_weight", 0.3) or 0.3)
            w_c = float(getattr(self.request, "co2_weight", 0.2) or 0.2)
            fuel = (dist / 12.0) * (1.0 + (v_demand / max(1.0, self.avg_demand)) * 0.15)
            co2 = fuel * 2.68
            return w_d * dist + w_t * t_mins + w_f * fuel + w_c * co2

    def optimize(self) -> OptimizationResponseOutput:
        start_time = time.perf_counter()

        if not self.deliveries:
            raise ValueError("No deliveries provided for optimization.")
        if not self.vehicles:
            raise ValueError("No vehicles provided for optimization.")

        k = len(self.vehicles)
        n_deliv = len(self.deliveries)

        # 1. Target Fleet Capacity & Stop Partitions
        # Bound cluster sizes so that ALL k active vehicles receive balanced routes
        target_stops = math.ceil(n_deliv / k)
        max_stops = max(target_stops, math.ceil((n_deliv / k) * (1.25 if self.capacity_mode == "strict" else 1.6)))

        total_demand = sum(d.get_demand() for d in self.deliveries)
        max_veh_cap = max(v.capacity for v in self.vehicles)
        target_cap = max(
            max(d.get_demand() for d in self.deliveries),
            (total_demand / k) * (1.15 if self.capacity_mode == "strict" else 1.5)
        )
        allowed_cap = min(max_veh_cap, target_cap)

        # 2. Multi-Objective Clarke-Wright Savings Calculation
        savings = []
        for i in range(n_deliv):
            id_i = self.deliveries[i].id
            cost_depot_i = self.get_edge_cost(self.depot.id, id_i)
            for j in range(i + 1, n_deliv):
                id_j = self.deliveries[j].id
                cost_depot_j = self.get_edge_cost(self.depot.id, id_j)
                cost_i_j = self.get_edge_cost(id_i, id_j)
                s = cost_depot_i + cost_depot_j - cost_i_j
                savings.append((s, id_i, id_j))

        # Sort descending by savings
        savings.sort(key=lambda x: x[0], reverse=True)

        # 3. Route Merging with Fleet Target Limits
        routes: List[List[str]] = [[d.id] for d in self.deliveries]
        loads: List[float] = [d.get_demand() for d in self.deliveries]

        for s_val, i_id, j_id in savings:
            idx_i = next((idx for idx, r in enumerate(routes) if i_id in r), None)
            idx_j = next((idx for idx, r in enumerate(routes) if j_id in r), None)

            if idx_i is not None and idx_j is not None and idx_i != idx_j:
                combined_load = loads[idx_i] + loads[idx_j]
                combined_stops = len(routes[idx_i]) + len(routes[idx_j])

                if combined_load <= allowed_cap and combined_stops <= max_stops:
                    r_i = routes[idx_i]
                    r_j = routes[idx_j]
                    merged = None

                    if r_i[-1] == i_id and r_j[0] == j_id:
                        merged = r_i + r_j
                    elif r_j[-1] == j_id and r_i[0] == i_id:
                        merged = r_j + r_i
                    elif r_i[-1] == i_id and r_j[-1] == j_id:
                        merged = r_i + list(reversed(r_j))
                    elif r_i[0] == i_id and r_j[0] == j_id:
                        merged = list(reversed(r_i)) + r_j

                    if merged is not None:
                        routes[idx_i] = merged
                        loads[idx_i] = combined_load
                        del routes[idx_j]
                        del loads[idx_j]

        # 4. Multi-Vehicle Fleet Guarantee: Ensure all k active vehicles are utilized
        while len(routes) < k:
            largest_idx = max(range(len(routes)), key=lambda idx: len(routes[idx]))
            if len(routes[largest_idx]) <= 1:
                break
            r = routes[largest_idx]
            mid = len(r) // 2
            r1, r2 = r[:mid], r[mid:]
            routes[largest_idx] = r1
            loads[largest_idx] = sum(self.deliveries_map[x].get_demand() for x in r1)
            routes.append(r2)
            loads.append(sum(self.deliveries_map[x].get_demand() for x in r2))

        # 5. Vehicle Assignment: match routes to vehicles
        # Sort routes by load/distance and assign to the k vehicles
        assignments: List[List[str]] = [[] for _ in range(k)]
        routes.sort(key=lambda r: len(r), reverse=True)
        for idx, r in enumerate(routes):
            v_idx = idx % k
            assignments[v_idx].extend(r)

        # 6. Time-Window Aware Route Evaluation Function
        depot_start_mins = float(parse_time_to_minutes(self.depot.operating_hours_start or "08:30"))

        def evaluate_route(seq: List[str]) -> float:
            curr_time = depot_start_mins
            total_cost = 0.0
            for step in range(len(seq) - 1):
                u, v = seq[step], seq[step + 1]
                edge_c = self.get_edge_cost(u, v)
                edge_t = self.get_edge_time(u, v)
                curr_time += edge_t

                if v in self.deliveries_map:
                    d_obj = self.deliveries_map[v]
                    tw_start = parse_time_to_minutes(d_obj.time_window_start)
                    tw_end = parse_time_to_minutes(d_obj.time_window_end)

                    if curr_time < tw_start:
                        curr_time = tw_start
                    elif curr_time > tw_end:
                        late_mins = curr_time - tw_end
                        if self.time_window_mode == "strict":
                            # Strict penalty forces early time windows to be visited first
                            total_cost += 500.0 + late_mins * 5.0
                        elif self.time_window_mode == "soft":
                            total_cost += 25.0 + late_mins * 0.8

                    curr_time += float(d_obj.service_time_mins or 15)

                total_cost += edge_c
            return total_cost

        # 7. Apply 2-Opt Refinement on each vehicle's route
        route_outputs: List[RouteOutput] = []
        for idx, (veh, node_ids) in enumerate(zip(self.vehicles, assignments)):
            color = VEHICLE_COLORS[idx % len(VEHICLE_COLORS)]
            if node_ids:
                # If strict time window mode, pre-order stops by time window start
                if self.time_window_mode == "strict":
                    node_ids = sorted(
                        node_ids,
                        key=lambda did: (
                            parse_time_to_minutes(self.deliveries_map[did].time_window_start),
                            -1 if (self.deliveries_map[did].priority or "").lower() == "urgent" else 0
                        )
                    )

                full_seq = [self.depot.id] + node_ids + [self.depot.id]
                best_seq = list(full_seq)
                best_val = evaluate_route(best_seq)
                improved = True
                iterations = 0

                while improved and iterations < 35:
                    improved = False
                    iterations += 1
                    for i in range(1, len(best_seq) - 2):
                        for j in range(i + 1, len(best_seq) - 1):
                            candidate = best_seq[:i] + best_seq[i:j + 1][::-1] + best_seq[j + 1:]
                            cand_val = evaluate_route(candidate)
                            if cand_val < best_val - 1e-4:
                                best_seq = candidate
                                best_val = cand_val
                                improved = True
                                break
                        if improved:
                            break

                refined_seq = best_seq
            else:
                refined_seq = [self.depot.id, self.depot.id]

            r_out = build_route_details(
                vehicle=veh,
                stop_ids=refined_seq,
                depot=self.depot,
                deliveries_map=self.deliveries_map,
                traffic_level=self.traffic_level,
                color=color,
                distance_matrix=self.distance_matrix,
                time_matrix=self.time_matrix,
            )
            route_outputs.append(r_out)

        exec_time = round(time.perf_counter() - start_time, 3)
        total_dist = round(sum(r.distance_km for r in route_outputs), 2)
        total_time = round(sum(r.travel_time_minutes for r in route_outputs), 1)
        total_fuel = round(sum(r.fuel_liters for r in route_outputs), 2)
        total_co2 = round(sum(r.co2_kg for r in route_outputs), 2)

        total_late = sum(
            sum(1 for wp in (r.waypoints or []) if wp.is_late)
            for r in route_outputs
        )
        total_delivered = sum(len(r.deliveries) for r in route_outputs)
        on_time_pct = (
            round(((total_delivered - total_late) / max(1, total_delivered)) * 100.0, 1)
            if total_delivered > 0 else 100.0
        )

        solver_notes = (
            f"Multi-Objective {self.objective.upper()} optimization with {len(self.vehicles)} active vehicles "
            f"under {self.traffic_level.upper()} traffic ({self.time_window_mode.upper()} time windows)."
        )

        return OptimizationResponseOutput(
            status="success",
            method="classical",
            routes=route_outputs,
            total_distance_km=total_dist,
            estimated_time_minutes=total_time,
            estimated_fuel_liters=total_fuel,
            estimated_co2_kg=total_co2,
            on_time_delivery_percentage=on_time_pct,
            execution_time_seconds=exec_time,
            solver=SolverInfo(
                name="Classical Clarke-Wright + 2-Opt",
                backend="CPU (Local Execution)",
                algorithm="Multi-Vehicle Clarke-Wright & Time-Window 2-Opt",
                status="completed",
                notes=solver_notes
            ),
            unassigned_deliveries=[],
            traffic_status=self.traffic_status,
            traffic_provider=self.traffic_provider,
            traffic_last_updated=self.traffic_last_updated,
            is_live_traffic_used=self.is_live_traffic_used,
        )
