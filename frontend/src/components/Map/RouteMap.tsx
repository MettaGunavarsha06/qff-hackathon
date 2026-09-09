import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import type { Depot, Delivery, VehicleRoute, Vehicle } from '../../types';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';

export type OpenFreeMapStyle = 'positron' | 'liberty' | 'bright';

interface RouteMapProps {
  depot: Depot;
  deliveries: Delivery[];
  vehicles?: Vehicle[];
  optimizationResult?: any;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicleId: string | null) => void;
  height?: string;
  showOverlayControls?: boolean;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  depot,
  deliveries,
  optimizationResult,
  selectedVehicleId = null,
  height = '100%',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const baseTileLayerRef = useRef<L.Layer | null>(null);

  const [activeFilter, setActiveFilter] = useState<string | null>(selectedVehicleId);
  const [mapStyle, setMapStyle] = useState<OpenFreeMapStyle>('positron');

  const routes: VehicleRoute[] = optimizationResult?.routes || [];

  useEffect(() => {
    setActiveFilter(selectedVehicleId);
  }, [selectedVehicleId]);

  // India Bounding Box coordinates
  const INDIA_BOUNDS = L.latLngBounds([
    [6.5, 68.0],   // Southwest corner of India
    [37.5, 97.5],  // Northeast corner of India
  ]);

  // Initialize Map container
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [depot.lat, depot.lng],
        zoom: 13,
        minZoom: 4,
        maxBounds: INDIA_BOUNDS,
        maxBoundsViscosity: 0.85,
        zoomControl: false,
        attributionControl: false,
      });

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Delayed resize invalidation to ensure Leaflet renders properly inside dynamic layouts
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Layer whenever mapStyle changes (OpenFreeMap vector tiles)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }

    try {
      // OpenFreeMap vector layer (https://github.com/hyperknot/openfreemap)
      const openFreeMapLayer = maplibreGL({
        style: `https://tiles.openfreemap.org/styles/${mapStyle}`,
      });
      openFreeMapLayer.addTo(map);
      baseTileLayerRef.current = openFreeMapLayer;
    } catch (err) {
      console.warn('OpenFreeMap vector tiles fallback to CartoDB raster tiles:', err);
      const fallbackLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);
      baseTileLayerRef.current = fallbackLayer;
    }
  }, [mapStyle]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [height]);

  // Draw Depot, Routes & Delivery Nodes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const group = layerGroupRef.current;
    group.clearLayers();

    const bounds = L.latLngBounds([[depot.lat, depot.lng]]);

    // Central Depot Marker (Geometric hub style)
    const depotIcon = L.divIcon({
      className: 'custom-depot-icon',
      html: `
        <div style="
          width: 38px; height: 38px; border-radius: 12px;
          background: #171A38;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 4px 14px rgba(23, 26, 56, 0.35);
          display: flex; align-items: center; justify-content: center;
          color: #FFFFFF; font-weight: 800; font-size: 11px;
          font-family: 'IBM Plex Mono', monospace;
        ">
          HUB
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    const depotMarker = L.marker([depot.lat, depot.lng], { icon: depotIcon });
    depotMarker.bindPopup(`
      <div style="padding: 6px 2px; font-family: 'Manrope', sans-serif;">
        <div style="font-size: 10px; font-weight: 700; color: #FF6B4A; letter-spacing: 0.5px; text-transform: uppercase;">
          CENTRAL DISPATCH DEPOT
        </div>
        <div style="font-weight: 700; font-size: 14px; color: #171A38; margin: 2px 0 6px;">
          ${depot.name}
        </div>
        <div style="font-size: 11px; color: #6B6D76; display: flex; gap: 8px; font-family: 'IBM Plex Mono';">
          <span>HOURS: ${depot.operating_hours_start} – ${depot.operating_hours_end}</span>
        </div>
      </div>
    `);
    group.addLayer(depotMarker);

    // Map deliveries to vehicle assignments
    const deliveryToVehicleMap: Record<
      string,
      { color: string; seq: number; vehicleName: string; arrival: string; isLate: boolean }
    > = {};

    routes.forEach((route, rIdx) => {
      const palette = ['#FF6B4A', '#E95AA8', '#3B82F6', '#10B981', '#F59E0B'];
      const routeColor = route.color || palette[rIdx % palette.length];

      route.waypoints?.forEach((wp) => {
        if (!wp.is_depot && wp.stop_id) {
          deliveryToVehicleMap[wp.stop_id] = {
            color: routeColor,
            seq: wp.sequence_index,
            vehicleName: route.vehicle_name || route.vehicle_id,
            arrival: wp.arrival_time,
            isLate: wp.is_late,
          };
        }
      });

      const isFiltered = activeFilter !== null && activeFilter !== route.vehicle_id;
      if (isFiltered) return;

      const latLngs = (route.waypoints || []).map((wp): [number, number] => [wp.lat, wp.lng]);
      if (latLngs.length > 1) {
        // Subtle Outer Glow Polyline
        const glowPolyline = L.polyline(latLngs, {
          color: routeColor,
          weight: activeFilter ? 6 : 4.5,
          opacity: activeFilter ? 0.35 : 0.2,
          lineCap: 'round',
          lineJoin: 'round',
        });
        group.addLayer(glowPolyline);

        // Core Route Polyline
        const polyline = L.polyline(latLngs, {
          color: routeColor,
          weight: activeFilter ? 3.5 : 2.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });

        polyline.bindPopup(`
          <div style="padding: 4px; font-family: 'Manrope', sans-serif;">
            <div style="font-size: 12px; font-weight: 700; color: ${routeColor};">
              Vehicle: ${route.vehicle_name || route.vehicle_id}
            </div>
            <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono'; margin-top: 4px;">
              <div>DISTANCE: ${route.total_distance_km.toFixed(1)} km</div>
              <div>DURATION: ${Math.round(route.total_time_mins)} mins</div>
              <div>DELIVERIES: ${route.deliveries_count} stops</div>
            </div>
          </div>
        `);
        group.addLayer(polyline);

        latLngs.forEach((coord) => bounds.extend(coord));
      }
    });

    // Draw Delivery Stop Markers
    deliveries.forEach((del) => {
      const assignment = deliveryToVehicleMap[del.id];
      if (activeFilter && !assignment) return;

      bounds.extend([del.lat, del.lng]);

      const markerBg = assignment ? assignment.color : '#8E909A';
      const seqText = assignment ? assignment.seq.toString() : '•';
      const priorityColor =
        del.priority === 'urgent'
          ? '#EF4444'
          : del.priority === 'high'
          ? '#F59E0B'
          : del.priority === 'medium'
          ? '#3B82F6'
          : '#10B981';

      const delIcon = L.divIcon({
        className: 'custom-del-icon',
        html: `
          <div style="
            width: 28px; height: 28px; border-radius: 50%;
            background: ${markerBg};
            border: 2px solid #FFFFFF;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: 700; font-size: 11px;
            font-family: 'IBM Plex Mono', monospace;
            position: relative;
            cursor: pointer;
          ">
            ${seqText}
            ${
              assignment?.isLate
                ? `<div style="position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; border-radius: 50%; background: #EF4444; border: 1.5px solid white;"></div>`
                : ''
            }
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const delMarker = L.marker([del.lat, del.lng], { icon: delIcon });
      delMarker.bindPopup(`
        <div style="padding: 4px 2px; min-width: 220px; font-family: 'Manrope', sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: #171A38; font-family: 'IBM Plex Mono';">${del.id}</span>
            <span style="background: ${priorityColor}15; color: ${priorityColor}; font-size: 9px; font-weight: 700; padding: 1.5px 6px; border-radius: 9999px; text-transform: uppercase;">
              ${del.priority}
            </span>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #171A38; margin-bottom: 2px;">${del.customer_name}</div>
          <div style="font-size: 11px; color: #6B6D76; margin-bottom: 4px;">📍 ${del.address || 'India Delivery Hub'}</div>
          <div style="font-size: 11px; color: #6B6D76; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px; padding-top: 4px; border-top: 1px solid #E8E6DF; font-family: 'IBM Plex Mono';">
            <div>LOAD: ${del.demand_kg} kg</div>
            <div>SERVICE: ${del.service_time_mins}m</div>
            <div style="grid-column: span 2;">WINDOW: ${del.time_window_start} – ${del.time_window_end}</div>
          </div>
        </div>
      `);
      group.addLayer(delMarker);
    });

    if (deliveries.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else {
      mapInstanceRef.current.setView([depot.lat, depot.lng], 13);
    }
  }, [depot, deliveries, routes, activeFilter]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetBounds = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([[depot.lat, depot.lng]]);
    deliveries.forEach((d) => bounds.extend([d.lat, d.lng]));
    if (deliveries.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else {
      mapInstanceRef.current.setView([depot.lat, depot.lng], 13);
    }
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E8E6DF] bg-[#F2F1EC] shadow-soft-sm"
      style={{ minHeight: '480px' }}
    >
      {/* Top Left: OpenFreeMap India Hub Badge */}
      <div className="absolute top-3.5 left-3.5 z-[1000] flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-sm pointer-events-none">
        <span className="text-sm leading-none select-none">🇮🇳</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[#171A38] tracking-wide">
            OPENFREEMAP &bull; INDIA GRID
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] text-[#6B6D76] font-mono truncate max-w-[140px]">
            {depot.name}
          </span>
        </div>
      </div>

      {/* Top Right: OpenFreeMap Style Switcher & Zoom Controls */}
      <div className="absolute top-3.5 right-3.5 z-[1000] flex items-center gap-2">
        {/* Style Selector */}
        <div className="flex items-center p-1 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-sm font-mono text-[10px]">
          {(['positron', 'liberty', 'bright'] as OpenFreeMapStyle[]).map((st) => (
            <button
              key={st}
              onClick={() => setMapStyle(st)}
              className={`px-2 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                mapStyle === st
                  ? 'bg-[#171A38] text-white font-bold shadow-xs'
                  : 'text-[#6B6D76] hover:text-[#171A38]'
              }`}
              title={`Switch OpenFreeMap style to ${st}`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#171A38] hover:text-[#FF6B4A] hover:bg-white shadow-sm transition-all cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#171A38] hover:text-[#FF6B4A] hover:bg-white shadow-sm transition-all cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetBounds}
            title="Recenter Map"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#171A38] hover:text-[#FF6B4A] hover:bg-white shadow-sm transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Minimal Status Readout */}
      <div className="absolute bottom-3.5 left-3.5 z-[1000] hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E6DF] font-mono text-[10px] text-[#6B6D76] shadow-sm">
        <div className="flex items-center gap-1.5 text-[#171A38] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>HUB: {depot.id}</span>
        </div>
        <span className="text-[#E8E6DF]">|</span>
        <div>STOPS: {deliveries.length}</div>
        <span className="text-[#E8E6DF]">|</span>
        <div>ROUTES: {routes.length || 'STANDBY'}</div>
      </div>

      {/* Bottom Right: OpenFreeMap Attribution */}
      <div className="absolute bottom-3.5 right-3.5 z-[1000] hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E6DF] font-mono text-[9px] text-[#6B6D76] shadow-sm">
        <span>Map:</span>
        <a
          href="https://github.com/hyperknot/openfreemap"
          target="_blank"
          rel="noreferrer"
          className="text-[#FF6B4A] hover:underline font-medium"
        >
          OpenFreeMap
        </a>
        <span>&bull;</span>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          © OSM
        </a>
      </div>

      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />
    </div>
  );
};
