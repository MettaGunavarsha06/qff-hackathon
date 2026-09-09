/**
 * Rich Marker Popup Generator for Leaflet
 * Generates interactive cards with:
 * - Name, Category, Description, Image, Rating, Address, Coordinates
 * - Buttons: Directions, Open in Google Maps, Save, Share
 */

export interface MarkerPopupData {
  id: string;
  name: string;
  category: string;
  description?: string;
  image?: string;
  rating?: number;
  address?: string;
  lat: number;
  lng: number;
  priority?: string;
  demand_kg?: number;
  delivery_window?: string;
  service_time_mins?: number;
  assigned_vehicle?: string;
  arrival_time?: string;
}

export function generateMarkerPopupHtml(data: MarkerPopupData): string {
  const ratingHtml = data.rating
    ? `
    <div style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #F59E0B; margin-top: 2px;">
      <span>★</span>
      <span style="font-weight: 700; color: #1F2024;">${data.rating.toFixed(1)}</span>
      <span style="color: #8E909A; font-size: 10px;">/ 5.0</span>
    </div>
  `
    : '';

  const imageHtml = data.image
    ? `
    <div style="width: 100%; height: 110px; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #F2F1EC;">
      <img src="${data.image}" alt="${data.name}" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  `
    : '';

  const coordsText = `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}`;

  return `
    <div class="routeq-marker-popup" style="padding: 2px 1px; min-width: 240px; max-width: 280px; font-family: 'Manrope', -apple-system, sans-serif; color: #1F2024;">
      ${imageHtml}
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
        <span style="display: inline-block; padding: 2px 7px; border-radius: 9999px; background: rgba(255,91,55,0.1); color: #FF5B37; font-size: 9px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; letter-spacing: 0.3px;">
          ${data.category}
        </span>
        <span style="font-size: 10px; font-family: 'IBM Plex Mono', monospace; color: #8E909A;">
          ${data.id}
        </span>
      </div>

      <div style="font-weight: 700; font-size: 14px; line-height: 1.3; color: #1F2024; margin-bottom: 3px;">
        ${data.name}
      </div>

      ${ratingHtml}

      ${
        data.description
          ? `<p style="font-size: 11px; line-height: 1.4; color: #6B6D76; margin: 4px 0 6px 0;">${data.description}</p>`
          : ''
      }

      <div style="font-size: 11px; color: #6B6D76; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 4px;">
        <span style="color: #8E909A; font-size: 12px; line-height: 1;">📍</span>
        <span>${data.address || 'Location Coordinates'}</span>
      </div>

      <!-- Telemetry if delivery/logistics node -->
      ${
        data.demand_kg !== undefined
          ? `
        <div style="font-size: 10px; color: #6B6D76; background: #FAF9F6; border: 1px solid #E8E6DF; border-radius: 10px; padding: 6px 8px; margin-bottom: 8px; font-family: 'IBM Plex Mono', monospace; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <div>LOAD: <b style="color: #1F2024;">${data.demand_kg} kg</b></div>
          <div>SERVICE: <b style="color: #1F2024;">${data.service_time_mins || 15}m</b></div>
          ${data.delivery_window ? `<div style="grid-column: span 2;">WINDOW: <b style="color: #1F2024;">${data.delivery_window}</b></div>` : ''}
          ${data.assigned_vehicle ? `<div style="grid-column: span 2; color: #FF5B37;">VEHICLE: <b>${data.assigned_vehicle}</b></div>` : ''}
        </div>
      `
          : ''
      }

      <div style="font-size: 10px; font-family: 'IBM Plex Mono', monospace; color: #8E909A; margin-bottom: 8px;">
        COORDS: ${coordsText}
      </div>

      <!-- Action Buttons -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding-top: 8px; border-top: 1px solid #E8E6DF;">
        <!-- Directions Button -->
        <button
          onclick="window.__routeq_get_directions && window.__routeq_get_directions(${data.lat}, ${data.lng}, '${escapeQuotes(data.name)}')"
          style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 8px; border-radius: 8px; background: #1F2024; color: #FFFFFF; font-size: 10px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; border: none; cursor: pointer; text-decoration: none;"
          title="Calculate route on map"
        >
          Directions &rarr;
        </button>

        <!-- Open in Google Maps (External Link) -->
        <a
          href="${googleMapsUrl}"
          target="_blank"
          rel="noopener noreferrer"
          style="display: flex; align-items: center; justify-content: center; gap: 4px; padding: 6px 8px; border-radius: 8px; background: #FFFFFF; color: #1F2024; border: 1px solid #E8E6DF; font-size: 10px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; text-decoration: none;"
          title="View on Google Maps in a new tab"
        >
          External &nearr;
        </a>

        <!-- Save Place Button -->
        <button
          onclick="window.__routeq_save_place && window.__routeq_save_place('${data.id}', '${escapeQuotes(data.name)}', ${data.lat}, ${data.lng})"
          style="display: flex; align-items: center; justify-content: center; gap: 3px; padding: 5px 6px; border-radius: 8px; background: #FAF9F6; color: #6B6D76; border: 1px solid #E8E6DF; font-size: 10px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; cursor: pointer;"
          title="Save to favorites"
        >
          ★ Save
        </button>

        <!-- Share URL Button -->
        <button
          onclick="window.__routeq_share_place && window.__routeq_share_place(${data.lat}, ${data.lng}, '${data.id}')"
          style="display: flex; align-items: center; justify-content: center; gap: 3px; padding: 5px 6px; border-radius: 8px; background: #FAF9F6; color: #6B6D76; border: 1px solid #E8E6DF; font-size: 10px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; cursor: pointer;"
          title="Copy shareable map URL"
        >
          ↗ Share
        </button>
      </div>
    </div>
  `;
}

function escapeQuotes(str: string): string {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
