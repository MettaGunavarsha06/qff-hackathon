import type { Depot, Vehicle, Delivery } from '../types';

// ============================================================================
// 1. BENGALURU LOGISTICS CORRIDOR (Karnataka, India)
// ============================================================================
export const BLR_DEPOT: Depot = {
  id: 'DEPOT-BLR',
  name: 'RouteQ Bengaluru Central Hub (Koramangala)',
  lat: 12.9279,
  lng: 77.6271,
  operating_hours_start: '08:30',
  operating_hours_end: '18:30',
};

export const BLR_VEHICLES: Vehicle[] = [
  {
    id: 'IND-V01',
    name: 'Tata Ace EV Express',
    capacity_kg: 500.0,
    starting_depot_id: 'DEPOT-BLR',
    max_route_distance_km: 120.0,
    fuel_efficiency_km_per_l: 19.0,
    fuel_type: 'electric',
  },
  {
    id: 'IND-V02',
    name: 'Mahindra Bolero Maxi Truck',
    capacity_kg: 650.0,
    starting_depot_id: 'DEPOT-BLR',
    max_route_distance_km: 150.0,
    fuel_efficiency_km_per_l: 11.5,
    fuel_type: 'diesel',
  },
  {
    id: 'IND-V03',
    name: 'Ashok Leyland Bada Dost',
    capacity_kg: 750.0,
    starting_depot_id: 'DEPOT-BLR',
    max_route_distance_km: 160.0,
    fuel_efficiency_km_per_l: 10.0,
    fuel_type: 'diesel',
  },
  {
    id: 'IND-V04',
    name: 'Euler HiLoad EV Delivery',
    capacity_kg: 480.0,
    starting_depot_id: 'DEPOT-BLR',
    max_route_distance_km: 110.0,
    fuel_efficiency_km_per_l: 18.0,
    fuel_type: 'electric',
  },
  {
    id: 'IND-V05',
    name: 'Piaggio Ape E-City Cargo',
    capacity_kg: 420.0,
    starting_depot_id: 'DEPOT-BLR',
    max_route_distance_km: 95.0,
    fuel_efficiency_km_per_l: 21.0,
    fuel_type: 'electric',
  },
];

export const BLR_DELIVERIES: Delivery[] = [
  { id: 'BLR-D01', customer_name: 'Apex BioTech Labs India', lat: 12.9716, lng: 77.6412, demand_kg: 38.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '10:30', service_time_mins: 15, address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038' },
  { id: 'BLR-D02', customer_name: 'Flipkart Internet Campus', lat: 12.9121, lng: 77.6446, demand_kg: 45.0, priority: 'high', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: '27th Main Rd, HSR Layout Sector 2, Bengaluru, Karnataka 560102' },
  { id: 'BLR-D03', customer_name: 'MG Road Commercial Plaza', lat: 12.9756, lng: 77.6066, demand_kg: 25.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:00', service_time_mins: 15, address: 'Mahatma Gandhi Rd, Central Business District, Bengaluru, Karnataka 560001' },
  { id: 'BLR-D04', customer_name: 'Bellandur EcoSpace Tech Park', lat: 12.9304, lng: 77.6784, demand_kg: 62.0, priority: 'medium', time_window_start: '10:00', time_window_end: '13:00', service_time_mins: 20, address: 'Outer Ring Rd, Bellandur, Bengaluru, Karnataka 560103' },
  { id: 'BLR-D05', customer_name: 'Marathahalli Multiplex & Market', lat: 12.9591, lng: 77.6974, demand_kg: 55.0, priority: 'high', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Varthur Rd, Marathahalli, Bengaluru, Karnataka 560037' },
  { id: 'BLR-D06', customer_name: 'Whitefield ITPL Main Gate', lat: 12.9863, lng: 77.7314, demand_kg: 90.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 25, address: 'International Tech Park, Whitefield, Bengaluru, Karnataka 560066' },
  { id: 'BLR-D07', customer_name: 'Jayanagar 4th Block Market', lat: 12.9308, lng: 77.5838, demand_kg: 40.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 15, address: '11th Main Rd, Jayanagar 4th Block, Bengaluru, Karnataka 560011' },
  { id: 'BLR-D08', customer_name: 'Electronic City Infosys Gate 1', lat: 12.8452, lng: 77.6602, demand_kg: 70.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:00', service_time_mins: 20, address: 'Hosur Rd, Electronic City Phase 1, Bengaluru, Karnataka 560100' },
  { id: 'BLR-D09', customer_name: 'Sarjapur Road Wipro Campus', lat: 12.9102, lng: 77.6835, demand_kg: 65.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:30', service_time_mins: 15, address: 'Sarjapur Main Rd, Kaikondrahalli, Bengaluru, Karnataka 560035' },
  { id: 'BLR-D10', customer_name: 'Hebbal Manyata Tech Park', lat: 13.0458, lng: 77.6201, demand_kg: 50.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Outer Ring Rd, Nagavara, Hebbal, Bengaluru, Karnataka 560045' },
  { id: 'BLR-D11', customer_name: 'Malleshwaram 8th Cross Retail', lat: 12.9984, lng: 77.5714, demand_kg: 32.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:00', service_time_mins: 15, address: 'Margosa Rd, Malleshwaram, Bengaluru, Karnataka 560003' },
  { id: 'BLR-D12', customer_name: 'Rajajinagar Industrial Estate', lat: 12.9892, lng: 77.5539, demand_kg: 85.0, priority: 'high', time_window_start: '09:00', time_window_end: '12:00', service_time_mins: 25, address: 'West of Chord Rd, Rajajinagar, Bengaluru, Karnataka 560010' },
  { id: 'BLR-D13', customer_name: 'Peenya 1st Stage Manufacturing', lat: 13.0285, lng: 77.5195, demand_kg: 95.0, priority: 'urgent', time_window_start: '09:30', time_window_end: '11:30', service_time_mins: 20, address: 'Peenya Industrial Area, Bengaluru, Karnataka 560058' },
  { id: 'BLR-D14', customer_name: 'BTM Layout 2nd Stage Commerce', lat: 12.9165, lng: 77.6101, demand_kg: 28.0, priority: 'urgent', time_window_start: '10:30', time_window_end: '12:30', service_time_mins: 15, address: 'Outer Ring Rd, BTM 2nd Stage, Bengaluru, Karnataka 560076' },
  { id: 'BLR-D15', customer_name: 'JP Nagar 6th Phase Cultural Hub', lat: 12.9063, lng: 77.5855, demand_kg: 45.0, priority: 'low', time_window_start: '13:30', time_window_end: '17:00', service_time_mins: 20, address: '15th Cross Rd, JP Nagar 6th Phase, Bengaluru, Karnataka 560078' },
  { id: 'BLR-D16', customer_name: 'Banashankari 3rd Stage Mart', lat: 12.9255, lng: 77.5467, demand_kg: 35.0, priority: 'medium', time_window_start: '11:30', time_window_end: '15:00', service_time_mins: 15, address: 'Kathreguppe Main Rd, Banashankari, Bengaluru, Karnataka 560085' },
  { id: 'BLR-D17', customer_name: 'Domlur Intermediate Ring Rd Hub', lat: 12.9609, lng: 77.6387, demand_kg: 48.0, priority: 'medium', time_window_start: '10:00', time_window_end: '13:30', service_time_mins: 20, address: 'Intermediate Ring Rd, Domlur, Bengaluru, Karnataka 560071' },
  { id: 'BLR-D18', customer_name: 'Richmond Town Commercial Zone', lat: 12.9634, lng: 77.6022, demand_kg: 52.0, priority: 'high', time_window_start: '09:00', time_window_end: '12:30', service_time_mins: 20, address: 'Richmond Rd, Richmond Town, Bengaluru, Karnataka 560025' },
  { id: 'BLR-D19', customer_name: 'Commercial Street Fashion Arcade', lat: 12.9822, lng: 77.6083, demand_kg: 42.0, priority: 'medium', time_window_start: '12:30', time_window_end: '16:00', service_time_mins: 15, address: 'Tasker Town, Shivajinagar, Bengaluru, Karnataka 560051' },
  { id: 'BLR-D20', customer_name: 'Frazer Town Gourmet Emporium', lat: 12.9968, lng: 77.6133, demand_kg: 58.0, priority: 'high', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Mosque Rd, Pulikeshi Nagar, Bengaluru, Karnataka 560005' },
  { id: 'BLR-D21', customer_name: 'Kalyan Nagar CMR Road Tech Hub', lat: 13.0218, lng: 77.6436, demand_kg: 30.0, priority: 'low', time_window_start: '13:00', time_window_end: '17:00', service_time_mins: 15, address: 'CMR Main Rd, HRBR Layout, Kalyan Nagar, Bengaluru, Karnataka 560043' },
  { id: 'BLR-D22', customer_name: 'Yeshwanthpur Wholesale Yard', lat: 13.0210, lng: 77.5480, demand_kg: 75.0, priority: 'low', time_window_start: '14:00', time_window_end: '17:30', service_time_mins: 20, address: 'Tumkur Rd, Yeshwanthpur, Bengaluru, Karnataka 560022' },
  { id: 'BLR-D23', customer_name: 'Bannerghatta Apollo Hospital', lat: 12.8943, lng: 77.5995, demand_kg: 35.0, priority: 'urgent', time_window_start: '11:00', time_window_end: '13:30', service_time_mins: 15, address: 'Bannerghatta Main Rd, Arakere, Bengaluru, Karnataka 560076' },
  { id: 'BLR-D24', customer_name: 'Yelahanka New Town Complex', lat: 13.1007, lng: 77.5963, demand_kg: 52.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Major Sandeep Unnikrishnan Rd, Yelahanka, Bengaluru, Karnataka 560064' },
  { id: 'BLR-D25', customer_name: 'KR Puram Railway Cargo Logistics', lat: 13.0039, lng: 77.6953, demand_kg: 80.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '10:30', service_time_mins: 25, address: 'Old Madras Rd, KR Puram, Bengaluru, Karnataka 560036' },
];

// ============================================================================
// 2. DELHI-NCR LOGISTICS CORRIDOR (Northern India)
// ============================================================================
export const DEL_DEPOT: Depot = {
  id: 'DEPOT-DEL',
  name: 'RouteQ Delhi-NCR Central Hub (Connaught Place)',
  lat: 28.6315,
  lng: 77.2167,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const DEL_VEHICLES: Vehicle[] = [
  {
    id: 'DEL-V01',
    name: 'Tata Ace EV Express',
    capacity_kg: 500.0,
    starting_depot_id: 'DEPOT-DEL',
    max_route_distance_km: 130.0,
    fuel_efficiency_km_per_l: 19.0,
    fuel_type: 'electric',
  },
  {
    id: 'DEL-V02',
    name: 'Mahindra Bolero Maxi Truck',
    capacity_kg: 650.0,
    starting_depot_id: 'DEPOT-DEL',
    max_route_distance_km: 150.0,
    fuel_efficiency_km_per_l: 11.5,
    fuel_type: 'diesel',
  },
  {
    id: 'DEL-V03',
    name: 'Euler HiLoad EV Delivery',
    capacity_kg: 480.0,
    starting_depot_id: 'DEPOT-DEL',
    max_route_distance_km: 110.0,
    fuel_efficiency_km_per_l: 18.0,
    fuel_type: 'electric',
  },
];

export const DEL_DELIVERIES: Delivery[] = [
  { id: 'DEL-D01', customer_name: 'Gurugram Cyber City Tower B', lat: 28.4950, lng: 77.0895, demand_kg: 65.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'DLF Cyber City, Phase 2, Gurugram, Haryana 122002' },
  { id: 'DEL-D02', customer_name: 'Noida Sector 62 Electronic City', lat: 28.6280, lng: 77.3649, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Sector 62, Noida, Uttar Pradesh 201309' },
  { id: 'DEL-D03', customer_name: 'Okhla Phase 3 Industrial Area', lat: 28.5355, lng: 77.2730, demand_kg: 85.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Okhla Industrial Estate Phase III, New Delhi 110020' },
  { id: 'DEL-D04', customer_name: 'Nehru Place Commercial Center', lat: 28.5494, lng: 77.2514, demand_kg: 40.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Nehru Place Market, New Delhi 110019' },
  { id: 'DEL-D05', customer_name: 'Karol Bagh Retail Arcade', lat: 28.6517, lng: 77.1906, demand_kg: 55.0, priority: 'medium', time_window_start: '11:00', time_window_end: '13:30', service_time_mins: 15, address: 'Ajmal Khan Rd, Karol Bagh, New Delhi 110005' },
  { id: 'DEL-D06', customer_name: 'Saket Select Citywalk Logistics', lat: 28.5284, lng: 77.2185, demand_kg: 45.0, priority: 'high', time_window_start: '11:30', time_window_end: '14:00', service_time_mins: 20, address: 'District Centre, Saket, New Delhi 110017' },
  { id: 'DEL-D07', customer_name: 'Janakpuri District Centre', lat: 28.6297, lng: 77.0782, demand_kg: 35.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:00', service_time_mins: 15, address: 'Janakpuri District Centre, New Delhi 110058' },
  { id: 'DEL-D08', customer_name: 'Faridabad Industrial Sector 15', lat: 28.4089, lng: 77.3178, demand_kg: 70.0, priority: 'high', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Mathura Rd, Sector 15, Faridabad, Haryana 121007' },
];

// ============================================================================
// 3. MUMBAI MMR LOGISTICS CORRIDOR (Western India)
// ============================================================================
export const BOM_DEPOT: Depot = {
  id: 'DEPOT-BOM',
  name: 'RouteQ Mumbai Central Hub (BKC G-Block)',
  lat: 19.0657,
  lng: 72.8687,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const BOM_VEHICLES: Vehicle[] = [
  {
    id: 'BOM-V01',
    name: 'Tata Ace EV Express',
    capacity_kg: 500.0,
    starting_depot_id: 'DEPOT-BOM',
    max_route_distance_km: 120.0,
    fuel_efficiency_km_per_l: 19.0,
    fuel_type: 'electric',
  },
  {
    id: 'BOM-V02',
    name: 'Mahindra Bolero Maxi Truck',
    capacity_kg: 650.0,
    starting_depot_id: 'DEPOT-BOM',
    max_route_distance_km: 140.0,
    fuel_efficiency_km_per_l: 11.5,
    fuel_type: 'diesel',
  },
  {
    id: 'BOM-V03',
    name: 'Piaggio Ape E-City Cargo',
    capacity_kg: 420.0,
    starting_depot_id: 'DEPOT-BOM',
    max_route_distance_km: 90.0,
    fuel_efficiency_km_per_l: 21.0,
    fuel_type: 'electric',
  },
];

export const BOM_DELIVERIES: Delivery[] = [
  { id: 'BOM-D01', customer_name: 'BKC Financial Towers', lat: 19.0607, lng: 72.8654, demand_kg: 55.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:00', service_time_mins: 20, address: 'G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051' },
  { id: 'BOM-D02', customer_name: 'Andheri East MIDC Tech Park', lat: 19.1197, lng: 72.8797, demand_kg: 70.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Central Rd, MIDC, Andheri East, Mumbai, Maharashtra 400093' },
  { id: 'BOM-D03', customer_name: 'Lower Parel High Street Phoenix', lat: 18.9953, lng: 72.8242, demand_kg: 40.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013' },
  { id: 'BOM-D04', customer_name: 'Nariman Point Financial District', lat: 18.9260, lng: 72.8238, demand_kg: 35.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Free Press Journal Marg, Nariman Point, Mumbai, Maharashtra 400021' },
  { id: 'BOM-D05', customer_name: 'Powai Hiranandani Business Park', lat: 19.1176, lng: 72.9060, demand_kg: 60.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076' },
  { id: 'BOM-D06', customer_name: 'Vashi APMC Agricultural Market', lat: 19.0760, lng: 72.9986, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'APMC Market, Sector 19, Vashi, Navi Mumbai, Maharashtra 400705' },
  { id: 'BOM-D07', customer_name: 'Bandra West Linking Road Stores', lat: 19.0600, lng: 72.8360, demand_kg: 30.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:00', service_time_mins: 15, address: 'Linking Rd, Bandra West, Mumbai, Maharashtra 400050' },
  { id: 'BOM-D08', customer_name: 'Thane Wagle Industrial Estate', lat: 19.1914, lng: 72.9525, demand_kg: 80.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Road No. 16, Wagle Estate, Thane, Maharashtra 400604' },
];

// ============================================================================
// 4. HYDERABAD LOGISTICS CORRIDOR (Telangana, India)
// ============================================================================
export const HYD_DEPOT: Depot = {
  id: 'DEPOT-HYD',
  name: 'RouteQ Hyderabad Central Hub (HITEC City)',
  lat: 17.4435,
  lng: 78.3772,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const HYD_VEHICLES: Vehicle[] = [
  {
    id: 'HYD-V01',
    name: 'Tata Ace EV Express',
    capacity_kg: 500.0,
    starting_depot_id: 'DEPOT-HYD',
    max_route_distance_km: 120.0,
    fuel_efficiency_km_per_l: 19.0,
    fuel_type: 'electric',
  },
  {
    id: 'HYD-V02',
    name: 'Mahindra Bolero Maxi Truck',
    capacity_kg: 650.0,
    starting_depot_id: 'DEPOT-HYD',
    max_route_distance_km: 140.0,
    fuel_efficiency_km_per_l: 11.5,
    fuel_type: 'diesel',
  },
  {
    id: 'HYD-V03',
    name: 'Euler HiLoad EV Delivery',
    capacity_kg: 480.0,
    starting_depot_id: 'DEPOT-HYD',
    max_route_distance_km: 110.0,
    fuel_efficiency_km_per_l: 18.0,
    fuel_type: 'electric',
  },
];

export const HYD_DELIVERIES: Delivery[] = [
  { id: 'HYD-D01', customer_name: 'Gachibowli Financial District', lat: 17.4156, lng: 78.3427, demand_kg: 55.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:00', service_time_mins: 20, address: 'Financial District, Nanakramguda, Hyderabad, Telangana 500032' },
  { id: 'HYD-D02', customer_name: 'Madhapur Cyber Towers', lat: 17.4504, lng: 78.3808, demand_kg: 45.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'HITEC City Main Rd, Madhapur, Hyderabad, Telangana 500081' },
  { id: 'HYD-D03', customer_name: 'Banjara Hills Commercial Rd 12', lat: 17.4165, lng: 78.4382, demand_kg: 40.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Road No. 12, Banjara Hills, Hyderabad, Telangana 500034' },
  { id: 'HYD-D04', customer_name: 'Jubilee Hills Check Post Mart', lat: 17.4319, lng: 78.4073, demand_kg: 35.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033' },
  { id: 'HYD-D05', customer_name: 'Begumpet Cargo Terminal', lat: 17.4447, lng: 78.4664, demand_kg: 60.0, priority: 'high', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Sardar Patel Rd, Begumpet, Hyderabad, Telangana 500016' },
  { id: 'HYD-D06', customer_name: 'Secunderabad Railway Goods Yard', lat: 17.4399, lng: 78.5017, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Station Rd, Secunderabad, Telangana 500003' },
  { id: 'HYD-D07', customer_name: 'Kondapur Botanical Garden Road', lat: 17.4650, lng: 78.3610, demand_kg: 30.0, priority: 'low', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Botanical Garden Rd, Kondapur, Hyderabad, Telangana 500084' },
  { id: 'HYD-D08', customer_name: 'Kukatpally Housing Board (KPHB)', lat: 17.4947, lng: 78.3996, demand_kg: 50.0, priority: 'medium', time_window_start: '13:00', time_window_end: '16:00', service_time_mins: 20, address: 'Phase 1, KPHB Colony, Kukatpally, Hyderabad, Telangana 500072' },
];

// ============================================================================
// 5. CHENNAI LOGISTICS CORRIDOR (Tamil Nadu, India)
// ============================================================================
export const MAA_DEPOT: Depot = {
  id: 'DEPOT-MAA',
  name: 'RouteQ Chennai Central Hub (Guindy Industrial Estate)',
  lat: 13.0067,
  lng: 80.2025,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const MAA_VEHICLES: Vehicle[] = [
  {
    id: 'MAA-V01',
    name: 'Ashok Leyland Bada Dost',
    capacity_kg: 750.0,
    starting_depot_id: 'DEPOT-MAA',
    max_route_distance_km: 150.0,
    fuel_efficiency_km_per_l: 10.5,
    fuel_type: 'diesel',
  },
  {
    id: 'MAA-V02',
    name: 'Tata Ace EV Express',
    capacity_kg: 500.0,
    starting_depot_id: 'DEPOT-MAA',
    max_route_distance_km: 120.0,
    fuel_efficiency_km_per_l: 19.0,
    fuel_type: 'electric',
  },
  {
    id: 'MAA-V03',
    name: 'Mahindra Zor Grand EV',
    capacity_kg: 450.0,
    starting_depot_id: 'DEPOT-MAA',
    max_route_distance_km: 100.0,
    fuel_efficiency_km_per_l: 20.0,
    fuel_type: 'electric',
  },
];

export const MAA_DELIVERIES: Delivery[] = [
  { id: 'MAA-D01', customer_name: 'Tidel Park OMR Tech Corridor', lat: 12.9893, lng: 80.2487, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:00', service_time_mins: 20, address: 'Rajiv Gandhi Salai (OMR), Taramani, Chennai, Tamil Nadu 600113' },
  { id: 'MAA-D02', customer_name: 'Anna Salai T. Nagar Commercial', lat: 13.0418, lng: 80.2341, demand_kg: 45.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Pondy Bazaar, T. Nagar, Chennai, Tamil Nadu 600017' },
  { id: 'MAA-D03', customer_name: 'Chennai Port Harbor Terminal', lat: 13.0844, lng: 80.2942, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Rajaji Salai, Chennai Port, Chennai, Tamil Nadu 600001' },
  { id: 'MAA-D04', customer_name: 'Ambattur Industrial Estate', lat: 13.0983, lng: 80.1618, demand_kg: 75.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Ambattur Industrial Estate, Chennai, Tamil Nadu 600058' },
  { id: 'MAA-D05', customer_name: 'Adyar Cancer Institute & Hub', lat: 13.0012, lng: 80.2565, demand_kg: 35.0, priority: 'urgent', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Sardar Patel Rd, Adyar, Chennai, Tamil Nadu 600020' },
  { id: 'MAA-D06', customer_name: 'Velachery Phoenix Marketcity', lat: 12.9915, lng: 80.2170, demand_kg: 50.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Guru Nanak College Rd, Velachery, Chennai, Tamil Nadu 600042' },
  { id: 'MAA-D07', customer_name: 'Koyambedu Wholesale Market Complex', lat: 13.0694, lng: 80.1916, demand_kg: 90.0, priority: 'high', time_window_start: '08:30', time_window_end: '10:30', service_time_mins: 25, address: 'Jawaharlal Nehru Rd, Koyambedu, Chennai, Tamil Nadu 600107' },
  { id: 'MAA-D08', customer_name: 'Tambaram Railway Logistics Point', lat: 12.9249, lng: 80.1000, demand_kg: 40.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'GST Rd, Tambaram, Chennai, Tamil Nadu 600045' },
];

// ============================================================================
// 6. KOLKATA LOGISTICS CORRIDOR (West Bengal, India)
// ============================================================================
export const CCU_DEPOT: Depot = {
  id: 'DEPOT-CCU',
  name: 'RouteQ Kolkata Central Hub (Park Street / Salt Lake)',
  lat: 22.5726,
  lng: 88.3639,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const CCU_VEHICLES: Vehicle[] = [
  { id: 'CCU-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-CCU', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'CCU-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-CCU', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'CCU-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-CCU', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const CCU_DELIVERIES: Delivery[] = [
  { id: 'CCU-D01', customer_name: 'Salt Lake Sector V IT Hub', lat: 22.5804, lng: 88.4378, demand_kg: 55.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:00', service_time_mins: 20, address: 'Sector V, Bidhannagar, Kolkata, West Bengal 700091' },
  { id: 'CCU-D02', customer_name: 'New Town Action Area 1 Corporate', lat: 22.5898, lng: 88.4744, demand_kg: 45.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Major Arterial Rd, Action Area I, New Town, Kolkata 700156' },
  { id: 'CCU-D03', customer_name: 'Howrah Railway Goods Terminal', lat: 22.5892, lng: 88.3415, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '10:30', service_time_mins: 25, address: 'Station Approach Rd, Howrah, West Bengal 711101' },
  { id: 'CCU-D04', customer_name: 'Burrabazar Wholesale Trading Center', lat: 22.5831, lng: 88.3512, demand_kg: 80.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Cotton St, Burrabazar, Kolkata, West Bengal 700007' },
  { id: 'CCU-D05', customer_name: 'Park Street Commercial Arcade', lat: 22.5517, lng: 88.3524, demand_kg: 40.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Park St, Taltala, Kolkata, West Bengal 700016' },
  { id: 'CCU-D06', customer_name: 'Taratala Industrial Area Port Link', lat: 22.5085, lng: 88.3075, demand_kg: 70.0, priority: 'high', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Taratala Rd, Behala, Kolkata, West Bengal 700088' },
  { id: 'CCU-D07', customer_name: 'Rajarhat Chinar Park Distribution', lat: 22.6234, lng: 88.4418, demand_kg: 35.0, priority: 'low', time_window_start: '12:30', time_window_end: '16:00', service_time_mins: 15, address: 'Rajarhat Main Rd, Chinar Park, Kolkata, West Bengal 700136' },
  { id: 'CCU-D08', customer_name: 'Alipore Commercial Quarters', lat: 22.5293, lng: 88.3327, demand_kg: 50.0, priority: 'medium', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Alipore Rd, Alipore, Kolkata, West Bengal 700027' },
];

// ============================================================================
// 7. PUNE LOGISTICS CORRIDOR (Maharashtra, India)
// ============================================================================
export const PNQ_DEPOT: Depot = {
  id: 'DEPOT-PNQ',
  name: 'RouteQ Pune Central Hub (Shivajinagar)',
  lat: 18.5314,
  lng: 73.8446,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const PNQ_VEHICLES: Vehicle[] = [
  { id: 'PNQ-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-PNQ', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'PNQ-V02', name: 'Ashok Leyland Bada Dost', capacity_kg: 750.0, starting_depot_id: 'DEPOT-PNQ', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 10.5, fuel_type: 'diesel' },
  { id: 'PNQ-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-PNQ', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const PNQ_DELIVERIES: Delivery[] = [
  { id: 'PNQ-D01', customer_name: 'Hinjawadi Rajiv Gandhi Infotech Park', lat: 18.5913, lng: 73.7389, demand_kg: 65.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Hinjawadi Phase 1, Pune, Maharashtra 411057' },
  { id: 'PNQ-D02', customer_name: 'Chakan Industrial Mega Cluster', lat: 18.7606, lng: 73.8567, demand_kg: 95.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'MIDC Phase 2, Chakan, Pune, Maharashtra 410501' },
  { id: 'PNQ-D03', customer_name: 'Magarpatta Cybercity Hadapsar', lat: 18.5158, lng: 73.9272, demand_kg: 50.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Magarpatta City, Hadapsar, Pune, Maharashtra 411028' },
  { id: 'PNQ-D04', customer_name: 'Viman Nagar Giga Space Tech', lat: 18.5679, lng: 73.9143, demand_kg: 40.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Ahmednagar Rd, Viman Nagar, Pune, Maharashtra 411014' },
  { id: 'PNQ-D05', customer_name: 'Bhosari MIDC Engineering Hub', lat: 18.6272, lng: 73.8456, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Telco Rd, MIDC Bhosari, Pimpri-Chinchwad, Maharashtra 411026' },
  { id: 'PNQ-D06', customer_name: 'Kothrud Commercial Centre', lat: 18.5074, lng: 73.8077, demand_kg: 45.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Karve Rd, Kothrud, Pune, Maharashtra 411038' },
  { id: 'PNQ-D07', customer_name: 'Senapati Bapat Road ICC Tower', lat: 18.5308, lng: 73.8296, demand_kg: 35.0, priority: 'high', time_window_start: '11:30', time_window_end: '14:30', service_time_mins: 15, address: 'Senapati Bapat Rd, Shivajinagar, Pune, Maharashtra 411016' },
  { id: 'PNQ-D08', customer_name: 'Pimpri Automotive Manufacturing Yard', lat: 18.6298, lng: 73.7997, demand_kg: 70.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Old Mumbai-Pune Hwy, Pimpri, Pune, Maharashtra 411018' },
];

// ============================================================================
// 8. AHMEDABAD LOGISTICS CORRIDOR (Gujarat, India)
// ============================================================================
export const AMD_DEPOT: Depot = {
  id: 'DEPOT-AMD',
  name: 'RouteQ Ahmedabad Central Hub (Ashram Road)',
  lat: 23.0338,
  lng: 72.5850,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const AMD_VEHICLES: Vehicle[] = [
  { id: 'AMD-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-AMD', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'AMD-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-AMD', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'AMD-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-AMD', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const AMD_DELIVERIES: Delivery[] = [
  { id: 'AMD-D01', customer_name: 'SG Highway Titanium City Center', lat: 23.0538, lng: 72.5165, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Sarkhej - Gandhinagar Hwy, Thaltej, Ahmedabad, Gujarat 380054' },
  { id: 'AMD-D02', customer_name: 'Prahlad Nagar Corporate Mile', lat: 23.0118, lng: 72.5050, demand_kg: 45.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Prahlad Nagar Corporate Rd, Vejalpur, Ahmedabad, Gujarat 380015' },
  { id: 'AMD-D03', customer_name: 'Sanand GIDC Automotive Corridor', lat: 22.9868, lng: 72.3789, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Sanand Industrial Estate GIDC, Ahmedabad, Gujarat 382110' },
  { id: 'AMD-D04', customer_name: 'Changodar Logistics & Warehousing', lat: 22.9234, lng: 72.4412, demand_kg: 85.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Sarkhej-Bavla Hwy, Changodar, Ahmedabad, Gujarat 382213' },
  { id: 'AMD-D05', customer_name: 'Naroda GIDC Industrial Estate', lat: 23.0722, lng: 72.6589, demand_kg: 70.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:30', service_time_mins: 20, address: 'Naroda Industrial Area GIDC, Ahmedabad, Gujarat 382330' },
  { id: 'AMD-D06', customer_name: 'Maninagar Commercial Goods Complex', lat: 22.9972, lng: 72.6025, demand_kg: 50.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Station Rd, Maninagar, Ahmedabad, Gujarat 380008' },
  { id: 'AMD-D07', customer_name: 'Chandkheda Gandhinagar Gateway', lat: 23.1119, lng: 72.5768, demand_kg: 40.0, priority: 'low', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Visat-Gandhinagar Hwy, Chandkheda, Ahmedabad, Gujarat 382424' },
  { id: 'AMD-D08', customer_name: 'Sindhu Bhavan Road Retail Strip', lat: 23.0452, lng: 72.4965, demand_kg: 35.0, priority: 'urgent', time_window_start: '12:30', time_window_end: '16:00', service_time_mins: 15, address: 'Sindhu Bhavan Marg, Bodakdev, Ahmedabad, Gujarat 380054' },
];

// ============================================================================
// 9. JAIPUR LOGISTICS CORRIDOR (Rajasthan, India)
// ============================================================================
export const JAI_DEPOT: Depot = {
  id: 'DEPOT-JAI',
  name: 'RouteQ Jaipur Central Hub (C-Scheme)',
  lat: 26.9124,
  lng: 75.7873,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const JAI_VEHICLES: Vehicle[] = [
  { id: 'JAI-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-JAI', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'JAI-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-JAI', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'JAI-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-JAI', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const JAI_DELIVERIES: Delivery[] = [
  { id: 'JAI-D01', customer_name: 'Sitapura Industrial Area & SEZ', lat: 26.7725, lng: 75.8364, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Sitapura Industrial Area, Jaipur, Rajasthan 302022' },
  { id: 'JAI-D02', customer_name: 'Vishwakarma Industrial Area (VKIA)', lat: 26.9942, lng: 75.7721, demand_kg: 90.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 25, address: 'Road No. 1, VKIA, Jaipur, Rajasthan 302013' },
  { id: 'JAI-D03', customer_name: 'Mansarovar Metro Commercial Zone', lat: 26.8628, lng: 75.7610, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Kaveri Path, Mansarovar, Jaipur, Rajasthan 302020' },
  { id: 'JAI-D04', customer_name: 'Malviya Nagar World Trade Park', lat: 26.8533, lng: 75.8052, demand_kg: 45.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur, Rajasthan 302017' },
  { id: 'JAI-D05', customer_name: 'M.I. Road Central Business District', lat: 26.9196, lng: 75.8042, demand_kg: 40.0, priority: 'urgent', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Mirza Ismail Rd, Jayanti Market, Jaipur, Rajasthan 302001' },
  { id: 'JAI-D06', customer_name: 'Vaishali Nagar Commercial Complex', lat: 26.9077, lng: 75.7397, demand_kg: 35.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Queens Rd, Vaishali Nagar, Jaipur, Rajasthan 302021' },
  { id: 'JAI-D07', customer_name: 'Sanganer Export Apparel Park', lat: 26.8194, lng: 75.7853, demand_kg: 70.0, priority: 'high', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Tonk Rd, Sanganer, Jaipur, Rajasthan 302029' },
  { id: 'JAI-D08', customer_name: 'Tonk Road IT Corridor', lat: 26.8378, lng: 75.7981, demand_kg: 30.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Tonk Rd, Durgapura, Jaipur, Rajasthan 302018' },
];

// ============================================================================
// 10. KOCHI LOGISTICS CORRIDOR (Kerala, India)
// ============================================================================
export const COK_DEPOT: Depot = {
  id: 'DEPOT-COK',
  name: 'RouteQ Kochi Central Hub (Willingdon Island / MG Road)',
  lat: 9.9674,
  lng: 76.2711,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const COK_VEHICLES: Vehicle[] = [
  { id: 'COK-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-COK', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'COK-V02', name: 'Ashok Leyland Bada Dost', capacity_kg: 750.0, starting_depot_id: 'DEPOT-COK', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 10.5, fuel_type: 'diesel' },
  { id: 'COK-V03', name: 'Piaggio Ape E-City Cargo', capacity_kg: 420.0, starting_depot_id: 'DEPOT-COK', max_route_distance_km: 95.0, fuel_efficiency_km_per_l: 21.0, fuel_type: 'electric' },
];

export const COK_DELIVERIES: Delivery[] = [
  { id: 'COK-D01', customer_name: 'Infopark Kakkanad Phase 1 Tech SEZ', lat: 10.0112, lng: 76.3639, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Kusumagiri PO, Kakkanad, Kochi, Kerala 682030' },
  { id: 'COK-D02', customer_name: 'Kalamassery KINFRA Hi-Tech Industrial Park', lat: 10.0526, lng: 76.3267, demand_kg: 85.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'HMT Colony, Kalamassery, Kochi, Kerala 683503' },
  { id: 'COK-D03', customer_name: 'Marine Drive Commercial Waterfront', lat: 9.9796, lng: 76.2755, demand_kg: 40.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Shanmugham Rd, Marine Drive, Ernakulam, Kerala 682031' },
  { id: 'COK-D04', customer_name: 'Edappally Lulu Logistics Distribution', lat: 10.0275, lng: 76.3081, demand_kg: 70.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Edappally Junction, Kochi, Kerala 682024' },
  { id: 'COK-D05', customer_name: 'Willingdon Island Container Freight Hub', lat: 9.9542, lng: 76.2694, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Bristow Rd, Willingdon Island, Kochi, Kerala 682003' },
  { id: 'COK-D06', customer_name: 'Aluva Railway Freight Yards', lat: 10.1076, lng: 76.3516, demand_kg: 80.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:30', service_time_mins: 20, address: 'Station Rd, Aluva, Kochi, Kerala 683101' },
  { id: 'COK-D07', customer_name: 'Mattancherry Spice Trading Terminal', lat: 9.9578, lng: 76.2589, demand_kg: 50.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Bazaar Rd, Mattancherry, Kochi, Kerala 682002' },
  { id: 'COK-D08', customer_name: 'Vyttila Mobility Hub Transit Corridor', lat: 9.9678, lng: 76.3194, demand_kg: 35.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Kaniyampuzha Rd, Vyttila, Kochi, Kerala 682019' },
];

// ============================================================================
// 11. LUCKNOW LOGISTICS CORRIDOR (Uttar Pradesh, India)
// ============================================================================
export const LKO_DEPOT: Depot = {
  id: 'DEPOT-LKO',
  name: 'RouteQ Lucknow Central Hub (Hazratganj)',
  lat: 26.8467,
  lng: 80.9462,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const LKO_VEHICLES: Vehicle[] = [
  { id: 'LKO-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-LKO', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'LKO-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-LKO', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'LKO-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-LKO', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const LKO_DELIVERIES: Delivery[] = [
  { id: 'LKO-D01', customer_name: 'Transport Nagar Intermodal Logistics Yard', lat: 26.7735, lng: 80.8924, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Kanpur Rd, Transport Nagar, Lucknow, Uttar Pradesh 226012' },
  { id: 'LKO-D02', customer_name: 'Gomti Nagar Cyber Heights Tech SEZ', lat: 26.8617, lng: 81.0028, demand_kg: 60.0, priority: 'high', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010' },
  { id: 'LKO-D03', customer_name: 'Amausi Airport Industrial Cargo Area', lat: 26.7606, lng: 80.8833, demand_kg: 85.0, priority: 'urgent', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Airport Rd, Amausi Industrial Area, Lucknow 226008' },
  { id: 'LKO-D04', customer_name: 'Vibhuti Khand Commercial District', lat: 26.8722, lng: 81.0119, demand_kg: 45.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Vibhuti Khand Phase 2, Lucknow, Uttar Pradesh 226010' },
  { id: 'LKO-D05', customer_name: 'Alambagh Commercial Terminus', lat: 26.8156, lng: 80.9022, demand_kg: 50.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Alambagh Chauraha, Lucknow, Uttar Pradesh 226005' },
  { id: 'LKO-D06', customer_name: 'Charbagh Railway Freight Station', lat: 26.8322, lng: 80.9194, demand_kg: 70.0, priority: 'high', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Station Rd, Charbagh, Lucknow, Uttar Pradesh 226004' },
  { id: 'LKO-D07', customer_name: 'Chowk Heritage Handicraft Corridor', lat: 26.8683, lng: 80.9056, demand_kg: 35.0, priority: 'low', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Chowk, Old Lucknow, Uttar Pradesh 226003' },
  { id: 'LKO-D08', customer_name: 'Jankipuram Biotech Knowledge Park', lat: 26.9156, lng: 80.9417, demand_kg: 40.0, priority: 'medium', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Kursi Rd, Sector G, Jankipuram, Lucknow, Uttar Pradesh 226021' },
];

// ============================================================================
// 12. CHANDIGARH LOGISTICS CORRIDOR (Punjab / Haryana, India)
// ============================================================================
export const IXC_DEPOT: Depot = {
  id: 'DEPOT-IXC',
  name: 'RouteQ Chandigarh Central Hub (Sector 17 Plaza)',
  lat: 30.7415,
  lng: 76.7794,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IXC_VEHICLES: Vehicle[] = [
  { id: 'IXC-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-IXC', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IXC-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-IXC', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'IXC-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IXC', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IXC_DELIVERIES: Delivery[] = [
  { id: 'IXC-D01', customer_name: 'Industrial Area Phase 1 & Elante Hub', lat: 30.7056, lng: 76.8014, demand_kg: 85.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Purv Marg, Industrial Area Phase I, Chandigarh 160002' },
  { id: 'IXC-D02', customer_name: 'Industrial Area Phase 2 Logistics', lat: 30.6978, lng: 76.7936, demand_kg: 90.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Industrial Area Phase II, Chandigarh 160002' },
  { id: 'IXC-D03', customer_name: 'Rajiv Gandhi IT Park Kishangarh', lat: 30.7256, lng: 76.8447, demand_kg: 55.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'DLF Info City, IT Park, Chandigarh 160101' },
  { id: 'IXC-D04', customer_name: 'Mohali Phase 8 Industrial Zone', lat: 30.7042, lng: 76.7178, demand_kg: 75.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Sector 73, Phase 8 Industrial Area, Mohali, Punjab 160071' },
  { id: 'IXC-D05', customer_name: 'Panchkula Sector 14 Commercial Market', lat: 30.6867, lng: 76.8589, demand_kg: 40.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Sector 14, Panchkula, Haryana 134113' },
  { id: 'IXC-D06', customer_name: 'Zirakpur Warehousing & Logistics Belt', lat: 30.6425, lng: 76.8178, demand_kg: 95.0, priority: 'urgent', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 25, address: 'Chandigarh-Ambala Hwy, Zirakpur, Punjab 140603' },
  { id: 'IXC-D07', customer_name: 'Sector 35 Commercial District', lat: 30.7236, lng: 76.7639, demand_kg: 35.0, priority: 'low', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Sector 35B, Chandigarh 160022' },
  { id: 'IXC-D08', customer_name: 'Mohali Bestech Business Square', lat: 30.7189, lng: 76.7325, demand_kg: 45.0, priority: 'medium', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Sector 66, Mohali, Punjab 160062' },
];

// ============================================================================
// 13. INDORE LOGISTICS CORRIDOR (Madhya Pradesh, India)
// ============================================================================
export const IDR_DEPOT: Depot = {
  id: 'DEPOT-IDR',
  name: 'RouteQ Indore Central Hub (Vijay Nagar)',
  lat: 22.7533,
  lng: 75.8937,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IDR_VEHICLES: Vehicle[] = [
  { id: 'IDR-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-IDR', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IDR-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-IDR', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'IDR-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IDR', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IDR_DELIVERIES: Delivery[] = [
  { id: 'IDR-D01', customer_name: 'Pithampur Industrial SEZ Mega Corridor', lat: 22.6142, lng: 75.6822, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Sector 1, Pithampur Industrial Area, Madhya Pradesh 454775' },
  { id: 'IDR-D02', customer_name: 'Dewas Naka Intercity Logistics Plaza', lat: 22.7814, lng: 75.9189, demand_kg: 90.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 25, address: 'AB Rd, Dewas Naka, Indore, Madhya Pradesh 452010' },
  { id: 'IDR-D03', customer_name: 'Sanwer Road Industrial Sector A', lat: 22.7756, lng: 75.8567, demand_kg: 75.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Sanwer Rd Industrial Area, Indore, Madhya Pradesh 452015' },
  { id: 'IDR-D04', customer_name: 'Palasia Commercial Square Market', lat: 22.7214, lng: 75.8856, demand_kg: 45.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Old Palasia, Indore, Madhya Pradesh 452001' },
  { id: 'IDR-D05', customer_name: 'Rau Bypass Transport Gateway', lat: 22.6514, lng: 75.8114, demand_kg: 60.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'AB Rd, Rau, Indore, Madhya Pradesh 453331' },
  { id: 'IDR-D06', customer_name: 'Chhappan Dukan Commercial Zone', lat: 22.7247, lng: 75.8775, demand_kg: 35.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'New Palasia, Indore, Madhya Pradesh 452001' },
  { id: 'IDR-D07', customer_name: 'Manglia Dry Port & Logistics Railhead', lat: 22.8256, lng: 75.9414, demand_kg: 85.0, priority: 'urgent', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 25, address: 'Indore-Dewas Hwy, Manglia, Madhya Pradesh 453771' },
  { id: 'IDR-D08', customer_name: 'Bhanwarkuan University Commerce Hub', lat: 22.6936, lng: 75.8647, demand_kg: 40.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Bhanwarkuan Square, Indore, Madhya Pradesh 452001' },
];

// ============================================================================
// 14. SURAT LOGISTICS CORRIDOR (Gujarat, India)
// ============================================================================
export const STV_DEPOT: Depot = {
  id: 'DEPOT-STV',
  name: 'RouteQ Surat Central Hub (Ring Road / Majura Gate)',
  lat: 21.1702,
  lng: 72.8311,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const STV_VEHICLES: Vehicle[] = [
  { id: 'STV-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-STV', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'STV-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-STV', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'STV-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-STV', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const STV_DELIVERIES: Delivery[] = [
  { id: 'STV-D01', customer_name: 'Surat Diamond Bourse (DREAM City)', lat: 21.1189, lng: 72.7936, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'DREAM City, Khajod, Surat, Gujarat 395007' },
  { id: 'STV-D02', customer_name: 'Ring Road Wholesale Textile Market', lat: 21.1925, lng: 72.8456, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Ring Rd, Begampura, Surat, Gujarat 395002' },
  { id: 'STV-D03', customer_name: 'Hazira Heavy Industrial & Port Corridor', lat: 21.1342, lng: 72.6412, demand_kg: 90.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Hazira Industrial Area, Surat, Gujarat 394270' },
  { id: 'STV-D04', customer_name: 'Sachin GIDC Engineering SEZ', lat: 21.0856, lng: 72.8714, demand_kg: 85.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Road No. 1, Sachin GIDC, Surat, Gujarat 394230' },
  { id: 'STV-D05', customer_name: 'Adajan Commercial Waterfront Market', lat: 21.1967, lng: 72.7956, demand_kg: 45.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Anand Mahal Rd, Adajan, Surat, Gujarat 395009' },
  { id: 'STV-D06', customer_name: 'Udhna Industrial Freight Sub-Hub', lat: 21.1578, lng: 72.8450, demand_kg: 70.0, priority: 'high', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Udhna Main Rd, Surat, Gujarat 394210' },
  { id: 'STV-D07', customer_name: 'Katargam Diamond Manufacturing Cluster', lat: 21.2214, lng: 72.8314, demand_kg: 40.0, priority: 'low', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Gotalawadi, Katargam, Surat, Gujarat 395004' },
  { id: 'STV-D08', customer_name: 'Pandesara GIDC Textile Dyeing Estate', lat: 21.1389, lng: 72.8425, demand_kg: 75.0, priority: 'medium', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Pandesara Industrial Estate, Surat, Gujarat 394221' },
];

// ============================================================================
// 15. VISAKHAPATNAM LOGISTICS CORRIDOR (Andhra Pradesh, India)
// ============================================================================
export const VTZ_DEPOT: Depot = {
  id: 'DEPOT-VTZ',
  name: 'RouteQ Visakhapatnam Central Hub (Dwaraka Nagar / Port)',
  lat: 17.7289,
  lng: 83.3038,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const VTZ_VEHICLES: Vehicle[] = [
  { id: 'VTZ-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-VTZ', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'VTZ-V02', name: 'Ashok Leyland Bada Dost', capacity_kg: 750.0, starting_depot_id: 'DEPOT-VTZ', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 10.5, fuel_type: 'diesel' },
  { id: 'VTZ-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-VTZ', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const VTZ_DELIVERIES: Delivery[] = [
  { id: 'VTZ-D01', customer_name: 'Visakhapatnam Port Container Terminal', lat: 17.6978, lng: 83.2981, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Port Area, Visakhapatnam, Andhra Pradesh 530035' },
  { id: 'VTZ-D02', customer_name: 'Gajuwaka Autonagar Industrial Zone', lat: 17.6856, lng: 83.2114, demand_kg: 85.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 25, address: 'Auto Nagar, Gajuwaka, Visakhapatnam, Andhra Pradesh 530026' },
  { id: 'VTZ-D03', customer_name: 'Rushikonda IT SEZ Millennium Tower', lat: 17.7814, lng: 83.3856, demand_kg: 55.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Hill No 3, Rushikonda, Visakhapatnam, Andhra Pradesh 530045' },
  { id: 'VTZ-D04', customer_name: 'Siripuram Commercial Square', lat: 17.7225, lng: 83.3189, demand_kg: 40.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Siripuram Junction, Visakhapatnam, Andhra Pradesh 530003' },
  { id: 'VTZ-D05', customer_name: 'Madhurawada Logistics & Tech Corridor', lat: 17.8089, lng: 83.3556, demand_kg: 60.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:30', service_time_mins: 20, address: 'NH16, Madhurawada, Visakhapatnam, Andhra Pradesh 530048' },
  { id: 'VTZ-D06', customer_name: 'Steel Plant Industrial Township Gate', lat: 17.6356, lng: 83.1814, demand_kg: 90.0, priority: 'urgent', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 25, address: 'Sector 6, Steel Plant Township, Visakhapatnam 530032' },
  { id: 'VTZ-D07', customer_name: 'Sheelanagar Container Freight Station', lat: 17.7214, lng: 83.2389, demand_kg: 70.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'BHPV Post, Sheela Nagar, Visakhapatnam 530012' },
  { id: 'VTZ-D08', customer_name: 'MVP Colony Retail Market Plaza', lat: 17.7414, lng: 83.3367, demand_kg: 35.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Sector 1, MVP Colony, Visakhapatnam 530017' },
];

// ============================================================================
// 16. NAGPUR LOGISTICS CORRIDOR (Maharashtra, Central India)
// ============================================================================
export const NAG_DEPOT: Depot = {
  id: 'DEPOT-NAG',
  name: 'RouteQ Nagpur Central Hub (Zero Mile / Sitabuldi)',
  lat: 21.1458,
  lng: 79.0882,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const NAG_VEHICLES: Vehicle[] = [
  { id: 'NAG-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-NAG', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'NAG-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-NAG', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'NAG-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-NAG', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const NAG_DELIVERIES: Delivery[] = [
  { id: 'NAG-D01', customer_name: 'MIHAN SEZ Multi-Modal International Cargo Hub', lat: 21.0425, lng: 79.0556, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'MIHAN SEZ, Wardha Rd, Nagpur, Maharashtra 441108' },
  { id: 'NAG-D02', customer_name: 'Butibori MIDC Industrial Mega-Zone', lat: 20.9189, lng: 78.9956, demand_kg: 90.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 25, address: 'MIDC Butibori, Nagpur, Maharashtra 441122' },
  { id: 'NAG-D03', customer_name: 'Wadi Goods Terminal & Transport Plaza', lat: 21.1514, lng: 78.9878, demand_kg: 85.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Amravati Rd, Wadi, Nagpur, Maharashtra 440023' },
  { id: 'NAG-D04', customer_name: 'Hingna Industrial Estate MIDC', lat: 21.1156, lng: 78.9950, demand_kg: 70.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Hingna Rd, MIDC Industrial Area, Nagpur 440016' },
  { id: 'NAG-D05', customer_name: 'Wardha Road Business Corridor', lat: 21.0894, lng: 79.0689, demand_kg: 45.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Chhatrapati Square, Wardha Rd, Nagpur 440015' },
  { id: 'NAG-D06', customer_name: 'Itwari Wholesale Commodity Market', lat: 21.1556, lng: 79.1156, demand_kg: 60.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Itwari Wholesale Market, Nagpur, Maharashtra 440002' },
  { id: 'NAG-D07', customer_name: 'Kalmeshwar Industrial Agro-Corridor', lat: 21.2314, lng: 78.9189, demand_kg: 50.0, priority: 'low', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'MIDC Kalmeshwar, Nagpur, Maharashtra 441501' },
  { id: 'NAG-D08', customer_name: 'Mankapur Ring Road Freight Depot', lat: 21.1925, lng: 79.0789, demand_kg: 40.0, priority: 'medium', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Ring Rd, Mankapur, Nagpur, Maharashtra 440030' },
];

// ============================================================================
// 17. COIMBATORE LOGISTICS CORRIDOR (Tamil Nadu, India)
// ============================================================================
export const CJB_DEPOT: Depot = {
  id: 'DEPOT-CJB',
  name: 'RouteQ Coimbatore Central Hub (Gandhipuram)',
  lat: 11.0168,
  lng: 76.9558,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const CJB_VEHICLES: Vehicle[] = [
  { id: 'CJB-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-CJB', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'CJB-V02', name: 'Ashok Leyland Bada Dost', capacity_kg: 750.0, starting_depot_id: 'DEPOT-CJB', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 10.5, fuel_type: 'diesel' },
  { id: 'CJB-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-CJB', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const CJB_DELIVERIES: Delivery[] = [
  { id: 'CJB-D01', customer_name: 'TIDEL Park Coimbatore Peelamedu SEZ', lat: 11.0289, lng: 77.0256, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Avinashi Rd, Peelamedu, Coimbatore, Tamil Nadu 641014' },
  { id: 'CJB-D02', customer_name: 'Kurichi SIDCO Industrial Mega Estate', lat: 10.9389, lng: 76.9689, demand_kg: 90.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'SIDCO Industrial Estate, Kurichi, Coimbatore 641021' },
  { id: 'CJB-D03', customer_name: 'Saravanampatti IT & Innovation Corridor', lat: 11.0856, lng: 76.9956, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Sathy Rd, Saravanampatti, Coimbatore, Tamil Nadu 641035' },
  { id: 'CJB-D04', customer_name: 'RS Puram Commercial Market District', lat: 11.0094, lng: 76.9456, demand_kg: 40.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'DB Rd, RS Puram, Coimbatore, Tamil Nadu 641002' },
  { id: 'CJB-D05', customer_name: 'Eachanari Industrial Warehousing Zone', lat: 10.9256, lng: 76.9789, demand_kg: 75.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Pollachi Main Rd, Eachanari, Coimbatore 641021' },
  { id: 'CJB-D06', customer_name: 'Ganapathy Motor & Engineering Cluster', lat: 11.0414, lng: 76.9789, demand_kg: 70.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Sathy Rd, Ganapathy, Coimbatore, Tamil Nadu 641006' },
  { id: 'CJB-D07', customer_name: 'Singanallur Central Cargo Point', lat: 10.9989, lng: 77.0214, demand_kg: 55.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Trichy Rd, Singanallur, Coimbatore, Tamil Nadu 641005' },
  { id: 'CJB-D08', customer_name: 'Thudiyalur Industrial Equipment Node', lat: 11.0814, lng: 76.9389, demand_kg: 35.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Mettupalayam Rd, Thudiyalur, Coimbatore 641034' },
];

// ============================================================================
// 18. BHUBANESWAR LOGISTICS CORRIDOR (Odisha, India)
// ============================================================================
export const BBI_DEPOT: Depot = {
  id: 'DEPOT-BBI',
  name: 'RouteQ Bhubaneswar Central Hub (Saheed Nagar / Janpath)',
  lat: 20.2961,
  lng: 85.8245,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const BBI_VEHICLES: Vehicle[] = [
  { id: 'BBI-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-BBI', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'BBI-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-BBI', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'BBI-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-BBI', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const BBI_DELIVERIES: Delivery[] = [
  { id: 'BBI-D01', customer_name: 'Infocity IT SEZ Patia Millennium Park', lat: 20.3556, lng: 85.8189, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Infocity Rd, Patia, Bhubaneswar, Odisha 751024' },
  { id: 'BBI-D02', customer_name: 'Mancheswar Industrial Estate Phase 1', lat: 20.3189, lng: 85.8614, demand_kg: 90.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Mancheswar IE, Bhubaneswar, Odisha 751010' },
  { id: 'BBI-D03', customer_name: 'Rasulgarh Logistics & Warehousing Square', lat: 20.2914, lng: 85.8656, demand_kg: 85.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'NH16, Rasulgarh, Bhubaneswar, Odisha 751010' },
  { id: 'BBI-D04', customer_name: 'Chandrasekharpur Corporate Corridor', lat: 20.3289, lng: 85.8156, demand_kg: 45.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Damana Square, Chandrasekharpur, Bhubaneswar 751016' },
  { id: 'BBI-D05', customer_name: 'Khandagiri Commercial Logistics Gateway', lat: 20.2614, lng: 85.7825, demand_kg: 50.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Khandagiri Chhak, Bhubaneswar, Odisha 751030' },
  { id: 'BBI-D06', customer_name: 'Jayadev Vihar Fortune Business Center', lat: 20.3014, lng: 85.8214, demand_kg: 40.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Nandankanan Rd, Jayadev Vihar, Bhubaneswar 751013' },
  { id: 'BBI-D07', customer_name: 'Cuttack Road Freight Yard', lat: 20.2756, lng: 85.8456, demand_kg: 70.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Cuttack-Puri Rd, Laxmisagar, Bhubaneswar 751006' },
  { id: 'BBI-D08', customer_name: 'Tamando Interstate Transport Interchange', lat: 20.2214, lng: 85.7489, demand_kg: 75.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'NH16, Tamando, Bhubaneswar, Odisha 752054' },
];

// ============================================================================
// 19. GUWAHATI LOGISTICS CORRIDOR (Assam, Northeast Gateway)
// ============================================================================
export const GAU_DEPOT: Depot = {
  id: 'DEPOT-GAU',
  name: 'RouteQ Guwahati Central Hub (GS Road / Dispur)',
  lat: 26.1445,
  lng: 91.7362,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const GAU_VEHICLES: Vehicle[] = [
  { id: 'GAU-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-GAU', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'GAU-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 650.0, starting_depot_id: 'DEPOT-GAU', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'GAU-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-GAU', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const GAU_DELIVERIES: Delivery[] = [
  { id: 'GAU-D01', customer_name: 'Beltola Commercial Warehousing Terminal', lat: 26.1289, lng: 91.7914, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Beltola Tiniali, Guwahati, Assam 781028' },
  { id: 'GAU-D02', customer_name: 'Lokhra Transport Nagar Logistics Hub', lat: 26.1114, lng: 91.7425, demand_kg: 95.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 25, address: 'Lokhra Chariali, ISBT Corridor, Guwahati, Assam 781040' },
  { id: 'GAU-D03', customer_name: 'GS Road Commercial Central Mile', lat: 26.1556, lng: 91.7756, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'GS Rd, Christian Basti, Guwahati, Assam 781005' },
  { id: 'GAU-D04', customer_name: 'Jalukbari Inland Port & River Terminal', lat: 26.1489, lng: 91.6614, demand_kg: 70.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Jalukbari Roundabout, Guwahati, Assam 781014' },
  { id: 'GAU-D05', customer_name: 'Fancy Bazaar Wholesale Commodity Mart', lat: 26.1856, lng: 91.7414, demand_kg: 75.0, priority: 'urgent', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'SS Rd, Fancy Bazaar, Guwahati, Assam 781001' },
  { id: 'GAU-D06', customer_name: 'Dispur Capital Commercial Complex', lat: 26.1414, lng: 91.7914, demand_kg: 40.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Dispur Secretariat Rd, Guwahati, Assam 781006' },
  { id: 'GAU-D07', customer_name: 'Borjhar Airport Cargo Terminal', lat: 26.1089, lng: 91.5856, demand_kg: 60.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Airport Rd, Borjhar, Guwahati, Assam 781015' },
  { id: 'GAU-D08', customer_name: 'Khanapara Interstate Transportation Junction', lat: 26.1142, lng: 91.8214, demand_kg: 45.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'GS Rd, Khanapara, Guwahati, Assam 781022' },
];

// ============================================================================
// 20. PATNA LOGISTICS CORRIDOR (Bihar)
// ============================================================================
export const PAT_DEPOT: Depot = {
  id: 'DEPOT-PAT',
  name: 'RouteQ Patna Central Hub (Didarganj / NH-30)',
  lat: 25.5684,
  lng: 85.2412,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const PAT_VEHICLES: Vehicle[] = [
  { id: 'PAT-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-PAT', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'PAT-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-PAT', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'PAT-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-PAT', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const PAT_DELIVERIES: Delivery[] = [
  { id: 'PAT-D01', customer_name: 'Maurya Lok Commercial Complex', lat: 25.6092, lng: 85.1376, demand_kg: 65.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Dak Bungalow Rd, Maurya Lok, Patna, Bihar 800001' },
  { id: 'PAT-D02', customer_name: 'Bailey Road Retail Corridor', lat: 25.6128, lng: 85.0924, demand_kg: 80.0, priority: 'high', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Bailey Rd, Raja Bazar, Patna, Bihar 800014' },
  { id: 'PAT-D03', customer_name: 'Patliputra Industrial Estate', lat: 25.6321, lng: 85.1054, demand_kg: 90.0, priority: 'urgent', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Patliputra Colony, Patna, Bihar 800013' },
  { id: 'PAT-D04', customer_name: 'Kankarbagh Main Market Terminal', lat: 25.5925, lng: 85.1542, demand_kg: 55.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Kankarbagh Main Rd, Patna, Bihar 800020' },
  { id: 'PAT-D05', customer_name: 'Boring Road Commercial Spine', lat: 25.6189, lng: 85.1215, demand_kg: 45.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Boring Rd, Nageshwar Colony, Patna, Bihar 800001' },
  { id: 'PAT-D06', customer_name: 'Danapur Cantt & Logistics Yard', lat: 25.6358, lng: 85.0412, demand_kg: 70.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Station Rd, Danapur Nizamat, Patna, Bihar 801503' },
  { id: 'PAT-D07', customer_name: 'Rajendra Nagar Freight Terminal', lat: 25.5991, lng: 85.1668, demand_kg: 60.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Kanti Factory Rd, Rajendra Nagar, Patna 800016' },
  { id: 'PAT-D08', customer_name: 'Patna City Wholesale Mandi', lat: 25.5962, lng: 85.2154, demand_kg: 85.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 25, address: 'Jhauganj Main Rd, Patna City, Bihar 800008' },
];

// ============================================================================
// 21. RANCHI LOGISTICS CORRIDOR (Jharkhand)
// ============================================================================
export const IXR_DEPOT: Depot = {
  id: 'DEPOT-IXR',
  name: 'RouteQ Ranchi Central Hub (Tupudana Industrial Area)',
  lat: 23.2921,
  lng: 85.3015,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IXR_VEHICLES: Vehicle[] = [
  { id: 'IXR-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-IXR', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IXR-V02', name: 'Eicher Pro 2049 Diesel', capacity_kg: 800.0, starting_depot_id: 'DEPOT-IXR', max_route_distance_km: 160.0, fuel_efficiency_km_per_l: 10.0, fuel_type: 'diesel' },
  { id: 'IXR-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IXR', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IXR_DELIVERIES: Delivery[] = [
  { id: 'IXR-D01', customer_name: 'Main Road Commercial District', lat: 23.3615, lng: 85.3248, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Main Rd, Hindpiri, Ranchi, Jharkhand 834001' },
  { id: 'IXR-D02', customer_name: 'Lalpur Circular Road Business Hub', lat: 23.3742, lng: 85.3361, demand_kg: 75.0, priority: 'high', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'Circular Rd, Lalpur, Ranchi, Jharkhand 834001' },
  { id: 'IXR-D03', customer_name: 'Kokar Industrial Area', lat: 23.3854, lng: 85.3562, demand_kg: 95.0, priority: 'urgent', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Kokar Industrial Area, Ranchi, Jharkhand 834001' },
  { id: 'IXR-D04', customer_name: 'Kanke Road Institutional Hub', lat: 23.4124, lng: 85.3187, demand_kg: 40.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Kanke Rd, Ranchi, Jharkhand 834008' },
  { id: 'IXR-D05', customer_name: 'Doranda Administrative & Trade Zone', lat: 23.3371, lng: 85.3218, demand_kg: 50.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Doranda Main Rd, Ranchi, Jharkhand 834002' },
  { id: 'IXR-D06', customer_name: 'Harmu Housing Colony Commercial Spine', lat: 23.3512, lng: 85.3045, demand_kg: 45.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Harmu Bypass Rd, Ranchi, Jharkhand 834002' },
  { id: 'IXR-D07', customer_name: 'Namkum Industrial Freight Hub', lat: 23.3421, lng: 85.3854, demand_kg: 80.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Tata Rd, Namkum, Ranchi, Jharkhand 834010' },
  { id: 'IXR-D08', customer_name: 'Birsa Munda Airport Cargo Terminal', lat: 23.3184, lng: 85.3221, demand_kg: 55.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Airport Rd, Hinoo, Ranchi, Jharkhand 834002' },
];

// ============================================================================
// 22. RAIPUR LOGISTICS CORRIDOR (Chhattisgarh)
// ============================================================================
export const RPR_DEPOT: Depot = {
  id: 'DEPOT-RPR',
  name: 'RouteQ Raipur Central Hub (Rawabhata Industrial Area)',
  lat: 21.3125,
  lng: 81.6542,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const RPR_VEHICLES: Vehicle[] = [
  { id: 'RPR-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-RPR', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'RPR-V02', name: 'Ashok Leyland Dost+ Diesel', capacity_kg: 750.0, starting_depot_id: 'DEPOT-RPR', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'RPR-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-RPR', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const RPR_DELIVERIES: Delivery[] = [
  { id: 'RPR-D01', customer_name: 'Pandri Wholesale Cloth Market', lat: 21.2584, lng: 81.6492, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Cloth Market, Pandri, Raipur, Chhattisgarh 492004' },
  { id: 'RPR-D02', customer_name: 'Jaistambh Chowk Retail District', lat: 21.2421, lng: 81.6345, demand_kg: 60.0, priority: 'high', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Malviya Rd, Jaistambh Chowk, Raipur 492001' },
  { id: 'RPR-D03', customer_name: 'Urla Industrial Complex', lat: 21.3345, lng: 81.6021, demand_kg: 100.0, priority: 'urgent', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Urla Industrial Area, Raipur, Chhattisgarh 492003' },
  { id: 'RPR-D04', customer_name: 'Shankar Nagar Premium Retail Hub', lat: 21.2512, lng: 81.6712, demand_kg: 45.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'VIP Estate Rd, Shankar Nagar, Raipur 492007' },
  { id: 'RPR-D05', customer_name: 'Telibandha Marine Drive Strip', lat: 21.2354, lng: 81.6745, demand_kg: 50.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'GE Rd, Telibandha, Raipur, Chhattisgarh 492006' },
  { id: 'RPR-D06', customer_name: 'Tatibandh Transport Nagar Junction', lat: 21.2541, lng: 81.5654, demand_kg: 90.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'GE Rd, Tatibandh, Raipur, Chhattisgarh 492099' },
  { id: 'RPR-D07', customer_name: 'Naya Raipur Sector 24 Complex', lat: 21.1612, lng: 81.7824, demand_kg: 40.0, priority: 'low', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Sector 24, Atal Nagar, Naya Raipur 492018' },
  { id: 'RPR-D08', customer_name: 'Swami Vivekananda Airport Cargo Gate', lat: 21.1815, lng: 81.7389, demand_kg: 55.0, priority: 'medium', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Airport Rd, Mana, Raipur, Chhattisgarh 492015' },
];

// ============================================================================
// 23. DEHRADUN LOGISTICS CORRIDOR (Uttarakhand)
// ============================================================================
export const DED_DEPOT: Depot = {
  id: 'DEPOT-DED',
  name: 'RouteQ Dehradun Central Hub (Selaqui Industrial Area)',
  lat: 30.3685,
  lng: 77.8542,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const DED_VEHICLES: Vehicle[] = [
  { id: 'DED-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-DED', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'DED-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-DED', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'DED-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-DED', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const DED_DELIVERIES: Delivery[] = [
  { id: 'DED-D01', customer_name: 'Rajpur Road Commercial Promenade', lat: 30.3425, lng: 78.0584, demand_kg: 55.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Rajpur Rd, Hathibarkala, Dehradun 248001' },
  { id: 'DED-D02', customer_name: 'Paltan Bazaar Central Mandi', lat: 30.3245, lng: 78.0412, demand_kg: 75.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'Paltan Bazaar, Clock Tower, Dehradun 248001' },
  { id: 'DED-D03', customer_name: 'Patel Nagar Trade Spine', lat: 30.3089, lng: 78.0195, demand_kg: 60.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Saharanpur Rd, Patel Nagar, Dehradun 248001' },
  { id: 'DED-D04', customer_name: 'Transport Nagar Inter-State Terminal', lat: 30.2912, lng: 77.9984, demand_kg: 90.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Saharanpur Bypass, Transport Nagar, Dehradun 248002' },
  { id: 'DED-D05', customer_name: 'Clement Town Institutional Center', lat: 30.2678, lng: 78.0095, demand_kg: 45.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Subhash Nagar Rd, Clement Town, Dehradun 248002' },
  { id: 'DED-D06', customer_name: 'Jakhan Foothills Retail Junction', lat: 30.3681, lng: 78.0754, demand_kg: 40.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Rajpur Rd, Jakhan, Dehradun, Uttarakhand 248009' },
  { id: 'DED-D07', customer_name: 'Harrawala Industrial Yard', lat: 30.2612, lng: 78.0924, demand_kg: 65.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'NH-7, Harrawala, Dehradun, Uttarakhand 248005' },
  { id: 'DED-D08', customer_name: 'Sahastradhara Road IT Park', lat: 30.3541, lng: 78.0821, demand_kg: 50.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Sahastradhara Rd, Kulhan, Dehradun 248013' },
];

// ============================================================================
// 24. SHIMLA / BADDI LOGISTICS CORRIDOR (Himachal Pradesh)
// ============================================================================
export const BDI_DEPOT: Depot = {
  id: 'DEPOT-BDI',
  name: 'RouteQ Himachal Central Hub (Baddi Industrial Estate)',
  lat: 30.9578,
  lng: 76.7912,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const BDI_VEHICLES: Vehicle[] = [
  { id: 'BDI-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-BDI', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'BDI-V02', name: 'Mahindra Bolero Camper 4WD', capacity_kg: 700.0, starting_depot_id: 'DEPOT-BDI', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'BDI-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-BDI', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const BDI_DELIVERIES: Delivery[] = [
  { id: 'BDI-D01', customer_name: 'Baddi Pharma Zone Hub', lat: 30.9324, lng: 76.8214, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Jharmajri, Baddi, Himachal Pradesh 174103' },
  { id: 'BDI-D02', customer_name: 'Nalagarh Industrial Gateway', lat: 31.0421, lng: 76.7214, demand_kg: 80.0, priority: 'high', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'NH-105, Nalagarh, Himachal Pradesh 174101' },
  { id: 'BDI-D03', customer_name: 'Barotiwala Trade Center', lat: 30.9112, lng: 76.8456, demand_kg: 70.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Barotiwala, Solan, Himachal Pradesh 174103' },
  { id: 'BDI-D04', customer_name: 'Shimla Mall Road Drop Point', lat: 31.1048, lng: 77.1734, demand_kg: 40.0, priority: 'urgent', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'The Mall, The Ridge, Shimla, Himachal Pradesh 171001' },
  { id: 'BDI-D05', customer_name: 'Sanjauli Commercial Hub', lat: 31.1012, lng: 77.1954, demand_kg: 50.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Sanjauli Chowk, Shimla, Himachal Pradesh 171006' },
  { id: 'BDI-D06', customer_name: 'Solan Mall Road Mandi', lat: 30.9084, lng: 77.0984, demand_kg: 60.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Mall Rd, Solan, Himachal Pradesh 173212' },
  { id: 'BDI-D07', customer_name: 'Parwanoo Sector 1 Terminal', lat: 30.8354, lng: 76.9584, demand_kg: 75.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'NH-5, Sector 1, Parwanoo, Himachal Pradesh 173220' },
  { id: 'BDI-D08', customer_name: 'Chotta Shimla Secretariat Hub', lat: 31.0921, lng: 77.1812, demand_kg: 35.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Chotta Shimla, Shimla, Himachal Pradesh 171002' },
];

// ============================================================================
// 25. GOA LOGISTICS CORRIDOR (Panaji / Verna)
// ============================================================================
export const GOI_DEPOT: Depot = {
  id: 'DEPOT-GOI',
  name: 'RouteQ Goa Central Hub (Verna Industrial Estate)',
  lat: 15.3621,
  lng: 73.9345,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const GOI_VEHICLES: Vehicle[] = [
  { id: 'GOI-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-GOI', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'GOI-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-GOI', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'GOI-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-GOI', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const GOI_DELIVERIES: Delivery[] = [
  { id: 'GOI-D01', customer_name: 'Panaji 18th June Road Commercial District', lat: 15.4989, lng: 73.8278, demand_kg: 55.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: '18th June Rd, Panaji, Goa 403001' },
  { id: 'GOI-D02', customer_name: 'Margao New Market Trading Hub', lat: 15.2742, lng: 73.9584, demand_kg: 75.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'New Market, Margao, Goa 403601' },
  { id: 'GOI-D03', customer_name: 'Vasco da Gama Port Logistics Yard', lat: 15.3984, lng: 73.8112, demand_kg: 85.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Swatantra Path, Vasco da Gama, Goa 403802' },
  { id: 'GOI-D04', customer_name: 'Mapusa Friday Market Trade Center', lat: 15.5921, lng: 73.8145, demand_kg: 60.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Municipal Market, Mapusa, Goa 403507' },
  { id: 'GOI-D05', customer_name: 'Porvorim Mall de Goa Commercial Corridor', lat: 15.5284, lng: 73.8295, demand_kg: 45.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'NH-66, Porvorim, Goa 403521' },
  { id: 'GOI-D06', customer_name: 'Kundaim Industrial Estate', lat: 15.4214, lng: 73.9854, demand_kg: 80.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Kundaim Industrial Area, Ponda, Goa 403115' },
  { id: 'GOI-D07', customer_name: 'Candolim Coastal Hospitality Spine', lat: 15.5184, lng: 73.7684, demand_kg: 40.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Fort Aguada Rd, Candolim, Goa 403515' },
  { id: 'GOI-D08', customer_name: 'Dabolim Airport Cargo Facility', lat: 15.3808, lng: 73.8314, demand_kg: 50.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Airport Rd, Dabolim, Goa 403801' },
];

// ============================================================================
// 26. SRINAGAR LOGISTICS CORRIDOR (Jammu & Kashmir UT)
// ============================================================================
export const SXR_DEPOT: Depot = {
  id: 'DEPOT-SXR',
  name: 'RouteQ Srinagar Central Hub (Rangreth Industrial Estate)',
  lat: 33.9921,
  lng: 74.7895,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const SXR_VEHICLES: Vehicle[] = [
  { id: 'SXR-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-SXR', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'SXR-V02', name: 'Mahindra Bolero 4x4 Diesel', capacity_kg: 700.0, starting_depot_id: 'DEPOT-SXR', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'SXR-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-SXR', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const SXR_DELIVERIES: Delivery[] = [
  { id: 'SXR-D01', customer_name: 'Lal Chowk City Centre Trade Mile', lat: 34.0712, lng: 74.8114, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Residency Rd, Lal Chowk, Srinagar, J&K 190001' },
  { id: 'SXR-D02', customer_name: 'Batamaloo Wholesale Market', lat: 34.0754, lng: 74.7924, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Batamaloo Bus Stand Rd, Srinagar, J&K 190009' },
  { id: 'SXR-D03', customer_name: 'Rajbagh Commercial Promenade', lat: 34.0592, lng: 74.8256, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Rajbagh Main Rd, Srinagar, J&K 190008' },
  { id: 'SXR-D04', customer_name: 'Karan Nagar Medical & Retail Hub', lat: 34.0884, lng: 74.8012, demand_kg: 65.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'SMHS Hospital Rd, Karan Nagar, Srinagar 190010' },
  { id: 'SXR-D05', customer_name: 'Zainakote Industrial Estate', lat: 34.1084, lng: 74.7214, demand_kg: 90.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Baramulla Hwy, Zainakote, Srinagar 190012' },
  { id: 'SXR-D06', customer_name: 'Hazratbal Commercial Complex', lat: 34.1295, lng: 74.8412, demand_kg: 45.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Hazratbal Rd, Naseem Bagh, Srinagar 190006' },
  { id: 'SXR-D07', customer_name: 'Pantha Chowk Bypass Logistics Hub', lat: 34.0321, lng: 74.8724, demand_kg: 75.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'NH-44 Bypass, Pantha Chowk, Srinagar 191101' },
  { id: 'SXR-D08', customer_name: 'Sheikh ul-Alam Airport Cargo Terminal', lat: 34.0084, lng: 74.7741, demand_kg: 55.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Airport Rd, Budgam, Srinagar, J&K 190007' },
];

// ============================================================================
// 27. LUDHIANA LOGISTICS CORRIDOR (Punjab)
// ============================================================================
export const LUH_DEPOT: Depot = {
  id: 'DEPOT-LUH',
  name: 'RouteQ Ludhiana Central Hub (Focal Point Phase IV)',
  lat: 30.8712,
  lng: 75.9142,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const LUH_VEHICLES: Vehicle[] = [
  { id: 'LUH-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-LUH', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'LUH-V02', name: 'Eicher Pro 2049 Diesel', capacity_kg: 850.0, starting_depot_id: 'DEPOT-LUH', max_route_distance_km: 160.0, fuel_efficiency_km_per_l: 10.0, fuel_type: 'diesel' },
  { id: 'LUH-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-LUH', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const LUH_DELIVERIES: Delivery[] = [
  { id: 'LUH-D01', customer_name: 'Chaura Bazaar Old Textile Mandi', lat: 30.9154, lng: 75.8542, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Chaura Bazaar, Ludhiana, Punjab 141008' },
  { id: 'LUH-D02', customer_name: 'Ghumar Mandi Retail Street', lat: 30.9024, lng: 75.8284, demand_kg: 60.0, priority: 'high', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Ghumar Mandi Rd, Ludhiana, Punjab 141001' },
  { id: 'LUH-D03', customer_name: 'Industrial Area A & B Hosiery Hub', lat: 30.8954, lng: 75.8754, demand_kg: 95.0, priority: 'urgent', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Cheema Chowk, Industrial Area A, Ludhiana 141003' },
  { id: 'LUH-D04', customer_name: 'Ferozepur Road Westend Mall Corridor', lat: 30.8845, lng: 75.7924, demand_kg: 50.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Ferozepur Rd, Gurdev Nagar, Ludhiana 141012' },
  { id: 'LUH-D05', customer_name: 'Model Town Market Square', lat: 30.8854, lng: 75.8341, demand_kg: 55.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Model Town Rd, Ludhiana, Punjab 141002' },
  { id: 'LUH-D06', customer_name: 'Gill Road Auto Parts Wholesale Center', lat: 30.8741, lng: 75.8592, demand_kg: 75.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Gill Rd, Dashmesh Nagar, Ludhiana 141003' },
  { id: 'LUH-D07', customer_name: 'Sahnewal Dry Port Logistics Yard', lat: 30.8451, lng: 75.9784, demand_kg: 90.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 25, address: 'GT Rd, Sahnewal, Ludhiana, Punjab 141120' },
  { id: 'LUH-D08', customer_name: 'Dholewal Chowk Transit Spine', lat: 30.8895, lng: 75.8674, demand_kg: 45.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'GT Rd, Dholewal Chowk, Ludhiana 141003' },
];

// ============================================================================
// 28. GURUGRAM LOGISTICS CORRIDOR (Haryana)
// ============================================================================
export const GUR_DEPOT: Depot = {
  id: 'DEPOT-GUR',
  name: 'RouteQ Gurugram Central Hub (Udyog Vihar Phase IV)',
  lat: 28.4984,
  lng: 77.0784,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const GUR_VEHICLES: Vehicle[] = [
  { id: 'GUR-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-GUR', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'GUR-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 750.0, starting_depot_id: 'DEPOT-GUR', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'GUR-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-GUR', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const GUR_DELIVERIES: Delivery[] = [
  { id: 'GUR-D01', customer_name: 'DLF Cyber City CyberHub Core', lat: 28.4954, lng: 77.0895, demand_kg: 65.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'CyberHub, DLF Phase 2, Gurugram, Haryana 122002' },
  { id: 'GUR-D02', customer_name: 'Golf Course Road Horizon Center', lat: 28.4684, lng: 77.0984, demand_kg: 55.0, priority: 'high', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'Golf Course Rd, Sector 43, Gurugram 122002' },
  { id: 'GUR-D03', customer_name: 'Manesar IMT Automotive Hub', lat: 28.3541, lng: 76.9214, demand_kg: 95.0, priority: 'urgent', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Sector 8, IMT Manesar, Gurugram, Haryana 122051' },
  { id: 'GUR-D04', customer_name: 'Sohna Road Commercial Belt', lat: 28.4214, lng: 77.0421, demand_kg: 60.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Sohna Rd, Sector 49, Gurugram, Haryana 122018' },
  { id: 'GUR-D05', customer_name: 'Old Gurugram Sadar Bazaar Mandi', lat: 28.4612, lng: 77.0284, demand_kg: 80.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Sadar Bazaar, Sector 12, Gurugram 122001' },
  { id: 'GUR-D06', customer_name: 'Golf Course Extension Retail Hub', lat: 28.4054, lng: 77.0745, demand_kg: 50.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Golf Course Ext Rd, Sector 65, Gurugram 122101' },
  { id: 'GUR-D07', customer_name: 'Dwarka Expressway Sector 84 Trade Hub', lat: 28.4184, lng: 76.9784, demand_kg: 70.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Dwarka Expressway, Sector 84, Gurugram 122004' },
  { id: 'GUR-D08', customer_name: 'MG Road Metro Commercial Strip', lat: 28.4795, lng: 77.0812, demand_kg: 45.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'MG Rd, Sikanderpur, Gurugram, Haryana 122002' },
];

// ============================================================================
// 29. AGARTALA LOGISTICS CORRIDOR (Tripura)
// ============================================================================
export const IXA_DEPOT: Depot = {
  id: 'DEPOT-IXA',
  name: 'RouteQ Agartala Central Hub (Bodhjungnagar Industrial Zone)',
  lat: 23.8921,
  lng: 91.3542,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IXA_VEHICLES: Vehicle[] = [
  { id: 'IXA-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-IXA', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IXA-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-IXA', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'IXA-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IXA', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IXA_DELIVERIES: Delivery[] = [
  { id: 'IXA-D01', customer_name: 'Battala Wholesale Supermarket', lat: 23.8321, lng: 91.2754, demand_kg: 80.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Battala, Agartala, Tripura 799001' },
  { id: 'IXA-D02', customer_name: 'Akhaura ICP Logistics Gate', lat: 23.8541, lng: 91.2612, demand_kg: 90.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Akhaura Check Post Rd, Agartala 799005' },
  { id: 'IXA-D03', customer_name: 'Maharajganj Bazaar Core Trading Zone', lat: 23.8384, lng: 91.2854, demand_kg: 65.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Maharajganj Bazar, Agartala, Tripura 799001' },
  { id: 'IXA-D04', customer_name: 'Kaman Chowmuhani Business Square', lat: 23.8354, lng: 91.2812, demand_kg: 50.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Central Rd, Kaman Chowmuhani, Agartala 799001' },
  { id: 'IXA-D05', customer_name: 'VIP Road Secretariat Complex', lat: 23.8584, lng: 91.2954, demand_kg: 40.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'VIP Rd, Kunjaban, Agartala, Tripura 799006' },
  { id: 'IXA-D06', customer_name: 'GB Pant Medical & Retail District', lat: 23.8641, lng: 91.3021, demand_kg: 55.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Agartala-Udaipur Rd, Kunjaban, Agartala 799006' },
  { id: 'IXA-D07', customer_name: 'Badharghat Railway Freight Yard', lat: 23.8054, lng: 91.2814, demand_kg: 75.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Railway Station Rd, Badharghat, Agartala 799003' },
  { id: 'IXA-D08', customer_name: 'MBB Airport Cargo Gate', lat: 23.8864, lng: 91.2421, demand_kg: 45.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Airport Rd, Singerbhil, Agartala 799009' },
];

// ============================================================================
// 30. SHILLONG LOGISTICS CORRIDOR (Meghalaya)
// ============================================================================
export const SHL_DEPOT: Depot = {
  id: 'DEPOT-SHL',
  name: 'RouteQ Shillong Central Hub (Umiam Barapani Industrial Node)',
  lat: 25.6684,
  lng: 91.9054,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const SHL_VEHICLES: Vehicle[] = [
  { id: 'SHL-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-SHL', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'SHL-V02', name: 'Mahindra Bolero Camper 4x4', capacity_kg: 750.0, starting_depot_id: 'DEPOT-SHL', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'SHL-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-SHL', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const SHL_DELIVERIES: Delivery[] = [
  { id: 'SHL-D01', customer_name: 'Police Bazar Central Commercial Hub', lat: 25.5784, lng: 91.8845, demand_kg: 65.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Police Bazar, GS Rd, Shillong, Meghalaya 793001' },
  { id: 'SHL-D02', customer_name: 'Iewduh (Bara Bazar) Wholesale Market', lat: 25.5742, lng: 91.8741, demand_kg: 90.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Iewduh, Bara Bazar, Shillong, Meghalaya 793002' },
  { id: 'SHL-D03', customer_name: 'Laitumkhrah Retail Promenade', lat: 25.5684, lng: 91.8984, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Laitumkhrah Main Rd, Shillong 793003' },
  { id: 'SHL-D04', customer_name: 'Laban Residential & Trade District', lat: 25.5612, lng: 91.8754, demand_kg: 45.0, priority: 'medium', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Laban Main Rd, Shillong, Meghalaya 793004' },
  { id: 'SHL-D05', customer_name: 'Mawlai Gate Commercial Corridor', lat: 25.6021, lng: 91.8724, demand_kg: 70.0, priority: 'high', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'NH-106, Mawlai Phudmuri, Shillong 793008' },
  { id: 'SHL-D06', customer_name: 'NEHU Institutional Complex', lat: 25.6142, lng: 91.9012, demand_kg: 40.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'NEHU Campus, Umshing, Shillong 793022' },
  { id: 'SHL-D07', customer_name: 'Nongthymmai Commercial Strip', lat: 25.5584, lng: 91.9124, demand_kg: 55.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Nongthymmai, Shillong, Meghalaya 793014' },
  { id: 'SHL-D08', customer_name: 'Upper Shillong Logistics Depot', lat: 25.5341, lng: 91.8384, demand_kg: 60.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: '5th Mile, Upper Shillong, Meghalaya 793005' },
];

// ============================================================================
// 31. IMPHAL LOGISTICS CORRIDOR (Manipur)
// ============================================================================
export const IMF_DEPOT: Depot = {
  id: 'DEPOT-IMF',
  name: 'RouteQ Imphal Central Hub (Nilakuthi Industrial Food Park)',
  lat: 24.8712,
  lng: 93.9451,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IMF_VEHICLES: Vehicle[] = [
  { id: 'IMF-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-IMF', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IMF-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-IMF', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'IMF-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IMF', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IMF_DELIVERIES: Delivery[] = [
  { id: 'IMF-D01', customer_name: 'Ima Keithel Wholesale Market', lat: 24.8084, lng: 93.9364, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Thangal Bazar, Imphal, Manipur 795001' },
  { id: 'IMF-D02', customer_name: 'Paona Bazaar Commercial Street', lat: 24.8051, lng: 93.9372, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Paona Rd, Imphal, Manipur 795001' },
  { id: 'IMF-D03', customer_name: 'Lamphelpat Healthcare Hub', lat: 24.8214, lng: 93.9184, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Lamphelpat, Imphal West, Manipur 795004' },
  { id: 'IMF-D04', customer_name: 'Khwairamband Wholesale Grain Mart', lat: 24.8095, lng: 93.9345, demand_kg: 75.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Khwairamband Bazar, Imphal 795001' },
  { id: 'IMF-D05', customer_name: 'Mantripukhri IT Complex', lat: 24.8484, lng: 93.9484, demand_kg: 45.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'NH-2, Mantripukhri, Imphal East 795002' },
  { id: 'IMF-D06', customer_name: 'Singjamei Commercial Junction', lat: 24.7812, lng: 93.9351, demand_kg: 65.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'NH-102, Singjamei, Imphal 795008' },
  { id: 'IMF-D07', customer_name: 'Porompat Administrative Hub', lat: 24.8142, lng: 93.9612, demand_kg: 40.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'DC Office Rd, Porompat, Imphal East 795005' },
  { id: 'IMF-D08', customer_name: 'Bir Tikendrajit Airport Cargo Gate', lat: 24.7612, lng: 93.8964, demand_kg: 55.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Tiddim Rd, Tulihal, Imphal 795140' },
];

// ============================================================================
// 32. DIMAPUR LOGISTICS CORRIDOR (Nagaland)
// ============================================================================
export const DMU_DEPOT: Depot = {
  id: 'DEPOT-DMU',
  name: 'RouteQ Dimapur Central Hub (Industrial Estate Diphupar)',
  lat: 25.8641,
  lng: 93.7541,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const DMU_VEHICLES: Vehicle[] = [
  { id: 'DMU-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-DMU', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'DMU-V02', name: 'Mahindra Bolero Camper 4WD', capacity_kg: 750.0, starting_depot_id: 'DEPOT-DMU', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'DMU-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-DMU', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const DMU_DELIVERIES: Delivery[] = [
  { id: 'DMU-D01', customer_name: 'Hong Kong Market Electronics Strip', lat: 25.9084, lng: 93.7254, demand_kg: 70.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Hong Kong Market, Dimapur, Nagaland 797112' },
  { id: 'DMU-D02', customer_name: 'New Market Wholesale Produce Hub', lat: 25.9124, lng: 93.7291, demand_kg: 80.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'New Market Rd, Dimapur, Nagaland 797112' },
  { id: 'DMU-D03', customer_name: 'Circular Road Hardware Spine', lat: 25.9042, lng: 93.7314, demand_kg: 65.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Circular Rd, Dimapur, Nagaland 797112' },
  { id: 'DMU-D04', customer_name: 'Purana Bazaar Inter-District Terminal', lat: 25.8941, lng: 93.7484, demand_kg: 85.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Purana Bazar, Dimapur, Nagaland 797112' },
  { id: 'DMU-D05', customer_name: 'Chumukedima Commercial Mile', lat: 25.8241, lng: 93.7745, demand_kg: 55.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'NH-29, Chumukedima, Nagaland 797103' },
  { id: 'DMU-D06', customer_name: 'Kohima Road 4th Mile Trade Center', lat: 25.8541, lng: 93.7621, demand_kg: 60.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: '4th Mile, Diphupar, Dimapur 797115' },
  { id: 'DMU-D07', customer_name: 'Dimapur Railway Freight Station Yard', lat: 25.9151, lng: 93.7342, demand_kg: 70.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Railway Colony, Dimapur, Nagaland 797112' },
  { id: 'DMU-D08', customer_name: 'Dimapur Airport Cargo Center', lat: 25.8841, lng: 93.7712, demand_kg: 45.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: '3rd Mile, Airport Rd, Dimapur 797115' },
];

// ============================================================================
// 33. AIZAWL LOGISTICS CORRIDOR (Mizoram)
// ============================================================================
export const AJL_DEPOT: Depot = {
  id: 'DEPOT-AJL',
  name: 'RouteQ Aizawl Central Hub (Zuangtui Industrial Area)',
  lat: 23.7654,
  lng: 92.7412,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const AJL_VEHICLES: Vehicle[] = [
  { id: 'AJL-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-AJL', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'AJL-V02', name: 'Mahindra Bolero 4WD Pickup', capacity_kg: 700.0, starting_depot_id: 'DEPOT-AJL', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'AJL-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-AJL', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const AJL_DELIVERIES: Delivery[] = [
  { id: 'AJL-D01', customer_name: 'Bara Bazar Central Hill Commercial Core', lat: 23.7312, lng: 92.7184, demand_kg: 75.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Bara Bazar, Aizawl, Mizoram 796001' },
  { id: 'AJL-D02', customer_name: 'Chanmari Commercial Junction', lat: 23.7441, lng: 92.7245, demand_kg: 60.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'Chanmari Main Rd, Aizawl, Mizoram 796007' },
  { id: 'AJL-D03', customer_name: 'Khatla Secretariat Administrative Belt', lat: 23.7214, lng: 92.7142, demand_kg: 45.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 15, address: 'Khatla, Aizawl, Mizoram 796001' },
  { id: 'AJL-D04', customer_name: 'Bawngkawn Trade Intersection', lat: 23.7584, lng: 92.7314, demand_kg: 70.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'NH-54, Bawngkawn, Aizawl, Mizoram 796014' },
  { id: 'AJL-D05', customer_name: 'Mission Veng Retail Promenade', lat: 23.7154, lng: 92.7214, demand_kg: 40.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Mission Veng, Aizawl, Mizoram 796005' },
  { id: 'AJL-D06', customer_name: 'Ramhlun North Trade Strip', lat: 23.7512, lng: 92.7284, demand_kg: 50.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Ramhlun North, Aizawl, Mizoram 796012' },
  { id: 'AJL-D07', customer_name: 'Kulikawn South Gateway Hub', lat: 23.7021, lng: 92.7195, demand_kg: 55.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Kulikawn Main Rd, Aizawl 796005' },
  { id: 'AJL-D08', customer_name: 'Lengpui Airport Cargo Access Depot', lat: 23.8412, lng: 92.6241, demand_kg: 65.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 25, address: 'Lengpui Airport Rd, Mizoram 796421' },
];

// ============================================================================
// 34. ITANAGAR LOGISTICS CORRIDOR (Arunachal Pradesh)
// ============================================================================
export const IXT_DEPOT: Depot = {
  id: 'DEPOT-IXT',
  name: 'RouteQ Itanagar Central Hub (Naharlagun Industrial Area)',
  lat: 27.1084,
  lng: 93.6945,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IXT_VEHICLES: Vehicle[] = [
  { id: 'IXT-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-IXT', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IXT-V02', name: 'Mahindra Bolero Camper 4x4', capacity_kg: 750.0, starting_depot_id: 'DEPOT-IXT', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'IXT-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IXT', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IXT_DELIVERIES: Delivery[] = [
  { id: 'IXT-D01', customer_name: 'Ganga Market Central Bazaar', lat: 27.0984, lng: 93.6184, demand_kg: 70.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Ganga Market, Itanagar, Arunachal 791111' },
  { id: 'IXT-D02', customer_name: 'Naharlagun Daily Market Center', lat: 27.1054, lng: 93.6984, demand_kg: 75.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'Daily Market, Naharlagun, Arunachal 791110' },
  { id: 'IXT-D03', customer_name: 'Bank Tinali Commercial Junction', lat: 27.0942, lng: 93.6214, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 15, address: 'Bank Tinali, Itanagar, Arunachal 791111' },
  { id: 'IXT-D04', customer_name: 'Civil Secretariat Complex', lat: 27.0895, lng: 93.6295, demand_kg: 40.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Niti Vihar, Itanagar, Arunachal 791111' },
  { id: 'IXT-D05', customer_name: 'E-Sector Business Hub', lat: 27.1124, lng: 93.7042, demand_kg: 55.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'E-Sector, Naharlagun, Arunachal 791110' },
  { id: 'IXT-D06', customer_name: 'Nirjuli Educational & Trade Zone', lat: 27.1354, lng: 93.7484, demand_kg: 60.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'NH-415, Nirjuli, Papum Pare 791109' },
  { id: 'IXT-D07', customer_name: 'Banderdewa Interstate Checkpost Yard', lat: 27.1512, lng: 93.8154, demand_kg: 85.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 25, address: 'NH-15, Banderdewa, Arunachal 791123' },
  { id: 'IXT-D08', customer_name: 'Donyi Polo Airport Cargo Terminal', lat: 26.9641, lng: 93.6451, demand_kg: 45.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Airport Rd, Hollongi, Arunachal 791123' },
];

// ============================================================================
// 35. GANGTOK LOGISTICS CORRIDOR (Sikkim)
// ============================================================================
export const SKM_DEPOT: Depot = {
  id: 'DEPOT-SKM',
  name: 'RouteQ Sikkim Central Hub (Rangpo Gateway Logistics Center)',
  lat: 27.1784,
  lng: 88.5295,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const SKM_VEHICLES: Vehicle[] = [
  { id: 'SKM-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-SKM', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'SKM-V02', name: 'Mahindra Bolero Maxi 4WD', capacity_kg: 700.0, starting_depot_id: 'DEPOT-SKM', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'SKM-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-SKM', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const SKM_DELIVERIES: Delivery[] = [
  { id: 'SKM-D01', customer_name: 'MG Marg Pedestrian Commercial Mall', lat: 27.3295, lng: 88.6142, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'MG Marg, Gangtok, Sikkim 737101' },
  { id: 'SKM-D02', customer_name: 'Lal Bazaar Wholesale Produce Mandi', lat: 27.3274, lng: 88.6112, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Lal Bazaar, Gangtok, Sikkim 737101' },
  { id: 'SKM-D03', customer_name: 'Deorali Commercial Junction & Ropeway', lat: 27.3184, lng: 88.6084, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'NH-10, Deorali, Gangtok, Sikkim 737102' },
  { id: 'SKM-D04', customer_name: 'Tadong Educational & Healthcare Mile', lat: 27.3095, lng: 88.6012, demand_kg: 55.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Indira Bypass, Tadong, Gangtok 737102' },
  { id: 'SKM-D05', customer_name: 'Ranipool Transit & Trading Hub', lat: 27.2814, lng: 88.5895, demand_kg: 75.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'NH-10, Ranipool, Gangtok 737135' },
  { id: 'SKM-D06', customer_name: 'Singtam Commercial Market Junction', lat: 27.2341, lng: 88.4984, demand_kg: 70.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Singtam Bazaar, Sikkim 737134' },
  { id: 'SKM-D07', customer_name: 'Vajra Cinema Commercial Hub', lat: 27.3384, lng: 88.6184, demand_kg: 40.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Balwakhani, Gangtok, Sikkim 737101' },
  { id: 'SKM-D08', customer_name: 'Pakyong Airport Cargo Link', lat: 27.2312, lng: 88.5884, demand_kg: 45.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Airport Rd, Pakyong, Sikkim 737106' },
];

// ============================================================================
// 36. PUDUCHERRY LOGISTICS CORRIDOR (Puducherry UT)
// ============================================================================
export const PNY_DEPOT: Depot = {
  id: 'DEPOT-PNY',
  name: 'RouteQ Puducherry Central Hub (Mettupalayam Industrial Estate)',
  lat: 11.9541,
  lng: 79.7942,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const PNY_VEHICLES: Vehicle[] = [
  { id: 'PNY-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-PNY', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'PNY-V02', name: 'Ashok Leyland Dost+ Diesel', capacity_kg: 750.0, starting_depot_id: 'DEPOT-PNY', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'PNY-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-PNY', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const PNY_DELIVERIES: Delivery[] = [
  { id: 'PNY-D01', customer_name: 'White Town Heritage Promenade', lat: 11.9324, lng: 79.8341, demand_kg: 50.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 15, address: 'Dumas St, White Town, Puducherry 605001' },
  { id: 'PNY-D02', customer_name: 'Jawaharlal Nehru Street Retail Core', lat: 11.9351, lng: 79.8295, demand_kg: 70.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'JN St, Heritage Town, Puducherry 605001' },
  { id: 'PNY-D03', customer_name: 'Goubert Market Traditional Mandi', lat: 11.9384, lng: 79.8274, demand_kg: 85.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Goubert Market, MG Rd, Puducherry 605001' },
  { id: 'PNY-D04', customer_name: 'Villianur Commercial Temple Junction', lat: 11.9154, lng: 79.7612, demand_kg: 60.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Villianur Main Rd, Puducherry 605110' },
  { id: 'PNY-D05', customer_name: 'Indira Gandhi Square Arterial Junction', lat: 11.9284, lng: 79.8084, demand_kg: 55.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'Villupuram Main Rd, Puducherry 605005' },
  { id: 'PNY-D06', customer_name: 'Sedarapet Industrial Growth Centre', lat: 11.9984, lng: 79.7421, demand_kg: 90.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 25, address: 'Sedarapet Industrial Area, Puducherry 605111' },
  { id: 'PNY-D07', customer_name: 'Auroville International Logistics Point', lat: 12.0064, lng: 79.8114, demand_kg: 45.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Auroville Rd, Bommayapalayam, Puducherry 605101' },
  { id: 'PNY-D08', customer_name: 'Puducherry Airport Cargo Center', lat: 11.9684, lng: 79.8124, demand_kg: 40.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Airport Rd, Lawspet, Puducherry 605008' },
];

// ============================================================================
// 37. LEH LOGISTICS CORRIDOR (Ladakh UT)
// ============================================================================
export const IXL_DEPOT: Depot = {
  id: 'DEPOT-IXL',
  name: 'RouteQ Ladakh Central Hub (Choglamsar Logistics Yard)',
  lat: 34.1245,
  lng: 77.5812,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IXL_VEHICLES: Vehicle[] = [
  { id: 'IXL-V01', name: 'Tata Ace EV Express', capacity_kg: 400.0, starting_depot_id: 'DEPOT-IXL', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IXL-V02', name: 'Mahindra Bolero 4x4 Diesel', capacity_kg: 750.0, starting_depot_id: 'DEPOT-IXL', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.0, fuel_type: 'diesel' },
  { id: 'IXL-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IXL', max_route_distance_km: 100.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IXL_DELIVERIES: Delivery[] = [
  { id: 'IXL-D01', customer_name: 'Leh Main Bazaar Heritage Street', lat: 34.1645, lng: 77.5842, demand_kg: 60.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Main Bazaar, Leh, Ladakh 194101' },
  { id: 'IXL-D02', customer_name: 'Fort Road Tourist & Retail Promenade', lat: 34.1592, lng: 77.5795, demand_kg: 55.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'Fort Rd, Leh, Ladakh 194101' },
  { id: 'IXL-D03', customer_name: 'Changspa Road Hospitality Hub', lat: 34.1712, lng: 77.5741, demand_kg: 45.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 15, address: 'Changspa Rd, Leh, Ladakh 194101' },
  { id: 'IXL-D04', customer_name: 'Skalzangling Commercial & Transport Hub', lat: 34.1484, lng: 77.5721, demand_kg: 75.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'Skalzangling, Leh, Ladakh 194101' },
  { id: 'IXL-D05', customer_name: 'Choglamsar Tibetan Settlement Market', lat: 34.1184, lng: 77.5912, demand_kg: 65.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Leh-Manali Hwy, Choglamsar, Ladakh 194104' },
  { id: 'IXL-D06', customer_name: 'Shey Agricultural & Supply Cluster', lat: 34.0712, lng: 77.6341, demand_kg: 40.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Shey Palace Rd, Shey, Ladakh 194201' },
  { id: 'IXL-D07', customer_name: 'Spituk Freight & Monastic Supply Node', lat: 34.1312, lng: 77.5284, demand_kg: 50.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Spituk Gompa Rd, Spituk, Leh 194104' },
  { id: 'IXL-D08', customer_name: 'Kushok Bakula Rimpochee Airport Cargo', lat: 34.1354, lng: 77.5462, demand_kg: 55.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Airport Rd, Leh, Ladakh 194101' },
];

// ============================================================================
// 38. PORT BLAIR LOGISTICS CORRIDOR (Andaman & Nicobar Islands UT)
// ============================================================================
export const IXZ_DEPOT: Depot = {
  id: 'DEPOT-IXZ',
  name: 'RouteQ Andaman Central Hub (Haddo Wharf Port Complex)',
  lat: 11.6784,
  lng: 92.7241,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const IXZ_VEHICLES: Vehicle[] = [
  { id: 'IXZ-V01', name: 'Tata Ace EV Express', capacity_kg: 450.0, starting_depot_id: 'DEPOT-IXZ', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'IXZ-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-IXZ', max_route_distance_km: 140.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'IXZ-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-IXZ', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const IXZ_DELIVERIES: Delivery[] = [
  { id: 'IXZ-D01', customer_name: 'Aberdeen Bazaar Commercial Square', lat: 11.6645, lng: 92.7412, demand_kg: 70.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Aberdeen Bazaar, Port Blair, Andaman 744101' },
  { id: 'IXZ-D02', customer_name: 'Phoenix Bay Jetty Cargo Terminal', lat: 11.6712, lng: 92.7314, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Phoenix Bay, Port Blair, Andaman 744102' },
  { id: 'IXZ-D03', customer_name: 'Junglighat Seafood & Produce Mandi', lat: 11.6512, lng: 92.7214, demand_kg: 60.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'Junglighat Main Rd, Port Blair 744103' },
  { id: 'IXZ-D04', customer_name: 'Bathubasti Trade Center', lat: 11.6214, lng: 92.7095, demand_kg: 75.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 20, address: 'ATR Highway, Bathubasti, Port Blair 744105' },
  { id: 'IXZ-D05', customer_name: 'Dollygunj Industrial Estate', lat: 11.6345, lng: 92.7154, demand_kg: 90.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 25, address: 'Dollygunj, Port Blair, Andaman 744103' },
  { id: 'IXZ-D06', customer_name: 'Garacharma Rural Marketplace', lat: 11.6095, lng: 92.7012, demand_kg: 50.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Garacharma, South Andaman 744105' },
  { id: 'IXZ-D07', customer_name: 'Marine Hill Administrative Complex', lat: 11.6695, lng: 92.7451, demand_kg: 45.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Marine Hill Rd, Port Blair 744101' },
  { id: 'IXZ-D08', customer_name: 'Veer Savarkar Airport Cargo Gate', lat: 11.6412, lng: 92.7295, demand_kg: 55.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Lamba Line, Port Blair, Andaman 744103' },
];

// ============================================================================
// 39. VARANASI LOGISTICS CORRIDOR (Uttar Pradesh - Eastern)
// ============================================================================
export const VNS_DEPOT: Depot = {
  id: 'DEPOT-VNS',
  name: 'RouteQ Varanasi Central Hub (Ramnagar Industrial Area Phase 1)',
  lat: 25.2712,
  lng: 83.0284,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const VNS_VEHICLES: Vehicle[] = [
  { id: 'VNS-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-VNS', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'VNS-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-VNS', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'VNS-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-VNS', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const VNS_DELIVERIES: Delivery[] = [
  { id: 'VNS-D01', customer_name: 'Godowlia Chowk Silk & Textile Core', lat: 25.3084, lng: 83.0074, demand_kg: 85.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Godowlia Chowk, Varanasi, UP 221001' },
  { id: 'VNS-D02', customer_name: 'Sigra Commercial Retail Corridor', lat: 25.3178, lng: 82.9884, demand_kg: 65.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Sigra-Mahmoorganj Rd, Varanasi, UP 221010' },
  { id: 'VNS-D03', customer_name: 'Lanka BHU Academic & Commercial Strip', lat: 25.2814, lng: 82.9984, demand_kg: 50.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 15, address: 'BHU Main Gate, Lanka, Varanasi 221005' },
  { id: 'VNS-D04', customer_name: 'Cantonment Station Freight Junction', lat: 25.3284, lng: 82.9845, demand_kg: 90.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'Station Rd, Cantt, Varanasi, UP 221002' },
  { id: 'VNS-D05', customer_name: 'Shivpur Industrial & Auto Market', lat: 25.3584, lng: 82.9641, demand_kg: 75.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'NH-31, Shivpur, Varanasi, UP 221003' },
  { id: 'VNS-D06', customer_name: 'Pandeypur Commercial Intersection', lat: 25.3421, lng: 83.0184, demand_kg: 55.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 15, address: 'Azamgarh Rd, Pandeypur, Varanasi 221002' },
  { id: 'VNS-D07', customer_name: 'Sarnath Cultural & Logistics Depot', lat: 25.3712, lng: 83.0245, demand_kg: 40.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Sarnath Station Rd, Varanasi 221007' },
  { id: 'VNS-D08', customer_name: 'Lal Bahadur Shastri Airport Cargo', lat: 25.4495, lng: 82.8592, demand_kg: 60.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 20, address: 'Airport Rd, Babatpur, Varanasi 221006' },
];

// ============================================================================
// 40. THIRUVANANTHAPURAM LOGISTICS CORRIDOR (Kerala - South)
// ============================================================================
export const TRV_DEPOT: Depot = {
  id: 'DEPOT-TRV',
  name: 'RouteQ Trivandrum Central Hub (Kochuveli Industrial Area)',
  lat: 8.5084,
  lng: 76.8912,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const TRV_VEHICLES: Vehicle[] = [
  { id: 'TRV-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-TRV', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'TRV-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-TRV', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'TRV-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-TRV', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const TRV_DELIVERIES: Delivery[] = [
  { id: 'TRV-D01', customer_name: 'Technopark Phase 1 Innovation Gate', lat: 8.5584, lng: 76.8812, demand_kg: 65.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Technopark Campus, Kazhakkoottam, Trivandrum 695581' },
  { id: 'TRV-D02', customer_name: 'MG Road Central Retail District', lat: 8.4984, lng: 76.9484, demand_kg: 70.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'MG Rd, Palayam, Trivandrum, Kerala 695001' },
  { id: 'TRV-D03', customer_name: 'Chalai Wholesale Bazaar', lat: 8.4841, lng: 76.9512, demand_kg: 95.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Chalai Market, East Fort, Trivandrum 695036' },
  { id: 'TRV-D04', customer_name: 'Kowdiar Premium Commercial Spine', lat: 8.5241, lng: 76.9641, demand_kg: 45.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 15, address: 'Kowdiar Main Rd, Trivandrum 695003' },
  { id: 'TRV-D05', customer_name: 'Vizhinjam International Port Logistics Link', lat: 8.3784, lng: 76.9895, demand_kg: 90.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 25, address: 'Harbour Rd, Vizhinjam, Trivandrum 695521' },
  { id: 'TRV-D06', customer_name: 'Kazhakkoottam High-Tech Bypass Hub', lat: 8.5712, lng: 76.8712, demand_kg: 55.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'NH-66 Bypass, Kazhakkoottam, Trivandrum 695582' },
  { id: 'TRV-D07', customer_name: 'Pattom Healthcare & Business Square', lat: 8.5184, lng: 76.9421, demand_kg: 50.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 15, address: 'Pattom Palace Rd, Trivandrum 695004' },
  { id: 'TRV-D08', customer_name: 'Trivandrum International Airport Cargo', lat: 8.4821, lng: 76.9204, demand_kg: 40.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Airport Rd, Chacka, Trivandrum 695024' },
];

// ============================================================================
// 41. BHOPAL LOGISTICS CORRIDOR (Madhya Pradesh - Central)
// ============================================================================
export const BHO_DEPOT: Depot = {
  id: 'DEPOT-BHO',
  name: 'RouteQ Bhopal Central Hub (Govindpura Industrial Area)',
  lat: 23.2541,
  lng: 77.4584,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const BHO_VEHICLES: Vehicle[] = [
  { id: 'BHO-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-BHO', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'BHO-V02', name: 'Mahindra Bolero Maxi Truck', capacity_kg: 700.0, starting_depot_id: 'DEPOT-BHO', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 11.5, fuel_type: 'diesel' },
  { id: 'BHO-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-BHO', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const BHO_DELIVERIES: Delivery[] = [
  { id: 'BHO-D01', customer_name: 'MP Nagar Zone 1 Commercial Hub', lat: 23.2324, lng: 77.4341, demand_kg: 70.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Zone 1, MP Nagar, Bhopal, MP 462011' },
  { id: 'BHO-D02', customer_name: 'New Market TT Nagar Shopping District', lat: 23.2384, lng: 77.3984, demand_kg: 75.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 20, address: 'New Market, TT Nagar, Bhopal, MP 462003' },
  { id: 'BHO-D03', customer_name: 'Bairagarh Cloth Mandi', lat: 23.2784, lng: 77.3341, demand_kg: 90.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 25, address: 'Main Cloth Market, Bairagarh, Bhopal 462030' },
  { id: 'BHO-D04', customer_name: 'Mandideep Industrial Gateway Link', lat: 23.0854, lng: 77.5184, demand_kg: 95.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'NH-12, Mandideep Industrial Area, Bhopal 462046' },
  { id: 'BHO-D05', customer_name: 'Arera Colony Commercial Strip', lat: 23.2124, lng: 77.4241, demand_kg: 45.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 15, address: 'E-3, Arera Colony, Bhopal, MP 462016' },
  { id: 'BHO-D06', customer_name: 'Kolar Road Retail Spine', lat: 23.1814, lng: 77.4195, demand_kg: 50.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Kolar Main Rd, Bhopal, MP 462042' },
  { id: 'BHO-D07', customer_name: 'Habibganj Rani Kamlapati Station Logistics', lat: 23.2184, lng: 77.4412, demand_kg: 65.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'Rani Kamlapati Station Rd, Bhopal 462016' },
  { id: 'BHO-D08', customer_name: 'Raja Bhoj Airport Cargo Terminal', lat: 23.2874, lng: 77.3374, demand_kg: 40.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'Airport Rd, Gandhinagar, Bhopal 462036' },
];

// ============================================================================
// 42. VIJAYAWADA LOGISTICS CORRIDOR (Andhra Pradesh - Amaravati)
// ============================================================================
export const BZA_DEPOT: Depot = {
  id: 'DEPOT-BZA',
  name: 'RouteQ Vijayawada Central Hub (Auto Nagar Industrial Estate)',
  lat: 16.4954,
  lng: 80.6712,
  operating_hours_start: '08:00',
  operating_hours_end: '19:00',
};

export const BZA_VEHICLES: Vehicle[] = [
  { id: 'BZA-V01', name: 'Tata Ace EV Express', capacity_kg: 500.0, starting_depot_id: 'DEPOT-BZA', max_route_distance_km: 120.0, fuel_efficiency_km_per_l: 19.0, fuel_type: 'electric' },
  { id: 'BZA-V02', name: 'Ashok Leyland Bada Dost', capacity_kg: 750.0, starting_depot_id: 'DEPOT-BZA', max_route_distance_km: 150.0, fuel_efficiency_km_per_l: 10.5, fuel_type: 'diesel' },
  { id: 'BZA-V03', name: 'Euler HiLoad EV Delivery', capacity_kg: 480.0, starting_depot_id: 'DEPOT-BZA', max_route_distance_km: 110.0, fuel_efficiency_km_per_l: 18.0, fuel_type: 'electric' },
];

export const BZA_DELIVERIES: Delivery[] = [
  { id: 'BZA-D01', customer_name: 'Besant Road Retail & Fashion Market', lat: 16.5124, lng: 80.6284, demand_kg: 75.0, priority: 'urgent', time_window_start: '09:00', time_window_end: '11:30', service_time_mins: 20, address: 'Besant Rd, Governorpet, Vijayawada 520002' },
  { id: 'BZA-D02', customer_name: 'One Town Wholesale Commercial Mandi', lat: 16.5184, lng: 80.6112, demand_kg: 95.0, priority: 'urgent', time_window_start: '08:30', time_window_end: '11:00', service_time_mins: 25, address: 'Kaleswara Rao Market, One Town, Vijayawada 520001' },
  { id: 'BZA-D03', customer_name: 'Benz Circle Commercial Crossroads', lat: 16.4984, lng: 80.6512, demand_kg: 60.0, priority: 'high', time_window_start: '09:30', time_window_end: '12:00', service_time_mins: 20, address: 'MG Rd, Benz Circle, Vijayawada 520010' },
  { id: 'BZA-D04', customer_name: 'Gollapudi Wholesale Agricultural Market', lat: 16.5451, lng: 80.5784, demand_kg: 90.0, priority: 'high', time_window_start: '10:00', time_window_end: '12:30', service_time_mins: 25, address: 'NH-65, Gollapudi, Vijayawada 521225' },
  { id: 'BZA-D05', customer_name: 'Mangalagiri Amaravati Textile Corridor', lat: 16.4384, lng: 80.5641, demand_kg: 70.0, priority: 'medium', time_window_start: '10:30', time_window_end: '13:00', service_time_mins: 20, address: 'Old Trunk Rd, Mangalagiri, AP 522503' },
  { id: 'BZA-D06', customer_name: 'Bhavanipuram Freight Transport Node', lat: 16.5295, lng: 80.5984, demand_kg: 65.0, priority: 'medium', time_window_start: '11:00', time_window_end: '14:00', service_time_mins: 20, address: 'Bhavanipuram Main Rd, Vijayawada 520012' },
  { id: 'BZA-D07', customer_name: 'Enikepadu Logistics Industrial Zone', lat: 16.5142, lng: 80.7012, demand_kg: 80.0, priority: 'medium', time_window_start: '12:00', time_window_end: '15:30', service_time_mins: 20, address: 'NH-16, Enikepadu, Vijayawada 521108' },
  { id: 'BZA-D08', customer_name: 'Gannavaram Airport Cargo Gate', lat: 16.5284, lng: 80.7984, demand_kg: 50.0, priority: 'low', time_window_start: '13:00', time_window_end: '16:30', service_time_mins: 15, address: 'NH-16, Gannavaram, Vijayawada 521102' },
];

// ============================================================================
// Multi-Hub Indian Directory (All 28 States & Major Union Territories)
// ============================================================================
export interface IndiaHubInfo {
  id: string;
  name: string;
  city: string;
  state: string;
  district: string;
  depot: Depot;
  vehicles: Vehicle[];
  deliveries: Delivery[];
}

export const INDIA_HUBS: Record<string, IndiaHubInfo> = {
  bengaluru: {
    id: 'bengaluru',
    name: 'Bengaluru Logistics Corridor',
    city: 'Bengaluru',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    depot: BLR_DEPOT,
    vehicles: BLR_VEHICLES,
    deliveries: BLR_DELIVERIES,
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai MMR Logistics Corridor',
    city: 'Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    depot: BOM_DEPOT,
    vehicles: BOM_VEHICLES,
    deliveries: BOM_DELIVERIES,
  },
  delhi: {
    id: 'delhi',
    name: 'Delhi-NCR Logistics Corridor',
    city: 'Delhi-NCR',
    state: 'Delhi / NCT',
    district: 'New Delhi',
    depot: DEL_DEPOT,
    vehicles: DEL_VEHICLES,
    deliveries: DEL_DELIVERIES,
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad Logistics Corridor',
    city: 'Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    depot: HYD_DEPOT,
    vehicles: HYD_VEHICLES,
    deliveries: HYD_DELIVERIES,
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai Logistics Corridor',
    city: 'Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    depot: MAA_DEPOT,
    vehicles: MAA_VEHICLES,
    deliveries: MAA_DELIVERIES,
  },
  kolkata: {
    id: 'kolkata',
    name: 'Kolkata Eastern Logistics Gateway',
    city: 'Kolkata',
    state: 'West Bengal',
    district: 'Kolkata',
    depot: CCU_DEPOT,
    vehicles: CCU_VEHICLES,
    deliveries: CCU_DELIVERIES,
  },
  pune: {
    id: 'pune',
    name: 'Pune Auto & IT Logistics Corridor',
    city: 'Pune',
    state: 'Maharashtra',
    district: 'Pune',
    depot: PNQ_DEPOT,
    vehicles: PNQ_VEHICLES,
    deliveries: PNQ_DELIVERIES,
  },
  ahmedabad: {
    id: 'ahmedabad',
    name: 'Ahmedabad Industrial Corridor',
    city: 'Ahmedabad',
    state: 'Gujarat',
    district: 'Ahmedabad',
    depot: AMD_DEPOT,
    vehicles: AMD_VEHICLES,
    deliveries: AMD_DELIVERIES,
  },
  jaipur: {
    id: 'jaipur',
    name: 'Jaipur Northern Trade Corridor',
    city: 'Jaipur',
    state: 'Rajasthan',
    district: 'Jaipur',
    depot: JAI_DEPOT,
    vehicles: JAI_VEHICLES,
    deliveries: JAI_DELIVERIES,
  },
  kochi: {
    id: 'kochi',
    name: 'Kochi Maritime Logistics Gateway',
    city: 'Kochi',
    state: 'Kerala',
    district: 'Ernakulam',
    depot: COK_DEPOT,
    vehicles: COK_VEHICLES,
    deliveries: COK_DELIVERIES,
  },
  lucknow: {
    id: 'lucknow',
    name: 'Lucknow Central Gangetic Corridor',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    depot: LKO_DEPOT,
    vehicles: LKO_VEHICLES,
    deliveries: LKO_DELIVERIES,
  },
  chandigarh: {
    id: 'chandigarh',
    name: 'Chandigarh Tri-City Corridor',
    city: 'Chandigarh',
    state: 'Punjab / Haryana / UT',
    district: 'Chandigarh',
    depot: IXC_DEPOT,
    vehicles: IXC_VEHICLES,
    deliveries: IXC_DELIVERIES,
  },
  indore: {
    id: 'indore',
    name: 'Indore Commercial Hub Corridor',
    city: 'Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
    depot: IDR_DEPOT,
    vehicles: IDR_VEHICLES,
    deliveries: IDR_DELIVERIES,
  },
  surat: {
    id: 'surat',
    name: 'Surat Textile & Diamond Corridor',
    city: 'Surat',
    state: 'Gujarat',
    district: 'Surat',
    depot: STV_DEPOT,
    vehicles: STV_VEHICLES,
    deliveries: STV_DELIVERIES,
  },
  visakhapatnam: {
    id: 'visakhapatnam',
    name: 'Visakhapatnam Seaport Corridor',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    depot: VTZ_DEPOT,
    vehicles: VTZ_VEHICLES,
    deliveries: VTZ_DELIVERIES,
  },
  nagpur: {
    id: 'nagpur',
    name: 'Nagpur Zero-Mile Multimodal Hub',
    city: 'Nagpur',
    state: 'Maharashtra',
    district: 'Nagpur',
    depot: NAG_DEPOT,
    vehicles: NAG_VEHICLES,
    deliveries: NAG_DELIVERIES,
  },
  coimbatore: {
    id: 'coimbatore',
    name: 'Coimbatore Industrial Corridor',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    depot: CJB_DEPOT,
    vehicles: CJB_VEHICLES,
    deliveries: CJB_DELIVERIES,
  },
  bhubaneswar: {
    id: 'bhubaneswar',
    name: 'Bhubaneswar Smart City Corridor',
    city: 'Bhubaneswar',
    state: 'Odisha',
    district: 'Khordha',
    depot: BBI_DEPOT,
    vehicles: BBI_VEHICLES,
    deliveries: BBI_DELIVERIES,
  },
  guwahati: {
    id: 'guwahati',
    name: 'Guwahati Northeast Gateway Hub',
    city: 'Guwahati',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    depot: GAU_DEPOT,
    vehicles: GAU_VEHICLES,
    deliveries: GAU_DELIVERIES,
  },
  patna: {
    id: 'patna',
    name: 'Patna Gangetic Logistics Hub',
    city: 'Patna',
    state: 'Bihar',
    district: 'Patna',
    depot: PAT_DEPOT,
    vehicles: PAT_VEHICLES,
    deliveries: PAT_DELIVERIES,
  },
  ranchi: {
    id: 'ranchi',
    name: 'Ranchi Mineral Plateau Corridor',
    city: 'Ranchi',
    state: 'Jharkhand',
    district: 'Ranchi',
    depot: IXR_DEPOT,
    vehicles: IXR_VEHICLES,
    deliveries: IXR_DELIVERIES,
  },
  raipur: {
    id: 'raipur',
    name: 'Raipur Central Chhattisgarh Corridor',
    city: 'Raipur',
    state: 'Chhattisgarh',
    district: 'Raipur',
    depot: RPR_DEPOT,
    vehicles: RPR_VEHICLES,
    deliveries: RPR_DELIVERIES,
  },
  dehradun: {
    id: 'dehradun',
    name: 'Dehradun Garhwal Foothills Corridor',
    city: 'Dehradun',
    state: 'Uttarakhand',
    district: 'Dehradun',
    depot: DED_DEPOT,
    vehicles: DED_VEHICLES,
    deliveries: DED_DELIVERIES,
  },
  shimla: {
    id: 'shimla',
    name: 'Shimla & Baddi Himachal Industrial Corridor',
    city: 'Shimla / Baddi',
    state: 'Himachal Pradesh',
    district: 'Solan / Shimla',
    depot: BDI_DEPOT,
    vehicles: BDI_VEHICLES,
    deliveries: BDI_DELIVERIES,
  },
  goa: {
    id: 'goa',
    name: 'Goa Coastal Maritime & Industrial Corridor',
    city: 'Goa (Panaji / Verna)',
    state: 'Goa',
    district: 'North Goa',
    depot: GOI_DEPOT,
    vehicles: GOI_VEHICLES,
    deliveries: GOI_DELIVERIES,
  },
  srinagar: {
    id: 'srinagar',
    name: 'Srinagar Kashmir Valley Corridor',
    city: 'Srinagar',
    state: 'Jammu & Kashmir (UT)',
    district: 'Srinagar',
    depot: SXR_DEPOT,
    vehicles: SXR_VEHICLES,
    deliveries: SXR_DELIVERIES,
  },
  ludhiana: {
    id: 'ludhiana',
    name: 'Ludhiana GT Road Industrial Corridor',
    city: 'Ludhiana',
    state: 'Punjab',
    district: 'Ludhiana',
    depot: LUH_DEPOT,
    vehicles: LUH_VEHICLES,
    deliveries: LUH_DELIVERIES,
  },
  gurugram: {
    id: 'gurugram',
    name: 'Gurugram Millennium Cyber Corridor',
    city: 'Gurugram',
    state: 'Haryana',
    district: 'Gurugram',
    depot: GUR_DEPOT,
    vehicles: GUR_VEHICLES,
    deliveries: GUR_DELIVERIES,
  },
  agartala: {
    id: 'agartala',
    name: 'Agartala Border Trade & Transit Corridor',
    city: 'Agartala',
    state: 'Tripura',
    district: 'West Tripura',
    depot: IXA_DEPOT,
    vehicles: IXA_VEHICLES,
    deliveries: IXA_DELIVERIES,
  },
  shillong: {
    id: 'shillong',
    name: 'Shillong Khasi Hills Corridor',
    city: 'Shillong',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    depot: SHL_DEPOT,
    vehicles: SHL_VEHICLES,
    deliveries: SHL_DELIVERIES,
  },
  imphal: {
    id: 'imphal',
    name: 'Imphal Valley Trade Corridor',
    city: 'Imphal',
    state: 'Manipur',
    district: 'Imphal West',
    depot: IMF_DEPOT,
    vehicles: IMF_VEHICLES,
    deliveries: IMF_DELIVERIES,
  },
  dimapur: {
    id: 'dimapur',
    name: 'Dimapur Gateway Commercial Corridor',
    city: 'Dimapur',
    state: 'Nagaland',
    district: 'Dimapur',
    depot: DMU_DEPOT,
    vehicles: DMU_VEHICLES,
    deliveries: DMU_DELIVERIES,
  },
  aizawl: {
    id: 'aizawl',
    name: 'Aizawl Hill Ridge Commercial Corridor',
    city: 'Aizawl',
    state: 'Mizoram',
    district: 'Aizawl',
    depot: AJL_DEPOT,
    vehicles: AJL_VEHICLES,
    deliveries: AJL_DELIVERIES,
  },
  itanagar: {
    id: 'itanagar',
    name: 'Itanagar Eastern Foothills Corridor',
    city: 'Itanagar',
    state: 'Arunachal Pradesh',
    district: 'Papum Pare',
    depot: IXT_DEPOT,
    vehicles: IXT_VEHICLES,
    deliveries: IXT_DELIVERIES,
  },
  gangtok: {
    id: 'gangtok',
    name: 'Gangtok Himalayan Gateway Corridor',
    city: 'Gangtok',
    state: 'Sikkim',
    district: 'Gangtok',
    depot: SKM_DEPOT,
    vehicles: SKM_VEHICLES,
    deliveries: SKM_DELIVERIES,
  },
  puducherry: {
    id: 'puducherry',
    name: 'Puducherry Coastal Trade Corridor',
    city: 'Puducherry',
    state: 'Puducherry (UT)',
    district: 'Puducherry',
    depot: PNY_DEPOT,
    vehicles: PNY_VEHICLES,
    deliveries: PNY_DELIVERIES,
  },
  leh: {
    id: 'leh',
    name: 'Leh High Altitude Trans-Himalayan Corridor',
    city: 'Leh',
    state: 'Ladakh (UT)',
    district: 'Leh',
    depot: IXL_DEPOT,
    vehicles: IXL_VEHICLES,
    deliveries: IXL_DELIVERIES,
  },
  portblair: {
    id: 'portblair',
    name: 'Port Blair Bay Islands Maritime Hub',
    city: 'Port Blair',
    state: 'Andaman & Nicobar Islands (UT)',
    district: 'South Andaman',
    depot: IXZ_DEPOT,
    vehicles: IXZ_VEHICLES,
    deliveries: IXZ_DELIVERIES,
  },
  varanasi: {
    id: 'varanasi',
    name: 'Varanasi Eastern Gangetic Cultural & Trade Hub',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    depot: VNS_DEPOT,
    vehicles: VNS_VEHICLES,
    deliveries: VNS_DELIVERIES,
  },
  thiruvananthapuram: {
    id: 'thiruvananthapuram',
    name: 'Thiruvananthapuram South Coastal Tech & Port Hub',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    depot: TRV_DEPOT,
    vehicles: TRV_VEHICLES,
    deliveries: TRV_DELIVERIES,
  },
  bhopal: {
    id: 'bhopal',
    name: 'Bhopal Central Heart Logistics Hub',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    depot: BHO_DEPOT,
    vehicles: BHO_VEHICLES,
    deliveries: BHO_DELIVERIES,
  },
  vijayawada: {
    id: 'vijayawada',
    name: 'Vijayawada Amaravati Capital Logistics Corridor',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    district: 'NTR',
    depot: BZA_DEPOT,
    vehicles: BZA_VEHICLES,
    deliveries: BZA_DELIVERIES,
  },
};

// Default export compatibility (Bengaluru Primary)
export const DEMO_DEPOT: Depot = BLR_DEPOT;
export const DEMO_VEHICLES: Vehicle[] = BLR_VEHICLES;
export const DEMO_DELIVERIES: Delivery[] = BLR_DELIVERIES;
