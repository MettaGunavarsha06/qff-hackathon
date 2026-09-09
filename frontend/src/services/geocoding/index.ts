/**
 * OpenStreetMap Nominatim Geocoding Service
 * Global search for countries, cities, POIs, attractions, airports, hospitals, etc.
 */

export interface GeocodingResult {
  place_id: number;
  osm_id: number;
  osm_type: string;
  lat: number;
  lng: number;
  display_name: string;
  name: string;
  type: string;
  category: string;
  address?: Record<string, string>;
  importance: number;
  boundingbox?: [number, number, number, number]; // [south, north, west, east]
}

export async function searchPlaces(
  query: string,
  limit: number = 6
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', trimmed);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      place_id: item.place_id,
      osm_id: item.osm_id,
      osm_type: item.osm_type,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      display_name: item.display_name,
      name: item.name || item.display_name.split(',')[0],
      type: item.type || 'place',
      category: item.class || 'general',
      address: item.address,
      importance: item.importance || 0,
      boundingbox: Array.isArray(item.boundingbox) && item.boundingbox.length === 4
        ? [
            parseFloat(item.boundingbox[0]),
            parseFloat(item.boundingbox[1]),
            parseFloat(item.boundingbox[2]),
            parseFloat(item.boundingbox[3]),
          ]
        : undefined,
    }));
  } catch (error) {
    console.warn('Nominatim search error:', error);
    return [];
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lng));
    url.searchParams.set('format', 'json');

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.display_name || null;
  } catch {
    return null;
  }
}
