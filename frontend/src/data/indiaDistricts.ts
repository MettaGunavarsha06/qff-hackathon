/**
 * Complete Administrative Districts of India (All 28 States & 8 Union Territories)
 * Total: 780+ official administrative districts.
 */

import type { Depot, Vehicle, Delivery, Priority, IndiaHubInfo } from '../types';
import { INDIA_HUBS } from './demoData';

export const INDIA_STATES_AND_DISTRICTS: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Alluri Sitharama Raju',
    'Anakapalli',
    'Ananthapuramu',
    'Annamayya',
    'Bapatla',
    'Chittoor',
    'Dr. B.R. Ambedkar Konaseema',
    'East Godavari',
    'Eluru',
    'Guntur',
    'Kakinada',
    'Krishna',
    'Kurnool',
    'Nandyal',
    'NTR',
    'Palnadu',
    'Parvathipuram Manyam',
    'Prakasam',
    'Sri Potti Sriramulu Nellore',
    'Sri Sathya Sai',
    'Srikakulam',
    'Tirupati',
    'Visakhapatnam',
    'Vizianagaram',
    'West Godavari',
    'YSR (Kadapa)',
  ],
  'Arunachal Pradesh': [
    'Anjaw',
    'Changlang',
    'Dibang Valley',
    'East Kameng',
    'East Siang',
    'Kamle',
    'Keyi Panyor',
    'Kra Daadi',
    'Kurung Kumey',
    'Lepa Rada',
    'Lohit',
    'Longding',
    'Lower Dibang Valley',
    'Lower Siang',
    'Lower Subansiri',
    'Namsai',
    'Pakke Kessang',
    'Papum Pare',
    'Shi Yomi',
    'Siang',
    'Tawang',
    'Tirap',
    'Upper Siang',
    'Upper Subansiri',
    'West Kameng',
    'West Siang',
  ],
  'Assam': [
    'Baksa',
    'Barpeta',
    'Biswanath',
    'Bongaigaon',
    'Cachar',
    'Charaideo',
    'Chirang',
    'Darrang',
    'Dhemaji',
    'Dhubri',
    'Dibrugarh',
    'Dima Hasao',
    'Goalpara',
    'Golaghat',
    'Hailakandi',
    'Hojai',
    'Jorhat',
    'Kamrup',
    'Kamrup Metropolitan',
    'Karbi Anglong',
    'Karimganj',
    'Kokrajhar',
    'Lakhimpur',
    'Majuli',
    'Morigaon',
    'Nagaon',
    'Nalbari',
    'Sivasagar',
    'Sonitpur',
    'South Salmara-Mankachar',
    'Tamulpur',
    'Tinsukia',
    'Udalguri',
    'West Karbi Anglong',
  ],
  'Bihar': [
    'Araria',
    'Arwal',
    'Aurangabad',
    'Banka',
    'Begusarai',
    'Bhagalpur',
    'Bhojpur',
    'Buxar',
    'Darbhanga',
    'East Champaran',
    'Gaya',
    'Gopalganj',
    'Jamui',
    'Jehanabad',
    'Kaimur',
    'Katihar',
    'Khagaria',
    'Kishanganj',
    'Lakhisarai',
    'Madhepura',
    'Madhubani',
    'Munger',
    'Muzaffarpur',
    'Nalanda',
    'Nawada',
    'Patna',
    'Purnia',
    'Rohtas',
    'Saharsa',
    'Samastipur',
    'Saran',
    'Sheikhpura',
    'Sheohar',
    'Sitamarhi',
    'Siwan',
    'Supaul',
    'Vaishali',
    'West Champaran',
  ],
  'Chhattisgarh': [
    'Balod',
    'Baloda Bazar-Bhatapara',
    'Balrampur-Ramanujganj',
    'Bastar',
    'Bemetara',
    'Bijapur',
    'Bilaspur',
    'Dantewada',
    'Dhamtari',
    'Durg',
    'Gariaband',
    'Gaurela-Pendra-Marwahi',
    'Janjgir-Champa',
    'Jashpur',
    'Kabirdham',
    'Kanker',
    'Khairagarh-Chhuikhadan-Gandai',
    'Kondagaon',
    'Korba',
    'Koriya',
    'Mahasamund',
    'Manendragarh-Chirmiri-Bharatpur',
    'Mohla-Manpur-Ambagarh Chowki',
    'Mungeli',
    'Narayanpur',
    'Raigarh',
    'Raipur',
    'Rajnandgaon',
    'Sakti',
    'Sarangarh-Bilaigarh',
    'Sukma',
    'Surajpur',
    'Surguja',
  ],
  'Goa': [
    'North Goa',
    'South Goa',
  ],
  'Gujarat': [
    'Ahmedabad',
    'Amreli',
    'Anand',
    'Aravalli',
    'Banaskantha',
    'Bharuch',
    'Bhavnagar',
    'Botad',
    'Chhota Udaipur',
    'Dahod',
    'Dang',
    'Devbhumi Dwarka',
    'Gandhinagar',
    'Gir Somnath',
    'Jamnagar',
    'Junagadh',
    'Kheda',
    'Kutch',
    'Mahisagar',
    'Mehsana',
    'Morbi',
    'Narmada',
    'Navsari',
    'Panchmahal',
    'Patan',
    'Porbandar',
    'Rajkot',
    'Sabarkantha',
    'Surat',
    'Surendranagar',
    'Tapi',
    'Vadodara',
    'Valsad',
  ],
  'Haryana': [
    'Ambala',
    'Bhiwani',
    'Charkhi Dadri',
    'Faridabad',
    'Fatehabad',
    'Gurugram',
    'Hisar',
    'Jhajjar',
    'Jind',
    'Kaithal',
    'Karnal',
    'Kurukshetra',
    'Mahendragarh',
    'Nuh',
    'Palwal',
    'Panchkula',
    'Panipat',
    'Rewari',
    'Rohtak',
    'Sirsa',
    'Sonipat',
    'Yamunanagar',
  ],
  'Himachal Pradesh': [
    'Bilaspur',
    'Chamba',
    'Hamirpur',
    'Kangra',
    'Kinnaur',
    'Kullu',
    'Lahaul and Spiti',
    'Mandi',
    'Shimla',
    'Sirmaur',
    'Solan',
    'Una',
  ],
  'Jharkhand': [
    'Bokaro',
    'Chatra',
    'Deoghar',
    'Dhanbad',
    'Dumka',
    'East Singhbhum',
    'Garhwa',
    'Giridih',
    'Godda',
    'Gumla',
    'Hazaribagh',
    'Jamtara',
    'Khunti',
    'Koderma',
    'Latehar',
    'Lohardaga',
    'Pakur',
    'Palamu',
    'Ramgarh',
    'Ranchi',
    'Sahibganj',
    'Seraikela Kharsawan',
    'Simdega',
    'West Singhbhum',
  ],
  'Karnataka': [
    'Bagalkot',
    'Ballari',
    'Belagavi',
    'Bengaluru Rural',
    'Bengaluru Urban',
    'Bidar',
    'Chamarajanagar',
    'Chikkaballapur',
    'Chikkamagaluru',
    'Chitradurga',
    'Dakshina Kannada',
    'Davanagere',
    'Dharwad',
    'Gadag',
    'Hassan',
    'Haveri',
    'Kalaburagi',
    'Kodagu',
    'Kolar',
    'Koppal',
    'Mandya',
    'Mysuru',
    'Raichur',
    'Ramanagara',
    'Shivamogga',
    'Tumakuru',
    'Udupi',
    'Uttara Kannada',
    'Vijayanagara',
    'Vijayapura',
    'Yadgir',
  ],
  'Kerala': [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad',
  ],
  'Madhya Pradesh': [
    'Agar Malwa',
    'Alirajpur',
    'Anuppur',
    'Ashoknagar',
    'Balaghat',
    'Barwani',
    'Betul',
    'Bhind',
    'Bhopal',
    'Burhanpur',
    'Chhatarpur',
    'Chhindwara',
    'Damoh',
    'Datia',
    'Dewas',
    'Dhar',
    'Dindori',
    'Guna',
    'Gwalior',
    'Harda',
    'Indore',
    'Jabalpur',
    'Jhabua',
    'Katni',
    'Khandwa',
    'Khargone',
    'Maihar',
    'Mandla',
    'Mandsaur',
    'Mauganj',
    'Morena',
    'Narmadapuram',
    'Narsinghpur',
    'Neemuch',
    'Pandhurna',
    'Panna',
    'Raisen',
    'Rajgarh',
    'Ratlam',
    'Rewa',
    'Sagar',
    'Satna',
    'Sehore',
    'Seoni',
    'Shahdol',
    'Shajapur',
    'Sheopur',
    'Shivpuri',
    'Sidhi',
    'Singrauli',
    'Tikamgarh',
    'Ujjain',
    'Umaria',
    'Vidisha',
  ],
  'Maharashtra': [
    'Ahilyanagar (Ahmednagar)',
    'Akola',
    'Amravati',
    'Beed',
    'Bhandara',
    'Buldhana',
    'Chandrapur',
    'Chhatrapati Sambhaji Nagar',
    'Dharashiv',
    'Dhule',
    'Gadchiroli',
    'Gondia',
    'Hingoli',
    'Jalgaon',
    'Jalna',
    'Kolhapur',
    'Latur',
    'Mumbai City',
    'Mumbai Suburban',
    'Nagpur',
    'Nanded',
    'Nandurbar',
    'Nashik',
    'Palghar',
    'Parbhani',
    'Pune',
    'Raigad',
    'Ratnagiri',
    'Sangli',
    'Satara',
    'Sindhudurg',
    'Solapur',
    'Thane',
    'Wardha',
    'Washim',
    'Yavatmal',
  ],
  'Manipur': [
    'Bishnupur',
    'Chandel',
    'Churachandpur',
    'Imphal East',
    'Imphal West',
    'Jiribam',
    'Kakching',
    'Kamjong',
    'Kangpokpi',
    'Noney',
    'Pherzawl',
    'Senapati',
    'Tamenglong',
    'Tengnoupal',
    'Thoubal',
    'Ukhrul',
  ],
  'Meghalaya': [
    'East Garo Hills',
    'East Jaintia Hills',
    'East Khasi Hills',
    'Eastern West Khasi Hills',
    'North Garo Hills',
    'Ri Bhoi',
    'South Garo Hills',
    'South West Garo Hills',
    'South West Khasi Hills',
    'West Garo Hills',
    'West Jaintia Hills',
    'West Khasi Hills',
  ],
  'Mizoram': [
    'Aizawl',
    'Champhai',
    'Hnahthial',
    'Khawzawl',
    'Kolasib',
    'Lawngtlai',
    'Lunglei',
    'Mamit',
    'Saiha',
    'Saitual',
    'Serchhip',
  ],
  'Nagaland': [
    'Chümoukedima',
    'Dimapur',
    'Kiphire',
    'Kohima',
    'Longleng',
    'Mokokchung',
    'Mon',
    'Niuland',
    'Noklak',
    'Peren',
    'Phek',
    'Shamator',
    'Tseminyü',
    'Tuensang',
    'Wokha',
    'Zünheboto',
  ],
  'Odisha': [
    'Angul',
    'Balangir',
    'Balasore',
    'Bargarh',
    'Bhadrak',
    'Boudh',
    'Cuttack',
    'Deogarh',
    'Dhenkanal',
    'Gajapati',
    'Ganjam',
    'Jagatsinghpur',
    'Jajpur',
    'Jharsuguda',
    'Kalahandi',
    'Kandhamal',
    'Kendrapara',
    'Kendujhar',
    'Khordha',
    'Koraput',
    'Malkangiri',
    'Mayurbhanj',
    'Nabarangpur',
    'Nayagarh',
    'Nuapada',
    'Puri',
    'Rayagada',
    'Sambalpur',
    'Subarnapur',
    'Sundargarh',
  ],
  'Punjab': [
    'Amritsar',
    'Barnala',
    'Bathinda',
    'Faridkot',
    'Fatehgarh Sahib',
    'Fazilka',
    'Ferozepur',
    'Gurdaspur',
    'Hoshiarpur',
    'Jalandhar',
    'Kapurthala',
    'Ludhiana',
    'Malerkotla',
    'Mansa',
    'Moga',
    'Muktsar',
    'Pathankot',
    'Patiala',
    'Rupnagar',
    'Sahibzada Ajit Singh Nagar (Mohali)',
    'Shaheed Bhagat Singh Nagar',
    'Sri Muktsar Sahib',
    'Tarn Taran',
  ],
  'Rajasthan': [
    'Ajmer',
    'Alwar',
    'Anupgarh',
    'Balotra',
    'Banswara',
    'Baran',
    'Barmer',
    'Beawar',
    'Bharatpur',
    'Bhilwara',
    'Bikaner',
    'Bundi',
    'Chittorgarh',
    'Churu',
    'Dausa',
    'Deeg',
    'Dholpur',
    'Didwana-Kuchaman',
    'Dudu',
    'Dungarpur',
    'Gangapur City',
    'Hanumangarh',
    'Jaipur',
    'Jaipur Rural',
    'Jaisalmer',
    'Jalore',
    'Jhalawar',
    'Jhunjhunu',
    'Jodhpur',
    'Jodhpur Rural',
    'Karauli',
    'Kekri',
    'Khairthal-Tijara',
    'Kota',
    'Kotputli-Behror',
    'Nagaur',
    'Neem Ka Thana',
    'Pali',
    'Phalodi',
    'Pratapgarh',
    'Rajsamand',
    'Salumbar',
    'Sanchore',
    'Sawai Madhopur',
    'Shahpura',
    'Sikar',
    'Sirohi',
    'Sri Ganganagar',
    'Tonk',
    'Udaipur',
  ],
  'Sikkim': [
    'Gangtok',
    'Gyalshing',
    'Mangan',
    'Namchi',
    'Pakyong',
    'Soreng',
  ],
  'Tamil Nadu': [
    'Ariyalur',
    'Chengalpattu',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Mayiladuthurai',
    'Nagapattinam',
    'Namakkal',
    'Nilgiris',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Ranipet',
    'Salem',
    'Sivaganga',
    'Tenkasi',
    'Thanjavur',
    'Theni',
    'Thoothukudi',
    'Tiruchirappalli',
    'Tirunelveli',
    'Tirupathur',
    'Tiruppur',
    'Tiruvallur',
    'Tiruvannamalai',
    'Tiruvarur',
    'Vellore',
    'Viluppuram',
    'Virudhunagar',
  ],
  'Telangana': [
    'Adilabad',
    'Bhadradri Kothagudem',
    'Hanamkonda',
    'Hyderabad',
    'Jagtial',
    'Jangaon',
    'Jayashankar Bhupalpally',
    'Jogulamba Gadwal',
    'Kamareddy',
    'Karimnagar',
    'Khammam',
    'Kumuram Bheem Asifabad',
    'Mahabubabad',
    'Mahabubnagar',
    'Mancherial',
    'Medak',
    'Medchal-Malkajgiri',
    'Mulugu',
    'Nagarkurnool',
    'Nalgonda',
    'Narayanpet',
    'Nirmal',
    'Nizamabad',
    'Peddapalli',
    'Rajanna Sircilla',
    'Ranga Reddy',
    'Sangareddy',
    'Siddipet',
    'Suryapet',
    'Vikarabad',
    'Wanaparthy',
    'Warangal',
    'Yadadri Bhuvanagiri',
  ],
  'Tripura': [
    'Dhalai',
    'Gomati',
    'Khowai',
    'North Tripura',
    'Sepahijala',
    'South Tripura',
    'Unakoti',
    'West Tripura',
  ],
  'Uttar Pradesh': [
    'Agra',
    'Aligarh',
    'Ambedkar Nagar',
    'Amethi',
    'Amroha',
    'Auraiya',
    'Ayodhya',
    'Azamgarh',
    'Baghpat',
    'Bahraich',
    'Ballia',
    'Balrampur',
    'Banda',
    'Barabanki',
    'Bareilly',
    'Basti',
    'Bhadohi',
    'Bijnor',
    'Budaun',
    'Bulandshahr',
    'Chandauli',
    'Chitrakoot',
    'Deoria',
    'Etah',
    'Etawah',
    'Farrukhabad',
    'Fatehpur',
    'Firozabad',
    'Gautam Buddha Nagar (Noida)',
    'Ghaziabad',
    'Ghazipur',
    'Gonda',
    'Gorakhpur',
    'Hamirpur',
    'Hapur',
    'Hardoi',
    'Hathras',
    'Jalaun',
    'Jaunpur',
    'Jhansi',
    'Kannauj',
    'Kanpur Dehat',
    'Kanpur Nagar',
    'Kasganj',
    'Kaushambi',
    'Kheri',
    'Kushinagar',
    'Lalitpur',
    'Lucknow',
    'Maharajganj',
    'Mahoba',
    'Mainpuri',
    'Mathura',
    'Mau',
    'Meerut',
    'Mirzapur',
    'Moradabad',
    'Muzaffarnagar',
    'Pilibhit',
    'Pratapgarh',
    'Prayagraj',
    'Raebareli',
    'Rampur',
    'Saharanpur',
    'Sambhal',
    'Sant Kabir Nagar',
    'Shahjahanpur',
    'Shamli',
    'Shravasti',
    'Siddharthnagar',
    'Sitapur',
    'Sonbhadra',
    'Sultanpur',
    'Unnao',
    'Varanasi',
  ],
  'Uttarakhand': [
    'Almora',
    'Bageshwar',
    'Chamoli',
    'Champawat',
    'Dehradun',
    'Haridwar',
    'Nainital',
    'Pauri Garhwal',
    'Pithoragarh',
    'Rudraprayag',
    'Tehri Garhwal',
    'Udham Singh Nagar',
    'Uttarkashi',
  ],
  'West Bengal': [
    'Alipurduar',
    'Bankura',
    'Birbhum',
    'Cooch Behar',
    'Dakshin Dinajpur',
    'Darjeeling',
    'Hooghly',
    'Howrah',
    'Jalpaiguri',
    'Jhargram',
    'Kalimpong',
    'Kolkata',
    'Malda',
    'Murshidabad',
    'Nadia',
    'North 24 Parganas',
    'Paschim Bardhaman',
    'Paschim Medinipur',
    'Purba Bardhaman',
    'Purba Medinipur',
    'Purulia',
    'South 24 Parganas',
    'Uttar Dinajpur',
  ],

  // ─── 8 Union Territories ───
  'Andaman and Nicobar Islands': [
    'Nicobar',
    'North and Middle Andaman',
    'South Andaman',
  ],
  'Chandigarh': [
    'Chandigarh',
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Dadra and Nagar Haveli',
    'Daman',
    'Diu',
  ],
  'Delhi': [
    'Central Delhi',
    'East Delhi',
    'New Delhi',
    'North Delhi',
    'North East Delhi',
    'North West Delhi',
    'Shahdara',
    'South Delhi',
    'South East Delhi',
    'South West Delhi',
    'West Delhi',
  ],
  'Jammu and Kashmir': [
    'Anantnag',
    'Bandipora',
    'Baramulla',
    'Budgam',
    'Doda',
    'Ganderbal',
    'Jammu',
    'Kathua',
    'Kishtwar',
    'Kulgam',
    'Kupwara',
    'Poonch',
    'Pulwama',
    'Rajouri',
    'Ramban',
    'Reasi',
    'Samba',
    'Shopian',
    'Srinagar',
    'Udhampur',
  ],
  'Ladakh': [
    'Kargil',
    'Leh',
  ],
  'Lakshadweep': [
    'Lakshadweep',
  ],
  'Puducherry': [
    'Karaikal',
    'Mahe',
    'Puducherry',
    'Yanam',
  ],
};

/**
 * Returns sorted list of all 28 states + 8 Union Territories
 */
export const getAllStates = (): string[] => {
  return Object.keys(INDIA_STATES_AND_DISTRICTS).sort((a, b) => a.localeCompare(b));
};

/**
 * Returns all districts belonging to the given state or union territory.
 */
export const getDistrictsForState = (state: string): string[] => {
  if (!state) return [];
  const direct = INDIA_STATES_AND_DISTRICTS[state];
  if (direct) return direct;

  // Case-insensitive fallback
  const foundKey = Object.keys(INDIA_STATES_AND_DISTRICTS).find(
    (k) => k.toLowerCase() === state.toLowerCase() || state.toLowerCase().includes(k.toLowerCase())
  );
  return foundKey ? INDIA_STATES_AND_DISTRICTS[foundKey] : [];
};

/**
 * Total district count across all of India
 */
export const getTotalDistrictCount = (): number => {
  return Object.values(INDIA_STATES_AND_DISTRICTS).reduce((acc, curr) => acc + curr.length, 0);
};

/**
 * Search across all states and districts by a query term.
 */
export const searchDistricts = (
  query: string
): Array<{ state: string; district: string }> => {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{ state: string; district: string }> = [];
  for (const [state, districts] of Object.entries(INDIA_STATES_AND_DISTRICTS)) {
    for (const district of districts) {
      if (district.toLowerCase().includes(q) || state.toLowerCase().includes(q)) {
        results.push({ state, district });
      }
    }
  }
  return results;
};

// ============================================================================
// Comprehensive State Metadata (All 36 States & Union Territories of India)
// ============================================================================
export interface StateMetadata {
  name: string;
  lat: number;
  lng: number;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  capital: string;
  postalZone: number;
  rtoCode: string;
  radiusKm: number;
}

export const STATE_METADATA: Record<string, StateMetadata> = {
  'Andhra Pradesh': { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400, region: 'South', capital: 'Amaravati', postalZone: 5, rtoCode: 'AP', radiusKm: 160 },
  'Arunachal Pradesh': { name: 'Arunachal Pradesh', lat: 28.2180, lng: 94.7278, region: 'Northeast', capital: 'Itanagar', postalZone: 7, rtoCode: 'AR', radiusKm: 150 },
  'Assam': { name: 'Assam', lat: 26.2006, lng: 92.9376, region: 'Northeast', capital: 'Dispur', postalZone: 7, rtoCode: 'AS', radiusKm: 140 },
  'Bihar': { name: 'Bihar', lat: 25.0961, lng: 85.3131, region: 'East', capital: 'Patna', postalZone: 8, rtoCode: 'BR', radiusKm: 120 },
  'Chhattisgarh': { name: 'Chhattisgarh', lat: 21.2787, lng: 81.8661, region: 'Central', capital: 'Raipur', postalZone: 4, rtoCode: 'CG', radiusKm: 170 },
  'Goa': { name: 'Goa', lat: 15.2993, lng: 74.1240, region: 'West', capital: 'Panaji', postalZone: 4, rtoCode: 'GA', radiusKm: 45 },
  'Gujarat': { name: 'Gujarat', lat: 22.2587, lng: 71.1924, region: 'West', capital: 'Gandhinagar', postalZone: 3, rtoCode: 'GJ', radiusKm: 180 },
  'Haryana': { name: 'Haryana', lat: 29.0588, lng: 76.0856, region: 'North', capital: 'Chandigarh', postalZone: 1, rtoCode: 'HR', radiusKm: 110 },
  'Himachal Pradesh': { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, region: 'North', capital: 'Shimla', postalZone: 1, rtoCode: 'HP', radiusKm: 100 },
  'Jharkhand': { name: 'Jharkhand', lat: 23.6102, lng: 85.2799, region: 'East', capital: 'Ranchi', postalZone: 8, rtoCode: 'JH', radiusKm: 130 },
  'Karnataka': { name: 'Karnataka', lat: 15.3173, lng: 75.7139, region: 'South', capital: 'Bengaluru', postalZone: 5, rtoCode: 'KA', radiusKm: 180 },
  'Kerala': { name: 'Kerala', lat: 10.8505, lng: 76.2711, region: 'South', capital: 'Thiruvananthapuram', postalZone: 6, rtoCode: 'KL', radiusKm: 150 },
  'Madhya Pradesh': { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569, region: 'Central', capital: 'Bhopal', postalZone: 4, rtoCode: 'MP', radiusKm: 220 },
  'Maharashtra': { name: 'Maharashtra', lat: 19.7515, lng: 75.7139, region: 'West', capital: 'Mumbai', postalZone: 4, rtoCode: 'MH', radiusKm: 220 },
  'Manipur': { name: 'Manipur', lat: 24.6637, lng: 93.9063, region: 'Northeast', capital: 'Imphal', postalZone: 7, rtoCode: 'MN', radiusKm: 80 },
  'Meghalaya': { name: 'Meghalaya', lat: 25.4670, lng: 91.3662, region: 'Northeast', capital: 'Shillong', postalZone: 7, rtoCode: 'ML', radiusKm: 80 },
  'Mizoram': { name: 'Mizoram', lat: 23.1645, lng: 92.9376, region: 'Northeast', capital: 'Aizawl', postalZone: 7, rtoCode: 'MZ', radiusKm: 80 },
  'Nagaland': { name: 'Nagaland', lat: 26.1584, lng: 94.5624, region: 'Northeast', capital: 'Kohima', postalZone: 7, rtoCode: 'NL', radiusKm: 70 },
  'Odisha': { name: 'Odisha', lat: 20.9517, lng: 85.0985, region: 'East', capital: 'Bhubaneswar', postalZone: 7, rtoCode: 'OD', radiusKm: 160 },
  'Punjab': { name: 'Punjab', lat: 31.1471, lng: 75.3412, region: 'North', capital: 'Chandigarh', postalZone: 1, rtoCode: 'PB', radiusKm: 110 },
  'Rajasthan': { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, region: 'North', capital: 'Jaipur', postalZone: 3, rtoCode: 'RJ', radiusKm: 240 },
  'Sikkim': { name: 'Sikkim', lat: 27.5330, lng: 88.5122, region: 'Northeast', capital: 'Gangtok', postalZone: 7, rtoCode: 'SK', radiusKm: 50 },
  'Tamil Nadu': { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, region: 'South', capital: 'Chennai', postalZone: 6, rtoCode: 'TN', radiusKm: 180 },
  'Telangana': { name: 'Telangana', lat: 18.1124, lng: 79.0193, region: 'South', capital: 'Hyderabad', postalZone: 5, rtoCode: 'TS', radiusKm: 140 },
  'Tripura': { name: 'Tripura', lat: 23.9408, lng: 91.9882, region: 'Northeast', capital: 'Agartala', postalZone: 7, rtoCode: 'TR', radiusKm: 60 },
  'Uttar Pradesh': { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, region: 'North', capital: 'Lucknow', postalZone: 2, rtoCode: 'UP', radiusKm: 220 },
  'Uttarakhand': { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, region: 'North', capital: 'Dehradun', postalZone: 2, rtoCode: 'UK', radiusKm: 90 },
  'West Bengal': { name: 'West Bengal', lat: 22.9868, lng: 87.8550, region: 'East', capital: 'Kolkata', postalZone: 7, rtoCode: 'WB', radiusKm: 170 },
  'Andaman and Nicobar Islands': { name: 'Andaman and Nicobar Islands', lat: 11.7401, lng: 92.6586, region: 'South', capital: 'Port Blair', postalZone: 7, rtoCode: 'AN', radiusKm: 100 },
  'Chandigarh': { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, region: 'North', capital: 'Chandigarh', postalZone: 1, rtoCode: 'CH', radiusKm: 20 },
  'Dadra and Nagar Haveli and Daman and Diu': { name: 'Dadra and Nagar Haveli and Daman and Diu', lat: 20.4283, lng: 72.8397, region: 'West', capital: 'Daman', postalZone: 3, rtoCode: 'DD', radiusKm: 40 },
  'Delhi': { name: 'Delhi', lat: 28.7041, lng: 77.1025, region: 'North', capital: 'New Delhi', postalZone: 1, rtoCode: 'DL', radiusKm: 30 },
  'Jammu and Kashmir': { name: 'Jammu and Kashmir', lat: 33.7782, lng: 76.5762, region: 'North', capital: 'Srinagar / Jammu', postalZone: 1, rtoCode: 'JK', radiusKm: 140 },
  'Ladakh': { name: 'Ladakh', lat: 34.1526, lng: 77.5771, region: 'North', capital: 'Leh', postalZone: 1, rtoCode: 'LA', radiusKm: 150 },
  'Lakshadweep': { name: 'Lakshadweep', lat: 10.5667, lng: 72.6417, region: 'South', capital: 'Kavaratti', postalZone: 6, rtoCode: 'LD', radiusKm: 50 },
  'Puducherry': { name: 'Puducherry', lat: 11.9416, lng: 79.8083, region: 'South', capital: 'Puducherry', postalZone: 6, rtoCode: 'PY', radiusKm: 30 },
};

/**
 * Deterministic polynomial string hash for reproducible coordinate positioning and seeding.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Calculates deterministic, geographically plausible center coordinates for any of the 780+ districts.
 */
export function getDistrictCoordinates(
  stateName: string,
  districtName: string
): { lat: number; lng: number } {
  const meta = STATE_METADATA[stateName] || STATE_METADATA['Delhi'];
  const distList = INDIA_STATES_AND_DISTRICTS[stateName] || [];
  const index = distList.findIndex(
    (d) => d.toLowerCase() === districtName.toLowerCase()
  );
  const idx = index >= 0 ? index : hashString(districtName) % 50;
  const total = Math.max(1, distList.length);

  // Golden ratio spiral distribution inside state bounding circle
  const hash = hashString(`${stateName}__${districtName}`);
  const angle = (idx * 2.399963 + (hash % 100) * 0.01) % (2 * Math.PI);
  const normDist = Math.sqrt((idx + 0.5) / total);
  const maxRadiusDeg = (meta.radiusKm / 111.0) * 0.75;
  const rDeg = Math.max(0.04, normDist * maxRadiusDeg);

  const latOffset = rDeg * Math.sin(angle);
  const lngOffset = (rDeg * Math.cos(angle)) / Math.cos((meta.lat * Math.PI) / 180);

  return {
    lat: Number((meta.lat + latOffset).toFixed(4)),
    lng: Number((meta.lng + lngOffset).toFixed(4)),
  };
}

/**
 * In-memory dynamic cache for synthesized district logistics hubs.
 */
export const DYNAMIC_DISTRICT_HUBS_CACHE: Record<string, IndiaHubInfo> = {};

/**
 * Synthesizes a dispatch-ready IndiaHubInfo for any given state and district.
 * Generates depot coordinates, 4-6 vehicles with state RTO registration plates,
 * and 8-12 realistic commercial delivery stops within a 10-20km radius.
 */
export function getOrCreateDistrictHub(
  stateName: string,
  districtName: string
): IndiaHubInfo {
  const normState =
    Object.keys(INDIA_STATES_AND_DISTRICTS).find(
      (k) => k.toLowerCase() === stateName.toLowerCase() || stateName.toLowerCase().includes(k.toLowerCase())
    ) || stateName;

  const distList = INDIA_STATES_AND_DISTRICTS[normState] || [];
  const normDistrict =
    distList.find(
      (d) => d.toLowerCase() === districtName.toLowerCase() || districtName.toLowerCase().includes(d.toLowerCase())
    ) || districtName;

  const hubKey = `hub-${normDistrict.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${normState.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  // Check if predefined in INDIA_HUBS
  const matchingStaticKey = Object.keys(INDIA_HUBS).find(
    (k) =>
      INDIA_HUBS[k].district.toLowerCase() === normDistrict.toLowerCase() &&
      INDIA_HUBS[k].state.toLowerCase() === normState.toLowerCase()
  );
  if (matchingStaticKey && INDIA_HUBS[matchingStaticKey]) {
    return INDIA_HUBS[matchingStaticKey];
  }

  // Check in-memory cache
  if (DYNAMIC_DISTRICT_HUBS_CACHE[hubKey]) {
    return DYNAMIC_DISTRICT_HUBS_CACHE[hubKey];
  }

  const meta = STATE_METADATA[normState] || {
    name: normState,
    lat: 20.5937,
    lng: 78.9629,
    region: 'Central' as const,
    capital: normDistrict,
    postalZone: 5,
    rtoCode: normState.slice(0, 2).toUpperCase(),
    radiusKm: 120,
  };

  const coords = getDistrictCoordinates(normState, normDistrict);
  const hash = hashString(`${normState}__${normDistrict}`);
  const rtoNum = (hash % 89 + 10).toString().padStart(2, '0');
  const distShort = normDistrict.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
  const depotId = `DEPOT-${meta.rtoCode}-${distShort}`;

  // 1. Synthesize Central Depot
  const depot: Depot = {
    id: depotId,
    name: `${normDistrict} Central Logistics Hub`,
    lat: coords.lat,
    lng: coords.lng,
    operating_hours_start: '08:00',
    operating_hours_end: '19:00',
    district: normDistrict,
    state: normState,
  };

  // 2. Synthesize Fleet Vehicles (4 to 6 vehicles with state RTO plates)
  const vehicleCount = 4 + (hash % 3); // 4, 5, or 6 vehicles
  const vehicleTemplates = [
    { name: 'Tata Ace EV Green Cargo', cap: 600, eff: 26.0, fuel: 'electric' as const, tag: 'EV-101' },
    { name: 'Mahindra Zor Grand EV Express', cap: 500, eff: 24.0, fuel: 'electric' as const, tag: 'EV-202' },
    { name: 'Ashok Leyland Dost+ Commercial', cap: 750, eff: 14.5, fuel: 'diesel' as const, tag: 'D-303' },
    { name: 'Tata 407 LPT Heavy Delivery', cap: 1200, eff: 10.5, fuel: 'diesel' as const, tag: 'D-404' },
    { name: 'Piaggio Ape E-Xtra Cargo', cap: 450, eff: 28.0, fuel: 'electric' as const, tag: 'EV-505' },
    { name: 'Eicher Pro 2049 City Transit', cap: 1500, eff: 9.8, fuel: 'hybrid' as const, tag: 'H-606' },
  ];

  const vehicles: Vehicle[] = vehicleTemplates.slice(0, vehicleCount).map((v, vIdx) => ({
    id: `${meta.rtoCode}-${rtoNum}-${v.tag}`,
    name: `${v.name} (${meta.rtoCode}-${rtoNum})`,
    capacity_kg: v.cap,
    starting_depot_id: depotId,
    max_route_distance_km: v.fuel === 'electric' ? 120.0 : 200.0,
    fuel_efficiency_km_per_l: v.eff,
    fuel_type: v.fuel,
  }));

  // 3. Synthesize Commercial Delivery Stops (8 to 12 stops)
  const stopCount = 8 + (hash % 5); // 8 to 12 stops
  const commercialCategories: Array<{
    title: string;
    priority: Priority;
    demandKg: number;
    start: string;
    end: string;
    serviceTime: number;
  }> = [
    { title: 'District Civil Hospital & Emergency Pharmacy', priority: 'urgent', demandKg: 30, start: '08:30', end: '11:30', serviceTime: 20 },
    { title: 'Apollo Pharmacy Regional Health Store', priority: 'high', demandKg: 20, start: '09:00', end: '12:30', serviceTime: 15 },
    { title: 'Reliance Smart Bazaar Retail Node', priority: 'medium', demandKg: 75, start: '10:00', end: '14:00', serviceTime: 25 },
    { title: 'Tata Croma Electronics Distribution Store', priority: 'medium', demandKg: 45, start: '11:00', end: '15:00', serviceTime: 20 },
    { title: 'BigBasket Quick-Commerce Dark Store', priority: 'high', demandKg: 85, start: '09:30', end: '13:00', serviceTime: 20 },
    { title: 'Blue Dart & DTDC Air Express Cargo Counter', priority: 'medium', demandKg: 35, start: '11:30', end: '16:00', serviceTime: 15 },
    { title: 'Amul Fresh Dairy Cold-Chain Facility', priority: 'high', demandKg: 65, start: '08:00', end: '11:00', serviceTime: 20 },
    { title: 'District APMC Wholesale Agricultural Mandi', priority: 'medium', demandKg: 95, start: '12:00', end: '16:30', serviceTime: 30 },
    { title: 'Indian Oil / HPCL Commercial Logistics Outpost', priority: 'low', demandKg: 40, start: '13:00', end: '17:00', serviceTime: 15 },
    { title: 'Zomato Hyperpure Restaurant Supply Depot', priority: 'medium', demandKg: 50, start: '10:30', end: '14:30', serviceTime: 20 },
    { title: 'Decathlon Sports & Apparel Logistics Center', priority: 'low', demandKg: 55, start: '14:00', end: '17:30', serviceTime: 20 },
    { title: 'MedPlus Central Distribution Hub', priority: 'urgent', demandKg: 25, start: '09:00', end: '12:00', serviceTime: 15 },
  ];

  const deliveries: Delivery[] = [];
  for (let i = 0; i < stopCount; i++) {
    const cat = commercialCategories[i % commercialCategories.length];
    const stopAngle = ((hash + i * 137.5) % 360) * (Math.PI / 180);
    // Offset between 2.5 km and 14 km
    const distKm = 2.5 + ((hash + i * 31) % 115) * 0.1;
    const latOffset = (distKm / 111.0) * Math.sin(stopAngle);
    const lngOffset = (distKm / 111.0) * Math.cos(stopAngle) / Math.cos((coords.lat * Math.PI) / 180);

    const pinSub = ((hash + i * 29) % 890 + 100).toString().padStart(3, '0');
    const pincode = `${meta.postalZone}${pinSub.slice(0, 2)}${((i + 1) * 7) % 90 + 10}`;

    deliveries.push({
      id: `${distShort}-D${(i + 1).toString().padStart(2, '0')}`,
      customer_name: `${normDistrict} ${cat.title}`,
      lat: Number((coords.lat + latOffset).toFixed(4)),
      lng: Number((coords.lng + lngOffset).toFixed(4)),
      demand_kg: cat.demandKg,
      priority: cat.priority,
      time_window_start: cat.start,
      time_window_end: cat.end,
      service_time_mins: cat.serviceTime,
      address: `Trunk Road Sector ${i + 1}, Near Central Bypass, ${normDistrict}, ${normState} - ${pincode}`,
      district: normDistrict,
      state: normState,
    });
  }

  const hubInfo: IndiaHubInfo = {
    id: hubKey,
    name: `${normDistrict} Logistics Corridor`,
    city: normDistrict,
    state: normState,
    district: normDistrict,
    depot,
    vehicles,
    deliveries,
  };

  // Cache by generated key and district aliases
  DYNAMIC_DISTRICT_HUBS_CACHE[hubKey] = hubInfo;
  DYNAMIC_DISTRICT_HUBS_CACHE[normDistrict.toLowerCase()] = hubInfo;
  DYNAMIC_DISTRICT_HUBS_CACHE[`${normDistrict.toLowerCase()}__${normState.toLowerCase()}`] = hubInfo;

  return hubInfo;
}

/**
 * Resolves an IndiaHubInfo from either:
 * 1. Predefined INDIA_HUBS (42 corridors)
 * 2. Cached dynamic district hubs
 * 3. Any of the 780+ districts via getOrCreateDistrictHub
 */
export function resolveDistrictHub(
  identifier?: string,
  stateHint?: string,
  districtHint?: string
): IndiaHubInfo {
  if (stateHint && districtHint) {
    return getOrCreateDistrictHub(stateHint, districtHint);
  }

  const key = (identifier || 'bengaluru').toLowerCase().trim();

  // 1. Exact match in predefined INDIA_HUBS
  if (INDIA_HUBS[key]) {
    return INDIA_HUBS[key];
  }

  // 2. Exact match in dynamic cache
  if (DYNAMIC_DISTRICT_HUBS_CACHE[key]) {
    return DYNAMIC_DISTRICT_HUBS_CACHE[key];
  }

  // 3. Search predefined INDIA_HUBS by city or district
  const staticMatch = Object.keys(INDIA_HUBS).find(
    (k) =>
      INDIA_HUBS[k].city.toLowerCase() === key ||
      INDIA_HUBS[k].district.toLowerCase() === key ||
      key.includes(INDIA_HUBS[k].district.toLowerCase())
  );
  if (staticMatch && INDIA_HUBS[staticMatch]) {
    return INDIA_HUBS[staticMatch];
  }

  // 4. Search across all 780+ districts
  for (const [st, dists] of Object.entries(INDIA_STATES_AND_DISTRICTS)) {
    const matchedDist = dists.find(
      (d) =>
        d.toLowerCase() === key ||
        key.includes(d.toLowerCase()) ||
        d.toLowerCase().includes(key)
    );
    if (matchedDist) {
      return getOrCreateDistrictHub(st, matchedDist);
    }
  }

  // Fallback to primary Bengaluru hub
  return INDIA_HUBS['bengaluru'];
}

