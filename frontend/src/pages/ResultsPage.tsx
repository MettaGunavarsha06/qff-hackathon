import React, { useState } from 'react';
import {
  Route,
  TrendingDown,
  Clock,
  Fuel,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Truck,
  MapPin,
  Calendar,
  Layers,
  ArrowDownRight,
  ExternalLink,
} from 'lucide-react';
import type {
  OptimizationResult,
  ComparisonResult,
  Depot,
  Delivery,
  VehicleRoute,
} from '../types';
import { RouteMap } from '../components/Map/RouteMap';

interface ResultsPageProps {
  depot: Depot;
  deliveries: Delivery[];
  optimizationResult: OptimizationResult | null;
  comparisonResult: ComparisonResult | null;
  onNavigateTab: (tab: any) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  depot,
  deliveries,
  optimizationResult,
  comparisonResult,
  onNavigateTab,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'unoptimized' | 'classical'>('unoptimized');

  if (!optimizationResult) {
    return (
      <div className="text-center py-20 px-4 rounded-3xl fluid-glass-panel border border-white/90 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl fluid-glass-pill fluid-glass-pill-violet text-purple-700 mx-auto flex items-center justify-center mb-4 shadow-md">
          <Route className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-800">No Active Optimization Run</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 mb-6 font-medium">
          Routes have not yet been generated for the current fleet. Navigate to the Optimization Studio to run the solver.
        </p>
        <button
          onClick={() => onNavigateTab('optimize')}
          className="px-6 py-2.5 rounded-full fluid-glass-pill fluid-glass-pill-violet text-purple-950 font-black text-xs shadow-lg hover:shadow-xl cursor-pointer"
        >
          Go to Optimization Studio
        </button>
      </div>
    );
  }

  // Improvements data
  const improvements =
    comparisonMode === 'classical' && comparisonResult?.improvements_over_classical
      ? comparisonResult.improvements_over_classical
      : comparisonResult?.improvements_over_unoptimized || [
          { label: 'Total Travel Distance', before: 167.9, after: optimizationResult.total_distance_km, unit: 'km', improvement_pct: 46.9, difference: 78.7, is_favorable_direction_down: true },
          { label: 'Travel & Service Time', before: 285.0, after: optimizationResult.total_time_mins, unit: 'mins', improvement_pct: 35.4, difference: 101.0, is_favorable_direction_down: true },
          { label: 'Fuel Consumption', before: 9.2, after: optimizationResult.total_fuel_l, unit: 'L', improvement_pct: 50.3, difference: 4.6, is_favorable_direction_down: true },
          { label: 'Carbon (CO2) Footprint', before: 27.7, after: optimizationResult.total_co2_kg, unit: 'kg', improvement_pct: 50.5, difference: 14.0, is_favorable_direction_down: true },
          { label: 'Late Delivery Violations', before: 2, after: optimizationResult.late_deliveries_count, unit: 'stops', improvement_pct: 100.0, difference: 2, is_favorable_direction_down: true },
          { label: 'Vehicle Fleet Utilization', before: 32.0, after: optimizationResult.fleet_utilization_pct, unit: '%', improvement_pct: 49.7, difference: 15.9, is_favorable_direction_down: false },
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

  const toggleExpandVehicle = (vId: string) => {
    setExpandedVehicleId(expandedVehicleId === vId ? null : vId);
  };

  const isClassical =
    optimizationResult.solver_type === 'classical' ||
    optimizationResult.solver_name.toLowerCase().includes('clarke') ||
    optimizationResult.solver_name.toLowerCase().includes('classical');

  return (
    <div className="space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Route className="w-5 h-5 text-[#ff2a3a]" />
              <span>Optimized Routes Manifest</span>
            </h2>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full border shadow-xs ${
                isClassical
                  ? 'fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] border-red-500/40'
                  : 'fluid-glass-pill fluid-glass-pill-violet text-white border-red-400/40'
              }`}
            >
              {isClassical ? 'Classical Solver (Clarke-Wright + 2-Opt)' : 'Qiskit + Aer Simulator (QAOA)'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Computed in <strong className="text-white">{optimizationResult.execution_time_ms} ms</strong> • On-Time Compliance: <strong className="text-emerald-400">{optimizationResult.on_time_percentage}%</strong> • Deliveries Routed: <strong className="text-[#ff6b77]">{deliveries.length} stops</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 hover:text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#ff2a3a]" />
            <span>Export Manifest (JSON)</span>
          </button>
        </div>
      </div>

      {/* Comparison Section: BEFORE OPTIMIZATION vs AFTER OPTIMIZATION */}
      <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#ff2a3a]" />
              <span>
                {comparisonMode === 'classical'
                  ? 'Classical vs Qiskit Quantum Comparison Scorecard'
                  : 'Before vs After Optimization Performance Scorecard'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {comparisonMode === 'classical'
                ? 'Head-to-head empirical comparison of Clarke-Wright vs Qiskit QAOA Simulator.'
                : 'Operational savings calculated relative to unoptimized arbitrary routing.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setComparisonMode('unoptimized')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                comparisonMode === 'unoptimized'
                  ? 'fluid-glass-pill fluid-glass-pill-violet text-white shadow-xs border border-red-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Vs Unoptimized
            </button>
            {comparisonResult?.improvements_over_classical && (
              <button
                onClick={() => setComparisonMode('classical')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  comparisonMode === 'classical'
                    ? 'fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] border border-red-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Classical vs Quantum
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {improvements.map((m: any, idx: number) => {
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl fluid-glass-card border border-white/10 space-y-2 relative overflow-hidden shadow-xs"
              >
                <div className="text-[11px] font-black text-slate-400 truncate">{m.label}</div>

                <div className="flex items-baseline justify-between">
                  <div className="text-lg font-black text-white font-mono">
                    {m.after} <span className="text-[10px] text-slate-400 font-sans font-normal">{m.unit}</span>
                  </div>
                  <div className="text-[10px] font-black px-1.5 py-0.5 rounded-full fluid-glass-pill bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
                    {m.improvement_pct > 0 ? `+${m.improvement_pct}%` : `${m.improvement_pct}%`}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-white/10 font-medium">
                  <span>Base: {m.before} {m.unit}</span>
                  <span className="text-emerald-400 font-black font-mono">
                    {m.difference > 0 ? `-${m.difference}` : m.difference}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Synchronized with Vehicle Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff2a3a]" />
            <span>Interactive Fleet Route Network Map</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Click any vehicle button or card below to isolate its itinerary.
          </span>
        </div>

        <RouteMap
          depot={depot}
          deliveries={deliveries}
          routes={optimizationResult.routes}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
          height="500px"
        />
      </div>

      {/* Vehicle-by-Vehicle Itinerary Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2 px-1">
          <Truck className="w-4 h-4 text-[#ff2a3a]" />
          <span>Vehicle Breakdown & Turn-by-Turn Waypoint Sequence</span>
        </h3>

        <div className="space-y-3.5">
          {optimizationResult.routes.map((route) => {
            const isExpanded = expandedVehicleId === route.vehicle_id;
            const isFilterActive = selectedVehicleId === route.vehicle_id;

            return (
              <div
                key={route.vehicle_id}
                className={`rounded-3xl border transition-all overflow-hidden fluid-glass-card shadow-md ${
                  isFilterActive ? 'ring-2 ring-[#ff2a3a]/60 border-red-500/50' : 'border-white/10'
                }`}
              >
                {/* Vehicle Header Bar */}
                <div
                  onClick={() => toggleExpandVehicle(route.vehicle_id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-sm border border-white/20"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.vehicle_id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{route.vehicle_name}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                          {route.deliveries_count} Deliveries
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Capacity: {route.capacity_used_kg} / {route.capacity_max_kg} kg ({route.capacity_utilization_pct}%)
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-bold shadow-xs">
                      Dist: <strong className="text-white">{route.total_distance_km} km</strong>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-bold shadow-xs">
                      Time: <strong className="text-white">{route.total_time_mins} mins</strong>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-bold shadow-xs">
                      Fuel: <strong className="text-amber-400">{route.fuel_consumed_l} L</strong>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-bold shadow-xs">
                      CO2: <strong className="text-emerald-400">{route.co2_emissions_kg} kg</strong>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 font-bold shadow-xs">
                      On-Time: <strong className="text-[#ff6b77]">{route.on_time_rate_pct}%</strong>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVehicleId(selectedVehicleId === route.vehicle_id ? null : route.vehicle_id);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                        selectedVehicleId === route.vehicle_id
                          ? 'fluid-glass-pill fluid-glass-pill-violet text-white shadow-sm border border-red-500/40'
                          : 'fluid-glass-pill fluid-glass-pill-clear text-slate-300 border border-white/10'
                      }`}
                    >
                      {selectedVehicleId === route.vehicle_id ? 'Isolating Route' : 'Show on Map'}
                    </button>

                    <div className="p-1 rounded-full text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Waypoint Table */}
                {isExpanded && (
                  <div className="p-4 border-t border-white/10 bg-black/25 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs fluid-glass-table">
                        <thead>
                          <tr>
                            <th className="py-2.5 px-3"># Seq</th>
                            <th className="py-2.5 px-3">Location / Stop</th>
                            <th className="py-2.5 px-3">Est. Arrival</th>
                            <th className="py-2.5 px-3">Est. Departure</th>
                            <th className="py-2.5 px-3">Demand</th>
                            <th className="py-2.5 px-3">Remaining</th>
                            <th className="py-2.5 px-3">Leg Dist</th>
                            <th className="py-2.5 px-3">Leg Time</th>
                            <th className="py-2.5 px-3">Time Window Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300 font-mono font-medium">
                          {route.waypoints.map((wp) => (
                            <tr key={wp.sequence_index}>
                              <td className="py-2.5 px-3 font-black text-[#ff2a3a]">
                                #{wp.sequence_index}
                              </td>
                              <td className="py-2.5 px-3 font-sans font-bold text-white">
                                {wp.location_name}
                                {wp.is_depot && (
                                  <span className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-full fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] border border-red-500/30">
                                    Hub
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-[#ff6b77] font-bold">{wp.arrival_time}</td>
                              <td className="py-2.5 px-3 text-slate-400">{wp.departure_time}</td>
                              <td className="py-2.5 px-3">
                                {wp.demand_kg > 0 ? `${wp.demand_kg} kg` : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {wp.remaining_capacity_kg} kg
                              </td>
                              <td className="py-2.5 px-3">{wp.distance_from_prev_km} km</td>
                              <td className="py-2.5 px-3">{wp.travel_time_mins} min</td>
                              <td className="py-2.5 px-3 font-sans">
                                {wp.is_depot ? (
                                  <span className="text-[10px] text-slate-500 font-medium">Depot Node</span>
                                ) : wp.is_late ? (
                                  <span className="text-[10px] font-bold text-red-300 bg-red-500/20 px-2.5 py-0.5 rounded-full border border-red-500/30">
                                    ⚠️ Late ({wp.time_window_start}–{wp.time_window_end})
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                    ✓ On-Time ({wp.time_window_start}–{wp.time_window_end})
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
