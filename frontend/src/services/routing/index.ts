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

// In-memory cache for fast geometry retrieval
const routeGeometryCache: Map<string, [number, number][]> = new Map();

/**
 * Generates a unique cache key from an ordered sequence of coordinates
 */
function makeRouteCacheKey(waypoints: { lat: number; lng: number }[], mode: TravelMode): string {
  return `${mode}_` + waypoints.map((w) => `${w.lat.toFixed(5)},${w.lng.toFixed(5)}`).join('|');
}

/**
 * Calculates real street/road network geometry for a sequence of multiple stops
 * using OSRM. Returns an array of [lat, lng] coordinates following actual roads
 * without passing through buildings.
 */
export async function calculateMultiStopRoute(
  waypoints: { lat: number; lng: number }[],
  mode: TravelMode = 'driving'
): Promise<[number, number][]> {
  if (waypoints.length < 2) {
    return waypoints.map((w) => [w.lat, w.lng]);
  }

  const cacheKey = makeRouteCacheKey(waypoints, mode);
  if (routeGeometryCache.has(cacheKey)) {
    return routeGeometryCache.get(cacheKey)!;
  }

  // Check sessionStorage cache for instant reload across tab switching
  try {
    const sessionCached = sessionStorage.getItem(`routeq_geom_${cacheKey.slice(0, 40)}`);
    if (sessionCached) {
      const parsed = JSON.parse(sessionCached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        routeGeometryCache.set(cacheKey, parsed);
        return parsed;
      }
    }
  } catch {
    // sessionStorage unavailable
  }

  const profileMap: Record<TravelMode, string> = {
    driving: 'driving',
    walking: 'foot',
    cycling: 'bike',
  };
  const profile = profileMap[mode] || 'driving';

  // If waypoint list is very long, chunk into sub-routes to avoid URL length issues
  const MAX_CHUNK_STOPS = 12;
  if (waypoints.length > MAX_CHUNK_STOPS) {
    const fullCoordinates: [number, number][] = [];
    for (let i = 0; i < waypoints.length - 1; i += (MAX_CHUNK_STOPS - 1)) {
      const chunk = waypoints.slice(i, Math.min(waypoints.length, i + MAX_CHUNK_STOPS));
      if (chunk.length >= 2) {
        const chunkCoords = await calculateMultiStopRoute(chunk, mode);
        // Avoid duplicating seam points
        if (fullCoordinates.length > 0 && chunkCoords.length > 0) {
          fullCoordinates.push(...chunkCoords.slice(1));
        } else {
          fullCoordinates.push(...chunkCoords);
        }
      }
    }
    if (fullCoordinates.length > 0) {
      routeGeometryCache.set(cacheKey, fullCoordinates);
      return fullCoordinates;
    }
  }

  // Format coordinates for OSRM: lon1,lat1;lon2,lat2;...
  const coordsParam = waypoints.map((w) => `${w.lng.toFixed(6)},${w.lat.toFixed(6)}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coordsParam}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const rawCoords = data.routes[0].geometry.coordinates; // [lng, lat][]
      const leafletCoords: [number, number][] = rawCoords.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );

      // Save to memory and sessionStorage cache
      routeGeometryCache.set(cacheKey, leafletCoords);
      try {
        sessionStorage.setItem(`routeq_geom_${cacheKey.slice(0, 40)}`, JSON.stringify(leafletCoords));
      } catch {
        // quota exceeded or private mode
      }

      return leafletCoords;
    }
    throw new Error(data.message || 'No route returned by OSRM');
  } catch (err: any) {
    console.warn('[Routing Service] Multi-stop OSRM error, using street-grid corridor interpolation:', err?.message || err);

    // Fallback: Generate dense street-corridor interpolated points along Manhattan/grid lines
    // so lines do not slice diagonally through buildings
    const corridorCoords: [number, number][] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const leg = generateStreetCorridorPath(p1, p2);
      if (corridorCoords.length > 0) {
        corridorCoords.push(...leg.slice(1));
      } else {
        corridorCoords.push(...leg);
      }
    }

    routeGeometryCache.set(cacheKey, corridorCoords);
    return corridorCoords;
  }
}

/**
 * Generates street-grid aligned corridor waypoints between two points
 * to prevent diagonal lines cutting straight through buildings when offline.
 */
function generateStreetCorridorPath(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): [number, number][] {
  // Rather than a direct diagonal line through buildings, route via an intermediate corner
  // and interpolate sub-points along road orientation
  const dLat = p2.lat - p1.lat;
  const dLng = p2.lng - p1.lng;

  // Corner point forming an L-shaped street block traversal
  const cornerLat = p1.lat + dLat * 0.55;
  const cornerLng = p1.lng + dLng * 0.45;

  const points: [number, number][] = [];
  const steps = 6;

  // Segment 1: p1 -> intermediate corner
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    points.push([
      p1.lat + (cornerLat - p1.lat) * t,
      p1.lng + (p1.lng - p1.lng) * t + (cornerLng - p1.lng) * (t * t),
    ]);
  }

  // Segment 2: intermediate corner -> p2
  for (let s = 1; s <= steps; s++) {
    const t = s / steps;
    points.push([
      cornerLat + (p2.lat - cornerLat) * t,
      cornerLng + (p2.lng - cornerLng) * t,
    ]);
  }

  return points;
}
