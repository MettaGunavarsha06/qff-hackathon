import React, { useState } from 'react';
import {
  Sparkles,
  Navigation,
  Clock,
  Fuel,
  Leaf,
  Play,
  CheckCircle2,
  RefreshCw,
  Radio,
  AlertTriangle,
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
  const [activeVehiclesCount, setActiveVehiclesCount] = useState<number>(vehicles.length);
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
    <div className="space-y-8 pb-20 text-[#F5F5F5]">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
            SOLVER STUDIO &bull; PARAMETER TUNING
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            OPTIMIZATION CONFIGURATION
          </h1>
        </div>

        <button
          onClick={handleStartOptimization}
          disabled={isOptimizing}
          className="btn-minimal-primary !py-2.5 !px-6 text-xs"
        >
          <Play className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Solving QUBO Model...' : 'Launch Optimization'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Columns: Objectives & Parameters */}
        <div className="lg:col-span-8 space-y-6">

          {/* Real-Time India Traffic & Routing (Mappls API) Card */}
          <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono text-[#8A8A8E] uppercase tracking-wider">
                  REAL-TIME TRAFFIC & ROUTING &bull; INDIA
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      trafficStatus?.is_live ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'
                    }`}
                  />
                  <span>
                    {trafficStatus?.is_live ? '● Live Traffic Connected' : '● Traffic Data Unavailable'}
                  </span>
                </h3>
              </div>

              {onRefreshTraffic && (
                <button
                  type="button"
                  onClick={onRefreshTraffic}
                  disabled={isRefreshingTraffic}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-mono text-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#00F0FF] ${isRefreshingTraffic ? 'animate-spin' : ''}`} />
                  <span>{isRefreshingTraffic ? 'Querying Mappls...' : 'Refresh Live Traffic'}</span>
                </button>
              )}
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded bg-black/50 border border-white/[0.04]">
                <span className="text-[10px] text-[#8A8A8E] block uppercase">Traffic Data Provider</span>
                <span className="text-sm font-semibold text-white">Mappls</span>
              </div>
              <div className="p-3 rounded bg-black/50 border border-white/[0.04]">
                <span className="text-[10px] text-[#8A8A8E] block uppercase">Connection Status</span>
                <span
                  className={`text-sm font-semibold ${
                    trafficStatus?.is_live ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {trafficStatus?.is_live ? 'Live' : 'Unavailable'}
                </span>
              </div>
              <div className="p-3 rounded bg-black/50 border border-white/[0.04] col-span-2">
                <span className="text-[10px] text-[#8A8A8E] block uppercase">Last Updated</span>
                <span className="text-xs font-semibold text-white">
                  {trafficStatus?.last_updated || '08 Sep 2026, 18:45 IST'}
                </span>
              </div>
            </div>

            {/* Live Message or Notice */}
            <div
              className={`p-3 rounded text-xs leading-relaxed flex items-start gap-2.5 ${
                trafficStatus?.is_live
                  ? 'bg-[#10B981]/10 border border-[#10B981]/20 text-emerald-200'
                  : 'bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-amber-200'
              }`}
            >
              <Radio className="w-4 h-4 shrink-0 mt-0.5 text-current" />
              <div>
                <span className="font-semibold block">
                  {trafficStatus?.is_live
                    ? 'Mappls Road & Live Traffic Matrix Active'
                    : 'Live traffic data is currently unavailable.'}
                </span>
                <span className="text-[11px] opacity-85">
                  {trafficStatus?.is_live
                    ? 'Road distance matrix and congestion-adjusted travel times are queried directly from Mappls routing API and injected into the optimization objective.'
                    : 'The optimizer can optionally use non-traffic road network estimates (standard distance calculation) to compute optimal delivery routes.'}
                </span>
              </div>
            </div>

            {/* Fallback Option Toggle & Qiskit indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/[0.04] text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={allowNonTrafficFallback}
                  onChange={(e) => setAllowNonTrafficFallback(e.target.checked)}
                  className="rounded bg-black border-white/20 text-[#00F0FF] focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] text-[#A1A1AA]">
                  Allow classical optimizer to run using non-traffic road data if Mappls API is offline
                </span>
              </label>

              <div className="text-[10px] font-mono text-[#8A8A8E] flex items-center gap-1.5 self-start sm:self-auto">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    optimizationResult?.is_live_traffic_used ? 'bg-emerald-400' : 'bg-[#8A8A8E]'
                  }`}
                />
                <span>
                  Qiskit: {optimizationResult?.is_live_traffic_used ? 'Live Traffic Used' : 'Non-Traffic Road Data'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Section 1: Optimization Objective Selection */}
          <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                1. Objective Function
              </div>
              <span className="font-mono text-[10px] text-[#8A8A8E]">HAMILTONIAN WEIGHTS</span>
            </div>


            <div className="space-y-2">
              {objectivesList.map((obj) => {
                const Icon = obj.icon;
                const isSelected = objective === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setObjective(obj.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#141414] border-white/30 text-white'
                        : 'bg-[#080808] border-white/[0.04] hover:border-white/[0.1] text-[#8A8A8E]'
                    }`}
                  >
                    <div
                      className={`p-2 rounded mt-0.5 ${
                        isSelected ? 'bg-white text-black' : 'bg-white/[0.04] text-[#8A8A8E]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-white">{obj.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[#8A8A8E] mt-1 leading-relaxed font-light">{obj.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Traffic Simulation & Urban Congestion */}
          <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                2. Traffic Multiplier
              </div>
              <span className="font-mono text-[10px] text-[#8A8A8E]">LATENCY SCALAR</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {trafficOptions.map((t) => {
                const isSelected = trafficLevel === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTrafficLevel(t.id)}
                    className={`p-3 rounded border text-left transition-all ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/30 text-white'
                        : 'bg-[#080808] border-white/[0.04] text-[#8A8A8E] hover:border-white/[0.1]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                      <span className="text-[#FF5500] font-bold">{t.mult}</span>
                    </div>
                    <div className="text-xs font-medium text-white">{t.label}</div>
                    <div className="text-[10px] text-[#8A8A8E] mt-1 line-clamp-2">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Fleet Allocation & Constraints */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-5">
            <div className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
              3. Constraints & Engine
            </div>

            {/* Active Fleet Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#8A8A8E]">Active Vehicles:</span>
                <span className="text-white font-bold">{activeVehiclesCount} / {vehicles.length}</span>
              </div>
              <input
                type="range"
                min="1"
                max={vehicles.length}
                value={activeVehiclesCount}
                onChange={(e) => setActiveVehiclesCount(Number(e.target.value))}
                className="w-full accent-[#FF5500] cursor-pointer"
              />
            </div>

            {/* Time Window Mode */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#8A8A8E] block">Time Window Policy:</span>
              <div className="grid grid-cols-3 gap-1">
                {(['strict', 'soft', 'ignore'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimeWindowMode(m)}
                    className={`py-1.5 rounded capitalize text-[11px] transition-all ${
                      timeWindowMode === m
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#080808] text-[#8A8A8E] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity Mode */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#8A8A8E] block">Vehicle Capacity Constraint:</span>
              <div className="grid grid-cols-2 gap-1">
                {(['strict', 'relaxed'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCapacityMode(c)}
                    className={`py-1.5 rounded capitalize text-[11px] transition-all ${
                      capacityMode === c
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#080808] text-[#8A8A8E] hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Solver Algorithm Selection */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#8A8A8E] block">Optimization Algorithm:</span>
              <div className="space-y-1.5">
                {[
                  { id: 'quantum_inspired', name: 'Simulated Quantum Annealing (SQA)', tag: 'Recommended' },
                  { id: 'qiskit_runtime', name: 'Qiskit Quantum Runtime API', tag: 'Hybrid' },
                  { id: 'classical_heuristics', name: 'Clarke-Wright + 2-Opt Heuristic', tag: 'Classical' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSolverType(s.id as SolverType)}
                    className={`w-full p-2.5 rounded text-left border transition-all ${
                      solverType === s.id
                        ? 'bg-white/[0.08] border-white/30 text-white'
                        : 'bg-[#080808] border-white/[0.04] text-[#8A8A8E] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-medium text-white">{s.name}</div>
                    <div className="text-[10px] text-[#8A8A8E] mt-0.5">{s.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartOptimization}
              disabled={isOptimizing}
              className="w-full btn-minimal-primary !py-2.5 text-xs text-center justify-center mt-2"
            >
              <span>{isOptimizing ? 'Running Solver...' : 'Execute Route Optimization'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
