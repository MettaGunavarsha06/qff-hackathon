import time
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
from utils.distance import haversine_distance
from services.metrics import build_route_details

VEHICLE_COLORS = [
    "#10b981",  # Emerald
    "#06b6d4",  # Cyan
    "#8b5cf6",  # Violet
    "#f59e0b",  # Amber
    "#ec4899",  # Rose
    "#3b82f6",  # Blue
    "#14b8a6",  # Teal
]

def run_2opt(
    route: List[str],
    cost_fn: Any
) -> List[str]:
    """2-opt local search heuristic to untangle route crossings using edge costs."""
    if len(route) <= 3:
        return route

    best = list(route)
    improved = True
    iterations = 0

    def calc_cost(r: List[str]) -> float:
        return sum(cost_fn(r[k], r[k+1]) for k in range(len(r) - 1))

    best_cost = calc_cost(best)

    while improved and iterations < 40:
        improved = False
        iterations += 1
        for i in range(1, len(best) - 2):
            for j in range(i + 1, len(best) - 1):
                new_route = best[:i] + best[i:j+1][::-1] + best[j+1:]
                new_cost = calc_cost(new_route)
                if new_cost < best_cost - 1e-4:
                    best = new_route
                    best_cost = new_cost
                    improved = True
                    break
            if improved:
                break

    return best

class ClassicalOptimizer:
    """
    Classical baseline optimizer using Capacity-aware Clarke-Wright Savings
    and 2-Opt local search refinement, powered by real road distance & traffic matrices.
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
        self.vehicles = request.vehicles
        self.deliveries = request.deliveries
        self.traffic_level = request.traffic_level or "medium"
        self.deliveries_map = {d.id: d for d in self.deliveries}
        
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
        if self.distance_matrix and (u, v) in self.distance_matrix:
            return self.distance_matrix[(u, v)]
        p1 = self.coords.get(u, (self.depot.lat, self.depot.lng))
        p2 = self.coords.get(v, (self.depot.lat, self.depot.lng))
        return haversine_distance(p1[0], p1[1], p2[0], p2[1]) * 1.3

    def get_edge_time(self, u: str, v: str) -> float:
        if self.time_matrix and (u, v) in self.time_matrix:
            return self.time_matrix[(u, v)]
        dist = self.get_edge_distance(u, v)
        from utils.distance import calculate_travel_time
        return calculate_travel_time(dist, self.traffic_level)

    def get_edge_cost(self, u: str, v: str) -> float:
        """
        Calculates multi-objective traffic-aware cost:
        objective = distance_weight * distance + time_weight * travel_time + fuel_weight * fuel + co2_weight * co2
        """
        dist = self.get_edge_distance(u, v)
        t_mins = self.get_edge_time(u, v)
        fuel = dist / 12.0
        co2 = fuel * 2.68

        w_d = float(getattr(self.request, "distance_weight", 1.0) or 1.0)
        w_t = float(getattr(self.request, "time_weight", 1.0) or 1.0)
        w_f = float(getattr(self.request, "fuel_weight", 1.0) or 1.0)
        w_c = float(getattr(self.request, "co2_weight", 1.0) or 1.0)

        return w_d * dist + w_t * t_mins + w_f * fuel + w_c * co2

    def optimize(self) -> OptimizationResponseOutput:
        start_time = time.perf_counter()

        if not self.deliveries:
            raise ValueError("No deliveries provided for optimization.")
        if not self.vehicles:
            raise ValueError("No vehicles provided for optimization.")

        # 1. Traffic-aware Clarke-Wright Savings Calculation
        savings = []
        n = len(self.deliveries)
        for i in range(n):
            id_i = self.deliveries[i].id
            cost_depot_i = self.get_edge_cost(self.depot.id, id_i)
            for j in range(i + 1, n):
                id_j = self.deliveries[j].id
                cost_depot_j = self.get_edge_cost(self.depot.id, id_j)
                cost_i_j = self.get_edge_cost(id_i, id_j)
                s = cost_depot_i + cost_depot_j - cost_i_j
                savings.append((s, id_i, id_j))

        # Sort descending by savings
        savings.sort(key=lambda x: x[0], reverse=True)

        # 2. Greedy cluster merging respecting vehicle capacities
        max_cap = max(v.capacity for v in self.vehicles)
        routes: List[List[str]] = [[d.id] for d in self.deliveries]
        loads: List[float] = [d.get_demand() for d in self.deliveries]

        for s_val, i_id, j_id in savings:
            idx_i = next((idx for idx, r in enumerate(routes) if i_id in r), None)
            idx_j = next((idx for idx, r in enumerate(routes) if j_id in r), None)

            if idx_i is not None and idx_j is not None and idx_i != idx_j:
                combined_load = loads[idx_i] + loads[idx_j]
                if combined_load <= max_cap:
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

        # 3. Bin-pack routes into available vehicles
        k = len(self.vehicles)
        assignments: List[List[str]] = [[] for _ in range(k)]
        veh_loads = [0.0 for _ in range(k)]

        routes.sort(key=lambda r: len(r), reverse=True)
        for r in routes:
            r_load = sum(self.deliveries_map[did].get_demand() for did in r)
            best_v = None
            best_rem = float("inf")
            for v_idx, v in enumerate(self.vehicles):
                if veh_loads[v_idx] + r_load <= v.capacity:
                    rem = v.capacity - (veh_loads[v_idx] + r_load)
                    if rem < best_rem:
                        best_rem = rem
                        best_v = v_idx

            if best_v is None:
                # Assign to least loaded vehicle
                best_v = int(min(range(k), key=lambda vi: veh_loads[vi]))

            assignments[best_v].extend(r)
            veh_loads[best_v] += r_load

        # 4. Apply 2-opt refinement on each vehicle's route using real edge costs
        route_outputs: List[RouteOutput] = []
        for idx, (veh, node_ids) in enumerate(zip(self.vehicles, assignments)):
            color = VEHICLE_COLORS[idx % len(VEHICLE_COLORS)]
            if node_ids:
                full_seq = [self.depot.id] + node_ids + [self.depot.id]
                refined_seq = run_2opt(full_seq, self.get_edge_cost)
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
            "Classical optimization completed using live Mappls road routing & traffic ETA data."
            if self.is_live_traffic_used
            else "Classical optimization completed using non-traffic road network estimates."
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
                algorithm="Clarke-Wright Savings & 2-Opt Local Search",
                status="completed",
                notes=solver_notes
            ),
            unassigned_deliveries=[],
            traffic_status=self.traffic_status,
            traffic_provider=self.traffic_provider,
            traffic_last_updated=self.traffic_last_updated,
            is_live_traffic_used=self.is_live_traffic_used,
        )

