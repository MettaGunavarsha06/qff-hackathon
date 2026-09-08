import time
import math
import random
from typing import List, Dict, Tuple, Optional
import numpy as np

from .models import (
    Depot, Vehicle, Delivery, VehicleRoute, Waypoint,
    OptimizationResult, ConvergencePoint, OptimizationObjective, TrafficLevel
)
from .distance_matrix import DistanceMatrix
from .classical_vrp import build_vehicle_routes, run_2opt
from .metrics import parse_time_to_minutes

class QuantumInspiredVRPSolver:
    """
    Quantum-Inspired Capacitated Vehicle Routing Problem with Time Windows (CVRPTW)
    Solver using QUBO (Quadratic Unconstrained Binary Optimization) representation
    and Simulated Quantum Annealing (SQA) with transverse-field tunneling.
    """
    def __init__(
        self,
        depot: Depot,
        vehicles: List[Vehicle],
        deliveries: List[Delivery],
        objective: OptimizationObjective = "balanced",
        traffic_level: TrafficLevel = "moderate",
        random_seed: Optional[int] = 42
    ):
        self.depot = depot
        self.vehicles = vehicles
        self.deliveries = deliveries
        self.objective = objective
        self.traffic_level = traffic_level
        self.dist_matrix = DistanceMatrix(depot, deliveries, traffic_level)
        self.deliveries_map = {d.id: d for d in deliveries}
        self.rng = random.Random(random_seed)
        np.random.seed(random_seed if random_seed is not None else 42)

    def _cost_weight(self, from_id: str, to_id: str, vehicle: Vehicle) -> float:
        dist = self.dist_matrix.get_distance(from_id, to_id)
        travel_time = self.dist_matrix.get_time(from_id, to_id)
        
        if self.objective == "min_distance":
            return dist
        elif self.objective == "min_travel_time":
            return travel_time * 1.1
        elif self.objective == "min_fuel":
            eff = max(1.0, vehicle.fuel_efficiency_km_per_l)
            fuel = (dist / 100.0) * (100.0 / eff)
            return fuel * 10.0
        elif self.objective == "min_co2":
            co2_factor = 0.05 if vehicle.fuel_type == "electric" else (1.4 if vehicle.fuel_type == "hybrid" else 2.68)
            return dist * co2_factor * 1.5
        else:  # balanced
            return dist * 0.9 + travel_time * 0.15

    def _evaluate_state_energy(self, assignments: List[List[str]]) -> float:
        """
        Evaluates the QUBO Hamiltonian:
        H = H_travel + lambda_visit * H_unvisited + lambda_cap * H_capacity + lambda_tw * H_timewindow
        """
        total_cost = 0.0
        lambda_cap = 200.0
        lambda_tw = 5.0

        visited_ids = set()

        for v_idx, route in enumerate(assignments):
            veh = self.vehicles[v_idx]
            if not route:
                continue

            full = ["DEPOT"] + route + ["DEPOT"]
            route_cost = 0.0
            route_load = 0.0
            current_time = float(parse_time_to_minutes("08:30"))
            tw_penalty = 0.0

            for i in range(len(full) - 1):
                u, v = full[i], full[i+1]
                route_cost += self._cost_weight(u, v, veh)
                
                if v != "DEPOT":
                    visited_ids.add(v)
                    d = self.deliveries_map[v]
                    route_load += d.demand_kg

                    # Time window evaluation
                    leg_time = self.dist_matrix.get_time(u, v)
                    current_time += leg_time
                    tw_start = parse_time_to_minutes(d.time_window_start)
                    tw_end = parse_time_to_minutes(d.time_window_end)
                    if current_time < tw_start:
                        current_time = float(tw_start)
                    elif current_time > tw_end:
                        # Quadratic penalty for late arrival to push towards strict compliance
                        overstay = current_time - tw_end
                        tw_penalty += (overstay ** 1.3)
                    current_time += d.service_time_mins

            # Capacity quadratic penalty
            cap_excess = max(0.0, route_load - veh.capacity_kg)
            cap_penalty = lambda_cap * (cap_excess ** 2)

            total_cost += route_cost + cap_penalty + (tw_penalty * lambda_tw)

        # Unvisited delivery penalty
        unvisited_count = len(self.deliveries) - len(visited_ids)
        total_cost += unvisited_count * 2000.0

        return total_cost

    def _seed_solution(self) -> List[List[str]]:
        """
        Quantum Initialization:
        Partitions the delivery points into balanced geographic sectors
        around the central depot, allocating deliveries evenly across all available
        vehicles according to their capacity and powertrain characteristics.
        """
        k = len(self.vehicles)
        clusters: List[List[str]] = [[] for _ in range(k)]
        loads = [0.0 for _ in range(k)]

        # Calculate polar angle from depot for each delivery
        deliv_angles = []
        for d in self.deliveries:
            angle = math.atan2(d.lat - self.depot.lat, d.lng - self.depot.lng)
            if angle < 0:
                angle += 2 * math.pi
            deliv_angles.append((angle, d))

        # Sort by angle to maintain spatial locality
        deliv_angles.sort(key=lambda x: x[0])

        target_per_veh = len(self.deliveries) // k
        extra = len(self.deliveries) % k

        current_v = 0
        assigned_in_current = 0
        limit_current = target_per_veh + (1 if current_v < extra else 0)

        for _, d in deliv_angles:
            if assigned_in_current >= limit_current and current_v < k - 1:
                current_v += 1
                assigned_in_current = 0
                limit_current = target_per_veh + (1 if current_v < extra else 0)

            clusters[current_v].append(d.id)
            loads[current_v] += d.demand_kg
            assigned_in_current += 1

        # Intra-cluster local 2-opt sort
        for c_idx in range(k):
            if len(clusters[c_idx]) > 1:
                seq = ["DEPOT"] + clusters[c_idx] + ["DEPOT"]
                refined = run_2opt(seq, self.dist_matrix)
                clusters[c_idx] = [n for n in refined if n != "DEPOT"]

        return clusters

    def solve(self) -> OptimizationResult:
        start_t = time.time()
        num_vehicles = len(self.vehicles)

        # 1. Quantum State Initialization
        initial_state = self._seed_solution()
        current_state = [list(r) for r in initial_state]
        best_state = [list(r) for r in current_state]
        current_energy = self._evaluate_state_energy(current_state)
        best_energy = current_energy

        convergence: List[ConvergencePoint] = []
        convergence.append(ConvergencePoint(
            iteration=0,
            energy=round(current_energy, 2),
            best_energy=round(best_energy, 2)
        ))

        # 2. Simulated Quantum Annealing (SQA) Loop
        # Transverse Field Hamiltonian: H(s) = s H_classical + (1 - s) H_transverse
        max_iterations = 450
        initial_gamma = 5.0     # Transverse field tunneling amplitude
        initial_temp = 50.0     # Thermal excitation
        cooling_rate = 0.985

        for it in range(1, max_iterations + 1):
            s = it / max_iterations
            gamma = initial_gamma * (1.0 - s)
            temp = max(0.08, initial_temp * (cooling_rate ** it))

            candidate_state = [list(r) for r in current_state]
            non_empty = [i for i, r in enumerate(candidate_state) if len(r) > 0]
            if not non_empty:
                continue

            # Stochastic Quantum Perturbation Operator:
            # 1: Intra-route segment inversion
            # 2: Inter-route delivery migration
            # 3: Inter-route swap
            # 4: Time-window compliant shift
            op = self.rng.choice([1, 1, 2, 2, 3, 4])

            if op == 1:
                # Intra-route segment reverse
                v_idx = self.rng.choice(non_empty)
                r = candidate_state[v_idx]
                if len(r) >= 3:
                    i = self.rng.randint(0, len(r) - 2)
                    j = self.rng.randint(i + 1, len(r) - 1)
                    candidate_state[v_idx] = r[:i] + r[i:j+1][::-1] + r[j+1:]
            elif op == 2:
                # Inter-route migration
                from_v = self.rng.choice(non_empty)
                to_v = self.rng.randrange(num_vehicles)
                if from_v != to_v and len(candidate_state[from_v]) > 0:
                    cust_idx = self.rng.randrange(len(candidate_state[from_v]))
                    cust = candidate_state[from_v].pop(cust_idx)
                    # Insert at position minimizing distance
                    best_pos = 0
                    best_cost = float("inf")
                    to_route = candidate_state[to_v]
                    for pos in range(len(to_route) + 1):
                        prev_n = "DEPOT" if pos == 0 else to_route[pos-1]
                        next_n = "DEPOT" if pos == len(to_route) else to_route[pos]
                        c_inc = (self.dist_matrix.get_distance(prev_n, cust) +
                                 self.dist_matrix.get_distance(cust, next_n) -
                                 self.dist_matrix.get_distance(prev_n, next_n))
                        if c_inc < best_cost:
                            best_cost = c_inc
                            best_pos = pos
                    to_route.insert(best_pos, cust)
            elif op == 3:
                # Inter-route swap
                if len(non_empty) >= 2:
                    v1, v2 = self.rng.sample(non_empty, 2)
                    i1 = self.rng.randrange(len(candidate_state[v1]))
                    i2 = self.rng.randrange(len(candidate_state[v2]))
                    candidate_state[v1][i1], candidate_state[v2][i2] = (
                        candidate_state[v2][i2], candidate_state[v1][i1]
                    )
            elif op == 4:
                # Time-window sort on one vehicle
                v_idx = self.rng.choice(non_empty)
                candidate_state[v_idx].sort(
                    key=lambda did: parse_time_to_minutes(self.deliveries_map[did].time_window_start)
                )

            cand_energy = self._evaluate_state_energy(candidate_state)
            delta_e = cand_energy - current_energy

            # Quantum tunneling probability
            # Tunneling channel allows escaping high potential barriers
            tunneling_denominator = max(0.001, temp + (gamma * math.sqrt(abs(delta_e) + 1.0)))

            if delta_e < 0:
                current_state = candidate_state
                current_energy = cand_energy
                if current_energy < best_energy:
                    best_energy = current_energy
                    best_state = [list(r) for r in current_state]
            else:
                prob = math.exp(-delta_e / tunneling_denominator)
                if self.rng.random() < prob:
                    current_state = candidate_state
                    current_energy = cand_energy

            if it % 30 == 0 or it == max_iterations:
                convergence.append(ConvergencePoint(
                    iteration=it,
                    energy=round(current_energy, 2),
                    best_energy=round(best_energy, 2)
                ))

        # 3. Classical Post-Processing & Untangling
        refined_assignments: List[List[str]] = []
        for r in best_state:
            if len(r) > 2:
                seq = ["DEPOT"] + r + ["DEPOT"]
                opt_seq = run_2opt(seq, self.dist_matrix)
                clean_r = [n for n in opt_seq if n != "DEPOT"]
                refined_assignments.append(clean_r)
            else:
                refined_assignments.append(r)

        # 4. Build vehicle routes & compute all KPIs
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

        return OptimizationResult(
            solver_type="quantum_inspired",
            solver_name="Quantum-Inspired Simulated Annealing (QUBO/SQA)",
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
            objective_score=round(best_energy, 2)
        )
