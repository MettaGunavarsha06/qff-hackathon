import React, { useState } from 'react';
import {
  Sparkles,
  Navigation,
  Clock,
  Fuel,
  Leaf,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Radio,
  Sliders,
} from 'lucide-react';
import type {
  OptimizationObjective,
  TrafficLevel,
  SolverType,
  OptimizationRequest,
  OptimizationResult,
  ComparisonResult,
  Depot,
  Vehicle,
  Delivery,
  TrafficStatus,
} from '../types';

interface OptimizationPageProps {
  depot: Depot;
  vehicles: Vehicle[];
  deliveries: Delivery[];
  optimizationResult: OptimizationResult | null;
  comparisonResult: ComparisonResult | null;
  isOptimizing: boolean;
  onRunOptimization: (req: OptimizationRequest) => Promise<void>;
  onNavigateTab: (tab: any) => void;
  trafficStatus?: TrafficStatus;
  onRefreshTraffic?: () => void;
  isRefreshingTraffic?: boolean;
}

export const OptimizationPage: React.FC<OptimizationPageProps> = ({
  depot,
  vehicles,
  deliveries,
  optimizationResult,
  isOptimizing,
  onRunOptimization,
  trafficStatus,
  onRefreshTraffic,
  isRefreshingTraffic,
}) => {
  const [objective, setObjective] = useState<OptimizationObjective>('balanced');
  const [trafficLevel, setTrafficLevel] = useState<TrafficLevel>('moderate');
  const [timeWindowMode, setTimeWindowMode] = useState<'strict' | 'soft' | 'ignore'>('soft');
  const [capacityMode, setCapacityMode] = useState<'strict' | 'relaxed'>('strict');
  const [solverType, setSolverType] = useState<SolverType>('quantum_inspired');
  const [activeVehiclesCount, setActiveVehiclesCount] = useState<number>(vehicles.length || 5);
  const [useLiveTraffic, setUseLiveTraffic] = useState<boolean>(true);
  const [allowNonTrafficFallback, setAllowNonTrafficFallback] = useState<boolean>(true);

  const handleStartOptimization = async () => {
    const subsetVehicles = vehicles.slice(0, activeVehiclesCount);
    const req: OptimizationRequest = {
      depot,
      vehicles: subsetVehicles,
      deliveries,
      objective,
      traffic_level: trafficLevel,
      time_window_mode: timeWindowMode,
      capacity_mode: capacityMode,
      solver_type: solverType,
      use_live_traffic: useLiveTraffic,
      allow_non_traffic_fallback: allowNonTrafficFallback,
    };
    await onRunOptimization(req);
  };

  const objectivesList: {
    id: OptimizationObjective;
    title: string;
    desc: string;
    icon: any;
  }[] = [
    {
      id: 'balanced',
      title: 'Balanced Multi-Objective (Recommended)',
      desc: 'Pareto-optimal tradeoff minimizing distance, travel duration, customer delays, and fleet carbon emissions.',
      icon: Sparkles,
    },
    {
      id: 'min_distance',
      title: 'Minimize Total Distance',
      desc: 'Optimizes shortest road network trajectory and minimizes total vehicle kilometers traveled (VKT).',
      icon: Navigation,
    },
    {
      id: 'min_travel_time',
      title: 'Minimize Travel Time & Delays',
      desc: 'Avoids congested arterial roads and incorporates live traffic bottlenecks to meet tight delivery windows.',
      icon: Clock,
    },
    {
      id: 'min_fuel',
      title: 'Minimize Fuel Consumption',
      desc: 'Factors in powertrain efficiency, cargo friction (+0.04L/100kg), and stop-and-go urban idle costs.',
      icon: Fuel,
    },
    {
      id: 'min_co2',
      title: 'Minimize CO₂ Emissions (Green Logistics)',
      desc: 'Prioritizes routing Electric Vehicles (EVs) for high-mileage runs and optimizes low-carbon delivery paths.',
      icon: Leaf,
    },
  ];

  const trafficOptions: { id: TrafficLevel; label: string; mult: string; desc: string }[] = [
    { id: 'clear', label: 'Clear Flow', mult: '1.00x', desc: 'Arterial speeds (~40 km/h)' },
    { id: 'moderate', label: 'Moderate Flow', mult: '1.28x', desc: 'Midday traffic (~30 km/h)' },
    { id: 'heavy', label: 'Heavy Traffic', mult: '1.75x', desc: 'Peak congestion (~20 km/h)' },
    { id: 'rush_hour', label: 'Rush Hour Gridlock', mult: '2.45x', desc: 'Severe slowdowns (~14 km/h)' },
  ];

  return (
    <div className="space-y-8 pb-24 text-[#1F2024] max-w-6xl mx-auto pt-4">
      
      {/* ─── STUDIO HEADER (OPTIMIZE THE NETWORK) ─────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="text-xs font-mono text-[#FF5B37] uppercase tracking-wider font-semibold">
            SOLVER WORKSPACE &bull; MULTI-OBJECTIVE PARAMETERS
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#1F2024] tracking-tight mt-1">
            OPTIMIZE THE NETWORK.
          </h1>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleStartOptimization}
          disabled={isOptimizing}
          className="btn-primary-gradient !py-3 !px-7 text-xs !font-semibold group self-start md:self-auto"
        >
          <span>{isOptimizing ? 'Solving Network...' : 'OPTIMIZE NETWORK'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns: Objectives & Traffic Controls */}
        <div className="lg:col-span-8 space-y-6">

          {/* Real-Time India Traffic & Routing Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono text-[#6B6D76] uppercase tracking-wider">
                  REAL-TIME TRAFFIC & ROUTING &bull; INDIA
                </div>
                <h3 className="text-base font-bold text-[#1F2024] tracking-tight flex items-center gap-2 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      trafficStatus?.is_live ? 'bg-[#10B981] animate-pulse' : 'bg-[#FF5B37]'
                    }`}
                  />
                  <span>
                    {trafficStatus?.is_live ? 'Live Traffic Connected (Mappls)' : 'Autonomous Network Calibrated'}
                  </span>
                </h3>
              </div>

              {onRefreshTraffic && (
                <button
                  type="button"
                  onClick={onRefreshTraffic}
                  disabled={isRefreshingTraffic}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F6F2] hover:bg-[#EFEFEB] text-[#1F2024] border border-[#E8E6DF] font-mono text-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#FF5B37] ${isRefreshingTraffic ? 'animate-spin' : ''}`} />
                  <span>{isRefreshingTraffic ? 'Querying Mappls...' : 'Refresh Live Traffic'}</span>
                </button>
              )}
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF]">
                <span className="text-[10px] text-[#8E909A] block uppercase">Provider</span>
                <span className="text-sm font-semibold text-[#1F2024]">Mappls Routing</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF]">
                <span className="text-[10px] text-[#8E909A] block uppercase">Status</span>
                <span
                  className={`text-sm font-semibold ${
                    trafficStatus?.is_live ? 'text-[#10B981]' : 'text-[#FF5B37]'
                  }`}
                >
                  {trafficStatus?.is_live ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#8E909A] block uppercase">Last Updated</span>
                <span className="text-xs font-semibold text-[#1F2024]">
                  {trafficStatus?.last_updated || '09 Sep 2026, 10:15 IST'}
                </span>
              </div>
            </div>

            {/* Fallback Option Toggle */}
            <div className="pt-2 border-t border-[#E8E6DF] text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-[#6B6D76] select-none">
                <input
                  type="checkbox"
                  checked={allowNonTrafficFallback}
                  onChange={(e) => setAllowNonTrafficFallback(e.target.checked)}
                  className="rounded border-[#E8E6DF] text-[#FF5B37] focus:ring-0 cursor-pointer accent-[#FF5B37]"
                />
                <span className="text-[11px]">
                  Enable dynamic road network matrix adaptation with real-time heuristic modeling
                </span>
              </label>
            </div>
          </div>
          
          {/* Section 1: Optimization Objective Selection */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div className="text-xs font-mono font-semibold text-[#1F2024] uppercase tracking-wider">
                1. OPTIMIZATION OBJECTIVE
              </div>
              <span className="font-mono text-[10px] text-[#6B6D76]">PARETO-OPTIMAL PROFILES</span>
            </div>

            <div className="space-y-2.5">
              {objectivesList.map((obj) => {
                const Icon = obj.icon;
                const isSelected = objective === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setObjective(obj.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'bg-white border-[#FF5B37] shadow-soft ring-2 ring-[#FF5B37]/15'
                        : 'bg-[#FAF9F6] border-[#E8E6DF] hover:border-[#D6D4CC] text-[#6B6D76]'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl mt-0.5 ${
                        isSelected
                          ? 'bg-gradient-to-tr from-[#FF5B37] to-[#FF4D8D] text-white shadow-[0_2px_8px_rgba(255,91,55,0.25)]'
                          : 'bg-white border border-[#E8E6DF] text-[#6B6D76]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#1F2024]">{obj.title}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF5B37] shrink-0" />}
                      </div>
                      <p className="text-xs text-[#6B6D76] mt-1 leading-relaxed font-light">{obj.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Traffic Multiplier */}
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div className="text-xs font-mono font-semibold text-[#1F2024] uppercase tracking-wider">
                2. TRAFFIC CONGESTION MULTIPLIER
              </div>
              <span className="font-mono text-[10px] text-[#6B6D76]">SPEED PENALTY</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trafficOptions.map((t) => {
                const isSelected = trafficLevel === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTrafficLevel(t.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#FF5B37] shadow-soft ring-2 ring-[#FF5B37]/15'
                        : 'bg-[#FAF9F6] border-[#E8E6DF] text-[#6B6D76] hover:border-[#D6D4CC]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                      <span className="text-[#FF5B37] font-bold">{t.mult}</span>
                    </div>
                    <div className="text-xs font-bold text-[#1F2024]">{t.label}</div>
                    <div className="text-[11px] text-[#8E909A] mt-1">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Fleet Allocation & Constraints */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-6">
            <div className="pb-3 border-b border-[#E8E6DF] flex items-center justify-between">
              <div className="text-xs font-mono font-semibold text-[#1F2024] uppercase tracking-wider">
                3. FLEET & CONSTRAINTS
              </div>
              <Sliders className="w-3.5 h-3.5 text-[#6B6D76]" />
            </div>

            {/* Active Fleet Slider */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#6B6D76]">Vehicles Deployed:</span>
                <span className="text-[#1F2024] font-bold">{activeVehiclesCount} / {vehicles.length || 5}</span>
              </div>
              <input
                type="range"
                min="1"
                max={vehicles.length || 5}
                value={activeVehiclesCount}
                onChange={(e) => setActiveVehiclesCount(Number(e.target.value))}
                className="w-full accent-[#FF5B37] cursor-pointer"
              />
            </div>

            {/* Time Window Mode */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#6B6D76] block">Time Window Policy:</span>
              <div className="grid grid-cols-3 gap-1.5 bg-[#F7F6F2] p-1 rounded-2xl border border-[#E8E6DF]">
                {(['strict', 'soft', 'ignore'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimeWindowMode(m)}
                    className={`py-1.5 rounded-xl capitalize text-xs transition-all cursor-pointer ${
                      timeWindowMode === m
                        ? 'bg-white text-[#1F2024] font-bold shadow-sm'
                        : 'text-[#6B6D76] hover:text-[#1F2024]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity Mode */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#6B6D76] block">Vehicle Capacity Constraint:</span>
              <div className="grid grid-cols-2 gap-1.5 bg-[#F7F6F2] p-1 rounded-2xl border border-[#E8E6DF]">
                {(['strict', 'relaxed'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCapacityMode(c)}
                    className={`py-1.5 rounded-xl capitalize text-xs transition-all cursor-pointer ${
                      capacityMode === c
                        ? 'bg-white text-[#1F2024] font-bold shadow-sm'
                        : 'text-[#6B6D76] hover:text-[#1F2024]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Solver Algorithm Selection */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#6B6D76] block">Optimization Engine:</span>
              <div className="space-y-2">
                {[
                  { id: 'quantum_inspired', name: 'Simulated Quantum Annealing', tag: 'Recommended' },
                  { id: 'qiskit_runtime', name: 'Qiskit QAOA / Statevector', tag: 'Hybrid' },
                  { id: 'classical_heuristics', name: 'Clarke-Wright & 2-Opt', tag: 'Classical' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSolverType(s.id as SolverType)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      solverType === s.id
                        ? 'bg-[#FAF9F6] border-[#FF5B37] text-[#1F2024] ring-1 ring-[#FF5B37]/20'
                        : 'bg-white border-[#E8E6DF] text-[#6B6D76] hover:border-[#D6D4CC]'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#1F2024]">{s.name}</div>
                    <div className="text-[10px] text-[#FF5B37] font-semibold mt-0.5">{s.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartOptimization}
              disabled={isOptimizing}
              className="w-full btn-primary-gradient !py-3 text-xs text-center justify-center font-bold tracking-wide mt-2"
            >
              <span>{isOptimizing ? 'Running Solver...' : 'OPTIMIZE NETWORK →'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
