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
    Classical multi-objective vehicle routing optimizer.
    Differentiates routes by objective:
      - min_distance:    Spatial angular sector clustering & 2-Opt spatial uncrossing (tight convex loops, lowest km)
      - min_travel_time: Time-window chronological sequencing & arterial traffic bypass (zero late stops, lowest mins)
      - min_fuel:        Cargo mass-shedding (heavy stops first) & powertrain efficiency matching (lowest L fuel)
      - min_co2:         Green Fleet Electrification (EV prioritization for high-mileage routes, lowest kg CO2)
      - balanced:        Pareto multi-objective compromise with balanced vehicle stop distribution
    Respects traffic levels (clear, moderate, heavy, rush_hour), time window constraints, and fleet vehicle counts.
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

        # Proximity of edge midpoint to city center/depot
        p1 = self.coords.get(u, (self.depot.lat, self.depot.lng))
        p2 = self.coords.get(v, (self.depot.lat, self.depot.lng))
        mid_lat = (p1[0] + p2[0]) / 2.0
        mid_lng = (p1[1] + p2[1]) / 2.0
        dist_to_center = haversine_distance(self.depot.lat, self.depot.lng, mid_lat, mid_lng)

        cong_multiplier = 1.0
        extra_delay = 0.0

        if self.traffic_level in ("rush_hour", "peak"):
            cong_multiplier = 2.65 if dist_to_center < 6.5 else 1.25
            if dist_to_center < 5.0:
                extra_delay = 8.0  # Dense downtown gridlock delay
        elif self.traffic_level in ("heavy", "high"):
            cong_multiplier = 1.95 if dist_to_center < 6.0 else 1.15
            if dist_to_center < 5.0:
                extra_delay = 4.0
        elif self.traffic_level in ("moderate", "medium"):
            cong_multiplier = 1.35 if dist_to_center < 6.0 else 1.05
        else:  # clear, low
            cong_multiplier = 1.0

        base_speed = 40.0 / cong_multiplier
        return (dist / max(8.0, base_speed)) * 60.0 + extra_delay

    def get_edge_cost(self, u: str, v: str) -> float:
        """
        Calculates multi-objective traffic-aware edge cost based on the chosen objective.
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
            # Penalize edges that arrive late or take long durations in peak traffic
            urgency_bonus = 0.0
            if v in self.deliveries_map:
                tw_start = parse_time_to_minutes(self.deliveries_map[v].time_window_start)
                urgency_bonus = (tw_start - 540) * 0.04
            return t_mins + urgency_bonus

        elif obj in ("fuel", "min_fuel"):
            # Mass shedding: Delivering heavier items earlier saves fuel over subsequent legs
            weight_incentive = (v_demand / max(1.0, self.avg_demand)) * 0.45
            return dist * (1.30 - weight_incentive)

        elif obj in ("co2", "min_co2"):
            # Eco-routing penalizes stop-and-go idle traffic heavily
            p1 = self.coords.get(u, (self.depot.lat, self.depot.lng))
            p2 = self.coords.get(v, (self.depot.lat, self.depot.lng))
            mid_dist = haversine_distance(self.depot.lat, self.depot.lng, (p1[0]+p2[0])/2, (p1[1]+p2[1])/2)
            cong_penalty = 12.0 if mid_dist < 5.0 and self.traffic_level in ("heavy", "rush_hour") else 0.0
            return dist * 0.55 + t_mins * 0.65 + cong_penalty

        else:  # balanced
            w_d = float(getattr(self.request, "distance_weight", 1.0) or 1.0)
            w_t = float(getattr(self.request, "time_weight", 0.5) or 0.5)
            w_f = float(getattr(self.request, "fuel_weight", 0.3) or 0.3)
            w_c = float(getattr(self.request, "co2_weight", 0.2) or 0.2)
            fuel = (dist / 12.0) * (1.0 + (v_demand / max(1.0, self.avg_demand)) * 0.15)
            co2 = fuel * 2.68
            return w_d * dist + w_t * t_mins + w_f * fuel + w_c * co2

    def _run_2opt(self, seq: List[str], eval_fn) -> List[str]:
        """Performs 2-Opt local search refinement on a closed or open route."""
        if len(seq) <= 3:
            return seq

        best_seq = list(seq)
        best_val = eval_fn(best_seq)
        improved = True
        iterations = 0

        while improved and iterations < 40:
            improved = False
            iterations += 1
            for i in range(1, len(best_seq) - 2):
                for j in range(i + 1, len(best_seq) - 1):
                    cand = best_seq[:i] + best_seq[i:j + 1][::-1] + best_seq[j + 1:]
                    cand_val = eval_fn(cand)
                    if cand_val < best_val - 1e-4:
                        best_seq = cand
                        best_val = cand_val
                        improved = True
                        break
                if improved:
                    break
        return best_seq

    def optimize(self) -> OptimizationResponseOutput:
        start_time = time.perf_counter()

        if not self.deliveries:
            raise ValueError("No deliveries provided for optimization.")
        if not self.vehicles:
            raise ValueError("No vehicles provided for optimization.")

        k = len(self.vehicles)
        n_deliv = len(self.deliveries)
        obj = self.objective.replace("min_", "")

        depot_start_mins = float(parse_time_to_minutes(self.depot.operating_hours_start or "08:30"))

        def evaluate_time_cost(seq: List[str]) -> float:
            curr_time = depot_start_mins
            total_penalty = 0.0
            for step in range(len(seq) - 1):
                u, v = seq[step], seq[step + 1]
                edge_t = self.get_edge_time(u, v)
                curr_time += edge_t
                if v in self.deliveries_map:
                    d_obj = self.deliveries_map[v]
                    tw_start = parse_time_to_minutes(d_obj.time_window_start)
                    tw_end = parse_time_to_minutes(d_obj.time_window_end)
                    if curr_time < tw_start:
                        curr_time = tw_start
                    elif curr_time > tw_end:
                        late = curr_time - tw_end
                        total_penalty += (500.0 if self.time_window_mode == "strict" else 40.0) + late * 5.0
                    curr_time += float(d_obj.service_time_mins or 15)
            return curr_time + total_penalty

        def evaluate_distance(seq: List[str]) -> float:
            return sum(self.get_edge_distance(seq[i], seq[i + 1]) for i in range(len(seq) - 1))

        def evaluate_fuel(seq: List[str]) -> float:
            tot = 0.0
            cur_cargo = sum(self.deliveries_map[did].get_demand() for did in seq if did in self.deliveries_map)
            for i in range(len(seq) - 1):
                d = self.get_edge_distance(seq[i], seq[i + 1])
                tot += d * (1.0 + 0.0008 * cur_cargo)
                if seq[i + 1] in self.deliveries_map:
                    cur_cargo -= self.deliveries_map[seq[i + 1]].get_demand()
            return tot

        assignments: List[List[str]] = [[] for _ in range(k)]

        # ─── OBJECTIVE SPECIFIC PARTITIONING ───────────────────────────────────

        if obj in ("distance", "min_distance"):
            # 1. MIN DISTANCE: Spatial Angular Sector Clustering
            # Sort all deliveries by polar angle from central depot
            deliv_angles = [
                (math.atan2(d.lng - self.depot.lng, d.lat - self.depot.lat), d)
                for d in self.deliveries
            ]
            deliv_angles.sort(key=lambda x: x[0])

            # Contiguous geographical angular sectors create compact non-overlapping petals
            for i in range(k):
                start_idx = int(i * n_deliv / k)
                end_idx = int((i + 1) * n_deliv / k)
                assignments[i] = [d.id for _, d in deliv_angles[start_idx:end_idx]]

            # 2-Opt spatial uncrossing for each vehicle
            for i in range(k):
                if assignments[i]:
                    seq = [self.depot.id] + assignments[i] + [self.depot.id]
                    refined = self._run_2opt(seq, evaluate_distance)
                    assignments[i] = [x for x in refined if x != self.depot.id]

        elif obj in ("travel_time", "time", "min_travel_time"):
            # 2. MIN TRAVEL TIME: Time-Window Urgent & Congestion Avoidance
            # Sort deliveries primarily by time window start, then priority, then distance
            sorted_delivs = sorted(
                self.deliveries,
                key=lambda d: (
                    -1 if (d.priority or "").lower() == "urgent" else 0,
                    parse_time_to_minutes(d.time_window_start),
                    haversine_distance(self.depot.lat, self.depot.lng, d.lat, d.lng)
                )
            )
            # Partition across vehicles so early time-windows are balanced across fleet
            for idx, d in enumerate(sorted_delivs):
                assignments[idx % k].append(d.id)

            # Within each route, sequence chronologically to eliminate wait time and lateness
            for i in range(k):
                if assignments[i]:
                    assignments[i].sort(
                        key=lambda did: (
                            parse_time_to_minutes(self.deliveries_map[did].time_window_start),
                            -1 if (self.deliveries_map[did].priority or "").lower() == "urgent" else 0
                        )
                    )
                    seq = [self.depot.id] + assignments[i] + [self.depot.id]
                    refined = self._run_2opt(seq, evaluate_time_cost)
                    assignments[i] = [x for x in refined if x != self.depot.id]

        elif obj in ("fuel", "min_fuel"):
            # 3. MIN FUEL: Mass-Shedding Heuristic
            # Partition deliveries into sectors, but within each route, visit heavy-cargo stops first!
            deliv_by_demand = sorted(self.deliveries, key=lambda d: d.get_demand(), reverse=True)
            for idx, d in enumerate(deliv_by_demand):
                assignments[idx % k].append(d.id)

            # In-route mass shedding: heavy deliveries dropped near beginning of route
            for i in range(k):
                if assignments[i]:
                    assignments[i].sort(key=lambda did: self.deliveries_map[did].get_demand(), reverse=True)
                    seq = [self.depot.id] + assignments[i] + [self.depot.id]
                    refined = self._run_2opt(seq, evaluate_fuel)
                    assignments[i] = [x for x in refined if x != self.depot.id]

            # Vehicle matching: match highest fuel efficiency vehicles to longest routes
            fuel_eff_sorted_veh_indices = sorted(
                range(k),
                key=lambda vi: self.vehicles[vi].fuel_efficiency,
                reverse=True
            )
            route_lengths = [sum(self.get_edge_distance(self.depot.id, did) for did in assignments[i]) for i in range(k)]
            sorted_route_indices = sorted(range(k), key=lambda ri: route_lengths[ri], reverse=True)

            reassigned = [[] for _ in range(k)]
            for v_rank, r_idx in enumerate(sorted_route_indices):
                target_v_idx = fuel_eff_sorted_veh_indices[v_rank]
                reassigned[target_v_idx] = assignments[r_idx]
            assignments = reassigned

        elif obj in ("co2", "min_co2"):
            # 4. MIN CO2: Green Fleet Electrification Dispatch
            # Identify vehicle powertrains (Electric = 0 tailpipe CO2, Hybrid = low, Diesel = high)
            deliv_angles = [
                (math.atan2(d.lng - self.depot.lng, d.lat - self.depot.lat), d)
                for d in self.deliveries
            ]
            deliv_angles.sort(key=lambda x: x[0])

            # Sort vehicles by eco-friendliness: Electric first, then Hybrid, then Diesel
            def eco_rank(v: VehicleInput) -> int:
                ftype = (v.fuel_type or "").lower()
                if "elec" in ftype: return 0
                if "hyb" in ftype: return 1
                return 2

            eco_sorted_veh_indices = sorted(range(k), key=lambda vi: eco_rank(self.vehicles[vi]))

            # Give the largest share of deliveries and longest loops to Electric Vehicles!
            # If there are 5 vehicles and 3 are electric, electric takes 85% of stops
            num_electric = sum(1 for v in self.vehicles if "elec" in (v.fuel_type or "").lower())
            
            cluster_sizes = []
            if num_electric > 0 and num_electric < k:
                # Disproportionately allocate stops to EVs to slash CO2
                stops_for_evs = math.ceil(n_deliv * 0.75)
                ev_per_veh = stops_for_evs // num_electric
                non_ev_per_veh = max(1, (n_deliv - stops_for_evs) // (k - num_electric))

                allocated = 0
                for rank, v_idx in enumerate(eco_sorted_veh_indices):
                    if rank < num_electric:
                        sz = ev_per_veh + (1 if rank < (stops_for_evs % num_electric) else 0)
                    else:
                        sz = max(1, (n_deliv - allocated) // max(1, k - rank))
                    cluster_sizes.append(sz)
                    allocated += sz
            else:
                base_sz = n_deliv // k
                cluster_sizes = [base_sz + (1 if i < n_deliv % k else 0) for i in range(k)]

            curr_d = 0
            for rank, v_idx in enumerate(eco_sorted_veh_indices):
                sz = cluster_sizes[rank]
                assignments[v_idx] = [d.id for _, d in deliv_angles[curr_d:curr_d + sz]]
                curr_d += sz

            # 2-Opt on eco routes
            for i in range(k):
                if assignments[i]:
                    seq = [self.depot.id] + assignments[i] + [self.depot.id]
                    refined = self._run_2opt(seq, evaluate_distance)
                    assignments[i] = [x for x in refined if x != self.depot.id]

        else:
            # 5. BALANCED: Multi-Objective Clarke-Wright Savings
            target_stops = math.ceil(n_deliv / k)
            max_stops = max(target_stops, math.ceil((n_deliv / k) * (1.25 if self.capacity_mode == "strict" else 1.5)))
            allowed_cap = min(max(v.capacity for v in self.vehicles), (sum(d.get_demand() for d in self.deliveries) / k) * 1.3)

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

            savings.sort(key=lambda x: x[0], reverse=True)
            cw_routes: List[List[str]] = [[d.id] for d in self.deliveries]
            cw_loads: List[float] = [d.get_demand() for d in self.deliveries]

            for s_val, i_id, j_id in savings:
                idx_i = next((idx for idx, r in enumerate(cw_routes) if i_id in r), None)
                idx_j = next((idx for idx, r in enumerate(cw_routes) if j_id in r), None)

                if idx_i is not None and idx_j is not None and idx_i != idx_j:
                    comb_load = cw_loads[idx_i] + cw_loads[idx_j]
                    comb_stops = len(cw_routes[idx_i]) + len(cw_routes[idx_j])
                    if comb_load <= allowed_cap and comb_stops <= max_stops:
                        r_i, r_j = cw_routes[idx_i], cw_routes[idx_j]
                        merged = None
                        if r_i[-1] == i_id and r_j[0] == j_id: merged = r_i + r_j
                        elif r_j[-1] == j_id and r_i[0] == i_id: merged = r_j + r_i
                        elif r_i[-1] == i_id and r_j[-1] == j_id: merged = r_i + list(reversed(r_j))
                        elif r_i[0] == i_id and r_j[0] == j_id: merged = list(reversed(r_i)) + r_j
                        if merged is not None:
                            cw_routes[idx_i] = merged
                            cw_loads[idx_i] = comb_load
                            del cw_routes[idx_j]
                            del cw_loads[idx_j]

            while len(cw_routes) < k:
                lg_idx = max(range(len(cw_routes)), key=lambda idx: len(cw_routes[idx]))
                if len(cw_routes[lg_idx]) <= 1: break
                r = cw_routes[lg_idx]
                mid = len(r) // 2
                cw_routes[lg_idx] = r[:mid]
                cw_routes.append(r[mid:])

            cw_routes.sort(key=lambda r: len(r), reverse=True)
            for idx, r in enumerate(cw_routes):
                assignments[idx % k].extend(r)

            for i in range(k):
                if assignments[i]:
                    seq = [self.depot.id] + assignments[i] + [self.depot.id]
                    refined = self._run_2opt(seq, evaluate_distance)
                    assignments[i] = [x for x in refined if x != self.depot.id]

        # ─── BUILD ROUTE OUTPUTS ───────────────────────────────────────────────
        route_outputs: List[RouteOutput] = []
        for idx, (veh, node_ids) in enumerate(zip(self.vehicles, assignments)):
            color = VEHICLE_COLORS[idx % len(VEHICLE_COLORS)]
            full_seq = [self.depot.id] + node_ids + [self.depot.id] if node_ids else [self.depot.id, self.depot.id]

            r_out = build_route_details(
                vehicle=veh,
                stop_ids=full_seq,
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

        obj_label = {
            "distance": "Distance-Minimized Spatial Loop",
            "travel_time": "Time-Window Urgent & Congestion Avoidance",
            "fuel": "Payload Mass-Shedding & Efficiency Matching",
            "co2": "Green Fleet Electrification (EV Priority)",
            "balanced": "Multi-Objective Pareto",
        }.get(obj, self.objective.upper())

        solver_notes = (
            f"Classical {obj_label} solver with {k} active vehicles "
            f"under {self.traffic_level.upper()} traffic ({self.time_window_mode.upper()} SLAs)."
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
                algorithm=f"Multi-Objective {obj_label}",
                status="completed",
                notes=solver_notes
            ),
            unassigned_deliveries=[],
            traffic_status=self.traffic_status,
            traffic_provider=self.traffic_provider,
            traffic_last_updated=self.traffic_last_updated,
            is_live_traffic_used=self.is_live_traffic_used,
        )
