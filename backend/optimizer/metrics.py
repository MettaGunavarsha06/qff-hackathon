from typing import List, Dict, Any, Tuple
from .models import Vehicle, Delivery, Waypoint, VehicleRoute, MetricComparison, TrafficLevel

DIESEL_CO2_PER_LITER = 2.68  # kg CO2 / liter of diesel
GAS_CO2_PER_LITER = 2.31     # kg CO2 / liter of gas/hybrid
EV_CO2_PER_KM = 0.048        # kg CO2 equivalent per km on grid

def parse_time_to_minutes(time_str: str) -> int:
    """Parses 'HH:MM' string to minutes from midnight."""
    try:
        parts = time_str.strip().split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 540  # Default 09:00

def minutes_to_time_str(mins: float) -> str:
    """Converts minutes from midnight to 'HH:MM' format."""
    total_mins = int(round(mins)) % (24 * 60)
    hours = total_mins // 60
    m = total_mins % 60
    return f"{hours:02d}:{m:02d}"

def calculate_fuel_and_co2(
    distance_km: float,
    vehicle: Vehicle,
    avg_load_kg: float,
    traffic_level: TrafficLevel
) -> Tuple[float, float]:
    """
    Computes estimated fuel consumption (L) and CO2 emissions (kg)
    factoring in vehicle powertrain, cargo payload, and traffic idle friction.
    """
    if distance_km <= 0:
        return 0.0, 0.0

    # Base L/100km
    base_l_per_100km = (100.0 / max(1.0, vehicle.fuel_efficiency_km_per_l))
    
    # Payload adjustment: ~0.04L / 100km per 100kg cargo
    cargo_penalty = (avg_load_kg / 100.0) * 0.04
    
    # Traffic idle penalty
    traffic_factors = {
        "clear": 1.0,
        "moderate": 1.08,
        "heavy": 1.25,
        "rush_hour": 1.48
    }
    traffic_penalty = traffic_factors.get(traffic_level, 1.08)

    effective_l_per_100km = (base_l_per_100km + cargo_penalty) * traffic_penalty

    if vehicle.fuel_type == "electric":
        fuel_liters = 0.0
        co2_kg = distance_km * EV_CO2_PER_KM * (1.0 + (avg_load_kg / 1000.0) * 0.15) * traffic_penalty
    elif vehicle.fuel_type == "hybrid":
        fuel_liters = (distance_km / 100.0) * (effective_l_per_100km * 0.68)
        co2_kg = fuel_liters * GAS_CO2_PER_LITER
    else:  # diesel
        fuel_liters = (distance_km / 100.0) * effective_l_per_100km
        co2_kg = fuel_liters * DIESEL_CO2_PER_LITER

    return round(fuel_liters, 2), round(co2_kg, 2)

def compute_improvements(before_val: float, after_val: float) -> Tuple[float, float]:
    """Returns (difference, percentage_improvement). Favorable is lower value."""
    diff = round(before_val - after_val, 2)
    if before_val > 0:
        pct = round((diff / before_val) * 100.0, 1)
    else:
        pct = 0.0
    return diff, pct

def build_comparison_metrics(
    before_metrics: Dict[str, float],
    after_metrics: Dict[str, float]
) -> List[MetricComparison]:
    definitions = [
        ("total_distance_km", "Total Distance", "km", True),
        ("total_time_mins", "Total Travel Time", "mins", True),
        ("total_fuel_l", "Fuel Consumption", "L", True),
        ("total_co2_kg", "CO2 Emissions", "kg", True),
        ("late_deliveries_count", "Late Deliveries", "deliveries", True),
        ("fleet_utilization_pct", "Vehicle Capacity Utilization", "%", False),
    ]
    results: List[MetricComparison] = []
    for key, label, unit, is_lower_better in definitions:
        b_val = before_metrics.get(key, 0.0)
        a_val = after_metrics.get(key, 0.0)
        if is_lower_better:
            diff, pct = compute_improvements(b_val, a_val)
        else:
            diff = round(a_val - b_val, 2)
            pct = round((diff / max(1.0, b_val)) * 100.0, 1) if b_val > 0 else 0.0

        results.append(MetricComparison(
            metric=key,
            label=label,
            before=b_val,
            after=a_val,
            difference=diff,
            improvement_pct=pct,
            unit=unit,
            is_favorable_direction_down=is_lower_better
        ))
    return results
