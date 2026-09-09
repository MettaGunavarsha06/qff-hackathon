import React, { useEffect, useRef, useState } from 'react';
import type { Depot, Delivery, VehicleRoute, Vehicle } from '../../types';
import { ZoomIn, ZoomOut, Maximize2, Layers, AlertCircle, Key, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
  }
}

interface GoogleRouteMapProps {
  depot: Depot;
  deliveries: Delivery[];
  vehicles?: Vehicle[];
  optimizationResult?: any;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicleId: string | null) => void;
  selectedStopId?: string | null;
  onSelectStop?: (delivery: Delivery) => void;
  apiKey: string;
  onOpenKeyModal?: () => void;
}

// Minimal, elegant cartographic style tailored for RouteQ palette
const ROUTEQ_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f7f6f2' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a4c54' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1f2024' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b6d76' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e5e9df' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e8e6df' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#7c7e88' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#fed7aa' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#fdba74' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#ecebe4' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#dbeafe' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#60a5fa' }],
  },
];

export const GoogleRouteMap: React.FC<GoogleRouteMapProps> = ({
  depot,
  deliveries,
  optimizationResult,
  selectedVehicleId = null,
  onSelectVehicle,
  selectedStopId = null,
  onSelectStop,
  apiKey,
  onOpenKeyModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const polylinesRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const stopMarkersMapRef = useRef<Record<string, { marker: any; infoWindow: any }>>({});
  const activeInfoWindowRef = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  const routes: VehicleRoute[] = optimizationResult?.routes || [];

  // Load Google Maps JavaScript API
  useEffect(() => {
    if (!apiKey || apiKey.trim() === '') {
      setLoadError('No Google Maps API Key provided.');
      return;
    }

    // Capture auth failures (e.g. invalid API key)
    window.gm_authFailure = () => {
      setLoadError('Google Maps API authentication failed. Please check your API key.');
    };

    if (window.google?.maps) {
      setIsLoaded(true);
      setLoadError(null);
      return;
    }

    const existingScript = document.getElementById('google-maps-sdk');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'google-maps-sdk';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey.trim())}&libraries=geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
      setLoadError(null);
    };

    script.onerror = () => {
      setLoadError('Failed to load Google Maps JavaScript API. Verify network connectivity and API key.');
    };

    document.head.appendChild(script);

    return () => {
      // Keep script cached if possible, but cleanup error handler
      window.gm_authFailure = undefined;
    };
  }, [apiKey]);

  // Initialize Google Map Instance
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || !window.google?.maps) return;

    if (!mapInstanceRef.current) {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: { lat: depot.lat, lng: depot.lng },
        zoom: 13,
        mapTypeId: mapType,
        styles: mapType === 'roadmap' ? ROUTEQ_MAP_STYLES : null,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
      });

      const trafficLayer = new window.google.maps.TrafficLayer();
      if (trafficEnabled) {
        trafficLayer.setMap(map);
      }
      trafficLayerRef.current = trafficLayer;
      mapInstanceRef.current = map;
    }
  }, [isLoaded]);

  // Toggle Traffic Layer
  useEffect(() => {
    if (!trafficLayerRef.current || !mapInstanceRef.current) return;
    trafficLayerRef.current.setMap(trafficEnabled ? mapInstanceRef.current : null);
  }, [trafficEnabled]);

  // Toggle Map Type
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    mapInstanceRef.current.setMapTypeId(mapType);
    mapInstanceRef.current.setOptions({
      styles: mapType === 'roadmap' ? ROUTEQ_MAP_STYLES : null,
    });
  }, [mapType]);

  // Render Markers, Routes & Stops on the Map
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const map = mapInstanceRef.current;

    // Clear previous entities
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    stopMarkersMapRef.current = {};

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: depot.lat, lng: depot.lng });

    // 1. Central Logistics Hub (Depot Marker)
    const depotSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="10" fill="#1F2024" stroke="#FFFFFF" stroke-width="2.5" />
        <circle cx="32" cy="8" r="4.5" fill="#FF5B37" stroke="#FFFFFF" stroke-width="1.5" />
        <text x="20" y="24" fill="#FFFFFF" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="bold" text-anchor="middle">HUB</text>
      </svg>
    `)}`;

    const depotMarker = new window.google.maps.Marker({
      position: { lat: depot.lat, lng: depot.lng },
      map,
      title: depot.name,
      icon: {
        url: depotSvg,
        scaledSize: new window.google.maps.Size(36, 36),
        anchor: new window.google.maps.Point(18, 18),
      },
      zIndex: 100,
    });

    const depotInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 6px 4px; min-width: 200px; font-family: 'Manrope', sans-serif; color: #1F2024;">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #FF5B37; letter-spacing: 0.5px; font-family: 'IBM Plex Mono', monospace;">Central Logistics Hub</div>
          <div style="font-weight: 700; font-size: 14px; margin-top: 2px;">${depot.name}</div>
          <div style="font-size: 11px; color: #6B6D76; margin-top: 4px; font-family: 'IBM Plex Mono', monospace;">ID: ${depot.id}</div>
          <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono', monospace;">HOURS: ${depot.operating_hours_start} – ${depot.operating_hours_end}</div>
        </div>
      `,
    });

    depotMarker.addListener('click', () => {
      activeInfoWindowRef.current?.close();
      depotInfoWindow.open(map, depotMarker);
      activeInfoWindowRef.current = depotInfoWindow;
    });

    markersRef.current.push(depotMarker);

    const deliveryToVehicleMap: Record<
      string,
      { color: string; seq: number; vehicleName: string; vehicleId: string; isLate: boolean; arrival: string }
    > = {};

    // 2. Draw Routes (Polylines)
    routes.forEach((route, rIdx) => {
      const isSelected = selectedVehicleId ? route.vehicle_id === selectedVehicleId : false;
      const isAlternative = selectedVehicleId ? route.vehicle_id !== selectedVehicleId : false;

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

      const path = route.waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng }));
      if (path.length > 1) {
        path.forEach((pt) => bounds.extend(pt));

        if (isAlternative) {
          // Alternative route (subtle dashed line)
          const lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 0.7,
            scale: 2.5,
            strokeColor: '#94A3B8',
          };

          const altLine = new window.google.maps.Polyline({
            path,
            strokeOpacity: 0,
            icons: [{ icon: lineSymbol, offset: '0', repeat: '14px' }],
            map,
            zIndex: 10,
          });

          altLine.addListener('click', () => {
            if (onSelectVehicle) onSelectVehicle(route.vehicle_id);
          });
          polylinesRef.current.push(altLine);
        } else if (isSelected) {
          // Selected vehicle route: Outer Magenta/Coral Glow + Core Stroke
          const glowLine = new window.google.maps.Polyline({
            path,
            strokeColor: '#FF4D8D',
            strokeOpacity: 0.45,
            strokeWeight: 9,
            map,
            zIndex: 25,
          });
          polylinesRef.current.push(glowLine);

          const coreLine = new window.google.maps.Polyline({
            path,
            strokeColor: '#FF5B37',
            strokeOpacity: 1.0,
            strokeWeight: 4.5,
            map,
            zIndex: 30,
          });
          polylinesRef.current.push(coreLine);
        } else {
          // Overview mode (all vehicles active)
          const glowLine = new window.google.maps.Polyline({
            path,
            strokeColor: defaultColor,
            strokeOpacity: 0.2,
            strokeWeight: 6,
            map,
            zIndex: 15,
          });
          polylinesRef.current.push(glowLine);

          const polyline = new window.google.maps.Polyline({
            path,
            strokeColor: defaultColor,
            strokeOpacity: 0.9,
            strokeWeight: 3.5,
            map,
            zIndex: 20,
          });

          polyline.addListener('click', () => {
            if (onSelectVehicle) onSelectVehicle(route.vehicle_id);
          });
          polylinesRef.current.push(polyline);
        }

        // Mid-point Truck Vector Marker
        if (route.waypoints.length > 1) {
          const midWpIdx = Math.min(
            route.waypoints.length - 1,
            Math.max(1, Math.floor(route.waypoints.length / 2))
          );
          const truckWp = route.waypoints[midWpIdx];
          const strokeColor = isSelected ? '#FF5B37' : (isAlternative ? '#94A3B8' : defaultColor);

          const truckSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="28" height="28" rx="8" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="2.2" />
              <g transform="translate(4, 4)">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round"/>
                <path d="M15 18H9" stroke="${strokeColor}" stroke-width="2"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                <circle cx="17" cy="18" r="2" fill="none" stroke="${strokeColor}" stroke-width="2"/>
                <circle cx="7" cy="18" r="2" fill="none" stroke="${strokeColor}" stroke-width="2"/>
              </g>
            </svg>
          `)}`;

          const truckMarker = new window.google.maps.Marker({
            position: { lat: truckWp.lat, lng: truckWp.lng },
            map,
            title: `${route.vehicle_name} (Click to inspect)`,
            icon: {
              url: truckSvg,
              scaledSize: new window.google.maps.Size(28, 28),
              anchor: new window.google.maps.Point(14, 14),
            },
            zIndex: 40,
          });

          truckMarker.addListener('click', () => {
            if (onSelectVehicle) onSelectVehicle(route.vehicle_id);
          });
          markersRef.current.push(truckMarker);
        }
      }
    });

    // 3. Delivery Stop Markers
    deliveries.forEach((del) => {
      bounds.extend({ lat: del.lat, lng: del.lng });
      const assignment = deliveryToVehicleMap[del.id];
      const isAssignedToSelected = selectedVehicleId && assignment ? assignment.vehicleId === selectedVehicleId : false;
      const isMutedAlternative = selectedVehicleId && assignment ? assignment.vehicleId !== selectedVehicleId : false;

      let markerColor = assignment ? assignment.color : '#8E909A';
      if (isAssignedToSelected) {
        markerColor = '#FF5B37';
      } else if (isMutedAlternative) {
        markerColor = '#CBD5E1';
      }

      const seqText = assignment ? assignment.seq.toString().padStart(2, '0') : '•';
      const isLate = assignment?.isLate;
      const size = isAssignedToSelected ? 26 : 22;

      const stopSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="${isAssignedToSelected ? 13 : 11}" fill="#FFFFFF" stroke="${isLate ? '#FF4D8D' : markerColor}" stroke-width="${isAssignedToSelected ? 3 : 2}" />
          <text x="16" y="20" fill="${isAssignedToSelected ? '#FF5B37' : '#1F2024'}" font-family="'IBM Plex Mono', monospace" font-size="${isAssignedToSelected ? 11 : 9.5}" font-weight="bold" text-anchor="middle">${seqText}</text>
        </svg>
      `)}`;

      const delMarker = new window.google.maps.Marker({
        position: { lat: del.lat, lng: del.lng },
        map,
        title: `${del.id}: ${del.customer_name}`,
        icon: {
          url: stopSvg,
          scaledSize: new window.google.maps.Size(size, size),
          anchor: new window.google.maps.Point(size / 2, size / 2),
        },
        opacity: isMutedAlternative ? 0.6 : 1.0,
        zIndex: isAssignedToSelected ? 80 : 50,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 6px 4px; min-width: 210px; font-family: 'Manrope', sans-serif; color: #1F2024;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 11px; font-weight: 700; color: #1F2024; font-family: 'IBM Plex Mono', monospace;">${del.id}</span>
              <span style="background: rgba(255,91,55,0.1); color: #FF5B37; font-size: 9px; font-weight: 600; padding: 1px 6px; border-radius: 9999px; text-transform: uppercase; font-family: 'IBM Plex Mono', monospace;">${del.priority} PRIORITY</span>
            </div>
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${del.customer_name}</div>
            <div style="font-size: 11px; color: #6B6D76; margin-bottom: 4px;">${del.address || 'Logistics Destination, India'}</div>
            ${assignment ? `
              <div style="font-size: 10px; color: #FF5B37; font-weight: 600; font-family: 'IBM Plex Mono', monospace; margin-bottom: 4px;">
                ASSIGNED: ${assignment.vehicleName} (STOP #${assignment.seq}) &bull; ARRIVAL: ${assignment.arrival}
              </div>
            ` : ''}
            <div style="font-size: 11px; color: #6B6D76; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px; padding-top: 4px; border-top: 1px solid #E8E6DF; font-family: 'IBM Plex Mono', monospace;">
              <div>LOAD: ${del.demand_kg} kg</div>
              <div>SERVICE: ${del.service_time_mins}m</div>
              <div style="grid-column: span 2;">WINDOW: ${del.time_window_start} – ${del.time_window_end}</div>
            </div>
          </div>
        `,
      });

      delMarker.addListener('click', () => {
        activeInfoWindowRef.current?.close();
        infoWindow.open(map, delMarker);
        activeInfoWindowRef.current = infoWindow;
        if (onSelectStop) onSelectStop(del);
      });

      stopMarkersMapRef.current[del.id] = { marker: delMarker, infoWindow };
      markersRef.current.push(delMarker);
    });

    if (deliveries.length > 0) {
      map.fitBounds(bounds, { top: 45, bottom: 45, left: 45, right: 45 });
    }
  }, [isLoaded, depot, deliveries, routes, selectedVehicleId]);

  // Handle selectedStopId focus
  useEffect(() => {
    if (!selectedStopId || !mapInstanceRef.current || !stopMarkersMapRef.current[selectedStopId]) return;
    const entry = stopMarkersMapRef.current[selectedStopId];
    mapInstanceRef.current.panTo(entry.marker.getPosition());
    mapInstanceRef.current.setZoom(15);
    activeInfoWindowRef.current?.close();
    entry.infoWindow.open(mapInstanceRef.current, entry.marker);
    activeInfoWindowRef.current = entry.infoWindow;
  }, [selectedStopId]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 13) + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 13) - 1);
    }
  };

  const handleResetBounds = () => {
    if (!mapInstanceRef.current || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: depot.lat, lng: depot.lng });
    deliveries.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
    mapInstanceRef.current.fitBounds(bounds, { top: 45, bottom: 45, left: 45, right: 45 });
  };

  if (loadError) {
    return (
      <div className="relative w-full h-full min-h-[480px] rounded-2xl border border-red-200 bg-red-50/50 p-6 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="max-w-md space-y-1">
          <h3 className="font-bold text-base text-[#1F2024]">Google Maps API Notice</h3>
          <p className="text-xs text-[#6B6D76] leading-relaxed">
            {loadError}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenKeyModal && (
            <button
              onClick={onOpenKeyModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E8E6DF] text-xs font-mono font-semibold text-[#1F2024] hover:border-[#FF5B37] shadow-soft-sm transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#FF5B37]" />
              <span>Configure Google Maps API Key</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E8E6DF] bg-[#F7F6F2] shadow-soft-sm" style={{ minHeight: '480px' }}>
      {/* Top Left: Google Maps India Logistics Grid Badge */}
      <div className="absolute top-3.5 left-3.5 z-[10] flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-sm pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[#1F2024] tracking-wide">
            GOOGLE MAPS &bull; LIVE GRID
          </span>
          <span className="text-[10px] text-[#6B6D76] font-mono truncate max-w-[140px]">
            {depot.name}
          </span>
        </div>
      </div>

      {/* Top Right: Style Selector, Traffic Toggle & Zoom Controls */}
      <div className="absolute top-3.5 right-3.5 z-[10] flex items-center gap-2">
        {/* Live Traffic Toggle */}
        <button
          onClick={() => setTrafficEnabled(!trafficEnabled)}
          className={`px-2.5 py-1.5 rounded-xl border backdrop-blur-md text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
            trafficEnabled
              ? 'bg-[#10B981] border-[#10B981] text-white shadow-emerald-500/20'
              : 'bg-white/95 border-[#E8E6DF] text-[#6B6D76] hover:text-[#1F2024]'
          }`}
          title="Toggle Google Maps Real-Time Traffic Layer"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${trafficEnabled ? 'bg-white' : 'bg-[#6B6D76]'}`} />
          <span>TRAFFIC</span>
        </button>

        {/* Map Type Selector */}
        <div className="flex items-center p-1 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-sm font-mono text-[10px]">
          {(['roadmap', 'satellite', 'terrain'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-2 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                mapType === type
                  ? 'bg-[#1F2024] text-white font-bold shadow-xs'
                  : 'text-[#6B6D76] hover:text-[#1F2024]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Zoom & Recenter Controls */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white shadow-sm transition-all cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white shadow-sm transition-all cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetBounds}
            title="Recenter"
            className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white shadow-sm transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Status Readout */}
      <div className="absolute bottom-3.5 left-3.5 z-[10] hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E6DF] font-mono text-[10px] text-[#6B6D76] shadow-sm">
        <div className="flex items-center gap-1.5 text-[#1F2024] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
          <span>HUB: {depot.id}</span>
        </div>
        <span className="text-[#E8E6DF]">|</span>
        <div>STOPS: {deliveries.length}</div>
        <span className="text-[#E8E6DF]">|</span>
        <div>ROUTES: {routes.length || 'STANDBY'}</div>
      </div>

      {/* Google Maps Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />
    </div>
  );
};
