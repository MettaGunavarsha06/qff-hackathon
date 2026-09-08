from typing import List, Tuple
from .models import Depot, Vehicle, Delivery

def get_demo_depot() -> Depot:
    return Depot(
        id="DEPOT-01",
        name="RouteQ Bay Logistics Hub",
        lat=37.7685,
        lng=-122.4140,
        operating_hours_start="08:00",
        operating_hours_end="18:00"
    )

def get_demo_vehicles() -> List[Vehicle]:
    return [
        Vehicle(
            id="V-01",
            name="VoltExpress Cargo E1",
            capacity_kg=480.0,
            starting_depot_id="DEPOT-01",
            max_route_distance_km=130.0,
            fuel_efficiency_km_per_l=18.0,
            fuel_type="electric"
        ),
        Vehicle(
            id="V-02",
            name="EcoTransit Sprinter Alpha",
            capacity_kg=550.0,
            starting_depot_id="DEPOT-01",
            max_route_distance_km=150.0,
            fuel_efficiency_km_per_l=9.5,
            fuel_type="diesel"
        ),
        Vehicle(
            id="V-03",
            name="UrbanHybrid Courier H1",
            capacity_kg=420.0,
            starting_depot_id="DEPOT-01",
            max_route_distance_km=120.0,
            fuel_efficiency_km_per_l=14.0,
            fuel_type="hybrid"
        ),
        Vehicle(
            id="V-04",
            name="EcoTransit Sprinter Beta",
            capacity_kg=580.0,
            starting_depot_id="DEPOT-01",
            max_route_distance_km=160.0,
            fuel_efficiency_km_per_l=9.0,
            fuel_type="diesel"
        ),
        Vehicle(
            id="V-05",
            name="VoltExpress Cargo E2",
            capacity_kg=500.0,
            starting_depot_id="DEPOT-01",
            max_route_distance_km=130.0,
            fuel_efficiency_km_per_l=18.5,
            fuel_type="electric"
        )
    ]

def get_demo_deliveries() -> List[Delivery]:
    raw_data = [
        ("DEL-01", "Apex BioTech Labs", 37.7885, -122.3995, 38.0, "urgent", "08:30", "10:30", 15, "550 Howard St, Financial District"),
        ("DEL-02", "Salesforce Tower Reception", 37.7897, -122.3972, 45.0, "high", "09:00", "11:30", 20, "415 Mission St, SoMa"),
        ("DEL-03", "Pacific Heights Medical", 37.7925, -122.4345, 25.0, "urgent", "09:00", "11:00", 15, "2340 Clay St, Pacific Heights"),
        ("DEL-04", "Presidio Design Studio", 37.7989, -122.4542, 62.0, "medium", "10:00", "13:00", 20, "101 Montgomery St, Presidio"),
        ("DEL-05", "Fisherman's Wharf Provisions", 37.8080, -122.4177, 85.0, "high", "08:30", "11:00", 25, "2800 Leavenworth St, North Beach"),
        ("DEL-06", "Embarcadero Tech Center", 37.7955, -122.3937, 30.0, "medium", "11:00", "14:00", 15, "1 Market St, Financial District"),
        ("DEL-07", "Nob Hill Boutique Hotel", 37.7915, -122.4150, 40.0, "high", "09:30", "12:00", 15, "905 California St, Nob Hill"),
        ("DEL-08", "Mission Community Health", 37.7599, -122.4148, 55.0, "urgent", "10:00", "12:00", 20, "2401 Mission St, Mission"),
        ("DEL-09", "Castro Artisan Foods", 37.7609, -122.4350, 48.0, "medium", "11:00", "14:30", 15, "400 Castro St, Castro"),
        ("DEL-10", "Noe Valley Organic Mart", 37.7502, -122.4332, 68.0, "low", "13:00", "16:30", 20, "3900 24th St, Noe Valley"),
        ("DEL-11", "Potrero Hill Creative Hub", 37.7580, -122.4010, 32.0, "medium", "12:00", "15:00", 15, "1695 18th St, Potrero Hill"),
        ("DEL-12", "Dogpatch Hardware & Craft", 37.7562, -122.3879, 90.0, "high", "09:00", "12:00", 25, "2298 3rd St, Dogpatch"),
        ("DEL-13", "Mission Bay Biotech Incubator", 37.7675, -122.3910, 35.0, "urgent", "09:30", "11:30", 15, "1700 4th St, Mission Bay"),
        ("DEL-14", "Inner Sunset Pharmacy", 37.7635, -122.4660, 22.0, "urgent", "10:30", "12:30", 15, "1200 9th Ave, Inner Sunset"),
        ("DEL-15", "Outer Sunset Surf Supplies", 37.7535, -122.5050, 75.0, "low", "13:30", "17:00", 20, "3800 Judah St, Outer Sunset"),
        ("DEL-16", "Richmond District Books", 37.7802, -122.4820, 28.0, "medium", "11:30", "15:00", 15, "5400 Geary Blvd, Central Richmond"),
        ("DEL-17", "Golden Gate Park Science Ctr", 37.7699, -122.4661, 50.0, "medium", "10:00", "13:30", 20, "55 Music Concourse Dr, GGP"),
        ("DEL-18", "Marina Green Yacht Supply", 37.8045, -122.4380, 65.0, "high", "09:00", "12:30", 20, "3950 Scott St, Marina"),
        ("DEL-19", "Cow Hollow Wine Merchants", 37.7975, -122.4350, 42.0, "medium", "12:30", "16:00", 15, "2100 Union St, Cow Hollow"),
        ("DEL-20", "Chinatown Heritage Market", 37.7941, -122.4078, 58.0, "high", "09:00", "11:30", 20, "700 Grant Ave, Chinatown"),
        ("DEL-21", "Civic Center Municipal Library", 37.7792, -122.4158, 30.0, "low", "13:00", "17:00", 15, "100 Larkin St, Civic Center"),
        ("DEL-22", "Twin Peaks View Observatory", 37.7544, -122.4477, 18.0, "low", "14:00", "17:30", 15, "501 Twin Peaks Blvd"),
        ("DEL-23", "Glen Park Village Bakery", 37.7345, -122.4335, 40.0, "medium", "11:00", "14:30", 15, "2800 Diamond St, Glen Park"),
        ("DEL-24", "Bernal Heights Hardware", 37.7420, -122.4180, 52.0, "medium", "12:00", "15:30", 15, "400 Cortland Ave, Bernal Heights"),
        ("DEL-25", "Oracle Park Event Logistics", 37.7786, -122.3893, 80.0, "urgent", "08:30", "10:30", 25, "24 Willie Mays Plaza, South Beach")
    ]
    deliveries = []
    for item in raw_data:
        deliveries.append(Delivery(
            id=item[0],
            customer_name=item[1],
            lat=item[2],
            lng=item[3],
            demand_kg=item[4],
            priority=item[5],
            time_window_start=item[6],
            time_window_end=item[7],
            service_time_mins=item[8],
            address=item[9]
        ))
    return deliveries
