import os
import time
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Tuple, Any, Optional
import requests

# Provider info
TRAFFIC_PROVIDER_NAME = "Mappls"

def get_ist_timestamp() -> str:
    """Returns the current timestamp in India Standard Time (IST: UTC+5:30)."""
    ist_tz = timezone(timedelta(hours=5, minutes=30))
    now = datetime.now(ist_tz)
    # Format: "08 Sep 2026, 15:42 IST"
    return now.strftime("%d %b %Y, %H:%M IST")

def get_mappls_api_key() -> Optional[str]:
    """Retrieves the Mappls REST API key strictly from environment variables."""
    key = os.getenv("MAPPLS_REST_KEY", "").strip()
    return key if key else None

def get_traffic_status() -> Dict[str, Any]:
    """
    Checks if live traffic service is connected or unavailable.
    Does NOT generate fake data.
    """
    api_key = get_mappls_api_key()
    if not api_key:
        return {
            "status": "traffic_unavailable",
            "message": "Live traffic data is currently unavailable. (MAPPLS_REST_KEY not configured)",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
            "last_updated": get_ist_timestamp(),
            "api_configured": False,
        }

    # Perform a lightweight ping/check to Mappls endpoint
    try:
        # Check driving distance between two standard points in Delhi/Bengaluru
        # Using Mappls distance_matrix_eta endpoint with small timeout
        coords = "77.6271,12.9279;77.6412,12.9716"  # lon,lat;lon,lat
        url = f"https://apis.mappls.com/advancedmaps/v1/{api_key}/distance_matrix_eta/driving/{coords}"
        resp = requests.get(url, timeout=4.0)

        if resp.status_code == 200:
            data = resp.json()
            # Mappls returns responseCode 200 or code 200/ok
            if data.get("responseCode") in [200, "200"] or "durations" in data or "results" in data:
                return {
                    "status": "live_connected",
                    "message": "Live traffic data connected and active.",
                    "provider": TRAFFIC_PROVIDER_NAME,
                    "is_live": True,
                    "last_updated": get_ist_timestamp(),
                    "api_configured": True,
                }

        # If error response from API (e.g. invalid key or quota)
        error_msg = resp.json().get("message", f"HTTP {resp.status_code}") if resp.text else f"HTTP {resp.status_code}"
        return {
            "status": "traffic_unavailable",
            "message": f"Live traffic data is currently unavailable. ({error_msg})",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
            "last_updated": get_ist_timestamp(),
            "api_configured": True,
        }
    except Exception as e:
        return {
            "status": "traffic_unavailable",
            "message": f"Live traffic data is currently unavailable. ({str(e)})",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
            "last_updated": get_ist_timestamp(),
            "api_configured": True,
        }

def get_distance_matrix(locations: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Retrieves live traffic-aware distance and travel-time matrix from Mappls.
    
    locations format: [{"id": "DEPOT", "lat": 12.9279, "lng": 77.6271}, ...]
    
    Returns:
    {
        "status": "success" | "traffic_unavailable",
        "provider": "Mappls",
        "is_live": bool,
        "last_updated": str,
        "distance_matrix": Dict[Tuple[str, str], float] (km),
        "time_matrix": Dict[Tuple[str, str], float] (minutes with live traffic),
        "traffic_levels": Dict[Tuple[str, str], str] (clear, moderate, heavy, etc.)
    }
    """
    api_key = get_mappls_api_key()
    node_ids = [loc["id"] for loc in locations]
    n = len(locations)

    if not api_key:
        return {
            "status": "traffic_unavailable",
            "message": "Live traffic data is currently unavailable. (MAPPLS_REST_KEY not configured)",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
            "last_updated": get_ist_timestamp(),
            "distance_matrix": None,
            "time_matrix": None,
        }

    try:
        # Mappls requires coordinates in longitude,latitude order separated by semicolon
        # Format: lon1,lat1;lon2,lat2;lon3,lat3
        coords_list = [f"{loc['lng']:.6f},{loc['lat']:.6f}" for loc in locations]
        coords_str = ";".join(coords_list)

        # Mappls distance_matrix_eta driving endpoint
        url = f"https://apis.mappls.com/advancedmaps/v1/{api_key}/distance_matrix_eta/driving/{coords_str}"
        resp = requests.get(url, timeout=7.0)

        if resp.status_code != 200:
            err_detail = resp.json().get("message", f"HTTP {resp.status_code}") if resp.text else f"HTTP {resp.status_code}"
            return {
                "status": "traffic_unavailable",
                "message": f"Live traffic data is currently unavailable. ({err_detail})",
                "provider": TRAFFIC_PROVIDER_NAME,
                "is_live": False,
                "last_updated": get_ist_timestamp(),
                "distance_matrix": None,
                "time_matrix": None,
            }

        data = resp.json()
        
        # Mappls response structures can be:
        # 1. {"durations": [[...]], "distances": [[...]]}
        # 2. {"results": {"durations": [[...]], "distances": [[...]]}}
        durations = data.get("durations") or data.get("results", {}).get("durations")
        distances = data.get("distances") or data.get("results", {}).get("distances")

        if not durations or not distances or len(durations) != n:
            return {
                "status": "traffic_unavailable",
                "message": "Live traffic data is currently unavailable. (Malformed matrix response from provider)",
                "provider": TRAFFIC_PROVIDER_NAME,
                "is_live": False,
                "last_updated": get_ist_timestamp(),
                "distance_matrix": None,
                "time_matrix": None,
            }

        dist_matrix: Dict[Tuple[str, str], float] = {}
        time_matrix: Dict[Tuple[str, str], float] = {}
        traffic_status: Dict[Tuple[str, str], str] = {}

        for i in range(n):
            for j in range(n):
                id_i = node_ids[i]
                id_j = node_ids[j]

                if i == j:
                    dist_matrix[(id_i, id_j)] = 0.0
                    time_matrix[(id_i, id_j)] = 0.0
                    traffic_status[(id_i, id_j)] = "clear"
                else:
                    # Mappls distances are in meters -> convert to km
                    dist_meters = float(distances[i][j])
                    dist_km = round(dist_meters / 1000.0, 3)

                    # Mappls durations are in seconds -> convert to minutes
                    dur_seconds = float(durations[i][j])
                    dur_mins = round(dur_seconds / 60.0, 1)

                    dist_matrix[(id_i, id_j)] = dist_km
                    time_matrix[(id_i, id_j)] = dur_mins

                    # Determine congestion level based on average speed (km/h)
                    speed_kmh = (dist_km / max(0.01, dur_mins / 60.0))
                    if speed_kmh < 15.0:
                        traffic_status[(id_i, id_j)] = "heavy"
                    elif speed_kmh < 28.0:
                        traffic_status[(id_i, id_j)] = "moderate"
                    else:
                        traffic_status[(id_i, id_j)] = "clear"

        return {
            "status": "success",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": True,
            "last_updated": get_ist_timestamp(),
            "distance_matrix": dist_matrix,
            "time_matrix": time_matrix,
            "traffic_status": traffic_status,
        }

    except Exception as e:
        return {
            "status": "traffic_unavailable",
            "message": f"Live traffic data is currently unavailable. ({str(e)})",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
            "last_updated": get_ist_timestamp(),
            "distance_matrix": None,
            "time_matrix": None,
        }

def get_route(origin: Tuple[float, float], destination: Tuple[float, float]) -> Dict[str, Any]:
    """
    Retrieves detailed turn-by-turn road route and live traffic info between two points.
    origin: (lat, lng)
    destination: (lat, lng)
    """
    api_key = get_mappls_api_key()
    if not api_key:
        return {
            "status": "traffic_unavailable",
            "message": "Live traffic data is currently unavailable.",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
        }

    try:
        # Longitude,latitude format
        coords_str = f"{origin[1]:.6f},{origin[0]:.6f};{destination[1]:.6f},{destination[0]:.6f}"
        url = f"https://apis.mappls.com/advancedmaps/v1/{api_key}/route_eta/driving/{coords_str}?geometries=polyline&overview=full"
        resp = requests.get(url, timeout=5.0)

        if resp.status_code == 200:
            data = resp.json()
            routes = data.get("routes", [])
            if routes:
                r = routes[0]
                dist_km = round(float(r.get("distance", 0.0)) / 1000.0, 3)
                duration_mins = round(float(r.get("duration", 0.0)) / 60.0, 1)
                geometry = r.get("geometry", "")
                
                return {
                    "status": "success",
                    "provider": TRAFFIC_PROVIDER_NAME,
                    "is_live": True,
                    "distance_km": dist_km,
                    "travel_time_mins": duration_mins,
                    "geometry": geometry,
                    "last_updated": get_ist_timestamp(),
                }

        return {
            "status": "traffic_unavailable",
            "message": "Live traffic data is currently unavailable.",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
        }
    except Exception as e:
        return {
            "status": "traffic_unavailable",
            "message": f"Live traffic data is currently unavailable. ({str(e)})",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
        }

def get_live_eta(origin: Tuple[float, float], destination: Tuple[float, float]) -> Dict[str, Any]:
    """
    Returns the real-time ETA in minutes and calculated arrival time in IST.
    """
    route_info = get_route(origin, destination)
    if route_info.get("status") == "success":
        duration_mins = route_info["travel_time_mins"]
        ist_tz = timezone(timedelta(hours=5, minutes=30))
        arrival_time = datetime.now(ist_tz) + timedelta(minutes=duration_mins)
        return {
            "status": "success",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": True,
            "travel_time_mins": duration_mins,
            "eta_time_ist": arrival_time.strftime("%H:%M IST"),
            "distance_km": route_info["distance_km"],
            "last_updated": get_ist_timestamp(),
        }
    else:
        return {
            "status": "traffic_unavailable",
            "message": "Live traffic data is currently unavailable.",
            "provider": TRAFFIC_PROVIDER_NAME,
            "is_live": False,
        }
