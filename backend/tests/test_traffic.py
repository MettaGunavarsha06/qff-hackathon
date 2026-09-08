import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.traffic_service import (
    get_ist_timestamp,
    get_traffic_status,
    get_distance_matrix,
    get_route,
    get_live_eta,
    refresh_traffic,
    TRAFFIC_PROVIDER_NAME,
)
from models.schemas import (
    OptimizationRequestInput,
    DepotInput,
    VehicleInput,
    DeliveryInput,
)
from services.classical_optimizer import ClassicalOptimizer
from services.qiskit_optimizer import QiskitVRPOptimizer

class TestTrafficService(unittest.TestCase):
    def setUp(self):
        self.original_key = os.environ.get("MAPPLS_REST_KEY")
        if "MAPPLS_REST_KEY" in os.environ:
            del os.environ["MAPPLS_REST_KEY"]

    def tearDown(self):
        if self.original_key is not None:
            os.environ["MAPPLS_REST_KEY"] = self.original_key

    def test_ist_timestamp_format(self):
        ts = get_ist_timestamp()
        self.assertIn("IST", ts)
        parts = ts.split(" ")
        self.assertEqual(len(parts), 5)
        self.assertEqual(parts[4], "IST")

    def test_traffic_unavailable_when_no_key(self):
        status = get_traffic_status()
        self.assertEqual(status["status"], "traffic_unavailable")
        self.assertEqual(status["message"], "Live traffic data is currently unavailable.")
        self.assertEqual(status["provider"], "Mappls")
        self.assertFalse(status["is_live"])
        self.assertIn("IST", status["last_updated"])

    def test_distance_matrix_unavailable_when_no_key(self):
        locations = [
            {"id": "DEPOT", "lat": 12.9279, "lng": 77.6271},
            {"id": "D1", "lat": 12.9352, "lng": 77.6245},
        ]
        res = get_distance_matrix(locations)
        self.assertEqual(res["status"], "traffic_unavailable")
        self.assertEqual(res["message"], "Live traffic data is currently unavailable.")
        self.assertIsNone(res.get("distance_matrix"))

    def test_route_and_eta_unavailable_when_no_key(self):
        res_route = get_route((12.9279, 77.6271), (12.9352, 77.6245))
        self.assertEqual(res_route["status"], "traffic_unavailable")
        self.assertEqual(res_route["message"], "Live traffic data is currently unavailable.")

        res_eta = get_live_eta((12.9279, 77.6271), (12.9352, 77.6245))
        self.assertEqual(res_eta["status"], "traffic_unavailable")
        self.assertEqual(res_eta["message"], "Live traffic data is currently unavailable.")

    def test_refresh_traffic_returns_clean_response(self):
        locations = [{"id": "DEPOT", "lat": 12.9279, "lng": 77.6271}]
        res = refresh_traffic(locations)
        self.assertEqual(res["status"], "traffic_unavailable")
        self.assertEqual(res["message"], "Live traffic data is currently unavailable.")

    def test_classical_optimizer_with_traffic_matrices(self):
        depot = DepotInput(id="DEPOT", lat=12.9279, lng=77.6271)
        vehicles = [VehicleInput(id="V1", capacity=500.0, fuel_efficiency=12.0)]
        deliveries = [
            DeliveryInput(id="D1", lat=12.9352, lng=77.6245, demand=20.0),
            DeliveryInput(id="D2", lat=12.9412, lng=77.6189, demand=30.0),
        ]
        req = OptimizationRequestInput(
            depot=depot,
            vehicles=vehicles,
            deliveries=deliveries,
            traffic_level="heavy",
            distance_weight=1.5,
            time_weight=2.0,
        )

        mock_dist_matrix = {
            ("DEPOT", "D1"): 2.4, ("D1", "DEPOT"): 2.4,
            ("DEPOT", "D2"): 4.1, ("D2", "DEPOT"): 4.1,
            ("D1", "D2"): 1.8, ("D2", "D1"): 1.8,
            ("DEPOT", "DEPOT"): 0.0, ("D1", "D1"): 0.0, ("D2", "D2"): 0.0,
        }
        mock_time_matrix = {
            ("DEPOT", "D1"): 8.5, ("D1", "DEPOT"): 8.5,
            ("DEPOT", "D2"): 14.2, ("D2", "DEPOT"): 14.2,
            ("D1", "D2"): 5.0, ("D2", "D1"): 5.0,
            ("DEPOT", "DEPOT"): 0.0, ("D1", "D1"): 0.0, ("D2", "D2"): 0.0,
        }

        optimizer = ClassicalOptimizer(
            request=req,
            distance_matrix=mock_dist_matrix,
            time_matrix=mock_time_matrix,
            is_live_traffic_used=True,
            traffic_provider="Mappls",
            traffic_status="live_connected",
            traffic_last_updated=get_ist_timestamp(),
        )
        res = optimizer.optimize()

        self.assertEqual(res.status, "success")
        self.assertTrue(res.is_live_traffic_used)
        self.assertEqual(res.traffic_provider, "Mappls")
        self.assertEqual(res.traffic_status, "live_connected")
        self.assertGreater(res.total_distance_km, 0)
        self.assertGreater(res.estimated_time_minutes, 0)

    def test_qiskit_optimizer_with_traffic_matrices(self):
        depot = DepotInput(id="DEPOT", lat=12.9279, lng=77.6271)
        vehicles = [VehicleInput(id="V1", capacity=500.0, fuel_efficiency=12.0)]
        deliveries = [
            DeliveryInput(id="D1", lat=12.9352, lng=77.6245, demand=20.0),
            DeliveryInput(id="D2", lat=12.9412, lng=77.6189, demand=30.0),
            DeliveryInput(id="D3", lat=12.9150, lng=77.6350, demand=15.0),
        ]
        req = OptimizationRequestInput(
            depot=depot,
            vehicles=vehicles,
            deliveries=deliveries,
            traffic_level="moderate",
            optimization_method="qiskit",
        )

        mock_dist_matrix = {
            ("DEPOT", "D1"): 2.4, ("D1", "DEPOT"): 2.4,
            ("DEPOT", "D2"): 4.1, ("D2", "DEPOT"): 4.1,
            ("DEPOT", "D3"): 3.0, ("D3", "DEPOT"): 3.0,
            ("D1", "D2"): 1.8, ("D2", "D1"): 1.8,
            ("D1", "D3"): 3.5, ("D3", "D1"): 3.5,
            ("D2", "D3"): 4.8, ("D3", "D2"): 4.8,
            ("DEPOT", "DEPOT"): 0.0, ("D1", "D1"): 0.0,
            ("D2", "D2"): 0.0, ("D3", "D3"): 0.0,
        }
        mock_time_matrix = {
            ("DEPOT", "D1"): 8.5, ("D1", "DEPOT"): 8.5,
            ("DEPOT", "D2"): 14.2, ("D2", "DEPOT"): 14.2,
            ("DEPOT", "D3"): 9.0, ("D3", "DEPOT"): 9.0,
            ("D1", "D2"): 5.0, ("D2", "D1"): 5.0,
            ("D1", "D3"): 11.0, ("D3", "D1"): 11.0,
            ("D2", "D3"): 16.0, ("D3", "D2"): 16.0,
            ("DEPOT", "DEPOT"): 0.0, ("D1", "D1"): 0.0,
            ("D2", "D2"): 0.0, ("D3", "D3"): 0.0,
        }

        optimizer = QiskitVRPOptimizer(
            request=req,
            distance_matrix=mock_dist_matrix,
            time_matrix=mock_time_matrix,
            is_live_traffic_used=True,
            traffic_provider="Mappls",
            traffic_status="live_connected",
            traffic_last_updated=get_ist_timestamp(),
        )
        res = optimizer.optimize()

        self.assertEqual(res.status, "success")
        self.assertTrue(res.is_live_traffic_used)
        self.assertEqual(res.traffic_provider, "Mappls")
        self.assertIn("live mappls real-time road", res.solver.notes.lower())

if __name__ == "__main__":
    unittest.main()
