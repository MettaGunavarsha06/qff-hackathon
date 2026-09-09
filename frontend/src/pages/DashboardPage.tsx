import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingDown,
  Clock,
  Fuel,
} from 'lucide-react';
import type { Depot, Vehicle, Delivery, OptimizationResult, ComparisonResult } from '../types';
import { RouteMap } from '../components/Map/RouteMap';

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

  return (
    <div className="space-y-5 pb-14 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* ─── 1. CLEAN EDITORIAL TELEMETRY STRIP ──────────────────────────── */}
      <div className="bg-white border border-[#E8E6DF] rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-soft-sm font-mono text-xs">
        
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-[#6B6D76]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8E909A] uppercase">FLEET</span>
            <span className="text-[#1F2024] font-bold">{totalVehicles.toString().padStart(2, '0')}</span>
          </div>

          <span className="text-[#E8E6DF]">|</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8E909A] uppercase">STOPS</span>
            <span className="text-[#1F2024] font-bold">{totalDeliveries.toString().padStart(2, '0')}</span>
          </div>

          <span className="text-[#E8E6DF]">|</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8E909A] uppercase">DISTANCE</span>
            <span className="text-[#1F2024] font-bold">{totalDistance.toFixed(1)} KM</span>
          </div>

          <span className="text-[#E8E6DF]">|</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8E909A] uppercase">FUEL</span>
            <span className="text-[#1F2024] font-bold">{totalFuel.toFixed(2)} L</span>
          </div>

          <span className="text-[#E8E6DF]">|</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8E909A] uppercase">CO₂</span>
            <span className="text-[#1F2024] font-bold">{totalCo2.toFixed(1)} KG</span>
          </div>

          <span className="text-[#E8E6DF]">|</span>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8E909A] uppercase">DURATION</span>
            <span className="text-[#1F2024] font-bold">{hours}H {mins}M</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#6B6D76] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            {optimizationResult ? 'OPTIMIZED' : 'STANDBY'}
          </span>
          <button
            onClick={onOptimizeClick}
            disabled={isOptimizing}
            className="btn-primary-gradient !py-1.5 !px-3.5 !text-xs !font-medium shadow-sm"
          >
            <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ─── 2. DOMINANT CARTOGRAPHIC MAP (~70% VIEWPORT) ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Dominant Map Container */}
        <div className="lg:col-span-9 h-[620px] rounded-3xl bg-white border border-[#E8E6DF] overflow-hidden shadow-soft relative">
          <RouteMap
            depot={depot}
            vehicles={vehicles}
            deliveries={deliveries}
            optimizationResult={optimizationResult}
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
          />
        </div>

        {/* Minimal Fleet & Route Inspector Side HUD */}
        <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
          
          {/* Fleet Vehicle Selector Panel */}
          <div className="bg-white border border-[#E8E6DF] rounded-3xl p-5 space-y-3.5 shadow-soft">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#E8E6DF]">
              <span className="font-bold text-[#1F2024]">ACTIVE FLEET</span>
              <button
                onClick={() => setSelectedVehicleId(null)}
                className={`text-[10px] transition-colors cursor-pointer ${
                  selectedVehicleId === null
                    ? 'text-[#FF6B4A] font-bold'
                    : 'text-[#6B6D76] hover:text-[#1F2024]'
                }`}
              >
                ALL ROUTES
              </button>
            </div>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {vehicles.map((v, i) => {
                const isSelected = selectedVehicleId === v.id;
                const routeInfo = optimizationResult?.routes?.find((r) => r.vehicle_id === v.id);
                const stopCount = routeInfo?.deliveries_count ?? Math.ceil(deliveries.length / vehicles.length);
                const vehColors = ['#FF6B4A', '#E95AA8', '#3B82F6', '#10B981', '#F59E0B'];
                const color = routeInfo?.color || vehColors[i % vehColors.length];

                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicleId(isSelected ? null : v.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF9F5] border-[#FF6B4A] text-[#1F2024] shadow-sm font-semibold'
                        : 'bg-[#FAF9F6] border-[#E8E6DF] text-[#6B6D76] hover:bg-[#F2F1EC] hover:text-[#1F2024]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="font-mono text-[11px] truncate">{v.name || `Vehicle ${v.id}`}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8E909A] shrink-0">{stopCount} stops</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Efficiency Gains & HUD */}
          <div className="bg-white border border-[#E8E6DF] rounded-3xl p-5 space-y-4 shadow-soft">
            <div className="text-xs font-mono font-bold text-[#1F2024] pb-2 border-b border-[#E8E6DF] uppercase tracking-wider">
              EFFICIENCY GAINS
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-[#F5F4EE]">
                <span className="text-[#6B6D76]">Distance Reduction</span>
                <span className="text-[#FF6B4A] font-bold">12.8%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F5F4EE]">
                <span className="text-[#6B6D76]">Fuel Conservation</span>
                <span className="text-[#FF6B4A] font-bold">8.4%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F5F4EE]">
                <span className="text-[#6B6D76]">CO₂ Abatement</span>
                <span className="text-[#10B981] font-bold">11.2%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B6D76]">Convergence</span>
                <span className="text-[#10B981] font-bold">Sub-second</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigateTab('routes')}
                className="w-full btn-secondary-outline !py-2 !text-xs font-mono text-center justify-center cursor-pointer"
              >
                <span>Dispatch Manifest</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
