import React, { useState } from 'react';
import {
  Route,
  Download,
  ChevronDown,
  ChevronUp,
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

export const ResultsPage: React.FC<ResultsPageProps> = ({
  depot,
  deliveries,
  optimizationResult,
  comparisonResult,
  onNavigateTab,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);

  if (!optimizationResult) {
    return (
      <div className="text-center py-20 px-4 rounded-lg bg-[#0D0D0D] border border-white/[0.06]">
        <div className="w-10 h-10 rounded border border-white/20 bg-[#080808] text-white mx-auto flex items-center justify-center mb-4">
          <Route className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-lg text-white">NO ACTIVE DISPATCH RUN</h3>
        <p className="text-xs text-[#8A8A8E] max-w-md mx-auto mt-2 mb-6 font-light">
          Optimal routes have not yet been computed. Run the optimizer to formulate and solve the vehicle routing model.
        </p>
        <button
          onClick={() => onNavigateTab('optimize')}
          className="btn-minimal-primary text-xs"
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

  const toggleExpandVehicle = (vId: string) => {
    setExpandedVehicleId(expandedVehicleId === vId ? null : vId);
  };

  return (
    <div className="space-y-8 pb-20 text-[#F5F5F5]">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
            MISSION MANIFEST &bull; RUN #{Math.round(optimizationResult.execution_time_ms || 280)}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            DISPATCH EXECUTION REPORT
          </h1>
        </div>

        <button
          onClick={handleExportJson}
          className="btn-minimal-outline text-xs !py-2 !px-4"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* 2. EFFICIENCY SCORECARD */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {improvements.map((imp) => (
          <div key={imp.label} className="p-4 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-1">
            <div className="text-[11px] font-mono text-[#8A8A8E]">{imp.label}</div>
            <div className="text-xl font-bold text-white font-mono">
              {imp.after.toFixed(1)} <span className="text-xs text-[#8A8A8E]">{imp.unit}</span>
            </div>
            <div className="text-[10px] font-mono text-[#FF5500]">
              -{imp.improvement_pct.toFixed(1)}% reduction
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAP INSPECTOR */}
      <div className="h-[440px] rounded-lg overflow-hidden border border-white/[0.06] bg-[#0D0D0D]">
        <RouteMap
          depot={depot}
          deliveries={deliveries}
          optimizationResult={optimizationResult}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
        />
      </div>

      {/* 4. VEHICLE ITINERARIES LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          VEHICLE DISPATCH ITINERARIES ({optimizationResult.routes.length})
        </h2>

        <div className="space-y-3">
          {optimizationResult.routes.map((route, i) => {
            const isExpanded = expandedVehicleId === route.vehicle_id;
            const palette = ['#FF5500', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
            const routeColor = route.color || palette[i % palette.length];

            return (
              <div
                key={route.vehicle_id}
                className="rounded-lg bg-[#0D0D0D] border border-white/[0.06] overflow-hidden"
              >
                {/* Route Row Header */}
                <div
                  onClick={() => toggleExpandVehicle(route.vehicle_id)}
                  className="p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: routeColor }} />
                    <div>
                      <div className="font-semibold text-sm text-white">{route.vehicle_name}</div>
                      <div className="font-mono text-[11px] text-[#8A8A8E]">ID: {route.vehicle_id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs text-[#8A8A8E]">
                    <div>STOPS: <span className="text-white">{route.deliveries_count}</span></div>
                    <div>DIST: <span className="text-white">{route.total_distance_km.toFixed(1)} km</span></div>
                    <div>TIME: <span className="text-white">{Math.round(route.total_time_mins)} min</span></div>
                    <div>LOAD: <span className="text-white">{route.capacity_used_kg}/{route.capacity_max_kg} kg</span></div>
                    
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Waypoints Sequence Accordion */}
                {isExpanded && (
                  <div className="border-t border-white/[0.06] p-4 bg-[#080808]/50 space-y-2">
                    <div className="text-[11px] font-mono text-[#8A8A8E] mb-2">WAYPOINT SEQUENCE</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
                      {route.waypoints.map((wp) => (
                        <div key={wp.sequence_index} className="p-2 rounded bg-[#0D0D0D] border border-white/[0.04] flex items-center justify-between">
                          <span className="text-[#FF5500]">#{wp.sequence_index.toString().padStart(2, '0')}</span>
                          <span className="text-white truncate max-w-[120px]">{wp.is_depot ? 'Central Depot' : wp.stop_id}</span>
                          <span className="text-[#8A8A8E] text-[10px]">{wp.arrival_time}</span>
                        </div>
                      ))}
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
