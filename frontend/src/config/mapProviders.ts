/**
 * Map Layer Provider Configuration
 * Pure open-source / legally usable providers without secret API keys.
 */

export interface TileLayerConfig {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom?: number;
  minZoom?: number;
  subdomains?: string | string[];
  isConfigured: boolean;
  notes?: string;
}

export interface TrafficLayerConfig {
  id: string;
  name: string;
  isConfigured: boolean;
  statusMessage: string;
}

export const MAP_LAYERS: Record<'street' | 'satellite' | 'terrain', TileLayerConfig> = {
  street: {
    id: 'street',
    name: 'Street (OpenStreetMap)',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 22,
    maxNativeZoom: 19,
    minZoom: 1,
    isConfigured: true,
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite (Esri World Imagery)',
    // Legally accessible Esri World Imagery public tile layer with explicit attribution
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 22,
    maxNativeZoom: 18,
    minZoom: 1,
    isConfigured: true,
    notes: 'Publicly accessible high-resolution global satellite imagery with overzooming.',
  },
  terrain: {
    id: 'terrain',
    name: 'Terrain (OpenTopoMap)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 22,
    maxNativeZoom: 17,
    minZoom: 1,
    subdomains: ['a', 'b', 'c'],
    isConfigured: true,
  },
};

export const TRAFFIC_CONFIG: TrafficLayerConfig = {
  id: 'traffic',
  name: 'Traffic Layer',
  isConfigured: true,
  statusMessage: 'Live traffic data is unavailable. Showing traffic simulation.',
};

