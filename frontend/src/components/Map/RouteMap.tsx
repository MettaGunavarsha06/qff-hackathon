import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Depot, Delivery, VehicleRoute, Vehicle } from '../../types';
import { ZoomIn, ZoomOut, Maximize2, Key, X, Check, MapPin } from 'lucide-react';
import { GoogleRouteMap } from './GoogleRouteMap';

interface RouteMapProps {
  depot: Depot;
  deliveries: Delivery[];
  vehicles?: Vehicle[];
  optimizationResult?: any;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicleId: string | null) => void;
  selectedStopId?: string | null;
  onSelectStop?: (delivery: Delivery) => void;
  height?: string;
  showOverlayControls?: boolean;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  depot,
  deliveries,
  vehicles,
  optimizationResult,
  selectedVehicleId = null,
  onSelectVehicle,
  selectedStopId = null,
  onSelectStop,
  height = '100%',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const stopMarkersRef = useRef<Record<string, L.Marker>>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(selectedVehicleId);

  // Map Provider State: 'leaflet' | 'google'
  const [mapProvider, setMapProvider] = useState<'leaflet' | 'google'>(() => {
    return (localStorage.getItem('routeq_map_provider') as 'leaflet' | 'google') || 'leaflet';
  });

  // Google Maps API Key state
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('routeq_gmaps_api_key') ||
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      ''
    );
  });
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>(apiKey);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const routes: VehicleRoute[] = optimizationResult?.routes || [];

  useEffect(() => {
    setActiveFilter(selectedVehicleId);
  }, [selectedVehicleId]);

  // India Bounding Box coordinates
  const INDIA_BOUNDS = L.latLngBounds([
    [6.5, 68.0],   // Southwest corner of India
    [37.5, 97.5],  // Northeast corner of India
  ]);

  // Initialize Map with clean light cartographic styling constrained to India
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

      // CartoDB Positron clean light raster tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
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
    stopMarkersRef.current = {};

    const bounds = L.latLngBounds([[depot.lat, depot.lng]]);

    // 1. Central Logistics Depot Marker (Custom Minimal Geometric Monogram)
    const depotIcon = L.divIcon({
      className: 'custom-depot-node',
      html: `
        <div style="
          width: 32px; height: 32px; position: relative;
          display: flex; align-items: center; justify-content: center;
        ">
          <div style="
            position: absolute; inset: 0; border: 2px solid #1F2024;
            border-radius: 8px; background: #FFFFFF;
            box-shadow: 0 4px 14px rgba(31,32,36,0.15);
          "></div>
          <div style="
            position: absolute; width: 8px; height: 8px; border-radius: 50%;
            background: linear-gradient(135deg, #FF5B37, #FF4D8D);
            top: -3px; right: -3px;
          "></div>
          <div style="
            position: relative; z-index: 10;
            color: #1F2024; font-family: 'IBM Plex Mono', monospace;
            font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
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
      <div style="padding: 4px 2px; min-width: 190px; font-family: 'Manrope', sans-serif;">
        <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #FF5B37; letter-spacing: 0.5px; font-family: 'IBM Plex Mono';">Central Logistics Hub</div>
        <div style="font-weight: 700; font-size: 13px; margin-top: 2px; color: #1F2024;">${depot.name}</div>
        <div style="font-size: 11px; color: #6B6D76; margin-top: 4px; font-family: 'IBM Plex Mono';">ID: ${depot.id}</div>
        <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono';">HOURS: ${depot.operating_hours_start} – ${depot.operating_hours_end}</div>
      </div>
    `);
    group.addLayer(depotMarker);

    const deliveryToVehicleMap: Record<
      string,
      { color: string; seq: number; vehicleName: string; vehicleId: string; isLate: boolean; arrival: string }
    > = {};

    // 2. Draw Route Polylines
    routes.forEach((route, rIdx) => {
      const isSelected = activeFilter ? route.vehicle_id === activeFilter : false;
      const isAlternative = activeFilter ? route.vehicle_id !== activeFilter : false;

      const palette = ['#FF5B37', '#FF4D8D', '#3B82F6', '#10B981', '#F59E0B'];
      const defaultColor = route.color || palette[rIdx % palette.length];

      route.waypoints.forEach((wp) => {
        if (!wp.is_depot) {
          deliveryToVehicleMap[wp.stop_id] = {
            color: defaultColor,
            seq: wp.sequence_index,
            vehicleName: route.vehicle_name,
            vehicleId: route.vehicle_id,
            isLate: wp.is_late,
            arrival: wp.arrival_time,
          };
        }
      });

      const latLngs = route.waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]);
      if (latLngs.length > 1) {
        if (isAlternative) {
          // Alternative routes: Subtle dashed lines
          const altPolyline = L.polyline(latLngs, {
            color: '#94A3B8',
            weight: 2.2,
            opacity: 0.38,
            dashArray: '6, 8',
            lineCap: 'round',
            lineJoin: 'round',
          });
          altPolyline.bindPopup(`
            <div style="padding: 4px 2px; font-family: 'Manrope', sans-serif;">
              <div style="font-weight: 700; color: #64748B; font-size: 13px;">${route.vehicle_name} (Alternative)</div>
              <div style="font-size: 11px; color: #6B6D76; margin-top: 3px; font-family: 'IBM Plex Mono';">STOPS: ${route.deliveries_count} | DIST: ${route.total_distance_km.toFixed(1)} km</div>
              <div style="font-size: 10px; color: #FF5B37; margin-top: 4px; font-weight: 600; cursor: pointer;">Click to switch to this route</div>
            </div>
          `);
          altPolyline.on('click', () => {
            if (onSelectVehicle) onSelectVehicle(route.vehicle_id);
          });
          group.addLayer(altPolyline);
        } else if (isSelected) {
          // Selected vehicle route: RouteQ Orange -> Pink gradient highlight
          // Layer 1: Soft Outer Magenta Glow
          const glowPolyline = L.polyline(latLngs, {
            color: '#FF4D8D',
            weight: 8,
            opacity: 0.45,
            lineCap: 'round',
            lineJoin: 'round',
          });
          group.addLayer(glowPolyline);

          // Layer 2: Core Vibrant RouteQ Coral Route
          const corePolyline = L.polyline(latLngs, {
            color: '#FF5B37',
            weight: 4.5,
            opacity: 1.0,
            lineCap: 'round',
            lineJoin: 'round',
          });
          corePolyline.bindPopup(`
            <div style="padding: 4px 2px; font-family: 'Manrope', sans-serif;">
              <div style="font-weight: 700; color: #FF5B37; font-size: 13px;">${route.vehicle_name} (Selected)</div>
              <div style="font-size: 11px; color: #6B6D76; margin-top: 3px; font-family: 'IBM Plex Mono';">STOPS: ${route.deliveries_count} | DIST: ${route.total_distance_km.toFixed(1)} km</div>
              <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono';">TIME: ${Math.round(route.total_time_mins)} mins | FUEL: ${route.fuel_consumed_l.toFixed(1)} L</div>
            </div>
          `);
          group.addLayer(corePolyline);
        } else {
          // Overview mode (all vehicles active)
          const glowPolyline = L.polyline(latLngs, {
            color: defaultColor,
            weight: 5,
            opacity: 0.22,
            lineCap: 'round',
            lineJoin: 'round',
          });
          group.addLayer(glowPolyline);

          const polyline = L.polyline(latLngs, {
            color: defaultColor,
            weight: 3,
            opacity: 0.92,
            lineCap: 'round',
            lineJoin: 'round',
          });
          polyline.bindPopup(`
            <div style="padding: 4px 2px; font-family: 'Manrope', sans-serif;">
              <div style="font-weight: 700; color: ${defaultColor}; font-size: 13px;">${route.vehicle_name}</div>
              <div style="font-size: 11px; color: #6B6D76; margin-top: 3px; font-family: 'IBM Plex Mono';">STOPS: ${route.deliveries_count} | DIST: ${route.total_distance_km.toFixed(1)} km</div>
              <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono';">TIME: ${Math.round(route.total_time_mins)} mins | FUEL: ${route.fuel_consumed_l.toFixed(1)} L</div>
            </div>
          `);
          polyline.on('click', () => {
            if (onSelectVehicle) onSelectVehicle(route.vehicle_id);
          });
          group.addLayer(polyline);
        }

        // Vector Truck Marker for each active vehicle
        if (route.waypoints.length > 1) {
          const midWpIdx = Math.min(route.waypoints.length - 1, Math.max(1, Math.floor(route.waypoints.length / 2)));
          const truckWp = route.waypoints[midWpIdx];
          const strokeColor = isSelected ? '#FF5B37' : (isAlternative ? '#94A3B8' : defaultColor);
          const shadowStyle = isSelected
            ? 'box-shadow: 0 0 14px rgba(255, 91, 55, 0.55);'
            : 'box-shadow: 0 4px 12px rgba(0,0,0,0.15);';

          const truckIcon = L.divIcon({
            className: 'custom-vehicle-truck-node',
            html: `
              <div style="
                display: flex; align-items: center; justify-content: center;
                width: 28px; height: 28px; border-radius: 8px;
                background: #FFFFFF; border: 2px solid ${strokeColor};
                ${shadowStyle}
                cursor: pointer; transition: transform 0.2s ease;
                opacity: ${isAlternative ? 0.65 : 1};
              " title="${route.vehicle_name} (Click to inspect)">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                  <path d="M15 18H9"/>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                  <circle cx="17" cy="18" r="2"/>
                  <circle cx="7" cy="18" r="2"/>
                </svg>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          const truckMarker = L.marker([truckWp.lat, truckWp.lng], { icon: truckIcon });
          truckMarker.on('click', () => {
            if (onSelectVehicle) onSelectVehicle(route.vehicle_id);
          });
          truckMarker.bindPopup(`
            <div style="padding: 4px 2px; font-family: 'Manrope', sans-serif;">
              <div style="font-weight: 700; color: ${strokeColor}; font-size: 13px;">${route.vehicle_name}</div>
              <div style="font-size: 11px; color: #6B6D76; margin-top: 3px; font-family: 'IBM Plex Mono';">CAPACITY: ${route.capacity_used_kg} kg (${route.capacity_utilization_pct}%)</div>
              <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono';">STOPS: ${route.deliveries_count} | DIST: ${route.total_distance_km.toFixed(1)} km</div>
            </div>
          `);
          group.addLayer(truckMarker);
        }

        latLngs.forEach((coord) => bounds.extend(coord));
      }
    });

    // 3. Delivery Stop Markers
    deliveries.forEach((del) => {
      const assignment = deliveryToVehicleMap[del.id];
      const isAssignedToSelected = activeFilter && assignment ? assignment.vehicleId === activeFilter : false;
      const isMutedAlternative = activeFilter && assignment ? assignment.vehicleId !== activeFilter : false;

      bounds.extend([del.lat, del.lng]);

      let markerColor = assignment ? assignment.color : '#8E909A';
      if (isAssignedToSelected) {
        markerColor = '#FF5B37';
      } else if (isMutedAlternative) {
        markerColor = '#CBD5E1';
      }

      const seqText = assignment ? assignment.seq.toString().padStart(2, '0') : '•';
      const isLate = assignment?.isLate;

      const delIcon = L.divIcon({
        className: 'custom-del-node',
        html: `
          <div style="
            width: ${isAssignedToSelected ? '24px' : '20px'};
            height: ${isAssignedToSelected ? '24px' : '20px'};
            border-radius: 50%;
            background: #FFFFFF;
            border: ${isAssignedToSelected ? '2.5px solid #FF5B37' : `2px solid ${isLate ? '#FF4D8D' : markerColor}`};
            box-shadow: ${isAssignedToSelected ? '0 0 10px rgba(255,91,55,0.45)' : '0 2px 6px rgba(31,32,36,0.12)'};
            display: flex; align-items: center; justify-content: center;
            color: ${isAssignedToSelected ? '#FF5B37' : (isMutedAlternative ? '#94A3B8' : '#1F2024')};
            font-family: 'IBM Plex Mono', monospace;
            font-weight: 700;
            font-size: ${isAssignedToSelected ? '10px' : '8.5px'};
            position: relative;
            opacity: ${isMutedAlternative ? 0.6 : 1};
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${seqText}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const delMarker = L.marker([del.lat, del.lng], { icon: delIcon });
      delMarker.bindPopup(`
        <div style="padding: 4px 2px; min-width: 200px; font-family: 'Manrope', sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <span style="font-size: 11px; font-weight: 700; color: #1F2024; font-family: 'IBM Plex Mono';">${del.id}</span>
            <span style="background: rgba(255,91,55,0.1); color: #FF5B37; font-size: 9px; font-weight: 600; padding: 1px 6px; border-radius: 9999px; text-transform: uppercase; font-family: 'IBM Plex Mono';">${del.priority}</span>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #1F2024; margin-bottom: 2px;">${del.customer_name}</div>
          <div style="font-size: 11px; color: #6B6D76; margin-bottom: 4px;">${del.address || 'Bengaluru Logistics Corridor, India'}</div>
          ${assignment ? `
            <div style="font-size: 10px; color: #FF5B37; font-weight: 600; font-family: 'IBM Plex Mono'; margin-bottom: 4px;">
              ASSIGNED: ${assignment.vehicleName} (STOP #${assignment.seq}) &bull; ARRIVAL: ${assignment.arrival}
            </div>
          ` : ''}
          <div style="font-size: 11px; color: #6B6D76; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px; padding-top: 4px; border-top: 1px solid #E8E6DF; font-family: 'IBM Plex Mono';">
            <div>LOAD: ${del.demand_kg} kg</div>
            <div>SERVICE: ${del.service_time_mins}m</div>
            <div style="grid-column: span 2;">WINDOW: ${del.time_window_start} – ${del.time_window_end}</div>
          </div>
        </div>
      `);

      delMarker.on('click', () => {
        if (onSelectStop) onSelectStop(del);
      });

      stopMarkersRef.current[del.id] = delMarker;
      group.addLayer(delMarker);
    });

    if (deliveries.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else {
      mapInstanceRef.current.setView([depot.lat, depot.lng], 13);
    }
  }, [depot, deliveries, routes, activeFilter]);

  // When selectedStopId changes, smoothly pan to and open its popup
  useEffect(() => {
    if (selectedStopId && mapInstanceRef.current && stopMarkersRef.current[selectedStopId]) {
      const marker = stopMarkersRef.current[selectedStopId];
      mapInstanceRef.current.setView(marker.getLatLng(), 15, { animate: true });
      marker.openPopup();
    }
  }, [selectedStopId]);

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

  const handleSaveKey = () => {
    const trimmed = tempKey.trim();
    setApiKey(trimmed);
    localStorage.setItem('routeq_gmaps_api_key', trimmed);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowKeyModal(false);
    }, 800);
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E8E6DF] bg-[#F2F1EC] shadow-soft-sm"
      style={{ minHeight: '480px' }}
    >
      {/* If Google Maps provider is active, render GoogleRouteMap */}
      {mapProvider === 'google' ? (
        <GoogleRouteMap
          depot={depot}
          deliveries={deliveries}
          vehicles={vehicles}
          optimizationResult={optimizationResult}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={onSelectVehicle}
          selectedStopId={selectedStopId}
          onSelectStop={onSelectStop}
          apiKey={apiKey}
          onOpenKeyModal={() => {
            setTempKey(apiKey);
            setShowKeyModal(true);
          }}
        />
      ) : (
        <>
          {/* Top Left: India Hub Badge */}
          <div className="absolute top-3.5 left-3.5 z-[1000] flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E6DF] shadow-sm pointer-events-none">
            <span className="text-sm leading-none select-none">🇮🇳</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-[#1F2024] tracking-wide">
                INDIA LOGISTICS GRID
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] text-[#6B6D76] font-mono truncate max-w-[140px]">
                {depot.name}
              </span>
            </div>
          </div>

          {/* Top Right: Minimal Zoom Controls */}
          <div className="absolute top-3.5 right-3.5 z-[1000] flex flex-col gap-1.5">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white shadow-sm transition-all cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white shadow-sm transition-all cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetBounds}
              title="Recenter"
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white shadow-sm transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Minimal Status Readout */}
          <div className="absolute bottom-3.5 left-3.5 z-[1000] hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E6DF] font-mono text-[10px] text-[#6B6D76] shadow-sm">
            <div className="flex items-center gap-1.5 text-[#1F2024] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>HUB: {depot.id}</span>
            </div>
            <span className="text-[#E8E6DF]">|</span>
            <div>STOPS: {deliveries.length}</div>
            <span className="text-[#E8E6DF]">|</span>
            <div>ROUTES: {routes.length || 'STANDBY'}</div>
          </div>

          {/* Leaflet Canvas Container */}
          <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />
        </>
      )}

      {/* Floating Map Engine Switcher & Google API Key Config (Pinned Top Center / Right) */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-[1001] flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-soft-sm font-mono text-[10px]">
        <button
          onClick={() => {
            setMapProvider('leaflet');
            localStorage.setItem('routeq_map_provider', 'leaflet');
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            mapProvider === 'leaflet'
              ? 'bg-[#1F2024] text-white shadow-xs'
              : 'text-[#6B6D76] hover:text-[#1F2024]'
          }`}
          title="Switch to Leaflet (OpenStreetMap / CartoDB raster tiles)"
        >
          LEAFLET
        </button>
        <button
          onClick={() => {
            if (!apiKey) {
              setTempKey(apiKey);
              setShowKeyModal(true);
            }
            setMapProvider('google');
            localStorage.setItem('routeq_map_provider', 'google');
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            mapProvider === 'google'
              ? 'bg-[#1F2024] text-white shadow-xs'
              : 'text-[#6B6D76] hover:text-[#1F2024]'
          }`}
          title="Switch to Google Maps (Real-Time Traffic, Satellite & Roadmaps)"
        >
          <span>GOOGLE MAPS</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              apiKey ? 'bg-[#34A853]' : 'bg-[#F59E0B] animate-pulse'
            }`}
          />
        </button>

        <button
          onClick={() => {
            setTempKey(apiKey);
            setShowKeyModal(true);
          }}
          title="Configure Google Maps API Key"
          className="p-1.5 rounded-xl text-[#6B6D76] hover:text-[#FF5B37] hover:bg-[#F7F6F2] transition-colors cursor-pointer"
        >
          <Key className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Google Maps API Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl border border-[#E8E6DF] shadow-soft-xl max-w-md w-full p-6 space-y-5 text-[#1F2024] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F7F6F2] text-[#6B6D76] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#FF5B37] uppercase">
                  MAP PROVIDER &bull; GOOGLE MAPS
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1F2024]">Configure API Key</h3>
              <p className="text-xs text-[#6B6D76] leading-relaxed">
                Provide your Google Maps JavaScript API key to enable live traffic layers, satellite imagery, and high-fidelity routing cartography.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[#6B6D76] block">
                GOOGLE MAPS JAVASCRIPT API KEY
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6DF] bg-[#FAF9F6] font-mono text-xs text-[#1F2024] focus:outline-none focus:border-[#FF5B37] focus:bg-white transition-all pr-10"
                />
                <Key className="w-4 h-4 text-[#8E909A] absolute right-3 top-3 pointer-events-none" />
              </div>
              <p className="text-[10px] text-[#8E909A] font-mono">
                Saved securely in local browser storage or configured via <code className="bg-[#F2F1EC] px-1 py-0.5 rounded text-[#1F2024]">VITE_GOOGLE_MAPS_API_KEY</code> in <code className="bg-[#F2F1EC] px-1 py-0.5 rounded text-[#1F2024]">.env</code>.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#E8E6DF]">
              <a
                href="https://console.cloud.google.com/google/maps-apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-[#FF5B37] hover:underline"
              >
                Get Google API Key &rarr;
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#6B6D76] hover:bg-[#F7F6F2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  className="px-4 py-2 rounded-xl bg-[#1F2024] text-white text-xs font-mono font-bold hover:bg-black transition-all flex items-center gap-1.5 shadow-soft-sm cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save & Apply</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
