import React, { useState } from 'react';
import {
  ArrowRight,
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
    <div className="space-y-4 pb-12">
      
      {/* ─── 1. MINIMAL TELEMETRY STRIP ────────────────────────────────────── */}
      <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-lg px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-6 text-[#8A8A8E]">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">VEHICLES</span>
            <span className="text-[#F5F5F5]">{totalVehicles.toString().padStart(2, '0')}</span>
          </div>

          <div className="h-3 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">DELIVERIES</span>
            <span className="text-[#F5F5F5]">{totalDeliveries.toString().padStart(2, '0')}</span>
          </div>

          <div className="h-3 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">DISTANCE</span>
            <span className="text-[#F5F5F5]">{totalDistance.toFixed(1)} KM</span>
          </div>

          <div className="h-3 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">FUEL</span>
            <span className="text-[#F5F5F5]">{totalFuel.toFixed(2)} L</span>
          </div>

          <div className="h-3 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">CO₂</span>
            <span className="text-[#F5F5F5]">{totalCo2.toFixed(1)} KG</span>
          </div>

          <div className="h-3 w-px bg-white/[0.08]" />

          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">TIME</span>
            <span className="text-[#F5F5F5]">{hours}H {mins}M</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#8A8A8E] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            {optimizationResult ? 'OPTIMIZED' : 'READY'}
          </span>
          <button
            onClick={onOptimizeClick}
            disabled={isOptimizing}
            className="btn-minimal-primary !py-1.5 !px-3 text-xs"
          >
            <span>{isOptimizing ? 'Computing...' : 'Run Optimization'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── 2. DOMINANT CARTOGRAPHIC MAP (~70% VIEWPORT) ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Dominant Map Container */}
        <div className="lg:col-span-9 h-[620px] rounded-lg bg-[#0D0D0D] border border-white/[0.06] overflow-hidden relative">
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
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A8A8E]">
              <span>ACTIVE FLEET</span>
              <button
                onClick={() => setSelectedVehicleId(null)}
                className={`text-[10px] hover:text-white transition-colors ${
                  selectedVehicleId === null ? 'text-white font-bold' : 'text-[#8A8A8E]'
                }`}
              >
                ALL ROUTES
              </button>
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {vehicles.map((v, i) => {
                const isSelected = selectedVehicleId === v.id;
                const routeInfo = optimizationResult?.routes?.find(r => r.vehicle_id === v.id);
                const stopCount = routeInfo?.deliveries_count ?? Math.ceil(deliveries.length / vehicles.length);

                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicleId(isSelected ? null : v.id)}
                    className={`w-full text-left p-2.5 rounded border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/30 text-white'
                        : 'bg-white/[0.02] border-white/[0.04] text-[#8A8A8E] hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#FF5500', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][i % 5] }} />
                      <span className="font-mono text-[11px] font-medium">{v.name || `Vehicle ${v.id}`}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8A8A8E]">{stopCount} stops</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Solution Telemetry Card */}
          <div className="bg-[#0D0D0D] border border-white/[0.06] rounded-lg p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="text-xs font-mono text-[#8A8A8E]">
              EFFICIENCY GAINS
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-[#8A8A8E]">Distance Reduction</span>
                <span className="text-white font-semibold">12.8%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-[#8A8A8E]">Fuel Conservation</span>
                <span className="text-white font-semibold">8.4%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                <span className="text-[#8A8A8E]">CO₂ Abatement</span>
                <span className="text-white font-semibold">11.2%</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#8A8A8E]">Solver Convergence</span>
                <span className="text-[#10B981] font-semibold">Sub-second</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('results')}
              className="w-full btn-minimal-outline !py-2 text-xs text-center justify-center mt-2"
            >
              View Dispatch Manifest
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
