import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Depot, Delivery, VehicleRoute, Vehicle } from '../../types';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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
  onSelectVehicle: _onSelectVehicle,
  height = '100%',
  showOverlayControls: _showOverlayControls,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(selectedVehicleId);

  const routes: VehicleRoute[] = optimizationResult?.routes || [];

  useEffect(() => {
    setActiveFilter(selectedVehicleId);
  }, [selectedVehicleId]);

  // India Bounding Box coordinates
  const INDIA_BOUNDS = L.latLngBounds([
    [6.5, 68.0],   // Southwest corner of India
    [37.5, 97.5],  // Northeast corner of India
  ]);

  // Initialize Map with dark cartographic styling constrained to India
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

      // CartoDB Dark Matter clean raster tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

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

    // 1. Central Logistics Depot Marker
    const depotIcon = L.divIcon({
      className: 'custom-depot-node',
      html: `
        <div style="
          width: 32px; height: 32px; position: relative;
          display: flex; align-items: center; justify-content: center;
        ">
          <div style="
            position: absolute; inset: 0; border: 1.5px solid #F5F5F5;
            border-radius: 6px; background: #080808;
            box-shadow: 0 0 12px rgba(255,255,255,0.25);
          "></div>
          <div style="
            position: relative; z-index: 10;
            color: #FFFFFF; font-family: 'JetBrains Mono', monospace;
            font-size: 9px; font-weight: 700; letter-spacing: 0.5px;
          ">
            HUB
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const depotMarker = L.marker([depot.lat, depot.lng], { icon: depotIcon });
    depotMarker.bindPopup(`
      <div style="padding: 4px 2px; min-width: 180px; font-family: 'Sora', sans-serif;">
        <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #FF5500; letter-spacing: 0.5px; font-family: 'JetBrains Mono';">Central Logistics Hub</div>
        <div style="font-weight: 600; font-size: 13px; margin-top: 2px; color: #FFFFFF;">${depot.name}</div>
        <div style="font-size: 11px; color: #8A8A8E; margin-top: 4px; font-family: 'JetBrains Mono';">ID: ${depot.id}</div>
        <div style="font-size: 11px; color: #8A8A8E; font-family: 'JetBrains Mono';">HOURS: ${depot.operating_hours_start} – ${depot.operating_hours_end}</div>
      </div>
    `);
    group.addLayer(depotMarker);

    const visibleRoutes = activeFilter
      ? routes.filter((r) => r.vehicle_id === activeFilter)
      : routes;

    const deliveryToVehicleMap: Record<
      string,
      { color: string; seq: number; vehicleName: string; isLate: boolean; arrival: string }
    > = {};

    // 2. Draw Route Polylines
    visibleRoutes.forEach((route, rIdx) => {
      const palette = ['#FF5500', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
      const routeColor = route.color || palette[rIdx % palette.length];

      route.waypoints.forEach((wp) => {
        if (!wp.is_depot) {
          deliveryToVehicleMap[wp.stop_id] = {
            color: routeColor,
            seq: wp.sequence_index,
            vehicleName: route.vehicle_name,
            isLate: wp.is_late,
            arrival: wp.arrival_time,
          };
        }
      });

      const latLngs = route.waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]);
      if (latLngs.length > 1) {
        // Outer soft polyline
        const glowPolyline = L.polyline(latLngs, {
          color: routeColor,
          weight: 4,
          opacity: 0.25,
          lineCap: 'round',
          lineJoin: 'round',
        });
        group.addLayer(glowPolyline);

        // Sharp inner polyline
        const polyline = L.polyline(latLngs, {
          color: routeColor,
          weight: 2,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        });

        polyline.bindPopup(`
          <div style="padding: 4px 2px; font-family: 'Sora', sans-serif;">
            <div style="font-weight: 600; color: ${routeColor}; font-size: 12px; font-family: 'Space Grotesk';">${route.vehicle_name}</div>
            <div style="font-size: 11px; color: #8A8A8E; margin-top: 3px; font-family: 'JetBrains Mono';">STOPS: ${route.deliveries_count} | DIST: ${route.total_distance_km} km</div>
            <div style="font-size: 11px; color: #8A8A8E; font-family: 'JetBrains Mono';">TIME: ${route.total_time_mins} mins | FUEL: ${route.fuel_consumed_l} L</div>
          </div>
        `);
        group.addLayer(polyline);

        latLngs.forEach((coord) => bounds.extend(coord));
      }
    });

    // 3. Delivery Stop Markers
    deliveries.forEach((del) => {
      const assignment = deliveryToVehicleMap[del.id];

      if (activeFilter && !assignment) {
        return;
      }

      bounds.extend([del.lat, del.lng]);

      const markerColor = assignment ? assignment.color : '#525252';
      const seqText = assignment ? assignment.seq.toString().padStart(2, '0') : '•';
      const isLate = assignment?.isLate;

      const delIcon = L.divIcon({
        className: 'custom-del-node',
        html: `
          <div style="
            width: 22px; height: 22px; border-radius: 4px;
            background: #080808; border: 1.5px solid ${isLate ? '#EC4899' : markerColor};
            display: flex; align-items: center; justify-content: center;
            color: #F5F5F5; font-family: 'JetBrains Mono', monospace;
            font-weight: 600; font-size: 9px; position: relative;
          ">
            ${seqText}
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const delMarker = L.marker([del.lat, del.lng], { icon: delIcon });
      delMarker.bindPopup(`
        <div style="padding: 4px 2px; min-width: 190px; font-family: 'Sora', sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <span style="font-size: 10px; font-weight: 700; color: #FFFFFF; font-family: 'JetBrains Mono';">${del.id}</span>
            <span style="background: rgba(255,255,255,0.06); color: #8A8A8E; font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 3px; text-transform: uppercase; font-family: 'JetBrains Mono';">${del.priority}</span>
          </div>
          <div style="font-weight: 600; font-size: 13px; color: #FFFFFF; margin-bottom: 2px;">${del.customer_name}</div>
          <div style="font-size: 11px; color: #8A8A8E; margin-bottom: 4px;">${del.address || 'Bengaluru Logistics Corridor, India'}</div>
          <div style="font-size: 11px; color: #8A8A8E; display: grid; grid-template-columns: 1fr 1fr; gap: 3px; margin-top: 4px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.08); font-family: 'JetBrains Mono';">
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
      className="relative w-full h-full rounded-lg overflow-hidden border border-white/[0.06] bg-[#080808]"
      style={{ minHeight: '480px' }}
    >
      {/* Top Left: India Hub Badge */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2.5 px-3 py-1.5 rounded bg-[#080808]/90 backdrop-blur-md border border-white/[0.08] shadow-xl pointer-events-none">
        <span className="text-base leading-none select-none">🇮🇳</span>
        <div className="flex flex-col">
          <div className="font-mono text-[10px] font-bold text-white tracking-wide flex items-center gap-1.5">
            <span>INDIA LOGISTICS CORRIDOR</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <div className="text-[9px] text-[#8A8A8E] font-mono truncate max-w-[220px]">
            {depot.name}
          </div>
        </div>
      </div>

      {/* Top Right: Minimal Zoom Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded bg-[#080808]/85 backdrop-blur-md border border-white/[0.08] text-[#8A8A8E] hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded bg-[#080808]/85 backdrop-blur-md border border-white/[0.08] text-[#8A8A8E] hover:text-white transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleResetBounds}
          title="Recenter"
          className="p-2 rounded bg-[#080808]/85 backdrop-blur-md border border-white/[0.08] text-[#8A8A8E] hover:text-white transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Minimal Status Readout */}
      <div className="absolute bottom-3 left-3 z-[1000] hidden sm:flex items-center gap-3 px-3 py-1.5 rounded bg-[#080808]/90 backdrop-blur-md border border-white/[0.06] font-mono text-[10px] text-[#8A8A8E]">
        <div className="flex items-center gap-1.5 text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>HUB: {depot.id}</span>
        </div>
        <span className="text-white/20">|</span>
        <div>STOPS: {deliveries.length}</div>
        <span className="text-white/20">|</span>
        <div>ROUTES: {routes.length || 'STANDBY'}</div>
      </div>

      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />
    </div>
  );
};
