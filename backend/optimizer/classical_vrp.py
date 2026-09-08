import time
from typing import List, Dict, Tuple, Optional
from .models import (
    Depot, Vehicle, Delivery, VehicleRoute, Waypoint,
    OptimizationResult, ConvergencePoint, OptimizationObjective, TrafficLevel
)
from .distance_matrix import DistanceMatrix
from .metrics import (
    parse_time_to_minutes, minutes_to_time_str,
    calculate_fuel_and_co2
)

VEHICLE_COLORS = [
    "#10b981",  # Emerald
    "#06b6d4",  # Cyan
    "#8b5cf6",  # Violet
    "#f59e0b",  # Amber
    "#ec4899",  # Pink/Rose
    "#3b82f6",  # Blue
    "#14b8a6",  # Teal
]

def run_2opt(route: List[str], dist_matrix: DistanceMatrix) -> List[str]:
    """Applies 2-opt local search heuristic to untangle route crossings."""
    if len(route) <= 2:
        return route

    best_route = list(route)
    improved = True
    max_iterations = 50
    iteration = 0

    def route_dist(r: List[str]) -> float:
        total = 0.0
        for i in range(len(r) - 1):
            total += dist_matrix.get_distance(r[i], r[i+1])
        return total

    best_dist = route_dist(best_route)

    while improved and iteration < max_iterations:
        improved = False
        iteration += 1
        for i in range(1, len(best_route) - 2):
            for j in range(i + 1, len(best_route) - 1):
                # Reverse segment between i and j
                new_route = best_route[:i] + best_route[i:j+1][::-1] + best_route[j+1:]
                new_dist = route_dist(new_route)
                if new_dist < best_dist - 1e-4:
                    best_route = new_route
                    best_dist = new_dist
                    improved = True
                    break
            if improved:
                break

    return best_route

def build_vehicle_routes(
    assignments: List[List[str]],
    vehicles: List[Vehicle],
    depot: Depot,
    deliveries_map: Dict[str, Delivery],
    dist_matrix: DistanceMatrix,
    traffic_level: TrafficLevel,
    depot_start_time_str: str = "08:30"
) -> List[VehicleRoute]:
    routes: List[VehicleRoute] = []
    depot_start_mins = parse_time_to_minutes(depot_start_time_str)

    for idx, (veh, node_ids) in enumerate(zip(vehicles, assignments)):
        color = VEHICLE_COLORS[idx % len(VEHICLE_COLORS)]
        v_name = veh.name or f"Vehicle {veh.id}"
        
        # Build full sequence [DEPOT, ...deliveries..., DEPOT]
        full_seq = ["DEPOT"] + node_ids + ["DEPOT"] if node_ids else ["DEPOT", "DEPOT"]
        
        waypoints: List[Waypoint] = []
        current_time_mins = float(depot_start_mins)
        total_dist_km = 0.0
        total_time_mins = 0.0
        
        # Calculate initial cargo load
        total_cargo_load = sum(deliveries_map[did].demand_kg for did in node_ids if did in deliveries_map)
        current_load = total_cargo_load

        # First waypoint: Depot departure
        waypoints.append(Waypoint(
            sequence_index=0,
            stop_id=depot.id,
            location_name=depot.name,
            lat=depot.lat,
            lng=depot.lng,
            arrival_time=minutes_to_time_str(current_time_mins),
            departure_time=minutes_to_time_str(current_time_mins),
            demand_kg=0.0,
            remaining_capacity_kg=round(veh.capacity_kg - current_load, 1),
            distance_from_prev_km=0.0,
            travel_time_mins=0.0,
            is_depot=True,
            is_late=False
        ))

        late_stops = 0

        for seq_i in range(1, len(full_seq)):
            from_node = full_seq[seq_i - 1]
            to_node = full_seq[seq_i]
            
            leg_dist = dist_matrix.get_distance(from_node, to_node)
            leg_time = dist_matrix.get_time(from_node, to_node)
            
            total_dist_km += leg_dist
            total_time_mins += leg_time
            current_time_mins += leg_time

            arrival_str = minutes_to_time_str(current_time_mins)

            if to_node == "DEPOT":
                # Return to depot
                departure_str = arrival_str
                waypoints.append(Waypoint(
                    sequence_index=seq_i,
                    stop_id=depot.id,
                    location_name=f"{depot.name} (Return)",
                    lat=depot.lat,
                    lng=depot.lng,
                    arrival_time=arrival_str,
                    departure_time=departure_str,
                    demand_kg=0.0,
                    remaining_capacity_kg=veh.capacity_kg,
                    distance_from_prev_km=round(leg_dist, 2),
                    travel_time_mins=round(leg_time, 1),
                    is_depot=True,
                    is_late=False
                ))
            else:
                deliv = deliveries_map[to_node]
                service_mins = deliv.service_time_mins
                total_time_mins += service_mins

                # Check time window
                tw_start_mins = parse_time_to_minutes(deliv.time_window_start)
                tw_end_mins = parse_time_to_minutes(deliv.time_window_end)
                
                # If arrived early, vehicle waits until start
                if current_time_mins < tw_start_mins:
                    wait_mins = tw_start_mins - current_time_mins
                    current_time_mins = float(tw_start_mins)
                    total_time_mins += wait_mins

                is_late = current_time_mins > (tw_end_mins + 5) # 5 min grace
                if is_late:
                    late_stops += 1

                # Depart after service
                current_time_mins += service_mins
                departure_str = minutes_to_time_str(current_time_mins)

                current_load -= deliv.demand_kg

                waypoints.append(Waypoint(
                    sequence_index=seq_i,
                    stop_id=deliv.id,
                    location_name=deliv.customer_name,
                    lat=deliv.lat,
                    lng=deliv.lng,
                    arrival_time=arrival_str,
                    departure_time=departure_str,
                    demand_kg=deliv.demand_kg,
                    remaining_capacity_kg=round(max(0.0, veh.capacity_kg - current_load), 1),
                    distance_from_prev_km=round(leg_dist, 2),
                    travel_time_mins=round(leg_time, 1),
                    is_depot=False,
                    is_late=is_late,
                    time_window_start=deliv.time_window_start,
                    time_window_end=deliv.time_window_end
                ))

        # Fuel & Emissions
        fuel_l, co2_kg = calculate_fuel_and_co2(
            total_dist_km, veh, total_cargo_load / 2.0, traffic_level
        )

        cap_util_pct = round((total_cargo_load / max(1.0, veh.capacity_kg)) * 100.0, 1)
        on_time_pct = 100.0 if not node_ids else round(((len(node_ids) - late_stops) / len(node_ids)) * 100.0, 1)

        routes.append(VehicleRoute(
            vehicle_id=veh.id,
            vehicle_name=v_name,
            color=color,
            assigned_delivery_ids=node_ids,
            waypoints=waypoints,
            total_distance_km=round(total_dist_km, 2),
            total_time_mins=round(total_time_mins, 1),
            capacity_used_kg=round(total_cargo_load, 1),
            capacity_max_kg=veh.capacity_kg,
            capacity_utilization_pct=min(100.0, cap_util_pct),
            fuel_consumed_l=fuel_l,
            co2_emissions_kg=co2_kg,
            deliveries_count=len(node_ids),
            on_time_rate_pct=on_time_pct
        ))

    return routes

class ClassicalVRPSolver:
    """
    Classical Capacitated Vehicle Routing Problem (CVRPTW) solver
    using Clarke-Wright Savings heuristic + 2-Opt local search refinement.
    """
    def __init__(
        self,
        depot: Depot,
        vehicles: List[Vehicle],
        deliveries: List[Delivery],
        objective: OptimizationObjective = "balanced",
        traffic_level: TrafficLevel = "moderate"
    ):
        self.depot = depot
        self.vehicles = vehicles
        self.deliveries = deliveries
        self.objective = objective
        self.traffic_level = traffic_level
        self.dist_matrix = DistanceMatrix(depot, deliveries, traffic_level)
        self.deliveries_map = {d.id: d for d in deliveries}

    def solve(self) -> OptimizationResult:
        start_t = time.time()
        convergence: List[ConvergencePoint] = []

        # 1. Initialize each delivery as its own sub-route: [DEPOT, d, DEPOT]
        routes_nodes: List[List[str]] = [[d.id] for d in self.deliveries]
        loads: List[float] = [d.demand_kg for d in self.deliveries]

        # 2. Compute Clarke-Wright savings for all pairs (i, j)
        # S(i, j) = dist(DEPOT, i) + dist(DEPOT, j) - dist(i, j)
        savings: List[Tuple[float, str, str]] = []
        n = len(self.deliveries)
        for i in range(n):
            id_i = self.deliveries[i].id
            for j in range(i + 1, n):
                id_j = self.deliveries[j].id
                s = (self.dist_matrix.get_distance("DEPOT", id_i) +
                     self.dist_matrix.get_distance("DEPOT", id_j) -
                     self.dist_matrix.get_distance(id_i, id_j))
                
                # Priority & Time window bonus if aligned
                d_i = self.deliveries[i]
                d_j = self.deliveries[j]
                ti_end = parse_time_to_minutes(d_i.time_window_end)
                tj_start = parse_time_to_minutes(d_j.time_window_start)
                if abs(ti_end - tj_start) <= 90:
                    s *= 1.15  # Good time synergy

                savings.append((s, id_i, id_j))

        # Sort descending by savings
        savings.sort(key=lambda x: x[0], reverse=True)

        avg_cap = sum(v.capacity_kg for v in self.vehicles) / max(1, len(self.vehicles))
        max_per_vehicle = max(v.capacity_kg for v in self.vehicles)

        iteration_count = 0
        # 3. Merge routes greedily
        for s_val, i_id, j_id in savings:
            iteration_count += 1
            # Find routes containing i and j
            r_i_idx = -1
            r_j_idx = -1
            for idx, r in enumerate(routes_nodes):
                if i_id in r:
                    r_i_idx = idx
                if j_id in r:
                    r_j_idx = idx

            if r_i_idx != -1 and r_j_idx != -1 and r_i_idx != r_j_idx:
                r_i = routes_nodes[r_i_idx]
                r_j = routes_nodes[r_j_idx]
                combined_load = loads[r_i_idx] + loads[r_j_idx]

                if combined_load <= max_per_vehicle:
                    # Check if i and j are at endpoints
                    can_merge = False
                    new_r = []
                    if r_i[-1] == i_id and r_j[0] == j_id:
                        new_r = r_i + r_j
                        can_merge = True
                    elif r_j[-1] == j_id and r_i[0] == i_id:
                        new_r = r_j + r_i
                        can_merge = True
                    elif r_i[-1] == i_id and r_j[-1] == j_id:
                        new_r = r_i + list(reversed(r_j))
                        can_merge = True
                    elif r_i[0] == i_id and r_j[0] == j_id:
                        new_r = list(reversed(r_i)) + r_j
                        can_merge = True

                    if can_merge:
                        routes_nodes[r_i_idx] = new_r
                        loads[r_i_idx] = combined_load
                        del routes_nodes[r_j_idx]
                        del loads[r_j_idx]

            if iteration_count % 15 == 0 or len(routes_nodes) <= len(self.vehicles):
                # Record convergence sample
                current_total_dist = sum(
                    sum(self.dist_matrix.get_distance(r[k], r[k+1]) for k in range(len(r)-1))
                    for r in routes_nodes if len(r) > 1
                )
                convergence.append(ConvergencePoint(
                    iteration=iteration_count,
                    energy=round(current_total_dist + len(routes_nodes)*20, 2),
                    best_energy=round(current_total_dist, 2)
                ))

        # 4. Fit into available vehicles (if routes > vehicles, bin pack)
        routes_nodes.sort(key=lambda r: len(r), reverse=True)
        final_assignments: List[List[str]] = [[] for _ in range(len(self.vehicles))]
        veh_loads = [0.0 for _ in range(len(self.vehicles))]

        for r in routes_nodes:
            r_load = sum(self.deliveries_map[d].demand_kg for d in r)
            # Find vehicle with best fit
            best_v = -1
            best_remaining = float("inf")
            for v_i, v in enumerate(self.vehicles):
                if veh_loads[v_i] + r_load <= v.capacity_kg:
                    rem = v.capacity_kg - (veh_loads[v_i] + r_load)
                    if rem < best_remaining:
                        best_remaining = rem
                        best_v = v_i
            
            if best_v == -1:
                # Fallback to vehicle with most remaining room
                best_v = int(min(range(len(self.vehicles)), key=lambda vi: veh_loads[vi]))

            final_assignments[best_v].extend(r)
            veh_loads[best_v] += r_load

        # 5. Apply 2-opt refinement on each vehicle's route
        refined_assignments: List[List[str]] = []
        for a in final_assignments:
            if len(a) > 2:
                seq = ["DEPOT"] + a + ["DEPOT"]
                optimized_seq = run_2opt(seq, self.dist_matrix)
                # Strip depot ends
                refined_assignments.append([node for node in optimized_seq if node != "DEPOT"])
            else:
                refined_assignments.append(a)

        # 6. Build vehicle routes & compute all KPIs
        routes = build_vehicle_routes(
            refined_assignments,
            self.vehicles,
            self.depot,
            self.deliveries_map,
            self.dist_matrix,
            self.traffic_level
        )

        exec_time_ms = round((time.time() - start_t) * 1000.0, 2)
        total_dist = round(sum(r.total_distance_km for r in routes), 2)
        total_time = round(sum(r.total_time_mins for r in routes), 1)
        total_fuel = round(sum(r.fuel_consumed_l for r in routes), 2)
        total_co2 = round(sum(r.co2_emissions_kg for r in routes), 2)
        total_cap_used = sum(r.capacity_used_kg for r in routes)
        total_cap_max = sum(r.capacity_max_kg for r in routes)
        fleet_util = round((total_cap_used / max(1.0, total_cap_max)) * 100.0, 1)

        total_late = sum(
            sum(1 for wp in r.waypoints if wp.is_late)
            for r in routes
        )
        total_deliveries_count = sum(r.deliveries_count for r in routes)
        on_time_pct = round(((total_deliveries_count - total_late) / max(1, total_deliveries_count)) * 100.0, 1)

        # Final convergence point
        convergence.append(ConvergencePoint(
            iteration=max(100, iteration_count),
            energy=total_dist,
            best_energy=total_dist
        ))

        return OptimizationResult(
            solver_type="classical_baseline",
            solver_name="Classical Clarke-Wright Savings + 2-Opt",
            execution_time_ms=exec_time_ms,
            routes=routes,
            unassigned_deliveries=[],
            total_distance_km=total_dist,
            total_time_mins=total_time,
            total_fuel_l=total_fuel,
            total_co2_kg=total_co2,
            fleet_utilization_pct=fleet_util,
            late_deliveries_count=total_late,
            on_time_percentage=on_time_pct,
            convergence_history=convergence,
            objective_score=total_dist
        )

    def generate_unoptimized_baseline(self) -> OptimizationResult:
        """
        Generates an unoptimized naive baseline (e.g. arbitrary round-robin ordering)
        to compare before vs after optimization improvements.
        """
        start_t = time.time()
        k = len(self.vehicles)
        naive_assignments: List[List[str]] = [[] for _ in range(k)]
        
        # Arbitrary round-robin assignment without spatial optimization
        for idx, deliv in enumerate(self.deliveries):
            naive_assignments[idx % k].append(deliv.id)

        routes = build_vehicle_routes(
            naive_assignments,
            self.vehicles,
            self.depot,
            self.deliveries_map,
            self.dist_matrix,
            self.traffic_level
        )

        total_dist = round(sum(r.total_distance_km for r in routes), 2)
        total_time = round(sum(r.total_time_mins for r in routes), 1)
        total_fuel = round(sum(r.fuel_consumed_l for r in routes), 2)
        total_co2 = round(sum(r.co2_emissions_kg for r in routes), 2)
        total_cap_used = sum(r.capacity_used_kg for r in routes)
        total_cap_max = sum(r.capacity_max_kg for r in routes)
        fleet_util = round((total_cap_used / max(1.0, total_cap_max)) * 100.0, 1)

        total_late = sum(
            sum(1 for wp in r.waypoints if wp.is_late)
            for r in routes
        )
        total_deliveries_count = sum(r.deliveries_count for r in routes)
        on_time_pct = round(((total_deliveries_count - total_late) / max(1, total_deliveries_count)) * 100.0, 1)

        return OptimizationResult(
            solver_type="unoptimized_baseline",
            solver_name="Unoptimized Baseline (Pre-Optimization)",
            execution_time_ms=round((time.time() - start_t) * 1000.0, 2),
            routes=routes,
            unassigned_deliveries=[],
            total_distance_km=total_dist,
            total_time_mins=total_time,
            total_fuel_l=total_fuel,
            total_co2_kg=total_co2,
            fleet_utilization_pct=fleet_util,
            late_deliveries_count=total_late,
            on_time_percentage=on_time_pct,
            convergence_history=[],
            objective_score=total_dist
        )
