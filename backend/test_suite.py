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
from services.route_optimizer import run_route_optimization

class TestRouteQBackend(unittest.TestCase):

    def setUp(self):
        self.depot = DepotInput(id="DEPOT-BLR", lat=12.9279, lng=77.6271, name="RouteQ Bengaluru Central Hub")
        self.vehicles = [
            VehicleInput(id="IND-V01", capacity=100.0, fuel_efficiency=12.0, fuel_type="diesel"),
            VehicleInput(id="IND-V02", capacity=100.0, fuel_efficiency=18.0, fuel_type="electric"),
        ]
        self.deliveries_small = [
            DeliveryInput(id="BLR-D01", customer="Indiranagar Tech Lab", lat=12.9716, lng=77.6412, demand=20.0, time_window_start="09:00", time_window_end="12:00"),
            DeliveryInput(id="BLR-D02", customer="HSR Layout Campus", lat=12.9121, lng=77.6446, demand=25.0, time_window_start="09:30", time_window_end="12:30"),
            DeliveryInput(id="BLR-D03", customer="MG Road Commercial Plaza", lat=12.9756, lng=77.6066, demand=15.0, time_window_start="10:00", time_window_end="13:00"),
            DeliveryInput(id="BLR-D04", customer="Bellandur EcoSpace Tech", lat=12.9304, lng=77.6784, demand=30.0, time_window_start="10:30", time_window_end="14:00"),
        ]

    def test_01_distance_calculation(self):
        """Test Haversine distance calculation is non-zero and symmetric."""
        d1 = haversine_distance(12.9279, 77.6271, 12.9716, 77.6412)
        d2 = haversine_distance(12.9716, 77.6412, 12.9279, 77.6271)
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
            self.assertEqual(r.stops[0], self.depot.id)
            self.assertEqual(r.stops[-1], self.depot.id)
        self.assertEqual(set(visited), {"BLR-D01", "BLR-D02", "BLR-D03", "BLR-D04"})

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
            self.assertEqual(r.stops[0], self.depot.id)
            self.assertEqual(r.stops[-1], self.depot.id)
            # Capacity check
            self.assertLessEqual(r.capacity_used, self.vehicles[0].capacity)

        self.assertEqual(set(visited), {"BLR-D01", "BLR-D02", "BLR-D03", "BLR-D04"})
        
        # Verify genuine Qiskit circuit metadata
        self.assertIsNotNone(res.quantum_circuit_info)
        qinfo = res.quantum_circuit_info
        self.assertEqual(qinfo.qubits, 4)
        self.assertGreater(qinfo.depth, 0)
        self.assertEqual(qinfo.shots, 1024)
        self.assertIn("rzz", qinfo.gate_counts)
        self.assertIn("rx", qinfo.gate_counts)
        self.assertIn("h", qinfo.gate_counts)
        self.assertTrue(len(qinfo.counts) > 0)
        self.assertTrue(len(qinfo.optimal_bitstring) > 0)

    def test_04_qiskit_problem_size_limit(self):
        """Test that Qiskit raises a clear message when >10 deliveries are submitted."""
        large_deliveries = self.deliveries_small * 3  # 12 deliveries
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
        self.assertIn("due to qubit statevector simulation space", str(ctx.exception))

    def test_05_explicit_classical_fallback(self):
        """Test explicit Qiskit -> Classical fallback when quantum size limit is exceeded."""
        large_deliveries = self.deliveries_small * 3  # 12 deliveries
        for idx, d in enumerate(large_deliveries):
            large_deliveries[idx] = DeliveryInput(
                id=f"D{idx+1}", customer=f"Cust {idx+1}", lat=d.lat, lng=d.lng, demand=5.0
            )

        req = OptimizationRequestInput(
            depot=self.depot,
            vehicles=self.vehicles,
            deliveries=large_deliveries,
            optimization_method="qiskit",
            allow_classical_fallback=True,
        )
        res = run_route_optimization(req)
        self.assertEqual(res.status, "success")
        self.assertEqual(res.method, "classical")
        self.assertIn("Classical Fallback Active", res.solver.notes)
        self.assertGreater(len(res.routes), 0)

if __name__ == "__main__":
    unittest.main()

