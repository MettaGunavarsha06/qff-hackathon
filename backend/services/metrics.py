import os
from typing import List, Dict, Tuple, Any, Optional
from models.schemas import VehicleInput, DeliveryInput, DepotInput, RouteWaypoint, RouteOutput
from utils.distance import haversine_distance, calculate_travel_time

# Configurable CO2 emission factor (kg CO2 / liter of fuel)
DEFAULT_CO2_EMISSION_FACTOR = float(os.getenv("CO2_EMISSION_FACTOR", "2.31"))
DIESEL_CO2_EMISSION_FACTOR = 2.68
ELECTRIC_GRID_CO2_PER_KM = 0.048

def parse_time_to_minutes(time_str: Optional[str]) -> int:
    """Converts 'HH:MM' string to minutes from midnight."""
    if not time_str:
        return 510  # 08:30 default
    try:
        parts = time_str.strip().split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 510

def minutes_to_time_str(mins: float) -> str:
    """Converts minutes from midnight to 'HH:MM' string."""
    total = int(round(mins)) % 1440
    h = total // 60
    m = total % 60
    return f"{h:02d}:{m:02d}"

def calculate_fuel_and_co2(
    distance_km: float,
    vehicle: VehicleInput,
    cargo_load_kg: float = 0.0
) -> Tuple[float, float]:
    """
    Computes estimated fuel consumption (Liters) and CO2 emissions (kg).
    Formula: fuel_liters = distance_km / fuel_efficiency
    """
    if distance_km <= 0:
        return 0.0, 0.0

    eff = max(1.0, float(vehicle.fuel_efficiency))
    
    # Powertrain specific calculations
    fuel_type = (vehicle.fuel_type or "diesel").lower()

    if fuel_type == "electric":
        fuel_l = 0.0
        co2_kg = round(distance_km * ELECTRIC_GRID_CO2_PER_KM * (1.0 + (cargo_load_kg / 1000.0) * 0.15), 2)
    elif fuel_type == "hybrid":
        base_fuel = (distance_km / eff) * 0.70
        fuel_l = round(base_fuel, 2)
        co2_kg = round(fuel_l * DEFAULT_CO2_EMISSION_FACTOR, 2)
    else:  # diesel
        base_fuel = distance_km / eff
        fuel_l = round(base_fuel, 2)
        co2_kg = round(fuel_l * DIESEL_CO2_EMISSION_FACTOR, 2)

    return fuel_l, co2_kg

def build_route_details(
    vehicle: VehicleInput,
    stop_ids: List[str],
    depot: DepotInput,
    deliveries_map: Dict[str, DeliveryInput],
    traffic_level: str = "medium",
    color: str = "#06b6d4",
    distance_matrix: Optional[Dict[Tuple[str, str], float]] = None,
    time_matrix: Optional[Dict[Tuple[str, str], float]] = None,
) -> RouteOutput:
    """
    Builds structured RouteOutput and turn-by-turn waypoints from a stop sequence.
    When distance_matrix and time_matrix (from Mappls / routing API) are provided,
    exact real-road distance and live traffic travel times are used.
    """
    coords: Dict[str, Tuple[float, float]] = {
        depot.id: (depot.lat, depot.lng)
    }
    for did, d in deliveries_map.items():
        coords[did] = (d.lat, d.lng)

    waypoints: List[RouteWaypoint] = []
    current_time_mins = float(parse_time_to_minutes(depot.operating_hours_start or "08:30"))
    total_dist_km = 0.0
    total_time_mins = 0.0

    # Cargo load
    visited_deliveries = [sid for sid in stop_ids if sid != depot.id and sid in deliveries_map]
    total_cargo = sum(deliveries_map[did].get_demand() for did in visited_deliveries)
    current_load = total_cargo
    late_count = 0

    # First waypoint: Depot Departure
    waypoints.append(RouteWaypoint(
        sequence_index=0,
        stop_id=depot.id,
        location_name=depot.name or "Central Depot",
        lat=depot.lat,
        lng=depot.lng,
        arrival_time=minutes_to_time_str(current_time_mins),
        departure_time=minutes_to_time_str(current_time_mins),
        demand_delivered_kg=0.0,
        remaining_capacity_kg=round(vehicle.capacity - current_load, 1),
        distance_from_prev_km=0.0,
        travel_time_mins=0.0,
        is_depot=True,
        is_late=False
    ))

    for i in range(1, len(stop_ids)):
        prev_id = stop_ids[i - 1]
        curr_id = stop_ids[i]

        p1 = coords.get(prev_id, (depot.lat, depot.lng))
        p2 = coords.get(curr_id, (depot.lat, depot.lng))

        # Check for real road matrix first
        if distance_matrix and (prev_id, curr_id) in distance_matrix:
            leg_dist = distance_matrix[(prev_id, curr_id)]
            leg_time = time_matrix.get((prev_id, curr_id), calculate_travel_time(leg_dist, traffic_level)) if time_matrix else calculate_travel_time(leg_dist, traffic_level)
        else:
            leg_dist = haversine_distance(p1[0], p1[1], p2[0], p2[1]) * 1.3  # Road network factor
            leg_time = calculate_travel_time(leg_dist, traffic_level)

        total_dist_km += leg_dist
        total_time_mins += leg_time
        current_time_mins += leg_time

        arrival_str = minutes_to_time_str(current_time_mins)

        if curr_id == depot.id:
            waypoints.append(RouteWaypoint(
                sequence_index=i,
                stop_id=depot.id,
                location_name=f"{depot.name or 'Central Depot'} (Return)",
                lat=depot.lat,
                lng=depot.lng,
                arrival_time=arrival_str,
                departure_time=arrival_str,
                demand_delivered_kg=0.0,
                remaining_capacity_kg=round(vehicle.capacity, 1),
                distance_from_prev_km=round(leg_dist, 2),
                travel_time_mins=round(leg_time, 1),
                is_depot=True,
                is_late=False
            ))
        else:
            deliv = deliveries_map[curr_id]
            service_mins = deliv.service_time_mins or 15
            total_time_mins += service_mins

            tw_start_mins = parse_time_to_minutes(deliv.time_window_start)
            tw_end_mins = parse_time_to_minutes(deliv.time_window_end)

            # Wait if arrived early
            if current_time_mins < tw_start_mins:
                wait_m = tw_start_mins - current_time_mins
                total_time_mins += wait_m
                current_time_mins = float(tw_start_mins)

            is_late = current_time_mins > (tw_end_mins + 5)
            if is_late:
                late_count += 1

            current_time_mins += service_mins
            current_load -= deliv.get_demand()

            waypoints.append(RouteWaypoint(
                sequence_index=i,
                stop_id=deliv.id,
                location_name=deliv.get_customer_name(),
                lat=deliv.lat,
                lng=deliv.lng,
                arrival_time=arrival_str,
                departure_time=minutes_to_time_str(current_time_mins),
                demand_delivered_kg=round(deliv.get_demand(), 1),
                remaining_capacity_kg=round(max(0.0, vehicle.capacity - current_load), 1),
                distance_from_prev_km=round(leg_dist, 2),
                travel_time_mins=round(leg_time, 1),
                is_depot=False,
                is_late=is_late,
                time_window_start=deliv.time_window_start,
                time_window_end=deliv.time_window_end
            ))

    fuel_l, co2_kg = calculate_fuel_and_co2(total_dist_km, vehicle, total_cargo / 2.0)
    cap_util = round((total_cargo / max(1.0, vehicle.capacity)) * 100.0, 1)

    return RouteOutput(
        vehicle_id=vehicle.id,
        vehicle_name=vehicle.name or f"Vehicle {vehicle.id}",
        color=color,
        stops=stop_ids,
        deliveries=visited_deliveries,
        distance_km=round(total_dist_km, 2),
        travel_time_minutes=round(total_time_mins, 1),
        fuel_liters=round(fuel_l, 2),
        co2_kg=round(co2_kg, 2),
        capacity_used=round(total_cargo, 1),
        capacity_utilization=min(100.0, cap_util),
        waypoints=waypoints
    )
