import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Clock,
  Navigation,
  Fuel,
  Leaf,
  Sliders,
  Play,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
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
}

export const OptimizationPage: React.FC<OptimizationPageProps> = ({
  depot,
  vehicles,
  deliveries,
  optimizationResult,
  comparisonResult,
  isOptimizing,
  onRunOptimization,
  onNavigateTab,
}) => {
  const [objective, setObjective] = useState<OptimizationObjective>('balanced');
  const [trafficLevel, setTrafficLevel] = useState<TrafficLevel>('moderate');
  const [timeWindowMode, setTimeWindowMode] = useState<'strict' | 'soft' | 'ignore'>('soft');
  const [capacityMode, setCapacityMode] = useState<'strict' | 'relaxed'>('strict');
  const [solverType, setSolverType] = useState<SolverType>('quantum_inspired');
  const [activeVehiclesCount, setActiveVehiclesCount] = useState<number>(vehicles.length);

  // Stepper progress for animated modal
  const [currentStage, setCurrentStage] = useState<number>(1);

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
    };
    await onRunOptimization(req);
  };

  const objectivesList: {
    id: OptimizationObjective;
    title: string;
    desc: string;
    icon: any;
    color: string;
  }[] = [
    {
      id: 'balanced',
      title: 'Balanced Multi-Objective (Recommended)',
      desc: 'Pareto-optimal tradeoff between mileage, travel duration, customer time windows, and fleet emissions.',
      icon: Sparkles,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    },
    {
      id: 'min_distance',
      title: 'Minimize Total Distance',
      desc: 'Optimizes shortest road network trajectory and minimizes total vehicle kilometers traveled (VKT).',
      icon: Navigation,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
    {
      id: 'min_travel_time',
      title: 'Minimize Travel Time & Delays',
      desc: 'Avoids congested arterial roads and incorporates live traffic bottlenecks to meet tight delivery windows.',
      icon: Clock,
      color: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    },
    {
      id: 'min_fuel',
      title: 'Minimize Fuel Consumption',
      desc: 'Factors in vehicle engine specs, cargo payload friction (+0.04L/100kg), and stop-and-go idle costs.',
      icon: Fuel,
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
    {
      id: 'min_co2',
      title: 'Minimize CO2 Emissions (Green Logistics)',
      desc: 'Prioritizes routing Electric Vehicles (EVs) for high-mileage runs and optimizes low-carbon delivery paths.',
      icon: Leaf,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
  ];

  const trafficOptions: { id: TrafficLevel; label: string; mult: string; desc: string }[] = [
    { id: 'clear', label: 'Clear Traffic', mult: '1.00x', desc: 'Free-flowing highway & arterial city speeds (~40 km/h)' },
    { id: 'moderate', label: 'Moderate Traffic', mult: '1.28x', desc: 'Typical midday urban flow with minor intersections (~30 km/h)' },
    { id: 'heavy', label: 'Heavy Traffic', mult: '1.75x', desc: 'High congestion with frequent red lights & lane queues (~20 km/h)' },
    { id: 'rush_hour', label: 'Peak Rush Hour', mult: '2.45x', desc: 'Severe gridlock during morning/evening commute spikes (~14 km/h)' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Optimization Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-objective Hamiltonian weights, traffic multipliers, and solver execution engine.
          </p>
        </div>

        <button
          onClick={handleStartOptimization}
          disabled={isOptimizing}
          className={`px-6 py-3 rounded-2xl text-xs font-black tracking-wide shadow-xl flex items-center gap-2.5 transition-all cursor-pointer ${
            isOptimizing
              ? 'bg-slate-800 text-slate-400 border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-500/40'
          }`}
        >
          <Play className={`w-4 h-4 fill-current ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'SOLVING CVRPTW QUBO...' : 'OPTIMIZE ROUTES'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Objectives & Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Optimization Objective Selection */}
          <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>1. Select Primary Optimization Objective</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">QUBO Hamiltonian Weights</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {objectivesList.map((obj) => {
                const Icon = obj.icon;
                const isSelected = objective === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setObjective(obj.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? `${obj.color} shadow-md`
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        isSelected ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{obj.title}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {obj.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Traffic Simulation & Urban Bottlenecks */}
          <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>2. Urban Traffic Conditions</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Travel Time Multiplier</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {trafficOptions.map((t) => {
                const isSelected = trafficLevel === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTrafficLevel(t.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t.label}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-amber-400">
                        {t.mult}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Constraint Settings */}
          <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>3. Constraint Enforcements & Active Fleet Size</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Active Vehicles Slider */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Active Vehicles</span>
                  <span className="font-extrabold text-cyan-400 font-mono text-sm">
                    {activeVehiclesCount} / {vehicles.length}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={vehicles.length}
                  value={activeVehiclesCount}
                  onChange={(e) => setActiveVehiclesCount(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">Limits available delivery vans to route.</p>
              </div>

              {/* Time Window Mode */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">Customer Time Windows</span>
                <select
                  value={timeWindowMode}
                  onChange={(e) => setTimeWindowMode(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="soft">Soft Window (Quadratic Penalty)</option>
                  <option value="strict">Strict Window (Hard Cutoff)</option>
                  <option value="ignore">Ignore Time Constraints</option>
                </select>
                <p className="text-[10px] text-slate-500">Penalizes early/late customer arrivals.</p>
              </div>

              {/* Capacity Strictness */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">Vehicle Payload Capacity</span>
                <select
                  value={capacityMode}
                  onChange={(e) => setCapacityMode(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="strict">Strict (Zero Overloading)</option>
                  <option value="relaxed">Relaxed (+10% Tolerated)</option>
                </select>
                <p className="text-[10px] text-slate-500">Prevents overloading vehicle weight limits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Solver Architecture & Problem Stats */}
        <div className="space-y-6">
          {/* Solver Selection Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Solver Engine Selection</span>
            </h3>

            <div className="space-y-2">
              {[
                {
                  id: 'quantum_inspired' as SolverType,
                  name: 'Quantum-Inspired Simulated Annealing',
                  tag: 'QUBO + SQA',
                  desc: 'Uses transverse-field quantum barrier tunneling to escape local traps.',
                  color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
                },
                {
                  id: 'classical_baseline' as SolverType,
                  name: 'Classical Clarke-Wright Savings',
                  tag: 'Heuristic + 2-Opt',
                  desc: 'Traditional greedy edge-merging followed by intra-route swap improvement.',
                  color: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
                },
                {
                  id: 'hybrid' as SolverType,
                  name: 'Hybrid Quantum-Classical Ensemble',
                  tag: 'Ensemble',
                  desc: 'Runs both solvers simultaneously and takes the Pareto-optimal winner.',
                  color: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
                },
              ].map((s) => {
                const isSelected = solverType === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSolverType(s.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? s.color
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{s.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 font-bold">
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Problem Complexity Telemetry */}
          <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Problem Complexity Profile</span>
            </h3>

            <div className="space-y-2 divide-y divide-slate-800/60">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Total Delivery Stops</span>
                <span className="font-bold text-white font-mono">{deliveries.length} nodes</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Available Fleet</span>
                <span className="font-bold text-white font-mono">{activeVehiclesCount} vehicles</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Search Space Complexity</span>
                <span className="font-bold text-cyan-400 font-mono">
                  ~{(deliveries.length ** 2 * activeVehiclesCount).toLocaleString()} variables
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Total Cargo Demand</span>
                <span className="font-bold text-white font-mono">
                  {deliveries.reduce((acc, d) => acc + d.demand_kg, 0)} kg
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400">Hub Location</span>
                <span className="font-bold text-white font-mono">{depot.name}</span>
              </div>
            </div>
          </div>

          {/* Last Run Summary (if optimized) */}
          {optimizationResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Last Optimization Results
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {optimizationResult.execution_time_ms} ms
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-[10px] text-slate-400">Optimized Distance</div>
                  <div className="text-sm font-extrabold text-white">
                    {optimizationResult.total_distance_km} km
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/50">
                  <div className="text-[10px] text-slate-400">On-Time Rate</div>
                  <div className="text-sm font-extrabold text-emerald-400">
                    {optimizationResult.on_time_percentage}%
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('results')}
                className="w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span>View Full Route Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Progress Animation Modal */}
      {isOptimizing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/50 p-6 shadow-2xl shadow-cyan-500/20 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center relative">
              <Cpu className="w-8 h-8 animate-spin" />
              <div className="absolute -inset-1 rounded-2xl border border-cyan-400 animate-ping opacity-30" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Quantum Optimization In Progress</h3>
              <p className="text-xs text-slate-400 mt-1">
                Executing Simulated Quantum Annealing on {deliveries.length} delivery nodes...
              </p>
            </div>

            {/* Stage Progress Pipeline */}
            <div className="space-y-2.5 text-left text-xs">
              {[
                { stage: 1, title: 'Classical Graph & Traffic Distance Preprocessing', done: true },
                { stage: 2, title: 'Formulating QUBO Objective & Time-Window Penalty Matrix', done: true },
                { stage: 3, title: 'Simulated Quantum Annealing (Barrier Tunneling)', active: true },
                { stage: 4, title: 'Classical Post-Processing & Waypoint Sequence Untangling', done: false },
              ].map((step) => (
                <div
                  key={step.stage}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 ${
                    step.active
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : step.done
                      ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.active
                        ? 'bg-cyan-500 text-slate-950 animate-pulse'
                        : step.done
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step.done ? '✓' : step.stage}
                  </div>
                  <span className="font-semibold">{step.title}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Solving on CPU/Accelerator simulator • Transverse field Γ(t) cooling
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
