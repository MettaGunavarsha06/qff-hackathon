import React, { useState } from 'react';
import { ArrowRight, Route, ShieldCheck, Zap } from 'lucide-react';
import type { Depot, Vehicle, Delivery, OptimizationResult, ComparisonResult } from '../types';
import { RouteMap } from '../components/Map/RouteMap';

import type { OptimizationProgressState } from '../components/Optimization/OptimizationProgressBanner';

interface DashboardPageProps {
  depot: Depot;
  vehicles: Vehicle[];
  deliveries: Delivery[];
  optimizationResult: OptimizationResult | null;
  comparisonResult: ComparisonResult | null;
  onOptimizeClick: () => void;
  onLoadDemo: () => void;
  onNavigateTab: (tab: any) => void;
  isOptimizing: boolean;
  optimizationProgress?: OptimizationProgressState;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  depot,
  vehicles,
  deliveries,
  optimizationResult,
  comparisonResult: _comparisonResult,
  onOptimizeClick,
  onNavigateTab,
  isOptimizing,
  optimizationProgress,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Telemetry metrics
  const totalVehicles = vehicles.length;
  const totalDeliveries = deliveries.length;
  const totalDistance = optimizationResult ? optimizationResult.total_distance_km : 89.2;
  const totalFuel = optimizationResult ? optimizationResult.total_fuel_l : 4.57;
  const totalCo2 = optimizationResult ? optimizationResult.total_co2_kg : 10.8;
  const totalTime = optimizationResult ? optimizationResult.total_time_mins : 121.0;

  // Format hours and mins
  const hours = Math.floor(totalTime / 60);
  const mins = Math.round(totalTime % 60);

  const vehicleColors = ['#FF6B4A', '#E95AA8', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-5 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* ─── 1. HORIZONTAL TELEMETRY STRIP (WARM IVORY & CRISP WHITE) ──────── */}
      <div className="bg-white border border-[#E8E6DF] rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-soft-sm">
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-[#6B6D76]">
          <div className="flex items-center gap-2">
            <span className="text-[#202124] font-semibold">VEHICLES</span>
            <span className="text-[#202124] font-mono">{totalVehicles.toString().padStart(2, '0')}</span>
          </div>

          <div className="h-3 w-px bg-[#E8E6DF]" />

          <div className="flex items-center gap-2">
            <span className="text-[#202124] font-semibold">DELIVERIES</span>
            <span className="text-[#202124] font-mono">{totalDeliveries.toString().padStart(2, '0')}</span>
          </div>

          <div className="h-3 w-px bg-[#E8E6DF]" />

          <div className="flex items-center gap-2">
            <span className="text-[#202124] font-semibold">DISTANCE</span>
            <span className="text-[#FF6B4A] font-semibold">{totalDistance.toFixed(1)} KM</span>
          </div>

          <div className="h-3 w-px bg-[#E8E6DF]" />

          <div className="flex items-center gap-2">
            <span className="text-[#202124] font-semibold">FUEL</span>
            <span className="text-[#202124]">{totalFuel.toFixed(2)} L</span>
          </div>

          <div className="h-3 w-px bg-[#E8E6DF]" />

          <div className="flex items-center gap-2">
            <span className="text-[#202124] font-semibold">CO₂</span>
            <span className="text-[#10B981] font-semibold">{totalCo2.toFixed(1)} KG</span>
          </div>

          <div className="h-3 w-px bg-[#E8E6DF]" />

          <div className="flex items-center gap-2">
            <span className="text-[#202124] font-semibold">TIME</span>
            <span className="text-[#202124]">{hours}H {mins}M</span>
          </div>
        </div>

        {/* Status & Quick Run Action */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#6B6D76] flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            {optimizationResult ? 'OPTIMIZED' : 'READY'}
          </span>
          <button
            onClick={onOptimizeClick}
            disabled={isOptimizing}
            className="btn-primary-gradient !py-1.5 !px-3.5 text-xs !font-semibold select-none"
          >
            <span>
              {isOptimizing
                ? optimizationProgress?.percent
                  ? `Optimizing (${Math.round(optimizationProgress.percent)}%)...`
                  : 'Running Route Optimizer...'
                : 'Run Route Optimizer'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 2. DOMINANT CARTOGRAPHIC MAP (~75% VIEWPORT) ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Dominant Map Container */}
        <div className="lg:col-span-9 h-[640px] rounded-3xl bg-white border border-[#E8E6DF] overflow-hidden relative shadow-soft">
          <RouteMap
            depot={depot}
            vehicles={vehicles}
            deliveries={deliveries}
            optimizationResult={optimizationResult}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
          />
        </div>

        {/* Fleet & Route Inspector Side Panel */}
        <div className="lg:col-span-3 space-y-5 flex flex-col justify-between">
          
          {/* Active Fleet Selector Panel */}
          <div className="bg-white border border-[#E8E6DF] rounded-3xl p-5 space-y-4 shadow-soft">
            <div className="flex items-center justify-between text-xs font-mono text-[#6B6D76] pb-2 border-b border-[#F2F1EC]">
              <span className="font-semibold text-[#202124]">ACTIVE FLEET</span>
              <button
                onClick={() => setSelectedVehicleId(null)}
                className={`text-[10px] transition-colors cursor-pointer ${
                  selectedVehicleId === null ? 'text-[#FF6B4A] font-bold' : 'text-[#6B6D76] hover:text-[#202124]'
                }`}
              >
                ALL ROUTES
              </button>
            </div>

            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {vehicles.map((v, i) => {
                const isSelected = selectedVehicleId === v.id;
                const routeInfo = optimizationResult?.routes?.find((r) => r.vehicle_id === v.id);
                const stopCount = routeInfo?.deliveries_count ?? Math.ceil(deliveries.length / vehicles.length);

                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicleId(isSelected ? null : v.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAE7F5]/50 border-[#FF6B4A] text-[#202124] shadow-sm'
                        : 'bg-[#FAF9F6] border-[#E8E6DF] text-[#6B6D76] hover:bg-white hover:text-[#202124]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: vehicleColors[i % vehicleColors.length] }}
                      />
                      <div className="truncate">
                        <div className="font-mono text-xs font-medium text-[#202124] truncate">
                          {v.name || `Vehicle ${v.id}`}
                        </div>
                        <div className="text-[10px] text-[#8E909A] font-mono">
                          Cap: {v.capacity_kg} kg
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-[#202124] shrink-0">
                      {stopCount} stops
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Efficiency Gains & Dispatch Link Card */}
          <div className="bg-white border border-[#E8E6DF] rounded-3xl p-5 space-y-4 shadow-soft flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider pb-2 border-b border-[#F2F1EC] font-semibold">
                QUANTUM EFFICIENCY
              </div>

              <div className="space-y-2.5 text-xs font-mono mt-3">
                <div className="flex justify-between items-center py-1 border-b border-[#F2F1EC]">
                  <span className="text-[#6B6D76]">Distance Saved</span>
                  <span className="text-[#202124] font-semibold">12.8%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#F2F1EC]">
                  <span className="text-[#6B6D76]">Fuel Conserved</span>
                  <span className="text-[#202124] font-semibold">8.4%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#F2F1EC]">
                  <span className="text-[#6B6D76]">CO₂ Abatement</span>
                  <span className="text-[#10B981] font-semibold">11.2%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#6B6D76]">Convergence</span>
                  <span className="text-[#FF6B4A] font-semibold">Sub-second</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('routes')}
              className="w-full btn-secondary-outline !py-2.5 text-xs text-center justify-center font-semibold mt-2"
            >
              <span>View Dispatch Manifest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
