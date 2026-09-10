import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Depot, Delivery, VehicleRoute, Vehicle } from '../../types';
import { MAP_LAYERS } from '../../config/mapProviders';
import { calculateDirections, calculateMultiStopRoute } from '../../services/routing';
import type { TravelMode, RouteResult } from '../../services/routing';
import type { GeocodingResult } from '../../services/geocoding';
import { LocationButton } from './LocationButton';
import { SearchBox } from './SearchBox';
import { LayerControl } from './LayerControl';
import type { ActiveMapLayer } from './LayerControl';
import { DirectionsPanel } from './DirectionsPanel';
import { MapControls } from './MapControls';
import { generateMarkerPopupHtml } from './MarkerPopup';
import { TrafficLegend } from './TrafficLegend';
import { defaultTrafficProvider } from '../../services/traffic';
import type { TrafficSnapshot } from '../../services/traffic';
import { AlertCircle, Check, X } from 'lucide-react';

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
  optimizationResult,
  selectedVehicleId = null,
  onSelectVehicle,
  selectedStopId = null,
  onSelectStop,
  height = '100%',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const logisticsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const directionsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const searchLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const trafficLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const districtBoundaryLayerRef = useRef<L.LayerGroup | null>(null);
  const stopMarkersRef = useRef<Record<string, L.Marker>>({});

  // Active Map Layer: 'street' | 'satellite' | 'terrain'
  const [activeLayer, setActiveLayer] = useState<ActiveMapLayer>('street');
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(false);
  const [trafficSnapshot, setTrafficSnapshot] = useState<TrafficSnapshot | null>(null);
  const [isRefreshingTraffic, setIsRefreshingTraffic] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(13);
  const hasInitialFitRef = useRef<boolean>(false);

  // Status banners & notices
  const [systemNotice, setSystemNotice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Directions State
  const [directionsOrigin, setDirectionsOrigin] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [directionsDestination, setDirectionsDestination] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [isRouting, setIsRouting] = useState<boolean>(false);

  const routes: VehicleRoute[] = optimizationResult?.routes || [];
  const [roadGeometries, setRoadGeometries] = useState<Record<string, [number, number][]>>({});

  // Asynchronously resolve street/road network geometries for each active vehicle route
  useEffect(() => {
    if (!routes || routes.length === 0) return;
    let isCancelled = false;

    routes.forEach((route) => {
      // If the route object already has road geometry attached, use it directly
      if (route.geometry && route.geometry.length > 1) {
        setRoadGeometries((prev) => ({
          ...prev,
          [route.vehicle_id]: route.geometry!,
        }));
        return;
      }

      if (route.waypoints && route.waypoints.length > 1) {
        const coords = route.waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng }));
        calculateMultiStopRoute(coords, 'driving')
          .then((resolved) => {
            if (!isCancelled && resolved && resolved.length > 0) {
              setRoadGeometries((prev) => ({
                ...prev,
                [route.vehicle_id]: resolved,
              }));
            }
          })
          .catch((err) => {
            console.warn('[RouteMap] Could not resolve road network for', route.vehicle_id, err);
          });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [routes]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const showNotice = useCallback((msg: string) => {
    setSystemNotice(msg);
    setTimeout(() => setSystemNotice(null), 4500);
  }, []);

  // 1. Initialize Global Leaflet Map (Supports long zoom 1 to very close zoom 22)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Check for shareable URL query coordinates: ?lat=...&lng=...&zoom=...
      const searchParams = new URLSearchParams(window.location.search);
      const urlLat = parseFloat(searchParams.get('lat') || '');
      const urlLng = parseFloat(searchParams.get('lng') || '');
      const urlZoom = parseInt(searchParams.get('zoom') || '', 10);

      const initialCenter: [number, number] =
        !isNaN(urlLat) && !isNaN(urlLng) ? [urlLat, urlLng] : [depot.lat, depot.lng];
      const initialZoom = !isNaN(urlZoom) ? urlZoom : 13;
      setCurrentZoom(initialZoom);

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 1, // Long zoom: full world global view
        maxZoom: 22, // Very close zoom: building, vehicle & meter level
        zoomSnap: 1,
        zoomDelta: 1,
        wheelPxPerZoomLevel: 60,
        wheelDebounceTime: 40,
        zoomControl: false,
        attributionControl: false,
      });

      // Track zoom level for controls and indicator
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Standard OpenStreetMap Tile Layer with Overzooming support
      const initialLayerConfig = MAP_LAYERS.street;
      const tile = L.tileLayer(initialLayerConfig.url, {
        maxZoom: initialLayerConfig.maxZoom || 22,
        maxNativeZoom: initialLayerConfig.maxNativeZoom || 19,
        minZoom: initialLayerConfig.minZoom || 1,
        attribution: initialLayerConfig.attribution,
      });

      tile.on('tileerror', () => {
        showNotice('Map could not be loaded. Please check your internet connection.');
      });

      tile.addTo(map);
      tileLayerRef.current = tile;

      // Attribution control in bottom right
      L.control
        .attribution({
          position: 'bottomright',
          prefix: '<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>',
        })
        .addTo(map);

      // Layer groups for clean separation of concerns
      districtBoundaryLayerRef.current = L.layerGroup().addTo(map);
      logisticsLayerGroupRef.current = L.layerGroup().addTo(map);
      directionsLayerGroupRef.current = L.layerGroup().addTo(map);
      searchLayerGroupRef.current = L.layerGroup().addTo(map);
      userLocationLayerGroupRef.current = L.layerGroup().addTo(map);

      // Dedicated Traffic Pane (above base tiles at 200, beneath markers at 600)
      if (!map.getPane('trafficPane')) {
        const tPane = map.createPane('trafficPane');
        tPane.style.zIndex = '380';
      }
      trafficLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Delayed resize invalidation
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    const handleFlyTo = (e: any) => {
      if (e.detail && mapInstanceRef.current) {
        const { lat, lng, zoom } = e.detail;
        mapInstanceRef.current.flyTo([lat, lng], zoom || 12, { duration: 1.2 });
      }
    };
    window.addEventListener('routeq_map_flyto', handleFlyTo);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('routeq_map_flyto', handleFlyTo);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when user switches between Street, Satellite, Terrain
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const config = MAP_LAYERS[activeLayer];

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const newTileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom || 22,
      maxNativeZoom: config.maxNativeZoom || 19,
      minZoom: config.minZoom || 1,
      attribution: config.attribution,
      subdomains: (config.subdomains as any) || 'abc',
    });

    newTileLayer.on('tileerror', () => {
      showNotice('Map provider unavailable. Please check your network connection.');
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [activeLayer, showNotice]);

  // Recalculate container size on height change
  useEffect(() => {
    if (mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [height, isFullscreen]);

  // 2. Global Event Handlers for Marker Popup Actions (Directions, Save, Share)
  useEffect(() => {
    // Window bridge for "Directions" button inside Leaflet popup HTML
    (window as any).__routeq_get_directions = (destLat: number, destLng: number, destName: string) => {
      setDirectionsOrigin({
        name: `${depot.name} (Hub)`,
        lat: depot.lat,
        lng: depot.lng,
      });
      setDirectionsDestination({
        name: destName,
        lat: destLat,
        lng: destLng,
      });
    };

    // Window bridge for "Save" button inside Leaflet popup HTML
    (window as any).__routeq_save_place = (id: string, name: string, lat: number, lng: number) => {
      try {
        const saved = JSON.parse(localStorage.getItem('routeq_saved_places') || '[]');
        const exists = saved.some((p: any) => p.id === id);
        if (!exists) {
          saved.push({ id, name, lat, lng, savedAt: new Date().toISOString() });
          localStorage.setItem('routeq_saved_places', JSON.stringify(saved));
          showToast(`Saved "${name}" to favorites!`);
        } else {
          showToast(`"${name}" is already saved.`);
        }
      } catch {
        showToast(`Saved "${name}"!`);
      }
    };

    // Window bridge for "Share" button inside Leaflet popup HTML
    (window as any).__routeq_share_place = (lat: number, lng: number, placeId: string) => {
      const zoom = mapInstanceRef.current ? mapInstanceRef.current.getZoom() : 14;
      const shareUrl = `${window.location.origin}${window.location.pathname}?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}&zoom=${zoom}&place=${placeId}`;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          showToast('Share link copied to clipboard!');
        })
        .catch(() => {
          showToast(`Share URL: ${shareUrl}`);
        });
    };

    return () => {
      delete (window as any).__routeq_get_directions;
      delete (window as any).__routeq_save_place;
      delete (window as any).__routeq_share_place;
    };
  }, [depot, showToast]);

  // 3. Traffic Layer Management & Realistic Simulation Feed
  const renderTrafficSegments = useCallback((snapshot: TrafficSnapshot) => {
    if (!trafficLayerGroupRef.current || !mapInstanceRef.current) return;
    const group = trafficLayerGroupRef.current;
    group.clearLayers();

    snapshot.segments.forEach((seg) => {
      const polyline = L.polyline(seg.coordinates, {
        pane: 'trafficPane',
        color: seg.color,
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      });

      const popupHtml = `
        <div style="padding: 6px 4px; font-family: 'Manrope', system-ui, sans-serif; min-width: 175px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="font-weight: 700; color: #1F2024; font-size: 12px;">${seg.roadName}</span>
            <span style="font-size: 9px; font-weight: 700; font-family: 'IBM Plex Mono'; color: ${seg.color}; background: ${seg.color}20; padding: 2px 6px; border-radius: 6px;">
              ${seg.level.toUpperCase()}
            </span>
          </div>
          <div style="font-family: 'IBM Plex Mono'; font-size: 10px; color: #6B6D76; margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <div>SPEED: <b style="color: #1F2024;">${seg.speedKmh} km/h</b></div>
            <div>DELAY: <b style="color: #1F2024;">+${seg.delayMins}m</b></div>
            <div>CONGESTION: <b style="color: #1F2024;">${seg.congestionPct}%</b></div>
            <div>LENGTH: <b style="color: #1F2024;">${seg.lengthKm} km</b></div>
          </div>
          <div style="margin-top: 6px; font-size: 8.5px; font-family: 'IBM Plex Mono'; color: #8E909A; border-top: 1px solid #F2F1EC; padding-top: 4px;">
            ${snapshot.label}
          </div>
        </div>
      `;

      polyline.bindPopup(popupHtml);
      group.addLayer(polyline);
    });
  }, []);

  const handleRefreshTraffic = useCallback(async () => {
    if (!mapInstanceRef.current) return;
    setIsRefreshingTraffic(true);
    try {
      const snap = await defaultTrafficProvider.refresh(
        { lat: depot.lat, lng: depot.lng },
        deliveries.map((d) => ({ id: d.id, lat: d.lat, lng: d.lng })),
        routes
      );
      setTrafficSnapshot(snap);
      renderTrafficSegments(snap);
      showToast('Traffic updated: just now');
    } catch {
      showNotice('Traffic refresh currently unavailable.');
    } finally {
      setIsRefreshingTraffic(false);
    }
  }, [depot, deliveries, routes, renderTrafficSegments, showToast, showNotice]);

  useEffect(() => {
    if (!trafficEnabled) {
      if (trafficLayerGroupRef.current) {
        trafficLayerGroupRef.current.clearLayers();
      }
      setTrafficSnapshot(null);
      return;
    }

    let isCancelled = false;
    showToast('Loading traffic...');
    showNotice('Live traffic data is unavailable. Showing traffic simulation.');

    defaultTrafficProvider
      .getSnapshot(
        { lat: depot.lat, lng: depot.lng },
        deliveries.map((d) => ({ id: d.id, lat: d.lat, lng: d.lng })),
        routes
      )
      .then((snap) => {
        if (isCancelled) return;
        setTrafficSnapshot(snap);
        renderTrafficSegments(snap);
        showToast('Traffic updated');
      })
      .catch(() => {
        if (!isCancelled) showNotice('Traffic provider unavailable.');
      });

    const interval = setInterval(() => {
      defaultTrafficProvider
        .refresh(
          { lat: depot.lat, lng: depot.lng },
          deliveries.map((d) => ({ id: d.id, lat: d.lat, lng: d.lng })),
          routes
        )
        .then((snap) => {
          if (isCancelled) return;
          setTrafficSnapshot(snap);
          renderTrafficSegments(snap);
        })
        .catch(() => {});
    }, 35000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [trafficEnabled, depot, deliveries, routes, renderTrafficSegments, showNotice, showToast]);

  // 4. Calculate OSRM Directions when Origin, Destination or Mode changes
  useEffect(() => {
    if (!directionsOrigin || !directionsDestination) {
      setRouteResult(null);
      directionsLayerGroupRef.current?.clearLayers();
      return;
    }

    let isCancelled = false;
    setIsRouting(true);

    calculateDirections(directionsOrigin, directionsDestination, travelMode)
      .then((res) => {
        if (isCancelled) return;
        setRouteResult(res);
        setIsRouting(false);

        if (directionsLayerGroupRef.current && mapInstanceRef.current) {
          directionsLayerGroupRef.current.clearLayers();

          // Draw the OSRM route geometry line
          const polyline = L.polyline(res.coordinates, {
            color: travelMode === 'walking' ? '#10B981' : travelMode === 'cycling' ? '#F59E0B' : '#0284C7',
            weight: 5,
            opacity: 0.9,
            dashArray: travelMode === 'walking' ? '5, 8' : undefined,
            lineCap: 'round',
            lineJoin: 'round',
          });

          polyline.bindPopup(`
            <div style="padding: 4px 2px; font-family: 'Manrope', sans-serif;">
              <div style="font-weight: 700; color: #1F2024; font-size: 13px;">${res.mode.toUpperCase()} ROUTE</div>
              <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono'; margin-top: 3px;">
                DISTANCE: ${res.distanceKm} km | TIME: ${res.durationMins} mins
              </div>
            </div>
          `);

          directionsLayerGroupRef.current.addLayer(polyline);

          // Fit map viewport to encompass the whole route
          const routeBounds = L.latLngBounds(res.coordinates);
          mapInstanceRef.current.fitBounds(routeBounds, { padding: [60, 60] });
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsRouting(false);
          showNotice('Routing service temporarily busy.');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [directionsOrigin, directionsDestination, travelMode, showNotice]);

  // 4. Render Logistics Entities (Hub, Fleet Routes, Delivery/Tourist Stops)
  useEffect(() => {
    if (!mapInstanceRef.current || !logisticsLayerGroupRef.current) return;
    const group = logisticsLayerGroupRef.current;
    group.clearLayers();
    stopMarkersRef.current = {};

    const bounds = L.latLngBounds([[depot.lat, depot.lng]]);

    // Render District Administrative Boundary if district is active
    if (districtBoundaryLayerRef.current) {
      districtBoundaryLayerRef.current.clearLayers();
      if (depot && depot.district) {
        const boundaryCircle = L.circle([depot.lat, depot.lng], {
          radius: 12500,
          color: '#FF6B4A',
          weight: 1.8,
          dashArray: '5, 8',
          fillColor: '#FF6B4A',
          fillOpacity: 0.04,
        });
        boundaryCircle.bindPopup(`
          <div style="font-family: 'Manrope', sans-serif; padding: 4px;">
            <div style="font-weight: 700; color: #1F2024; font-size: 13px;">${depot.district} District</div>
            <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono'; margin-top: 2px;">
              ${depot.state ? `${depot.state} · ` : ''}Operational Logistics Boundary
            </div>
          </div>
        `);
        districtBoundaryLayerRef.current.addLayer(boundaryCircle);
      }
    }

    // Central Logistics Hub Marker
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
    const depotPopupHtml = generateMarkerPopupHtml({
      id: depot.id,
      name: depot.name,
      category: 'Central Logistics Hub',
      description: `Primary operational fulfillment center serving ${depot.district || 'Metro Region'}. Operating hours: ${depot.operating_hours_start} – ${depot.operating_hours_end}.`,
      rating: 4.9,
      address: `${depot.name}, ${depot.district || ''}, ${depot.state || 'India'}`,
      lat: depot.lat,
      lng: depot.lng,
    });
    depotMarker.bindPopup(depotPopupHtml);
    group.addLayer(depotMarker);

    const deliveryToVehicleMap: Record<
      string,
      { color: string; seq: number; vehicleName: string; vehicleId: string; isLate: boolean; arrival: string }
    > = {};

    // Stable, visually distinct per-vehicle color palette
    // Ordered so that even the first 5 routes are immediately distinguishable at a glance.
    const ROUTE_PALETTE = [
      '#2E8B57', // Route 1 – Forest Green
      '#2563EB', // Route 2 – Royal Blue
      '#DC2626', // Route 3 – Vivid Red
      '#F59E0B', // Route 4 – Amber Orange
      '#7C3AED', // Route 5 – Deep Purple
      '#0891B2', // Route 6 – Cyan Teal
      '#D97706', // Route 7 – Warm Gold
      '#DB2777', // Route 8 – Hot Pink
    ];

    // Render Routes
    routes.forEach((route, rIdx) => {
      const isSelected = selectedVehicleId ? route.vehicle_id === selectedVehicleId : false;
      const isAlternative = selectedVehicleId ? route.vehicle_id !== selectedVehicleId : false;

      // Stable index-based color — never random, never shifts on re-render
      const defaultColor = route.color || ROUTE_PALETTE[rIdx % ROUTE_PALETTE.length];

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
      // Use real road network geometry coordinates following the actual streets
      const roadCoords = (roadGeometries[route.vehicle_id] && roadGeometries[route.vehicle_id].length > 1)
        ? roadGeometries[route.vehicle_id]
        : (route.geometry && route.geometry.length > 1)
          ? route.geometry
          : latLngs;

      if (roadCoords.length > 1) {
        if (isAlternative) {
          const altPolyline = L.polyline(roadCoords, {
            color: '#94A3B8',
            weight: 2.5,
            opacity: 0.42,
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
          // Glow halo uses the vehicle's own color so it stays consistent
          const glowLine = L.polyline(roadCoords, {
            color: defaultColor,
            weight: 10,
            opacity: 0.30,
            lineCap: 'round',
            lineJoin: 'round',
          });
          group.addLayer(glowLine);

          const coreLine = L.polyline(roadCoords, {
            color: defaultColor,
            weight: 5,
            opacity: 1.0,
            lineCap: 'round',
            lineJoin: 'round',
          });
          coreLine.bindPopup(`
            <div style="padding: 4px 2px; font-family: 'Manrope', sans-serif;">
              <div style="font-weight: 700; color: ${defaultColor}; font-size: 13px;">${route.vehicle_name} (Active Focus)</div>
              <div style="font-size: 11px; color: #6B6D76; margin-top: 3px; font-family: 'IBM Plex Mono';">STOPS: ${route.deliveries_count} | DIST: ${route.total_distance_km.toFixed(1)} km</div>
              <div style="font-size: 11px; color: #6B6D76; font-family: 'IBM Plex Mono';">TIME: ${Math.round(route.total_time_mins)} mins | FUEL: ${route.fuel_consumed_l.toFixed(1)} L</div>
            </div>
          `);
          group.addLayer(coreLine);
        } else {
          const glowLine = L.polyline(roadCoords, {
            color: defaultColor,
            weight: 6,
            opacity: 0.20,
            lineCap: 'round',
            lineJoin: 'round',
          });
          group.addLayer(glowLine);

          const polyline = L.polyline(roadCoords, {
            color: defaultColor,
            weight: 3.8,
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

        // Truck Vector Marker placed along the road geometry
        if (roadCoords.length > 1) {
          const midIdx = Math.min(roadCoords.length - 1, Math.max(1, Math.floor(roadCoords.length / 2)));
          const truckWp = { lat: roadCoords[midIdx][0], lng: roadCoords[midIdx][1] };
          const strokeColor = isSelected ? '#FF5B37' : (isAlternative ? '#94A3B8' : defaultColor);

          const truckIcon = L.divIcon({
            className: 'custom-vehicle-truck-node',
            html: `
              <div style="
                display: flex; align-items: center; justify-content: center;
                width: 28px; height: 28px; border-radius: 8px;
                background: #FFFFFF; border: 2px solid ${strokeColor};
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                cursor: pointer; opacity: ${isAlternative ? 0.65 : 1};
              " title="${route.vehicle_name}">
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

        roadCoords.forEach((coord) => bounds.extend(coord));
      }
    });

    // Render Delivery / Tourist Place Markers
    deliveries.forEach((del) => {
      const assignment = deliveryToVehicleMap[del.id];
      const isAssignedToSelected = selectedVehicleId && assignment ? assignment.vehicleId === selectedVehicleId : false;
      const isMutedAlternative = selectedVehicleId && assignment ? assignment.vehicleId !== selectedVehicleId : false;

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

      const popupHtml = generateMarkerPopupHtml({
        id: del.id,
        name: del.customer_name,
        category: del.priority === 'urgent' ? 'High Priority' : 'Delivery Destination',
        description: `Scheduled stop with ${del.demand_kg} kg cargo. Service time: ${del.service_time_mins} mins. Window: ${del.time_window_start} – ${del.time_window_end}.`,
        rating: 4.8,
        address: del.address || `${del.district || ''}, ${del.state || 'India'}`,
        lat: del.lat,
        lng: del.lng,
        priority: del.priority,
        demand_kg: del.demand_kg,
        delivery_window: `${del.time_window_start} – ${del.time_window_end}`,
        service_time_mins: del.service_time_mins,
        assigned_vehicle: assignment ? `${assignment.vehicleName} (Stop #${assignment.seq})` : undefined,
        arrival_time: assignment?.arrival,
      });

      delMarker.bindPopup(popupHtml);

      delMarker.on('click', () => {
        if (onSelectStop) onSelectStop(del);
      });

      stopMarkersRef.current[del.id] = delMarker;
      group.addLayer(delMarker);
    });

    // Only perform initial automatic fitBounds once on first load if not using shareable URL coordinates
    // This strictly preserves the user's manual close zoom or long zoom across re-renders
    if (deliveries.length > 0 && mapInstanceRef.current && !hasInitialFitRef.current) {
      const searchParams = new URLSearchParams(window.location.search);
      const hasExplicitCoords = searchParams.has('lat') || searchParams.has('zoom');
      if (!hasExplicitCoords) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
      hasInitialFitRef.current = true;
    }
  }, [depot, deliveries, routes, selectedVehicleId, onSelectVehicle, onSelectStop, selectedStopId]);

  // Handle selectedStopId focus
  useEffect(() => {
    if (!selectedStopId || !mapInstanceRef.current || !stopMarkersRef.current[selectedStopId]) return;
    const marker = stopMarkersRef.current[selectedStopId];
    mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.8 });
    marker.openPopup();
  }, [selectedStopId]);

  // Handle Geolocation Found ("My Location" button)
  const handleLocationFound = (loc: { lat: number; lng: number; accuracy: number }) => {
    if (!mapInstanceRef.current || !userLocationLayerGroupRef.current) return;
    const group = userLocationLayerGroupRef.current;
    group.clearLayers();

    // Accuracy Circle
    const accuracyCircle = L.circle([loc.lat, loc.lng], {
      radius: Math.max(loc.accuracy, 30),
      color: '#3B82F6',
      fillColor: '#3B82F6',
      fillOpacity: 0.12,
      weight: 1.5,
    });
    group.addLayer(accuracyCircle);

    // Pulsing User Pin
    const userIcon = L.divIcon({
      className: 'custom-user-location-node',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #3B82F6; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const userMarker = L.marker([loc.lat, loc.lng], { icon: userIcon });
    const userPopupHtml = generateMarkerPopupHtml({
      id: 'USER-LOC',
      name: 'Your Current Location',
      category: 'Current Position',
      description: `Accurate within ~${Math.round(loc.accuracy)} meters via browser geolocation.`,
      lat: loc.lat,
      lng: loc.lng,
    });
    userMarker.bindPopup(userPopupHtml);
    group.addLayer(userMarker);

    mapInstanceRef.current.flyTo([loc.lat, loc.lng], 14, { duration: 1.2 });
    userMarker.openPopup();
    showToast('Found your location!');
  };

  // Handle Search Result Selected (Nominatim Place Search)
  const handleSearchResult = (place: GeocodingResult) => {
    if (!mapInstanceRef.current || !searchLayerGroupRef.current) return;
    const group = searchLayerGroupRef.current;
    group.clearLayers();

    const searchIcon = L.divIcon({
      className: 'custom-search-pin-node',
      html: `
        <div style="
          width: 28px; height: 28px; border-radius: 50%;
          background: #10B981; border: 2.5px solid #FFFFFF;
          box-shadow: 0 4px 14px rgba(16,185,129,0.4);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: 12px;
        ">
          📍
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([place.lat, place.lng], { icon: searchIcon });
    const popupHtml = generateMarkerPopupHtml({
      id: `OSM-${place.osm_id}`,
      name: place.name,
      category: place.type.replace('_', ' '),
      description: place.display_name,
      rating: 4.7,
      address: place.display_name,
      lat: place.lat,
      lng: place.lng,
    });

    marker.bindPopup(popupHtml);
    group.addLayer(marker);

    // If bounding box is available, fit bounds; otherwise use adaptive zoom
    if (place.boundingbox) {
      const [south, north, west, east] = place.boundingbox;
      mapInstanceRef.current.fitBounds(
        [
          [south, west],
          [north, east],
        ],
        { padding: [40, 40], maxZoom: 18 }
      );
    } else {
      const targetZoom =
        place.type === 'house' || place.type === 'building' || place.type === 'amenity' || place.type === 'shop'
          ? 18
          : place.type === 'road' || place.type === 'suburb' || place.type === 'neighbourhood'
          ? 16
          : place.type === 'city' || place.type === 'town'
          ? 12
          : place.type === 'country'
          ? 5
          : 14;
      mapInstanceRef.current.flyTo([place.lat, place.lng], targetZoom, { duration: 1.2 });
    }
    marker.openPopup();
  };

  // Recenter Bounds (Fit all delivery and depot locations)
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([[depot.lat, depot.lng]]);
    deliveries.forEach((d) => bounds.extend([d.lat, d.lng]));
    if (deliveries.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 18 });
    } else {
      mapInstanceRef.current.setView([depot.lat, depot.lng], 13);
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#E8E6DF] bg-[#F2F1EC] shadow-soft-sm transition-all ${
        isFullscreen ? 'fixed inset-0 z-[5000] rounded-none' : 'h-full'
      }`}
      style={{ minHeight: isFullscreen ? '100vh' : '480px' }}
    >
      {/* Top Left: India Logistics Grid / Global Badge */}
      <div className="absolute top-3.5 left-3.5 z-[1000] flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-sm pointer-events-none">
        <span className="text-sm leading-none select-none">🌐</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-[#1F2024] tracking-wide">
            GLOBAL LOGISTICS GRID
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span className="text-[10px] text-[#6B6D76] font-mono truncate max-w-[140px]">
            {depot.name}
          </span>
        </div>
      </div>

      {/* Top Right: Layer Switcher, Location & Navigation Controls */}
      <div className="absolute top-3.5 right-3.5 z-[1000] flex items-start gap-2">
        <LayerControl
          activeLayer={activeLayer}
          onSelectLayer={setActiveLayer}
          trafficEnabled={trafficEnabled}
          onToggleTraffic={() => setTrafficEnabled(!trafficEnabled)}
          onShowNotice={showNotice}
        />

        <div className="flex flex-col gap-1.5">
          <LocationButton onLocationFound={handleLocationFound} onError={showNotice} />
          <MapControls
            onZoomIn={() => mapInstanceRef.current?.zoomIn()}
            onZoomOut={() => mapInstanceRef.current?.zoomOut()}
            onRecenter={handleRecenter}
            currentZoom={currentZoom}
            minZoom={1}
            maxZoom={22}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
      </div>

      {/* Directions Panel (when active) */}
      {directionsDestination && (
        <DirectionsPanel
          originName={directionsOrigin?.name || 'Origin'}
          destinationName={directionsDestination.name}
          routeResult={routeResult}
          isLoading={isRouting}
          selectedMode={travelMode}
          onSelectMode={setTravelMode}
          onClear={() => {
            setDirectionsDestination(null);
            setRouteResult(null);
            directionsLayerGroupRef.current?.clearLayers();
          }}
        />
      )}

      {/* Traffic Legend (when traffic overlay active) */}
      {trafficEnabled && (
        <TrafficLegend
          snapshot={trafficSnapshot}
          onRefresh={handleRefreshTraffic}
          isRefreshing={isRefreshingTraffic}
        />
      )}

      {/* System Notice Alert (e.g. Traffic unconfigured or permission notice) */}
      {systemNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1002] max-w-md w-auto px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] font-mono text-xs shadow-soft-lg flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-[#FF5B37] shrink-0" />
          <span className="leading-tight">{systemNotice}</span>
          <button onClick={() => setSystemNotice(null)} className="p-1 hover:text-[#FF5B37] cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[1002] px-4 py-2 rounded-full bg-[#1F2024] text-white font-mono text-xs shadow-soft-xl flex items-center gap-2 animate-in fade-in zoom-in-95">
          <Check className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />
    </div>
  );
};
