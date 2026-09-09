/**
 * OpenStreetMap-compatible Routing Service
 * Uses OSRM (Open Source Routing Machine) public demo server
 * Provides Driving, Walking, and Cycling directions with zero API keys.
 */

export type TravelMode = 'driving' | 'walking' | 'cycling';

export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng] array
  distanceKm: number;
  durationMins: number;
  mode: TravelMode;
  status: 'success' | 'fallback' | 'error';
  errorMessage?: string;
}

/**
 * Calculates road network route between start and end coordinates.
 */
export async function calculateDirections(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  mode: TravelMode = 'driving'
): Promise<RouteResult> {
  // Map travel mode to OSRM profile
  const profileMap: Record<TravelMode, string> = {
    driving: 'driving',
    walking: 'foot',
    cycling: 'bike',
  };

  const profile = profileMap[mode] || 'driving';
  const url = `https://router.project-osrm.org/route/v1/${profile}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Routing request failed (${response.status})`);
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found between selected coordinates.');
    }

    const route = data.routes[0];
    // GeoJSON coordinates are [lng, lat], convert to Leaflet [lat, lng]
    const coords: [number, number][] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );

    return {
      coordinates: coords,
      distanceKm: parseFloat((route.distance / 1000).toFixed(2)),
      durationMins: Math.round(route.duration / 60),
      mode,
      status: 'success',
    };
  } catch (err: any) {
    console.warn('OSRM routing fallback:', err?.message || err);

    // Haversine straight-line fallback
    const straightLineDist = calculateHaversineDistance(
      start.lat,
      start.lng,
      end.lat,
      end.lng
    );

    // Approximate speeds: driving 45 km/h, walking 4.5 km/h, cycling 15 km/h
    const speedKmH = mode === 'driving' ? 45 : mode === 'cycling' ? 15 : 4.5;
    const estMinutes = Math.max(1, Math.round((straightLineDist / speedKmH) * 60));

    return {
      coordinates: [
        [start.lat, start.lng],
        [end.lat, end.lng],
      ],
      distanceKm: parseFloat(straightLineDist.toFixed(2)),
      durationMins: estMinutes,
      mode,
      status: 'fallback',
      errorMessage: 'Direct line estimate (Routing service temporarily busy).',
    };
  }
}

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
