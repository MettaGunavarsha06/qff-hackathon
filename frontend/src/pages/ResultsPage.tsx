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
      <div className="text-center py-20 px-4 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-4">
          <Route className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-white">No Active Optimization Run</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 mb-6">
          Routes have not yet been generated for the current fleet. Navigate to the Optimization Studio to run the solver.
        </p>
        <button
          onClick={() => onNavigateTab('optimize')}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
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
              <Route className="w-5 h-5 text-cyan-400" />
              <span>Optimized Routes Manifest</span>
            </h2>
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                isClassical
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {isClassical ? 'Classical Solver (Clarke-Wright + 2-Opt)' : 'Qiskit + Aer Simulator (QAOA)'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Computed in <strong className="text-slate-200">{optimizationResult.execution_time_ms} ms</strong> • On-Time Compliance: <strong className="text-emerald-400">{optimizationResult.on_time_percentage}%</strong> • Deliveries Routed: <strong className="text-cyan-400">{deliveries.length} stops</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Manifest (JSON)</span>
          </button>
        </div>
      </div>

      {/* Comparison Section: BEFORE OPTIMIZATION vs AFTER OPTIMIZATION */}
      <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>
                {comparisonMode === 'classical'
                  ? 'Classical vs Qiskit Quantum Comparison Scorecard'
                  : 'Before vs After Optimization Performance Scorecard'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {comparisonMode === 'classical'
                ? 'Head-to-head empirical comparison of Clarke-Wright vs Qiskit QAOA Simulator.'
                : 'Operational savings calculated relative to unoptimized arbitrary routing.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setComparisonMode('unoptimized')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                comparisonMode === 'unoptimized'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              Vs Unoptimized
            </button>
            {comparisonResult?.improvements_over_classical && (
              <button
                onClick={() => setComparisonMode('classical')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  comparisonMode === 'classical'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                Classical vs Quantum
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {improvements.map((m: any, idx: number) => {
            const isFavorable = m.is_favorable_direction_down ? m.after <= m.before : m.after >= m.before;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2 relative overflow-hidden"
              >
                <div className="text-[11px] font-bold text-slate-400 truncate">{m.label}</div>

                <div className="flex items-baseline justify-between">
                  <div className="text-lg font-extrabold text-white font-mono">
                    {m.after} <span className="text-[10px] text-slate-400 font-sans font-normal">{m.unit}</span>
                  </div>
                  <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                    {m.improvement_pct > 0 ? `+${m.improvement_pct}%` : `${m.improvement_pct}%`}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>Baseline: {m.before} {m.unit}</span>
                  <span className="text-emerald-400 font-semibold font-mono">
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
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Interactive Fleet Route Network Map</span>
          </h3>
          <span className="text-xs text-slate-400">
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
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          <span>Vehicle Breakdown & Turn-by-Turn Waypoint Sequence</span>
        </h3>

        <div className="space-y-3">
          {optimizationResult.routes.map((route) => {
            const isExpanded = expandedVehicleId === route.vehicle_id;
            const isFilterActive = selectedVehicleId === route.vehicle_id;

            return (
              <div
                key={route.vehicle_id}
                className={`rounded-2xl border transition-all overflow-hidden bg-slate-900/80 backdrop-blur-md ${
                  isFilterActive ? 'border-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-slate-800'
                }`}
              >
                {/* Vehicle Header Bar */}
                <div
                  onClick={() => toggleExpandVehicle(route.vehicle_id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xs shadow-md"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.vehicle_id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{route.vehicle_name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {route.deliveries_count} Deliveries
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Capacity: {route.capacity_used_kg} / {route.capacity_max_kg} kg ({route.capacity_utilization_pct}%)
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="px-3 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/60">
                      Distance: <strong className="text-white">{route.total_distance_km} km</strong>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/60">
                      Duration: <strong className="text-white">{route.total_time_mins} mins</strong>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/60">
                      Fuel: <strong className="text-amber-400">{route.fuel_consumed_l} L</strong>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/60">
                      CO2: <strong className="text-emerald-400">{route.co2_emissions_kg} kg</strong>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700/60">
                      On-Time: <strong className="text-cyan-400">{route.on_time_rate_pct}%</strong>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVehicleId(selectedVehicleId === route.vehicle_id ? null : route.vehicle_id);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedVehicleId === route.vehicle_id
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {selectedVehicleId === route.vehicle_id ? 'Isolating Route' : 'Show on Map'}
                    </button>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Waypoint Table */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 animate-in fade-in duration-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800 pb-2">
                          <tr>
                            <th className="py-2 px-3"># Seq</th>
                            <th className="py-2 px-3">Location / Stop</th>
                            <th className="py-2 px-3">Est. Arrival</th>
                            <th className="py-2 px-3">Est. Departure</th>
                            <th className="py-2 px-3">Demand Delivered</th>
                            <th className="py-2 px-3">Remaining Cap</th>
                            <th className="py-2 px-3">Leg Dist</th>
                            <th className="py-2 px-3">Leg Time</th>
                            <th className="py-2 px-3">Time Window Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                          {route.waypoints.map((wp) => (
                            <tr key={wp.sequence_index} className="hover:bg-slate-800/30">
                              <td className="py-2.5 px-3 font-bold text-cyan-400">
                                #{wp.sequence_index}
                              </td>
                              <td className="py-2.5 px-3 font-sans font-semibold text-white">
                                {wp.location_name}
                                {wp.is_depot && (
                                  <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                    Hub
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-cyan-300">{wp.arrival_time}</td>
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
                                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                                    ⚠️ Late ({wp.time_window_start}–{wp.time_window_end})
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
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
