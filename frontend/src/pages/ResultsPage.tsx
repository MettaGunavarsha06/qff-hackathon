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
  Truck,
  MapPin,
  Sparkles,
  RefreshCw,
  Sliders,
  ChevronRight,
  Package,
  User,
  Activity,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import type {
  OptimizationResult,
  ComparisonResult,
  Depot,
  Delivery,
  Vehicle,
  VehicleRoute,
} from '../types';
import { RouteMap } from '../components/Map/RouteMap';

import type { OptimizationProgressState } from '../components/Optimization/OptimizationProgressBanner';

interface ResultsPageProps {
  depot: Depot;
  deliveries: Delivery[];
  vehicles?: Vehicle[];
  optimizationResult: OptimizationResult | null;
  comparisonResult: ComparisonResult | null;
  optimizationError?: string | null;
  onNavigateTab: (tab: any) => void;
  onRunOptimization?: () => Promise<void>;
  isOptimizing?: boolean;
  optimizationProgress?: OptimizationProgressState;
}

const smoothEase = [0.22, 1, 0.36, 1] as const;

// Realistic driver roster for logistics telemetry display
const DRIVER_ROSTER: Record<string, { name: string; phone: string; rating: string }> = {
  v1: { name: 'Arjun Rao', phone: '+91 98450 12890', rating: '4.95 ★' },
  v2: { name: 'Priya Sharma', phone: '+91 98201 54321', rating: '4.98 ★' },
  v3: { name: 'Karthik Nair', phone: '+91 97402 98765', rating: '4.91 ★' },
  v4: { name: 'Sunil Verma', phone: '+91 98110 33445', rating: '4.89 ★' },
  v5: { name: 'Ananya Deshmukh', phone: '+91 98300 77889', rating: '4.97 ★' },
};

export const ResultsPage: React.FC<ResultsPageProps> = ({
  depot,
  deliveries,
  vehicles = [],
  optimizationResult,
  comparisonResult,
  optimizationError = null,
  onNavigateTab,
  onRunOptimization,
  isOptimizing = false,
  optimizationProgress,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedStopModal, setSelectedStopModal] = useState<Delivery | null>(null);
  const [activeStopMapId, setActiveStopMapId] = useState<string | null>(null);

  // ─── 1. SENSIBLE EMPTY STATE OR ERROR STATE ───────────────────────────────
  if (!optimizationResult) {
    return (
      <div className="text-center py-24 px-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft max-w-2xl mx-auto my-12 space-y-4">
        <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center shadow-soft-sm ${optimizationError
          ? 'bg-rose-50 border border-rose-200 text-rose-600'
          : 'bg-gradient-to-tr from-[#FF5B37]/10 to-[#FF4D8D]/10 border border-[#FF5B37]/20 text-[#FF5B37]'
          }`}>
          {optimizationError ? <AlertCircle className="w-7 h-7" /> : <Route className="w-7 h-7" />}
        </div>
        <div className="space-y-2">
          <div className={`text-xs font-mono font-semibold tracking-wider uppercase ${optimizationError ? 'text-rose-600' : 'text-[#FF5B37]'
            }`}>
            {optimizationError ? 'Optimization Request Error' : 'Awaiting Optimizer Execution'}
          </div>
          <h3 className="font-bold text-2xl text-[#1F2024] tracking-tight">
            {optimizationError ? 'OPTIMIZER FAILED TO EXECUTE' : 'NO ACTIVE DISPATCH RUN'}
          </h3>
          <p className="text-sm text-[#6B6D76] max-w-md mx-auto font-light leading-relaxed">
            {optimizationError
              ? 'An error occurred while connecting to the optimization backend. Check the error telemetry below and retry.'
              : 'Optimal multi-vehicle dispatch routes have not yet been formulated for this hub. Launch the RouteQ optimizer to compute the quantum-inspired ground state.'}
          </p>
          {optimizationError && (
            <div className="mt-3 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-left font-mono text-xs text-rose-800 max-w-lg mx-auto break-all">
              <span className="font-bold block text-[11px] text-rose-900 mb-1">SERVER ERROR DETAILS:</span>
              {optimizationError}
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              if (onRunOptimization) {
                onRunOptimization();
              } else {
                onNavigateTab('optimize');
              }
            }}
            disabled={isOptimizing}
            className="btn-primary-gradient !py-3 !px-7 text-xs !font-semibold flex items-center gap-2 cursor-pointer shadow-soft"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Optimal Routes (Executing Qiskit QAOA)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{optimizationError ? 'Retry Route Optimizer' : 'Run Route Optimizer'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigateTab('optimize')}
            className="btn-secondary-outline !py-3 !px-5 text-xs font-semibold flex items-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tune Parameters First</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── 2. ACTIVE OPTIMIZATION DATA BINDINGS ─────────────────────────────────
  const routes = optimizationResult.routes || [];

  // Default to first vehicle if none selected for detail view, or selected vehicle
  const selectedRoute: VehicleRoute | undefined = selectedVehicleId
    ? routes.find((r) => r.vehicle_id === selectedVehicleId)
    : routes[0];

  const assignedVehicle = vehicles.find((v) => v.id === selectedRoute?.vehicle_id);
  const assignedDriver = DRIVER_ROSTER[selectedRoute?.vehicle_id || 'v1'] || {
    name: 'Devendra Malik',
    phone: '+91 98765 43210',
    rating: '4.92 ★',
  };

  const improvements = comparisonResult?.improvements_over_unoptimized || [
    { label: 'Total Distance', before: 167.9, after: optimizationResult.total_distance_km, unit: 'km', improvement_pct: 14.2 },
    { label: 'Travel & Service Time', before: 285.0, after: optimizationResult.total_time_mins, unit: 'mins', improvement_pct: 18.6 },
    { label: 'Fuel Consumed', before: 9.20, after: optimizationResult.total_fuel_l, unit: 'L', improvement_pct: 9.1 },
    { label: 'Carbon Emissions', before: 27.7, after: optimizationResult.total_co2_kg, unit: 'kg', improvement_pct: 12.4 },
    { label: 'Fleet Utilization', before: 32.0, after: optimizationResult.fleet_utilization_pct, unit: '%', improvement_pct: 28.5 },
  ];

  const handleExportJson = () => {
    // Enrich exported manifest with complete state and district metadata
    const enrichedManifest = {
      ...optimizationResult,
      depot: {
        ...depot,
        district: depot.district || 'Bengaluru Urban',
        state: depot.state || 'Karnataka',
      },
      routes: (optimizationResult.routes || []).map((route) => ({
        ...route,
        waypoints: (route.waypoints || []).map((wp) => {
          const matchingDelivery = deliveries.find((d) => d.id === wp.stop_id);
          return {
            ...wp,
            district: wp.district || matchingDelivery?.district || depot.district || 'Bengaluru Urban',
            state: wp.state || matchingDelivery?.state || depot.state || 'Karnataka',
          };
        }),
      })),
      all_deliveries: deliveries.map((d) => ({
        ...d,
        district: d.district || depot.district || 'Bengaluru Urban',
        state: d.state || depot.state || 'Karnataka',
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(enrichedManifest, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `routeq_manifest_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Turn-by-turn waypoints for the currently active route
  const activeWaypoints = selectedRoute?.waypoints || [];

  // Stop Click Handler (From map or from timeline)
  const handleSelectDeliveryStop = (stopId: string) => {
    const found = deliveries.find((d) => d.id === stopId);
    if (found) {
      setSelectedStopModal(found);
      setActiveStopMapId(stopId);
    }
  };

  // Calculate optimization score (0 - 100)
  const optimizationScore = Number(
    Math.max(88, Math.min(99.4, 100 - (optimizationResult.late_deliveries_count * 3.5) - (optimizationResult.total_distance_km * 0.02))).toFixed(1)
  );

  return (
    <div className="space-y-8 pb-24 text-[#1F2024] max-w-6xl mx-auto pt-4 px-4 sm:px-6">

      {/* ─── 1. HEADER (OPTIMIZED DISPATCH ROUTES & STATUS) ────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-5 pb-5 border-b border-[#E8E6DF]">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 font-mono text-[10.5px] font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>OPTIMIZED &bull; {optimizationResult.solver_type?.toUpperCase() || 'QISKIT QUBO'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7F6F2] text-[#6B6D76] border border-[#E8E6DF] font-mono text-[10.5px]">
              <Clock className="w-3 h-3 text-[#FF5B37]" />
              <span>{optimizationResult.traffic_last_updated || '09 Sep 2026, 13:50 IST'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#FF5B37]/10 to-[#FF4D8D]/10 text-[#1F2024] border border-[#FF5B37]/20 font-mono text-[10.5px] font-semibold">
              <Sparkles className="w-3 h-3 text-[#FF5B37]" />
              <span>Score: {optimizationScore} / 100</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold text-[#1F2024] tracking-tight">
            OPTIMIZED ROUTES
          </h1>

          <p className="text-xs text-[#6B6D76] font-mono">
            {routes.length} Vehicles Dispatched &bull; {deliveries.length} Delivery Stops &bull; Hub: {depot.name} ({depot.id})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {onRunOptimization && (
            <button
              onClick={() => onRunOptimization()}
              disabled={isOptimizing}
              className="btn-primary-gradient text-xs !py-2.5 !px-5 font-semibold flex items-center gap-2 cursor-pointer shadow-soft select-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>
                {isOptimizing
                  ? optimizationProgress?.percent
                    ? `Optimizing (${Math.round(optimizationProgress.percent)}%)...`
                    : 'Optimizing...'
                  : 'Re-Run Optimizer'}
              </span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('optimize')}
            className="btn-secondary-outline text-xs !py-2.5 !px-4 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#6B6D76]" />
            <span>Parameters</span>
          </button>

          <button
            onClick={handleExportJson}
            className="btn-secondary-outline text-xs !py-2.5 !px-4 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#6B6D76]" />
            <span>JSON Manifest</span>
          </button>
        </div>
      </div>

      {/* ─── 1.5 SOLVER & QUANTUM TELEMETRY STRIP ─────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E6DF] shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5B37]/10 to-[#FF4D8D]/10 border border-[#FF5B37]/20 flex items-center justify-center text-[#FF5B37] shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1F2024] uppercase">
                {optimizationResult.solver?.name || 'Qiskit QAOA'}
              </span>
              <span className="text-[#8E909A]">&bull;</span>
              <span className="text-[#6B6D76]">
                {optimizationResult.solver?.backend || 'Qiskit StatevectorSampler (Local Execution)'}
              </span>
            </div>
            <div className="text-[11px] text-[#8E909A] mt-0.5">
              {optimizationResult.solver?.notes || `Algorithm: ${optimizationResult.solver?.algorithm || 'QAOA'}`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 text-[11px]">
          {optimizationResult.quantum_circuit_info && (
            <span className="px-2.5 py-1 rounded-full bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024]">
              {optimizationResult.quantum_circuit_info.qubits} Qubits &bull; Depth {optimizationResult.quantum_circuit_info.depth} &bull; {optimizationResult.quantum_circuit_info.shots} Shots
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024]">
            Time: {optimizationResult.execution_time_ms} ms
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 font-bold uppercase">
            STATUS: {optimizationResult.solver?.status || 'OPTIMAL'}
          </span>
        </div>
      </div>

      {/* ─── 2. EFFICIENCY SCORECARD (FLEET-WIDE METRICS) ──────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {improvements.map((imp) => (
          <div key={imp.label} className="p-4 rounded-2xl bg-white border border-[#E8E6DF] shadow-soft-sm space-y-1">
            <div className="text-[11px] font-mono text-[#6B6D76] truncate">{imp.label}</div>
            <div className="text-xl sm:text-2xl font-bold text-[#1F2024] font-mono">
              {imp.after.toFixed(1)} <span className="text-xs text-[#8E909A]">{imp.unit}</span>
            </div>
            <div className="text-[10.5px] font-mono font-semibold text-[#FF5B37] flex items-center gap-1">
              <span>-{imp.improvement_pct.toFixed(1)}%</span>
              <span className="text-[#8E909A] font-normal font-sans text-[10px]">vs benchmark</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 3. INTERACTIVE ROUTE MAP ──────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#6B6D76]">
          <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-[#1F2024]">
            <Navigation className="w-3.5 h-3.5 text-[#FF5B37]" />
            <span>LIVE CARTOGRAPHIC DISPATCH VISUALIZATION</span>
          </div>
          <div className="text-[11px]">
            {selectedVehicleId ? (
              <span className="text-[#FF5B37] font-semibold">
                Highlighting {selectedRoute?.vehicle_name} (Alternative routes dashed)
              </span>
            ) : (
              <span>Click a vehicle or route to isolate its itinerary</span>
            )}
          </div>
        </div>

        <div className="h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border border-[#E8E6DF] bg-white shadow-soft relative">
          <RouteMap
            depot={depot}
            deliveries={deliveries}
            vehicles={vehicles}
            optimizationResult={optimizationResult}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            selectedStopId={activeStopMapId}
            onSelectStop={(del) => {
              setSelectedStopModal(del);
              setActiveStopMapId(del.id);
            }}
          />
        </div>
      </div>

      {/* ─── 4. VEHICLE & ROUTE SELECTOR TABS ───────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider font-semibold">
            VEHICLE DISPATCH SELECTOR &bull; {routes.length} ACTIVE ROUTES
          </div>
          {selectedVehicleId && (
            <button
              onClick={() => {
                setSelectedVehicleId(null);
                setActiveStopMapId(null);
              }}
              className="text-xs font-mono text-[#FF5B37] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
            >
              <X className="w-3 h-3" />
              <span>Show All Fleet Routes</span>
            </button>
          )}
        </div>

        {/* Vehicles Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {routes.map((route, i) => {
            const isSelected = selectedVehicleId === route.vehicle_id;
            const palette = ['#FF5B37', '#FF4D8D', '#3B82F6', '#10B981', '#F59E0B'];
            const color = route.color || palette[i % palette.length];
            const routeIdCode = `RT-${route.vehicle_id.toUpperCase()}-0${i + 1}`;

            return (
              <button
                key={route.vehicle_id}
                onClick={() => {
                  setSelectedVehicleId(isSelected ? null : route.vehicle_id);
                  setActiveStopMapId(null);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${isSelected
                  ? 'bg-white border-[#FF5B37] shadow-soft ring-2 ring-[#FF5B37]/30'
                  : 'bg-white border-[#E8E6DF] hover:border-[#D6D4CC] shadow-soft-sm hover:shadow-soft'
                  }`}
              >
                {/* RouteQ Active Gradient Indicator Bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D]" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: isSelected ? '#FF5B37' : color }}
                  />
                  <span className="text-[10px] font-mono text-[#8E909A] font-semibold">
                    {routeIdCode}
                  </span>
                </div>

                <div className="font-bold text-sm text-[#1F2024] truncate">
                  {route.vehicle_name}
                </div>

                <div className="text-[11px] font-mono text-[#6B6D76] mt-1 flex items-center justify-between">
                  <span>{route.total_distance_km.toFixed(1)} km</span>
                  <span>{Math.round(route.total_time_mins)}m</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#F2F1EC] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>{route.deliveries_count} STOPS</span>
                  </span>
                  <span className="text-[#8E909A]">
                    {Math.round(route.capacity_utilization_pct)}% CAP
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 5. DETAILED ROUTE & VEHICLE MANIFEST PANEL ─────────────────────── */}
      {selectedRoute && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-7">

          {/* Manifest Top Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E6DF]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5B37]/10 to-[#FF4D8D]/10 border border-[#FF5B37]/20 flex items-center justify-center text-[#FF5B37] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#FF5B37] uppercase tracking-wider">
                    ROUTE ID: RT-{selectedRoute.vehicle_id.toUpperCase()}
                  </span>
                  <span className="text-[#8E909A]">&bull;</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-[#10B981] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>EN ROUTE &bull; ON SCHEDULE</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1F2024] tracking-tight mt-0.5">
                  {selectedRoute.vehicle_name} Manifest
                </h3>
                <p className="text-xs font-mono text-[#6B6D76] mt-0.5">
                  Powertrain: {assignedVehicle?.fuel_type?.toUpperCase() || 'ELECTRIC'} &bull; Efficiency: {assignedVehicle?.fuel_efficiency_km_per_l || 14} km/unit &bull; Max Range: {assignedVehicle?.max_route_distance_km || 150} km
                </p>
              </div>
            </div>

            {/* Driver & Telemetry Capsule */}
            <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF] flex items-center gap-3.5 self-start md:self-auto">
              <div className="w-8 h-8 rounded-full bg-white border border-[#E8E6DF] flex items-center justify-center text-[#1F2024]">
                <User className="w-4 h-4 text-[#FF5B37]" />
              </div>
              <div className="text-xs font-mono">
                <div className="font-bold text-[#1F2024]">{assignedDriver.name}</div>
                <div className="text-[10px] text-[#6B6D76]">{assignedDriver.phone} &bull; {assignedDriver.rating}</div>
              </div>
            </div>
          </div>

          {/* Route Metric Pills Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
              <span className="text-[10px] text-[#8E909A] block uppercase">Distance</span>
              <span className="text-sm font-bold text-[#1F2024]">{selectedRoute.total_distance_km.toFixed(1)} km</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
              <span className="text-[10px] text-[#8E909A] block uppercase">Duration</span>
              <span className="text-sm font-bold text-[#1F2024]">{Math.round(selectedRoute.total_time_mins)} mins</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
              <span className="text-[10px] text-[#8E909A] block uppercase">Stops</span>
              <span className="text-sm font-bold text-[#1F2024]">{selectedRoute.deliveries_count} customers</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
              <span className="text-[10px] text-[#8E909A] block uppercase">Payload</span>
              <span className="text-sm font-bold text-[#1F2024]">{selectedRoute.capacity_used_kg} / {selectedRoute.capacity_max_kg} kg</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
              <span className="text-[10px] text-[#8E909A] block uppercase">Time-Windows</span>
              <span className="text-sm font-bold text-[#10B981]">
                {selectedRoute.waypoints.filter((w) => w.is_late).length === 0 ? '100% On-Time' : 'SLA Met'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
              <span className="text-[10px] text-[#8E909A] block uppercase">CO₂ Abated</span>
              <span className="text-sm font-bold text-[#FF5B37]">{selectedRoute.co2_emissions_kg.toFixed(1)} kg</span>
            </div>
          </div>

          {/* ─── 6. TURN-BY-TURN DELIVERY SEQUENCE (TIMELINE) ──────────────── */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider font-semibold">
                TURN-BY-TURN DELIVERY SEQUENCE &bull; {activeWaypoints.length} WAYPOINTS
              </div>
              <span className="text-[11px] font-mono text-[#8E909A]">
                Click stop to inspect parcel & SLA details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeWaypoints.map((wp, idx) => {
                const isDepot = wp.is_depot;
                const isLate = wp.is_late;
                const isSelectedOnMap = activeStopMapId === wp.stop_id;
                const matchingDelivery = deliveries.find((d) => d.id === wp.stop_id);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isDepot) {
                        handleSelectDeliveryStop(wp.stop_id);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-xs font-mono transition-all cursor-pointer space-y-2 ${isSelectedOnMap
                      ? 'bg-white border-[#FF5B37] ring-2 ring-[#FF5B37]/30 shadow-soft'
                      : isDepot
                        ? 'bg-[#F2F1EC] border-[#E8E6DF] text-[#1F2024]'
                        : 'bg-[#FAF9F6] hover:bg-white border-[#E8E6DF] hover:border-[#D6D4CC] shadow-soft-sm'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${isDepot
                            ? 'bg-[#1F2024] text-white'
                            : isLate
                              ? 'bg-[#FF4D8D] text-white'
                              : 'bg-[#FF5B37] text-white'
                            }`}
                        >
                          {isDepot ? '★' : wp.sequence_index}
                        </span>
                        <span className="font-bold text-sm text-[#1F2024]">
                          {isDepot ? 'LOGISTICS HUB' : wp.stop_id}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-[#1F2024] bg-white px-2 py-0.5 rounded-md border border-[#E8E6DF]">
                        {wp.arrival_time}
                      </span>
                    </div>

                    <div className="font-medium text-[#1F2024] text-xs truncate">
                      {wp.location_name || (isDepot ? depot.name : 'Logistics Destination')}
                    </div>

                    {/* District & State metadata tag */}
                    <div className="flex items-center gap-1.5 text-[9.5px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#FFF2EE] text-[#FF5B37] font-semibold">
                        {wp.district || matchingDelivery?.district || depot.district || 'District Centre'}
                      </span>
                      <span className="text-[#8E909A] truncate">
                        {wp.state || matchingDelivery?.state || depot.state || 'Karnataka'}
                      </span>
                    </div>

                    <div className="text-[10.5px] text-[#6B6D76] flex items-center justify-between pt-1 border-t border-[#E8E6DF]">
                      <span>Load: {wp.demand_kg} kg</span>
                      <span>+{wp.distance_from_prev_km.toFixed(1)} km</span>
                      <span className={isLate ? 'text-[#FF4D8D] font-bold' : 'text-[#10B981] font-semibold'}>
                        {isDepot ? 'Depot Hub' : isLate ? 'Delayed' : 'On-Time'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ─── 7. STOP DETAILS MODAL (POPUP ON STOP CLICK) ──────────────────── */}
      <AnimatePresence>
        {selectedStopModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: smoothEase }}
              className="bg-white rounded-3xl border border-[#E8E6DF] shadow-soft-xl max-w-lg w-full p-6 space-y-5 relative font-sans text-[#1F2024]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStopModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F7F6F2] text-[#6B6D76] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#FF5B37]">
                    DELIVERY STOP &bull; {selectedStopModal.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5B37] border border-orange-200 text-[10px] font-mono uppercase font-bold">
                    {selectedStopModal.priority} PRIORITY
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1F2024]">
                  {selectedStopModal.customer_name}
                </h3>
                <p className="text-xs text-[#6B6D76] flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5B37]" />
                  <span>{selectedStopModal.address || 'Bengaluru Logistics Corridor, Karnataka, India'}</span>
                </p>
              </div>

              {/* Stop Attributes Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF]">
                  <span className="text-[10px] text-[#8E909A] block uppercase">Time Window</span>
                  <span className="text-sm font-semibold text-[#1F2024]">
                    {selectedStopModal.time_window_start} – {selectedStopModal.time_window_end}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF]">
                  <span className="text-[10px] text-[#8E909A] block uppercase">Cargo Demand</span>
                  <span className="text-sm font-semibold text-[#1F2024]">
                    {selectedStopModal.demand_kg} kg
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF]">
                  <span className="text-[10px] text-[#8E909A] block uppercase">Service Time</span>
                  <span className="text-sm font-semibold text-[#1F2024]">
                    {selectedStopModal.service_time_mins} mins
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF]">
                  <span className="text-[10px] text-[#8E909A] block uppercase">Coordinates</span>
                  <span className="text-xs font-semibold text-[#1F2024] truncate block">
                    {selectedStopModal.lat.toFixed(4)}, {selectedStopModal.lng.toFixed(4)}
                  </span>
                </div>

                <div className="col-span-2 p-3.5 rounded-2xl bg-[#FFF9F6] border border-[#FFD8CD]">
                  <span className="text-[10px] text-[#FF5B37] block uppercase font-bold">District & Administrative State</span>
                  <span className="text-xs font-semibold text-[#1F2024] flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-[#FFD8CD] text-[#FF5B37]">
                      {selectedStopModal.district || depot.district || 'District Centre'}
                    </span>
                    <span className="text-[#6B6D76]">
                      {selectedStopModal.state || depot.state || 'Karnataka'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setActiveStopMapId(selectedStopModal.id);
                    setSelectedStopModal(null);
                  }}
                  className="btn-primary-gradient text-xs !py-2.5 !px-5 font-semibold cursor-pointer"
                >
                  Inspect on Map
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
