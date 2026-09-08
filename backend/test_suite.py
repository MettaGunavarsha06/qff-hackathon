import unittest
import time
from models.schemas import (
    DepotInput,
    VehicleInput,
    DeliveryInput,
    OptimizationRequestInput,
)
from utils.distance import haversine_distance, calculate_travel_time
from services.classical_optimizer import ClassicalOptimizer
from services.qiskit_optimizer import QiskitVRPOptimizer

class TestRouteQBackend(unittest.TestCase):

    def setUp(self):
        self.depot = DepotInput(id="DEPOT", lat=37.7685, lng=-122.4140, name="Central Hub")
        self.vehicles = [
            VehicleInput(id="V1", capacity=100.0, fuel_efficiency=12.0, fuel_type="diesel"),
            VehicleInput(id="V2", capacity=100.0, fuel_efficiency=18.0, fuel_type="electric"),
        ]
        self.deliveries_small = [
            DeliveryInput(id="D1", customer="Customer 1", lat=37.7885, lng=-122.3995, demand=20.0, time_window_start="09:00", time_window_end="12:00"),
            DeliveryInput(id="D2", customer="Customer 2", lat=37.7897, lng=-122.3972, demand=25.0, time_window_start="09:30", time_window_end="12:30"),
            DeliveryInput(id="D3", customer="Customer 3", lat=37.7925, lng=-122.4345, demand=15.0, time_window_start="10:00", time_window_end="13:00"),
            DeliveryInput(id="D4", customer="Customer 4", lat=37.7989, lng=-122.4542, demand=30.0, time_window_start="10:30", time_window_end="14:00"),
        ]

    def test_01_distance_calculation(self):
        """Test Haversine distance calculation is non-zero and symmetric."""
        d1 = haversine_distance(37.7685, -122.4140, 37.7885, -122.3995)
        d2 = haversine_distance(37.7885, -122.3995, 37.7685, -122.4140)
        self.assertGreater(d1, 1.0)
        self.assertAlmostEqual(d1, d2, places=2)

        # Travel time
        t_low = calculate_travel_time(10.0, "low")
        t_high = calculate_travel_time(10.0, "high")
        self.assertGreater(t_high, t_low)

    def test_02_classical_optimization(self):
        """Test Classical Optimizer produces valid routes visiting all stops."""
        req = OptimizationRequestInput(
            depot=self.depot,
            vehicles=self.vehicles,
            deliveries=self.deliveries_small,
            optimization_method="classical",
            traffic_level="medium"
        )
        opt = ClassicalOptimizer(req)
        res = opt.optimize()

        self.assertEqual(res.status, "success")
        self.assertEqual(res.method, "classical")
        self.assertGreater(res.total_distance_km, 0.0)
        self.assertGreater(res.estimated_fuel_liters, 0.0)
        self.assertGreater(res.estimated_co2_kg, 0.0)

        # Verify all deliveries are visited
        visited = []
        for r in res.routes:
            visited.extend(r.deliveries)
            self.assertEqual(r.stops[0], "DEPOT")
            self.assertEqual(r.stops[-1], "DEPOT")
        self.assertEqual(set(visited), {"D1", "D2", "D3", "D4"})

    def test_03_qiskit_optimization(self):
        """Test Qiskit QAOA / QUBO Optimizer execution."""
        req = OptimizationRequestInput(
            depot=self.depot,
            vehicles=self.vehicles,
            deliveries=self.deliveries_small,
            optimization_method="qiskit",
            traffic_level="medium"
        )
        opt = QiskitVRPOptimizer(req)
        res = opt.optimize()

        self.assertEqual(res.status, "success")
        self.assertEqual(res.method, "qiskit")
        self.assertEqual(res.solver.name, "Qiskit")
        self.assertIn("QAOA", res.solver.algorithm)
        self.assertGreater(res.total_distance_km, 0.0)

        # Verify all stops are visited and routes start/end at depot
        visited = []
        for r in res.routes:
            visited.extend(r.deliveries)
            self.assertEqual(r.stops[0], "DEPOT")
            self.assertEqual(r.stops[-1], "DEPOT")
            # Capacity check
            self.assertLessEqual(r.capacity_used, self.vehicles[0].capacity)

        self.assertEqual(set(visited), {"D1", "D2", "D3", "D4"})

    def test_04_qiskit_problem_size_limit(self):
        """Test that Qiskit raises a clear message when >6 deliveries are submitted."""
        large_deliveries = self.deliveries_small * 2  # 8 deliveries
        for idx, d in enumerate(large_deliveries):
            large_deliveries[idx] = DeliveryInput(
                id=f"D{idx+1}", customer=f"Cust {idx+1}", lat=d.lat, lng=d.lng, demand=5.0
            )

        req = OptimizationRequestInput(
            depot=self.depot,
            vehicles=self.vehicles,
            deliveries=large_deliveries,
            optimization_method="qiskit"
        )
        opt = QiskitVRPOptimizer(req)
        with self.assertRaises(ValueError) as ctx:
            opt.optimize()
        self.assertIn("supports small routing instances", str(ctx.exception))

if __name__ == "__main__":
    unittest.main()
