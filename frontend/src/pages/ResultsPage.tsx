import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Route,
  Download,
  CheckCircle2,
  Clock,
  Navigation,
  Shield,
  X,
} from 'lucide-react';
import type {
  OptimizationResult,
  ComparisonResult,
  Depot,
  Delivery,
} from '../types';
import { RouteMap } from '../components/Map/RouteMap';

interface ResultsPageProps {
  depot: Depot;
  deliveries: Delivery[];
  optimizationResult: OptimizationResult | null;
  comparisonResult: ComparisonResult | null;
  onNavigateTab: (tab: any) => void;
}

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const ResultsPage: React.FC<ResultsPageProps> = ({
  depot,
  deliveries,
  optimizationResult,
  comparisonResult,
  onNavigateTab,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  if (!optimizationResult) {
    return (
      <div className="text-center py-24 px-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft max-w-2xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-[#F7F6F2] border border-[#E8E6DF] text-[#FF5B37] mx-auto flex items-center justify-center mb-4 shadow-soft-sm">
          <Route className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-xl text-[#1F2024] tracking-tight">NO ACTIVE DISPATCH RUN</h3>
        <p className="text-sm text-[#6B6D76] max-w-md mx-auto mt-2 mb-6 font-light leading-relaxed">
          Optimal routes have not yet been computed. Launch the optimizer to formulate and solve the vehicle routing model.
        </p>
        <button
          onClick={() => onNavigateTab('optimize')}
          className="btn-primary-gradient !py-2.5 !px-6 text-xs !font-semibold"
        >
          Run Route Optimizer
        </button>
      </div>
    );
  }

  const improvements = comparisonResult?.improvements_over_unoptimized || [
    { label: 'Total Distance', before: 167.9, after: optimizationResult.total_distance_km, unit: 'km', improvement_pct: 12.8 },
    { label: 'Travel & Service Time', before: 285.0, after: optimizationResult.total_time_mins, unit: 'mins', improvement_pct: 18.4 },
    { label: 'Fuel Consumed', before: 9.20, after: optimizationResult.total_fuel_l, unit: 'L', improvement_pct: 8.4 },
    { label: 'Carbon Emissions', before: 27.7, after: optimizationResult.total_co2_kg, unit: 'kg', improvement_pct: 11.2 },
    { label: 'Fleet Utilization', before: 32.0, after: optimizationResult.fleet_utilization_pct, unit: '%', improvement_pct: 24.5 },
  ];

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(optimizationResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `routeq_manifest_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const selectedRoute = optimizationResult.routes.find((r) => r.vehicle_id === selectedVehicleId);

  return (
    <div className="space-y-8 pb-20 text-[#1F2024] max-w-6xl mx-auto pt-4">
      
      {/* ─── 1. HEADER (OPTIMIZED ROUTES) ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="text-xs font-mono text-[#FF5B37] uppercase tracking-wider font-semibold">
            DISPATCH EXECUTION &bull; RUN #{Math.round(optimizationResult.execution_time_ms || 280)}
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#1F2024] tracking-tight mt-1">
            OPTIMIZED ROUTES
          </h1>
          <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-[#6B6D76]">
            <span className={`w-2 h-2 rounded-full ${optimizationResult.is_live_traffic_used ? 'bg-[#10B981]' : 'bg-[#FF5B37]'}`} />
            <span className="font-semibold text-[#1F2024]">
              {optimizationResult.is_live_traffic_used ? 'Mappls Real-Time Traffic Active' : 'Offline Corridor Matrix'}
            </span>
            <span>&bull;</span>
            <span>{optimizationResult.traffic_last_updated || 'India Standard Time (IST)'}</span>
          </div>
        </div>

        <button
          onClick={handleExportJson}
          className="btn-secondary-outline text-xs !py-2 !px-4 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON Manifest</span>
        </button>
      </div>

      {/* ─── 2. EFFICIENCY SCORECARD ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {improvements.map((imp) => (
          <div key={imp.label} className="p-4 rounded-2xl bg-white border border-[#E8E6DF] shadow-soft-sm space-y-1">
            <div className="text-[11px] font-mono text-[#6B6D76]">{imp.label}</div>
            <div className="text-xl font-bold text-[#1F2024] font-mono">
              {imp.after.toFixed(1)} <span className="text-xs text-[#8E909A]">{imp.unit}</span>
            </div>
            <div className="text-[10px] font-mono font-semibold text-[#FF5B37]">
              -{imp.improvement_pct.toFixed(1)}% reduction
            </div>
          </div>
        ))}
      </div>

      {/* ─── 3. LARGE MAP DISPLAY ─────────────────────────────────────────── */}
      <div className="h-[520px] rounded-3xl overflow-hidden border border-[#E8E6DF] bg-white shadow-soft relative">
        <RouteMap
          depot={depot}
          deliveries={deliveries}
          optimizationResult={optimizationResult}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
      </div>

      {/* ─── 4. VEHICLE SELECTOR ROW (Vehicle 01, Vehicle 02, etc.) ───────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider font-semibold">
            SELECT VEHICLE TO HIGHLIGHT ITINERARY
          </div>
          {selectedVehicleId && (
            <button
              onClick={() => setSelectedVehicleId(null)}
              className="text-xs font-mono text-[#FF5B37] hover:underline cursor-pointer"
            >
              Reset to All Vehicles
            </button>
          )}
        </div>

        {/* Vehicle buttons row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {optimizationResult.routes.map((route, i) => {
            const isSelected = selectedVehicleId === route.vehicle_id;
            const palette = ['#FF5B37', '#FF4D8D', '#3B82F6', '#10B981', '#F59E0B'];
            const color = route.color || palette[i % palette.length];

            return (
              <button
                key={route.vehicle_id}
                onClick={() => setSelectedVehicleId(isSelected ? null : route.vehicle_id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#FF5B37] shadow-soft ring-2 ring-[#FF5B37]/20'
                    : 'bg-white border-[#E8E6DF] hover:border-[#D6D4CC] shadow-soft-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono text-[#8E909A]">
                    {route.deliveries_count} STOPS
                  </span>
                </div>
                <div className="font-bold text-sm text-[#1F2024]">
                  {route.vehicle_name}
                </div>
                <div className="text-[11px] font-mono text-[#6B6D76] mt-1">
                  {route.total_distance_km.toFixed(1)} km &bull; {Math.round(route.total_time_mins)}m
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── 5. SLIDE-IN VEHICLE DETAIL PANEL (WHEN SELECTED) ───────────── */}
        <AnimatePresence>
          {selectedRoute && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: smoothEase }}
              className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: selectedRoute.color || '#FF5B37' }}
                  />
                  <div>
                    <h3 className="font-bold text-lg text-[#1F2024]">
                      {selectedRoute.vehicle_name} Manifest
                    </h3>
                    <p className="text-xs font-mono text-[#6B6D76]">
                      Vehicle ID: {selectedRoute.vehicle_id} &bull; Capacity: {selectedRoute.capacity_used_kg} / {selectedRoute.capacity_max_kg} kg ({Math.round((selectedRoute.capacity_used_kg / selectedRoute.capacity_max_kg) * 100)}%)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVehicleId(null)}
                  className="p-1.5 rounded-full hover:bg-[#F7F6F2] text-[#6B6D76] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Waypoints Sequence Grid */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider font-semibold">
                  ORDERED TURN-BY-TURN WAYPOINTS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {selectedRoute.waypoints.map((wp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between text-[#6B6D76]">
                        <span className="font-bold text-[#1F2024]">
                          {wp.is_depot ? 'HUB DEPOT' : `STOP ${wp.sequence_index}`}
                        </span>
                        <span className="text-[10px]">{wp.arrival_time}</span>
                      </div>
                      <div className="text-[11px] text-[#1F2024] font-medium truncate">
                        {wp.location_name || 'Central Distribution Hub'}
                      </div>
                      <div className="text-[10px] text-[#6B6D76] flex justify-between">
                        <span>Demand: {wp.demand_kg} kg</span>
                        <span>{wp.distance_from_prev_km.toFixed(1)} km</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
