/**
 * Administrative Geographic Structure of India
 * Strictly 28 States and 8 Union Territories with official district rosters & coordinates.
 */

import {
  INDIA_STATES_AND_DISTRICTS,
  STATE_METADATA,
  getDistrictCoordinates,
} from './indiaDistricts';

export interface DistrictInfo {
  name: string;
  lat: number;
  lng: number;
  state: string;
  isUT: boolean;
  alias?: string;
}

export interface StateInfo {
  name: string;
  code: string;
  lat: number;
  lng: number;
  capital: string;
  isUT: boolean;
  districts: DistrictInfo[];
}

export interface IndiaLocationsData {
  states: StateInfo[];
  unionTerritories: StateInfo[];
}

// Strictly the 28 Official Indian States (excl. Union Territories)
export const OFFICIAL_STATE_NAMES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

// Strictly the 8 Official Union Territories
export const OFFICIAL_UT_NAMES = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

// Precise benchmark coordinates for major districts & state capitals
const BENCHMARK_COORDINATES: Record<string, { lat: number; lng: number; alias?: string }> = {
  // Karnataka (31 districts)
  'Bengaluru Urban': { lat: 12.9716, lng: 77.5946, alias: 'Bangalore' },
  'Bengaluru Rural': { lat: 13.2847, lng: 77.5583 },
  'Mysuru': { lat: 12.2958, lng: 76.6394, alias: 'Mysore' },
  'Dakshina Kannada': { lat: 12.9141, lng: 74.8560, alias: 'Mangaluru / Mangalore' },
  'Udupi': { lat: 13.3409, lng: 74.7421 },
  'Belagavi': { lat: 15.8497, lng: 74.4977, alias: 'Belgaum' },
  'Ballari': { lat: 15.1394, lng: 76.9214, alias: 'Bellary' },
  'Vijayapura': { lat: 16.8302, lng: 75.7100, alias: 'Bijapur' },
  'Tumakuru': { lat: 13.3379, lng: 77.1010, alias: 'Tumkur' },
  'Shivamogga': { lat: 13.9299, lng: 75.5681, alias: 'Shimoga' },
  'Hassan': { lat: 13.0033, lng: 76.1004 },
  'Kodagu': { lat: 12.3375, lng: 75.8069, alias: 'Coorg' },
  'Mandya': { lat: 12.5218, lng: 76.8951 },
  'Kolar': { lat: 13.1367, lng: 78.1291 },
  'Chikkaballapur': { lat: 13.4355, lng: 77.7315 },
  'Chitradurga': { lat: 14.2251, lng: 76.3980 },
  'Davanagere': { lat: 14.4644, lng: 75.9218 },
  'Dharwad': { lat: 15.4589, lng: 75.0078, alias: 'Hubballi-Dharwad' },
  'Gadag': { lat: 15.4167, lng: 75.6333 },
  'Haveri': { lat: 14.7954, lng: 75.3992 },
  'Kalaburagi': { lat: 17.3297, lng: 76.8343, alias: 'Gulbarga' },
  'Koppal': { lat: 15.3468, lng: 76.1554 },
  'Raichur': { lat: 16.2120, lng: 77.3439 },
  'Yadgir': { lat: 16.7619, lng: 77.1378 },
  'Bagalkot': { lat: 16.1691, lng: 75.6615 },
  'Chamarajanagar': { lat: 11.9261, lng: 76.9437 },
  'Chikkamagaluru': { lat: 13.3161, lng: 75.7720, alias: 'Chikmagalur' },
  'Uttara Kannada': { lat: 14.7937, lng: 74.6869, alias: 'Karwar' },
  'Bidar': { lat: 17.9104, lng: 77.5199 },
  'Ramanagara': { lat: 12.7209, lng: 77.2799 },
  'Vijayanagara': { lat: 15.2750, lng: 76.3910, alias: 'Hampi' },

  // Key National Metropolitan Centers
  'Mumbai City': { lat: 18.9388, lng: 72.8354, alias: 'South Mumbai' },
  'Mumbai Suburban': { lat: 19.0760, lng: 72.8777, alias: 'Mumbai Suburbs' },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Thane': { lat: 19.2183, lng: 72.9781 },
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Chennai': { lat: 13.0827, lng: 80.2707, alias: 'Madras' },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai': { lat: 9.9252, lng: 78.1198 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, alias: 'Cyberabad' },
  'Medchal-Malkajgiri': { lat: 17.4933, lng: 78.3914 },
  'Rangareddy': { lat: 17.3375, lng: 78.5524 },
  'Kolkata': { lat: 22.5726, lng: 88.3639, alias: 'Calcutta' },
  'Howrah': { lat: 22.5958, lng: 88.2636 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Surat': { lat: 21.1702, lng: 72.8311 },
  'Vadodara': { lat: 22.3072, lng: 73.1812 },
  'New Delhi': { lat: 28.6139, lng: 77.2090, alias: 'National Capital' },
  'Central Delhi': { lat: 28.6448, lng: 77.2167 },
  'South Delhi': { lat: 28.5447, lng: 77.2066 },
  'North Delhi': { lat: 28.7180, lng: 77.1636 },
  'Gurugram': { lat: 28.4595, lng: 77.0266, alias: 'Gurgaon' },
  'Faridabad': { lat: 28.4089, lng: 77.3178 },
  'Gautam Buddha Nagar': { lat: 28.5355, lng: 77.3910, alias: 'Noida' },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Kanpur Nagar': { lat: 26.4499, lng: 80.3319 },
  'Varanasi': { lat: 25.3176, lng: 82.9739, alias: 'Banaras' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, alias: 'Pink City' },
  'Jodhpur': { lat: 26.2389, lng: 73.0243 },
  'Patna': { lat: 25.5941, lng: 85.1376 },
  'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366, alias: 'Trivandrum' },
  'Ernakulam': { lat: 9.9816, lng: 76.2999, alias: 'Kochi / Cochin' },
  'Visakhapatnam': { lat: 17.6868, lng: 83.2185, alias: 'Vizag' },
  'NTR': { lat: 16.5062, lng: 80.6480, alias: 'Vijayawada' },
  'Ludhiana': { lat: 30.9010, lng: 75.8573 },
  'Amritsar': { lat: 31.6340, lng: 74.8723 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Srinagar': { lat: 34.0837, lng: 74.7973 },
  'Jammu': { lat: 32.7266, lng: 74.8570 },
  'Leh': { lat: 34.1526, lng: 77.5771 },
  'Puducherry': { lat: 11.9416, lng: 79.8083, alias: 'Pondicherry' },
  'South Andaman': { lat: 11.6234, lng: 92.7265, alias: 'Port Blair' },
};

function buildDistrictInfo(stateName: string, districtName: string, isUT: boolean): DistrictInfo {
  const benchmark = BENCHMARK_COORDINATES[districtName];
  if (benchmark) {
    return {
      name: districtName,
      lat: benchmark.lat,
      lng: benchmark.lng,
      state: stateName,
      isUT,
      alias: benchmark.alias,
    };
  }

  const coords = getDistrictCoordinates(stateName, districtName);
  return {
    name: districtName,
    lat: coords.lat,
    lng: coords.lng,
    state: stateName,
    isUT,
  };
}

function buildStateInfo(stateName: string, isUT: boolean): StateInfo {
  const meta = STATE_METADATA[stateName] || {
    name: stateName,
    lat: 20.5937,
    lng: 78.9629,
    region: 'Central',
    capital: stateName,
    postalZone: 5,
    rtoCode: stateName.slice(0, 2).toUpperCase(),
    radiusKm: 120,
  };

  const rawDistricts = INDIA_STATES_AND_DISTRICTS[stateName] || [];
  const districts = rawDistricts.map((dist) => buildDistrictInfo(stateName, dist, isUT));

  return {
    name: stateName,
    code: meta.rtoCode,
    lat: meta.lat,
    lng: meta.lng,
    capital: meta.capital,
    isUT,
    districts,
  };
}

// ─── Primary Export: indiaLocations ──────────────────────────────────────────
export const indiaLocations: IndiaLocationsData = {
  states: OFFICIAL_STATE_NAMES.map((name) => buildStateInfo(name, false)),
  unionTerritories: OFFICIAL_UT_NAMES.map((name) => buildStateInfo(name, true)),
};

// Dynamic calculated counts directly from data
export const TOTAL_STATES_COUNT = indiaLocations.states.length; // strictly 28
export const TOTAL_UT_COUNT = indiaLocations.unionTerritories.length; // strictly 8
export const TOTAL_DISTRICTS_COUNT =
  indiaLocations.states.reduce((acc, s) => acc + s.districts.length, 0) +
  indiaLocations.unionTerritories.reduce((acc, u) => acc + u.districts.length, 0);

/**
 * Returns all districts across India flattened with state metadata
 */
export function getAllDistrictsList(): DistrictInfo[] {
  const all: DistrictInfo[] = [];
  for (const s of indiaLocations.states) {
    all.push(...s.districts);
  }
  for (const u of indiaLocations.unionTerritories) {
    all.push(...u.districts);
  }
  return all;
}

/**
 * Find State or UT by name
 */
export function findStateOrUT(name: string): StateInfo | undefined {
  const q = name.trim().toLowerCase();
  return (
    indiaLocations.states.find((s) => s.name.toLowerCase() === q) ||
    indiaLocations.unionTerritories.find((u) => u.name.toLowerCase() === q)
  );
}

/**
 * Search locations matching state name, district name, UT name, or combo
 */
export interface SearchResultItem {
  type: 'state' | 'ut' | 'district';
  name: string;
  parentName?: string; // State or "Union Territory"
  item: StateInfo | DistrictInfo;
  districtCount?: number;
}

export function searchIndiaLocations(query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];
  const addedKeys = new Set<string>();

  // 1. Check States
  for (const s of indiaLocations.states) {
    if (s.name.toLowerCase().includes(q) || s.code.toLowerCase() === q) {
      const key = `state-${s.name}`;
      if (!addedKeys.has(key)) {
        addedKeys.add(key);
        results.push({
          type: 'state',
          name: s.name,
          parentName: 'State',
          item: s,
          districtCount: s.districts.length,
        });
      }
    }
  }

  // 2. Check Union Territories
  for (const u of indiaLocations.unionTerritories) {
    if (u.name.toLowerCase().includes(q) || u.code.toLowerCase() === q || 'union territory'.includes(q)) {
      const key = `ut-${u.name}`;
      if (!addedKeys.has(key)) {
        addedKeys.add(key);
        results.push({
          type: 'ut',
          name: u.name,
          parentName: 'Union Territory',
          item: u,
          districtCount: u.districts.length,
        });
      }
    }
  }

  // 3. Check Districts
  for (const s of [...indiaLocations.states, ...indiaLocations.unionTerritories]) {
    for (const d of s.districts) {
      const matchDistrict = d.name.toLowerCase().includes(q);
      const matchState = s.name.toLowerCase().includes(q);
      const matchCombo = `${d.name} ${s.name}`.toLowerCase().includes(q) || `${s.name} ${d.name}`.toLowerCase().includes(q);
      const matchAlias = d.alias && d.alias.toLowerCase().includes(q);

      if (matchDistrict || matchCombo || matchAlias || (matchState && q.length > 2)) {
        const key = `dist-${s.name}-${d.name}`;
        if (!addedKeys.has(key)) {
          addedKeys.add(key);
          results.push({
            type: 'district',
            name: d.name,
            parentName: s.name,
            item: d,
          });
        }
      }
    }
  }

  return results;
}
