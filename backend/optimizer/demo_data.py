from typing import List, Tuple
from .models import Depot, Vehicle, Delivery

def get_demo_depot() -> Depot:
    """Central logistics depot at Koramangala, Bengaluru, India."""
    return Depot(
        id="DEPOT-BLR",
        name="RouteQ Bengaluru Central Hub (Koramangala)",
        lat=12.9279,
        lng=77.6271,
        operating_hours_start="08:30",
        operating_hours_end="18:30"
    )

def get_demo_vehicles() -> List[Vehicle]:
    """Urban delivery fleet tailored for Indian traffic and road conditions."""
    return [
        Vehicle(
            id="IND-V01",
            name="Tata Ace EV Express",
            capacity_kg=500.0,
            starting_depot_id="DEPOT-BLR",
            max_route_distance_km=120.0,
            fuel_efficiency_km_per_l=19.0,
            fuel_type="electric"
        ),
        Vehicle(
            id="IND-V02",
            name="Mahindra Bolero Maxi Truck",
            capacity_kg=650.0,
            starting_depot_id="DEPOT-BLR",
            max_route_distance_km=150.0,
            fuel_efficiency_km_per_l=11.5,
            fuel_type="diesel"
        ),
        Vehicle(
            id="IND-V03",
            name="Ashok Leyland Bada Dost",
            capacity_kg=750.0,
            starting_depot_id="DEPOT-BLR",
            max_route_distance_km=160.0,
            fuel_efficiency_km_per_l=10.0,
            fuel_type="diesel"
        ),
        Vehicle(
            id="IND-V04",
            name="Euler HiLoad EV Delivery",
            capacity_kg=480.0,
            starting_depot_id="DEPOT-BLR",
            max_route_distance_km=110.0,
            fuel_efficiency_km_per_l=18.0,
            fuel_type="electric"
        ),
        Vehicle(
            id="IND-V05",
            name="Piaggio Ape E-City Cargo",
            capacity_kg=420.0,
            starting_depot_id="DEPOT-BLR",
            max_route_distance_km=95.0,
            fuel_efficiency_km_per_l=21.0,
            fuel_type="electric"
        )
    ]

def get_demo_deliveries() -> List[Delivery]:
    """25 realistic delivery stops across major Bengaluru commercial and tech corridors."""
    raw_india = [
        ("BLR-D01", "Apex BioTech Labs India", 12.9716, 77.6412, 38.0, "urgent", "08:30", "10:30", 15, "100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru"),
        ("BLR-D02", "Flipkart Internet Campus", 12.9121, 77.6446, 45.0, "high", "09:00", "11:30", 20, "27th Main Rd, HSR Layout Sector 2, Bengaluru"),
        ("BLR-D03", "MG Road Commercial Plaza", 12.9756, 77.6066, 25.0, "urgent", "09:00", "11:00", 15, "Mahatma Gandhi Rd, Central Business District, Bengaluru"),
        ("BLR-D04", "Bellandur EcoSpace Tech Park", 12.9304, 77.6784, 62.0, "medium", "10:00", "13:00", 20, "Outer Ring Rd, Bellandur, Bengaluru"),
        ("BLR-D05", "Marathahalli Multiplex & Market", 12.9591, 77.6974, 55.0, "high", "08:30", "11:00", 25, "Varthur Rd, Marathahalli, Bengaluru"),
        ("BLR-D06", "Whitefield ITPL Main Gate", 12.9863, 77.7314, 90.0, "medium", "11:00", "14:00", 25, "International Tech Park, Whitefield, Bengaluru"),
        ("BLR-D07", "Jayanagar 4th Block Market", 12.9308, 77.5838, 40.0, "high", "09:30", "12:00", 15, "11th Main Rd, Jayanagar 4th Block, Bengaluru"),
        ("BLR-D08", "Electronic City Infosys Gate 1", 12.8452, 77.6602, 70.0, "urgent", "10:00", "12:00", 20, "Hosur Rd, Electronic City Phase 1, Bengaluru"),
        ("BLR-D09", "Sarjapur Road Wipro Campus", 12.9102, 77.6835, 65.0, "medium", "11:00", "14:30", 15, "Sarjapur Main Rd, Kaikondrahalli, Bengaluru"),
        ("BLR-D10", "Hebbal Manyata Tech Park", 13.0458, 77.6201, 50.0, "low", "13:00", "16:30", 20, "Outer Ring Rd, Nagavara, Hebbal, Bengaluru"),
        ("BLR-D11", "Malleshwaram 8th Cross Retail", 12.9984, 77.5714, 32.0, "medium", "12:00", "15:00", 15, "Margosa Rd, Malleshwaram, Bengaluru"),
        ("BLR-D12", "Rajajinagar Industrial Estate", 12.9892, 77.5539, 85.0, "high", "09:00", "12:00", 25, "West of Chord Rd, Rajajinagar, Bengaluru"),
        ("BLR-D13", "Peenya 1st Stage Manufacturing", 13.0285, 77.5195, 95.0, "urgent", "09:30", "11:30", 20, "Peenya Industrial Area, Bengaluru"),
        ("BLR-D14", "BTM Layout 2nd Stage Commerce", 12.9165, 77.6101, 28.0, "urgent", "10:30", "12:30", 15, "Outer Ring Rd, BTM 2nd Stage, Bengaluru"),
        ("BLR-D15", "JP Nagar 6th Phase Cultural Hub", 12.9063, 77.5855, 45.0, "low", "13:30", "17:00", 20, "15th Cross Rd, JP Nagar 6th Phase, Bengaluru"),
        ("BLR-D16", "Banashankari 3rd Stage Mart", 12.9255, 77.5467, 35.0, "medium", "11:30", "15:00", 15, "Kathreguppe Main Rd, Banashankari, Bengaluru"),
        ("BLR-D17", "Domlur Intermediate Ring Rd Hub", 12.9609, 77.6387, 48.0, "medium", "10:00", "13:30", 20, "Intermediate Ring Rd, Domlur, Bengaluru"),
        ("BLR-D18", "Richmond Town Commercial Zone", 12.9634, 77.6022, 52.0, "high", "09:00", "12:30", 20, "Richmond Rd, Richmond Town, Bengaluru"),
        ("BLR-D19", "Commercial Street Fashion Arcade", 12.9822, 77.6083, 42.0, "medium", "12:30", "16:00", 15, "Tasker Town, Shivajinagar, Bengaluru"),
        ("BLR-D20", "Frazer Town Gourmet Emporium", 12.9968, 77.6133, 58.0, "high", "09:00", "11:30", 20, "Mosque Rd, Pulikeshi Nagar, Bengaluru"),
        ("BLR-D21", "Kalyan Nagar CMR Road Tech Hub", 13.0218, 77.6436, 30.0, "low", "13:00", "17:00", 15, "CMR Main Rd, HRBR Layout, Kalyan Nagar, Bengaluru"),
        ("BLR-D22", "Yeshwanthpur Wholesale Yard", 13.0210, 77.5480, 75.0, "low", "14:00", "17:30", 20, "Tumkur Rd, Yeshwanthpur, Bengaluru"),
        ("BLR-D23", "Bannerghatta Apollo Hospital", 12.8943, 77.5995, 35.0, "urgent", "11:00", "13:30", 15, "Bannerghatta Main Rd, Arakere, Bengaluru"),
        ("BLR-D24", "Yelahanka New Town Complex", 13.1007, 77.5963, 52.0, "medium", "12:00", "15:30", 15, "Major Sandeep Unnikrishnan Rd, Yelahanka, Bengaluru"),
        ("BLR-D25", "KR Puram Railway Cargo Logistics", 13.0039, 77.6953, 80.0, "urgent", "08:30", "10:30", 25, "Old Madras Rd, KR Puram, Bengaluru")
    ]
    deliveries = []
    for item in raw_india:
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

def get_india_demo_depot() -> Depot:
    return get_demo_depot()

def get_india_demo_vehicles() -> List[Vehicle]:
    return get_demo_vehicles()

def get_india_demo_deliveries() -> List[Delivery]:
    return get_demo_deliveries()
