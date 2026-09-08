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
  onLoadQuantumDemo?: () => void;
  onLoadFullDemo?: () => void;
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
  onLoadQuantumDemo,
  onLoadFullDemo,
}) => {
  const [objective, setObjective] = useState<OptimizationObjective>('balanced');
  const [trafficLevel, setTrafficLevel] = useState<TrafficLevel>('moderate');
  const [timeWindowMode, setTimeWindowMode] = useState<'strict' | 'soft' | 'ignore'>('soft');
  const [capacityMode, setCapacityMode] = useState<'strict' | 'relaxed'>('strict');
  const [solverType, setSolverType] = useState<SolverType>('qiskit');
  const [activeVehiclesCount, setActiveVehiclesCount] = useState<number>(vehicles.length);

  // Stepper progress for animated modal (5 stages)
  const [currentStage, setCurrentStage] = useState<number>(1);

  React.useEffect(() => {
    if (!isOptimizing) {
      setCurrentStage(1);
      return;
    }
    const t1 = setTimeout(() => setCurrentStage(2), 250);
    const t2 = setTimeout(() => setCurrentStage(3), 700);
    const t3 = setTimeout(() => setCurrentStage(4), 1150);
    const t4 = setTimeout(() => setCurrentStage(5), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOptimizing]);

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#ff2a3a]" />
            <span>Optimization Studio</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Configure multi-objective Hamiltonian weights, traffic multipliers, and solver execution engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onLoadQuantumDemo && (
            <button
              onClick={onLoadQuantumDemo}
              className="px-4 py-2.5 rounded-full fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] border border-red-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Load small 4-stop dataset optimized for Qiskit Aer quantum simulator"
            >
              <Zap className="w-3.5 h-3.5 text-[#ff2a3a] fill-current" />
              <span>Load Quantum Demo (4 stops)</span>
            </button>
          )}

          {onLoadFullDemo && (
            <button
              onClick={onLoadFullDemo}
              className="px-4 py-2.5 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 border border-white/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Load full 25-stop delivery dataset"
            >
              <Layers className="w-3.5 h-3.5 text-[#ff2a3a]" />
              <span>Full Demo (25 stops)</span>
            </button>
          )}

          <button
            onClick={handleStartOptimization}
            disabled={isOptimizing || (solverType === 'qiskit' && deliveries.length > 6)}
            className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wide shadow-xl flex items-center gap-2 transition-all cursor-pointer fluid-glass-pill ${
              isOptimizing || (solverType === 'qiskit' && deliveries.length > 6)
                ? 'fluid-glass-pill-clear text-slate-400 opacity-70 cursor-not-allowed'
                : 'fluid-glass-pill-violet text-white hover:shadow-red-500/40'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>
              {isOptimizing
                ? 'OPTIMIZING...'
                : solverType === 'qiskit' && deliveries.length > 6
                ? 'SELECT ≤ 6 STOPS FOR QISKIT'
                : 'OPTIMIZE ROUTES'}
            </span>
          </button>
        </div>
      </div>

      {/* Qiskit Limit Warning Banner */}
      {solverType === 'qiskit' && deliveries.length > 6 && (
        <div className="p-4 rounded-3xl fluid-glass-panel border border-amber-500/30 bg-amber-500/10 flex items-start gap-3.5 text-xs text-amber-200 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-black text-amber-300">
              Qiskit Aer Simulator Scaling Limit (≤ 6 stops)
            </div>
            <div className="text-[11px] text-slate-300 mt-1 leading-relaxed font-medium">
              The Qiskit quantum simulator scales exponentially (2ⁿ Hilbert state-space) and is designed for <strong>3 to 6 delivery locations</strong>. The current dataset contains <strong>{deliveries.length} stops</strong>.
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {onLoadQuantumDemo && (
                <button
                  onClick={onLoadQuantumDemo}
                  className="px-4 py-1.5 rounded-full fluid-glass-pill fluid-glass-pill-amber text-amber-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-900" />
                  <span>Load Quantum Demo (4 stops)</span>
                </button>
              )}
              <button
                onClick={() => setSolverType('classical')}
                className="px-4 py-1.5 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-white/10 shadow-xs"
              >
                <Cpu className="w-3.5 h-3.5 text-[#ff2a3a]" />
                <span>Switch to Classical Optimizer (Up to 50+ stops)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Objectives & Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Optimization Objective Selection */}
          <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff2a3a]" />
                <span>1. Select Primary Optimization Objective</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold">QUBO Hamiltonian Weights</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {objectivesList.map((obj) => {
                const Icon = obj.icon;
                const isSelected = objective === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setObjective(obj.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'fluid-glass-card border-red-500/50 bg-[#ff2a3a]/10 shadow-md ring-2 ring-red-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl mt-0.5 ${
                        isSelected ? 'fluid-glass-pill fluid-glass-pill-violet text-white' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{obj.title}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#ff2a3a] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-medium">
                        {obj.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Traffic Simulation & Urban Bottlenecks */}
          <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff2a3a]" />
                <span>2. Urban Traffic Conditions</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold">Travel Time Multiplier</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {trafficOptions.map((t) => {
                const isSelected = trafficLevel === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTrafficLevel(t.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'fluid-glass-card border-red-500/50 bg-[#ff2a3a]/10 shadow-md ring-2 ring-red-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{t.label}</span>
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full bg-[#ff2a3a]/20 text-[#ff6b77] border border-red-500/30">
                        {t.mult}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-tight font-medium">{t.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Constraint Settings */}
          <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#ff2a3a]" />
              <span>3. Constraint Enforcements & Active Fleet Size</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Active Vehicles Slider */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Active Vehicles</span>
                  <span className="font-black text-[#ff2a3a] font-mono text-sm">
                    {activeVehiclesCount} / {vehicles.length}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={vehicles.length}
                  value={activeVehiclesCount}
                  onChange={(e) => setActiveVehiclesCount(parseInt(e.target.value, 10))}
                  className="w-full accent-[#ff2a3a] cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 font-medium">Limits available delivery vans to route.</p>
              </div>

              {/* Time Window Mode */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 shadow-xs">
                <span className="font-bold text-slate-300 block">Customer Time Windows</span>
                <select
                  value={timeWindowMode}
                  onChange={(e) => setTimeWindowMode(e.target.value as any)}
                  className="w-full p-2 fluid-glass-input text-xs font-bold bg-[#0d0e15]"
                >
                  <option value="soft">Soft Window (Quadratic Penalty)</option>
                  <option value="strict">Strict Window (Hard Cutoff)</option>
                  <option value="ignore">Ignore Time Constraints</option>
                </select>
                <p className="text-[10px] text-slate-500 font-medium">Penalizes early/late customer arrivals.</p>
              </div>

              {/* Capacity Strictness */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 shadow-xs">
                <span className="font-bold text-slate-300 block">Vehicle Payload Capacity</span>
                <select
                  value={capacityMode}
                  onChange={(e) => setCapacityMode(e.target.value as any)}
                  className="w-full p-2 fluid-glass-input text-xs font-bold bg-[#0d0e15]"
                >
                  <option value="strict">Strict (Zero Overloading)</option>
                  <option value="relaxed">Relaxed (+10% Tolerated)</option>
                </select>
                <p className="text-[10px] text-slate-500 font-medium">Prevents overloading vehicle weight limits.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Solver Architecture & Problem Stats */}
        <div className="space-y-6">
          {/* Solver Selection Card */}
          <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ff2a3a]" />
              <span>Solver Engine Selection</span>
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'qiskit' as SolverType,
                  name: 'Qiskit QAOA (Aer Simulator)',
                  tag: 'QUBO + Aer',
                  desc: 'CVRPTW Hamiltonian mapped to QAOA quantum circuit; simulated via local Qiskit Aer / Statevector sampler. (3–6 stops)',
                },
                {
                  id: 'classical' as SolverType,
                  name: 'Classical Clarke-Wright + 2-Opt',
                  tag: 'Heuristic + 2-Opt',
                  desc: 'Greedy Clarke-Wright savings method followed by 2-opt swap route untangling. (Up to 50+ stops)',
                },
                {
                  id: 'quantum_inspired' as SolverType,
                  name: 'Quantum-Inspired SQA',
                  tag: 'QUBO + SQA',
                  desc: 'Transverse-field Simulated Quantum Annealing for medium problem spaces.',
                },
              ].map((s) => {
                const isSelected = solverType === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSolverType(s.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'fluid-glass-card border-red-500/50 bg-[#ff2a3a]/10 shadow-md ring-2 ring-red-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{s.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#ff6b77] border border-white/15 font-bold">
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-medium">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Problem Complexity Telemetry */}
          <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Problem Complexity Profile</span>
            </h3>

            <div className="space-y-2.5 divide-y divide-white/10">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 font-medium">Total Delivery Stops</span>
                <span className="font-black text-white font-mono">{deliveries.length} nodes</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Available Fleet</span>
                <span className="font-black text-white font-mono">{activeVehiclesCount} vehicles</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Search Space Complexity</span>
                <span className="font-black text-[#ff2a3a] font-mono">
                  ~{(deliveries.length ** 2 * activeVehiclesCount).toLocaleString()} variables
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Total Cargo Demand</span>
                <span className="font-black text-white font-mono">
                  {deliveries.reduce((acc, d) => acc + d.demand_kg, 0)} kg
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Hub Location</span>
                <span className="font-black text-white font-mono">{depot.name}</span>
              </div>
            </div>
          </div>

          {/* Last Run Summary (if optimized) */}
          {optimizationResult && (
            <div className="p-6 rounded-3xl fluid-glass-card border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ff2a3a]" />
                  Last Optimization Results
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {optimizationResult.execution_time_ms} ms
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-medium">Optimized Distance</div>
                  <div className="text-sm font-black text-white mt-0.5">
                    {optimizationResult.total_distance_km} km
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-[10px] text-slate-400 font-medium">On-Time Rate</div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">
                    {optimizationResult.on_time_percentage}%
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('results')}
                className="w-full py-2.5 rounded-full fluid-glass-pill fluid-glass-pill-violet text-white text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm hover:shadow-red-500/40"
              >
                <span>View Full Route Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Progress Animation Modal (5 Stages) in Dark Obsidian Glass */}
      {isOptimizing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl fluid-glass-panel border border-white/15 p-6 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl fluid-glass-pill-violet text-white mx-auto flex items-center justify-center relative shadow-lg shadow-red-500/30">
              <Cpu className="w-8 h-8 animate-spin" />
              <div className="absolute -inset-1 rounded-2xl border border-red-500 animate-ping opacity-30" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                {solverType === 'qiskit'
                  ? 'Qiskit Quantum QAOA In Progress'
                  : 'Route Optimization In Progress'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {solverType === 'qiskit'
                  ? `Simulating quantum circuit for ${deliveries.length} delivery nodes on AerSimulator...`
                  : `Solving Clarke-Wright savings network for ${deliveries.length} delivery nodes...`}
              </p>
            </div>

            {/* Stage Progress Pipeline (5 Specific Stages) */}
            <div className="space-y-2.5 text-left text-xs">
              {(solverType === 'qiskit'
                ? [
                    { stage: 1, title: 'Preparing optimization problem...' },
                    { stage: 2, title: 'Running Qiskit optimization...' },
                    { stage: 3, title: 'Decoding solution...' },
                    { stage: 4, title: 'Calculating route metrics...' },
                    { stage: 5, title: 'Optimization complete' },
                  ]
                : [
                    { stage: 1, title: 'Preparing optimization problem...' },
                    { stage: 2, title: 'Running Clarke-Wright Savings...' },
                    { stage: 3, title: 'Executing 2-Opt route refinement...' },
                    { stage: 4, title: 'Calculating route metrics...' },
                    { stage: 5, title: 'Optimization complete' },
                  ]
              ).map((step) => {
                const isDone = step.stage < currentStage || currentStage === 5;
                const isActive = step.stage === currentStage && currentStage < 5;
                return (
                  <div
                    key={step.stage}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                      isActive
                        ? 'fluid-glass-card border-red-500/50 bg-[#ff2a3a]/15 text-white shadow-sm'
                        : isDone
                        ? 'bg-white/5 border-white/10 text-slate-300'
                        : 'bg-white/5 border-white/5 text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isActive
                          ? 'fluid-glass-pill fluid-glass-pill-violet text-white animate-pulse'
                          : isDone
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/10 text-slate-500'
                      }`}
                    >
                      {isDone ? '✓' : step.stage}
                    </div>
                    <span className="font-bold">{step.title}</span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 font-mono font-bold">
              {solverType === 'qiskit'
                ? 'Backend: Qiskit Aer / Statevector Simulator • QUBO Formulation'
                : 'Backend: Local CPU Heuristic Engine • Deterministic Savings Matrix'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
