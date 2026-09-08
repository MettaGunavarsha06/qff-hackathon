import time
from typing import List, Dict, Any, Tuple
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

def run_2opt(route: List[str], coords: Dict[str, Tuple[float, float]]) -> List[str]:
    """2-opt local search heuristic to untangle route crossings."""
    if len(route) <= 3:
        return route

    best = list(route)
    improved = True
    iterations = 0

    def calc_dist(r: List[str]) -> float:
        total = 0.0
        for i in range(len(r) - 1):
            p1 = coords[r[i]]
            p2 = coords[r[i+1]]
            total += haversine_distance(p1[0], p1[1], p2[0], p2[1])
        return total

    best_dist = calc_dist(best)

    while improved and iterations < 40:
        improved = False
        iterations += 1
        for i in range(1, len(best) - 2):
            for j in range(i + 1, len(best) - 1):
                new_route = best[:i] + best[i:j+1][::-1] + best[j+1:]
                new_dist = calc_dist(new_route)
                if new_dist < best_dist - 1e-4:
                    best = new_route
                    best_dist = new_dist
                    improved = True
                    break
            if improved:
                break

    return best

class ClassicalOptimizer:
    """
    Classical baseline optimizer using Capacity-aware Clarke-Wright Savings
    and Nearest Neighbor heuristics with 2-Opt local search refinement.
    """
    def __init__(self, request: OptimizationRequestInput):
        self.request = request
        self.depot = request.depot or DepotInput(id="DEPOT", lat=37.7685, lng=-122.4140)
        self.vehicles = request.vehicles
        self.deliveries = request.deliveries
        self.traffic_level = request.traffic_level or "medium"
        self.deliveries_map = {d.id: d for d in self.deliveries}
        
        self.coords: Dict[str, Tuple[float, float]] = {
            self.depot.id: (self.depot.lat, self.depot.lng)
        }
        for d in self.deliveries:
            self.coords[d.id] = (d.lat, d.lng)

    def optimize(self) -> OptimizationResponseOutput:
        start_time = time.perf_counter()

        if not self.deliveries:
            raise ValueError("No deliveries provided for optimization.")
        if not self.vehicles:
            raise ValueError("No vehicles provided for optimization.")

        # 1. Clarke-Wright Savings Calculation
        savings = []
        n = len(self.deliveries)
        for i in range(n):
            id_i = self.deliveries[i].id
            p_i = self.coords[id_i]
            d_depot_i = haversine_distance(self.depot.lat, self.depot.lng, p_i[0], p_i[1])
            for j in range(i + 1, n):
                id_j = self.deliveries[j].id
                p_j = self.coords[id_j]
                d_depot_j = haversine_distance(self.depot.lat, self.depot.lng, p_j[0], p_j[1])
                d_i_j = haversine_distance(p_i[0], p_i[1], p_j[0], p_j[1])
                s = d_depot_i + d_depot_j - d_i_j
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

        # 4. Apply 2-opt refinement on each vehicle's route
        route_outputs: List[RouteOutput] = []
        for idx, (veh, node_ids) in enumerate(zip(self.vehicles, assignments)):
            color = VEHICLE_COLORS[idx % len(VEHICLE_COLORS)]
            if node_ids:
                full_seq = [self.depot.id] + node_ids + [self.depot.id]
                refined_seq = run_2opt(full_seq, self.coords)
            else:
                refined_seq = [self.depot.id, self.depot.id]

            r_out = build_route_details(
                vehicle=veh,
                stop_ids=refined_seq,
                depot=self.depot,
                deliveries_map=self.deliveries_map,
                traffic_level=self.traffic_level,
                color=color
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
                notes="Classical heuristic optimization completed successfully."
            ),
            unassigned_deliveries=[]
        )
