import math
from typing import List, Dict, Tuple, Any
from .models import Location, Delivery, Depot, TrafficLevel

EARTH_RADIUS_KM = 6371.0
ROAD_WINDING_FACTOR = 1.30  # Realistic Manhattan/urban road network distance vs straight line

TRAFFIC_MULTIPLIERS: Dict[TrafficLevel, float] = {
    "clear": 1.0,
    "moderate": 1.28,
    "heavy": 1.75,
    "rush_hour": 2.45
}

BASE_CITY_SPEED_KMH = 38.0  # Base speed in km/h

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates haversine distance in km."""
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_KM * c

def road_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Approximates realistic road distance in km."""
    crow_dist = haversine_distance(lat1, lon1, lat2, lon2)
    return crow_dist * ROAD_WINDING_FACTOR

def travel_time_minutes(dist_km: float, traffic_level: TrafficLevel) -> float:
    """Calculates travel time in minutes considering traffic conditions."""
    traffic_mult = TRAFFIC_MULTIPLIERS.get(traffic_level, 1.28)
    effective_speed_kmh = max(8.0, BASE_CITY_SPEED_KMH / traffic_mult)
    hours = dist_km / effective_speed_kmh
    return hours * 60.0

class DistanceMatrix:
    def __init__(self, depot: Depot, deliveries: List[Delivery], traffic_level: TrafficLevel = "moderate"):
        self.depot = depot
        self.deliveries = deliveries
        self.traffic_level = traffic_level
        self.node_ids = ["DEPOT"] + [d.id for d in deliveries]
        self.coords: Dict[str, Tuple[float, float]] = {
            "DEPOT": (depot.lat, depot.lng)
        }
        for d in deliveries:
            self.coords[d.id] = (d.lat, d.lng)

        self.dist_matrix: Dict[Tuple[str, str], float] = {}
        self.time_matrix: Dict[Tuple[str, str], float] = {}
        self._build_matrices()

    def _build_matrices(self):
        for id1 in self.node_ids:
            lat1, lon1 = self.coords[id1]
            for id2 in self.node_ids:
                if id1 == id2:
                    self.dist_matrix[(id1, id2)] = 0.0
                    self.time_matrix[(id1, id2)] = 0.0
                else:
                    lat2, lon2 = self.coords[id2]
                    dist = road_distance(lat1, lon1, lat2, lon2)
                    t_mins = travel_time_minutes(dist, self.traffic_level)
                    self.dist_matrix[(id1, id2)] = dist
                    self.time_matrix[(id1, id2)] = t_mins

    def get_distance(self, from_id: str, to_id: str) -> float:
        return self.dist_matrix.get((from_id, to_id), 0.0)

    def get_time(self, from_id: str, to_id: str) -> float:
        return self.time_matrix.get((from_id, to_id), 0.0)
