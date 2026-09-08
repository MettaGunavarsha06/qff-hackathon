import math
from typing import List, Dict, Tuple, Any

EARTH_RADIUS_KM = 6371.0
ROAD_CURVATURE_FACTOR = 1.30  # Urban street grid network distance vs straight line

TRAFFIC_SPEED_KMH = {
    "low": 40.0,
    "medium": 30.0,
    "high": 20.0,
    # Compatibility aliases
    "clear": 40.0,
    "moderate": 30.0,
    "heavy": 20.0,
    "rush_hour": 14.0,
}

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes great-circle distance between two GPS points using the Haversine formula.
    Multiplied by urban road curvature factor to represent realistic road distance in km.
    """
    if lat1 == lat2 and lon1 == lon2:
        return 0.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    straight_km = EARTH_RADIUS_KM * c
    return round(straight_km * ROAD_CURVATURE_FACTOR, 3)

def calculate_travel_time(distance_km: float, traffic_level: str = "medium") -> float:
    """
    Calculates estimated travel time in minutes based on distance and traffic level.
    """
    speed_kmh = TRAFFIC_SPEED_KMH.get(traffic_level.lower(), 30.0)
    hours = distance_km / max(5.0, speed_kmh)
    return round(hours * 60.0, 1)

def compute_distance_matrix(
    locations: List[Dict[str, Any]]
) -> Tuple[List[str], Dict[Tuple[str, str], float], Dict[Tuple[str, str], float]]:
    """
    Generates distance and travel time matrices for all provided location nodes.
    Returns: (node_ids, distance_matrix, time_matrix)
    """
    node_ids = [loc["id"] for loc in locations]
    coords = {loc["id"]: (loc["lat"], loc["lng"]) for loc in locations}
    
    dist_mat: Dict[Tuple[str, str], float] = {}
    time_mat: Dict[Tuple[str, str], float] = {}

    for id1 in node_ids:
        lat1, lon1 = coords[id1]
        for id2 in node_ids:
            if id1 == id2:
                dist_mat[(id1, id2)] = 0.0
                time_mat[(id1, id2)] = 0.0
            else:
                lat2, lon2 = coords[id2]
                d = haversine_distance(lat1, lon1, lat2, lon2)
                t = calculate_travel_time(d, "medium")
                dist_mat[(id1, id2)] = d
                time_mat[(id1, id2)] = t

    return node_ids, dist_mat, time_mat
