import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Depot, Delivery, VehicleRoute } from '../../types';
import { Layers, ZoomIn, ZoomOut, Maximize2, Navigation } from 'lucide-react';

interface RouteMapProps {
  depot: Depot;
  deliveries: Delivery[];
  routes?: VehicleRoute[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicleId: string | null) => void;
  height?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  depot,
  deliveries,
  routes = [],
  selectedVehicleId = null,
  onSelectVehicle,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(selectedVehicleId);

  // Sync internal filter state if external prop changes
  useEffect(() => {
    setActiveFilter(selectedVehicleId);
  }, [selectedVehicleId]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [depot.lat, depot.lng],
        zoom: 13,
        zoomControl: false,
      });

      // Sleek Dark Matter tile layer for premium AI/logistics feel
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate size on mount / height change
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }
  }, [height]);

  // Render Markers and Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    const bounds = L.latLngBounds([[depot.lat, depot.lng]]);

    // 1. Depot Marker
    const depotIcon = L.divIcon({
      className: 'custom-depot-marker-wrapper',
      html: `
        <div style="
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #2563eb);
          border: 3px solid #ffffff; box-shadow: 0 0 16px rgba(6,182,212,0.8);
          display: flex; align-items: center; justify-content: center; color: white;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    const depotMarker = L.marker([depot.lat, depot.lng], { icon: depotIcon });
    depotMarker.bindPopup(`
      <div style="padding: 6px 2px; min-width: 180px;">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #06b6d4; letter-spacing: 0.5px;">Central Logistics Hub</div>
        <div style="font-weight: 700; font-size: 14px; margin-top: 2px; color: #1e293b;">${depot.name}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">ID: ${depot.id}</div>
        <div style="font-size: 12px; color: #64748b;">Operating Hours: ${depot.operating_hours_start} – ${depot.operating_hours_end}</div>
      </div>
    `);
    group.addLayer(depotMarker);

    // Filter routes to display
    const visibleRoutes = activeFilter
      ? routes.filter((r) => r.vehicle_id === activeFilter)
      : routes;

    // Map deliveries to their assigned vehicle route for styling
    const deliveryToVehicleMap: Record<
      string,
      { color: string; seq: number; vehicleName: string; isLate: boolean; arrival: string }
    > = {};

    visibleRoutes.forEach((route) => {
      route.waypoints.forEach((wp) => {
        if (!wp.is_depot) {
          deliveryToVehicleMap[wp.stop_id] = {
            color: route.color,
            seq: wp.sequence_index,
            vehicleName: route.vehicle_name,
            isLate: wp.is_late,
            arrival: wp.arrival_time,
          };
        }
      });

      // Draw Route Polyline
      const latLngs = route.waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]);
      if (latLngs.length > 1) {
        const polyline = L.polyline(latLngs, {
          color: route.color,
          weight: 4.5,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: activeFilter && route.vehicle_id !== activeFilter ? '4, 8' : undefined,
        });

        polyline.bindPopup(`
          <div style="padding: 6px 2px;">
            <div style="font-weight: 700; color: ${route.color}; font-size: 13px;">${route.vehicle_name}</div>
            <div style="font-size: 12px; color: #475569; margin-top: 2px;">Stops: ${route.deliveries_count} | Distance: ${route.total_distance_km} km</div>
            <div style="font-size: 12px; color: #475569;">Travel Time: ${route.total_time_mins} mins | Fuel: ${route.fuel_consumed_l} L</div>
          </div>
        `);
        group.addLayer(polyline);

        latLngs.forEach((coord) => bounds.extend(coord));
      }
    });

    // 2. Delivery Markers
    deliveries.forEach((del) => {
      const assignment = deliveryToVehicleMap[del.id];

      // If active filter is set and delivery is not on that vehicle, skip or fade
      if (activeFilter && !assignment) {
        return;
      }

      bounds.extend([del.lat, del.lng]);

      const markerBg = assignment ? assignment.color : '#64748b';
      const seqText = assignment ? assignment.seq.toString() : '•';
      const priorityColor =
        del.priority === 'urgent'
          ? '#ef4444'
          : del.priority === 'high'
          ? '#f59e0b'
          : del.priority === 'medium'
          ? '#3b82f6'
          : '#10b981';

      const delIcon = L.divIcon({
        className: 'custom-del-icon',
        html: `
          <div style="
            width: 28px; height: 28px; border-radius: 50%;
            background: ${markerBg}; border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: 700; font-size: 11px;
            position: relative;
          ">
            ${seqText}
            ${
              assignment?.isLate
                ? `<div style="position: absolute; top: -3px; right: -3px; width: 9px; height: 9px; border-radius: 50%; background: #ef4444; border: 1.5px solid white;"></div>`
                : ''
            }
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const delMarker = L.marker([del.lat, del.lng], { icon: delIcon });
      delMarker.bindPopup(`
        <div style="padding: 6px 2px; min-width: 210px; color: #1e293b;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; color: #06b6d4;">${del.id}</span>
            <span style="background: ${priorityColor}20; color: ${priorityColor}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; text-transform: uppercase;">${del.priority}</span>
          </div>
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${del.customer_name}</div>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">📍 ${del.address || 'San Francisco, CA'}</div>
          <div style="font-size: 12px; color: #475569; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
            <div><strong>Demand:</strong> ${del.demand_kg} kg</div>
            <div><strong>Service:</strong> ${del.service_time_mins} min</div>
            <div style="grid-column: span 2;"><strong>Time Window:</strong> ${del.time_window_start} – ${del.time_window_end}</div>
          </div>
          ${
            assignment
              ? `
            <div style="margin-top: 8px; padding: 6px 8px; border-radius: 6px; background: ${assignment.color}15; border-left: 3px solid ${assignment.color};">
              <div style="font-size: 11px; font-weight: 700; color: ${assignment.color};">Assigned to: ${assignment.vehicleName}</div>
              <div style="font-size: 11px; color: #475569;">Estimated Arrival: <strong>${assignment.arrival}</strong> (Stop #${assignment.seq})</div>
              ${assignment.isLate ? `<div style="font-size: 11px; color: #ef4444; font-weight: 700; margin-top: 2px;">⚠️ Late Delivery Warning</div>` : `<div style="font-size: 11px; color: #10b981; font-weight: 600; margin-top: 2px;">✓ On-Time Delivery</div>`}
            </div>
          `
              : `<div style="margin-top: 6px; font-size: 11px; color: #94a3b8; font-style: italic;">Unassigned</div>`
          }
        </div>
      `);
      group.addLayer(delMarker);
    });

    if (deliveries.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [depot, deliveries, routes, activeFilter]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetBounds = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([[depot.lat, depot.lng]]);
    deliveries.forEach((d) => bounds.extend([d.lat, d.lng]));
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  };

  const handleSelectRoute = (vehId: string | null) => {
    setActiveFilter(vehId);
    if (onSelectVehicle) onSelectVehicle(vehId);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900" style={{ height }}>
      {/* Route Filter Pills Header */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg text-xs">
        <button
          onClick={() => handleSelectRoute(null)}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            activeFilter === null
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          All Routes ({routes.length})
        </button>

        {routes.map((r) => (
          <button
            key={r.vehicle_id}
            onClick={() => handleSelectRoute(r.vehicle_id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === r.vehicle_id
                ? 'text-white font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            style={{
              backgroundColor: activeFilter === r.vehicle_id ? r.color : undefined,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: r.color }}
            />
            {r.vehicle_id} ({r.deliveries_count})
          </button>
        ))}
      </div>

      {/* Map Control Buttons */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetBounds}
          title="Fit All Locations"
          className="p-2 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 shadow-lg transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Map Bottom Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-lg text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white" />
          <span>Central Depot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
          <span>Delivery Stop</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Late Window Alert</span>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
