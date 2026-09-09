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
// Multi-Hub Indian Directory
// ============================================================================
export interface IndiaHubInfo {
  id: string;
  name: string;
  city: string;
  state: string;
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
    depot: BLR_DEPOT,
    vehicles: BLR_VEHICLES,
    deliveries: BLR_DELIVERIES,
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai MMR Logistics Corridor',
    city: 'Mumbai',
    state: 'Maharashtra',
    depot: BOM_DEPOT,
    vehicles: BOM_VEHICLES,
    deliveries: BOM_DELIVERIES,
  },
  delhi: {
    id: 'delhi',
    name: 'Delhi-NCR Logistics Corridor',
    city: 'Delhi-NCR',
    state: 'Delhi / Haryana',
    depot: DEL_DEPOT,
    vehicles: DEL_VEHICLES,
    deliveries: DEL_DELIVERIES,
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad Logistics Corridor',
    city: 'Hyderabad',
    state: 'Telangana',
    depot: HYD_DEPOT,
    vehicles: HYD_VEHICLES,
    deliveries: HYD_DELIVERIES,
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai Logistics Corridor',
    city: 'Chennai',
    state: 'Tamil Nadu',
    depot: MAA_DEPOT,
    vehicles: MAA_VEHICLES,
    deliveries: MAA_DELIVERIES,
  },
};

// Default export compatibility (Bengaluru Primary)
export const DEMO_DEPOT: Depot = BLR_DEPOT;
export const DEMO_VEHICLES: Vehicle[] = BLR_VEHICLES;
export const DEMO_DELIVERIES: Delivery[] = BLR_DELIVERIES;

