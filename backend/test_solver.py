from optimizer.demo_data import get_demo_depot, get_demo_vehicles, get_demo_deliveries
from optimizer.qubo_vrp import QuantumInspiredVRPSolver
from optimizer.classical_vrp import ClassicalVRPSolver

depot = get_demo_depot()
vehs = get_demo_vehicles()
dels = get_demo_deliveries()

c_solver = ClassicalVRPSolver(depot, vehs, dels)
unopt = c_solver.generate_unoptimized_baseline()
classic = c_solver.solve()

q_solver = QuantumInspiredVRPSolver(depot, vehs, dels)
quantum = q_solver.solve()

print(f"Unoptimized: {unopt.total_distance_km:.2f} km | Late: {unopt.late_deliveries_count} | Fuel: {unopt.total_fuel_l:.2f} L | CO2: {unopt.total_co2_kg:.2f} kg | Util: {unopt.fleet_utilization_pct}%")
print(f"Classical:   {classic.total_distance_km:.2f} km | Late: {classic.late_deliveries_count} | Fuel: {classic.total_fuel_l:.2f} L | CO2: {classic.total_co2_kg:.2f} kg | Util: {classic.fleet_utilization_pct}%")
print(f"Quantum:     {quantum.total_distance_km:.2f} km | Late: {quantum.late_deliveries_count} | Fuel: {quantum.total_fuel_l:.2f} L | CO2: {quantum.total_co2_kg:.2f} kg | Util: {quantum.fleet_utilization_pct}%")
