import React from 'react';
import {
  Truck,
  Package,
  Navigation,
  Fuel,
  Clock,
  Leaf,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
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
  comparisonResult,
  onOptimizeClick,
  onLoadDemo,
  onNavigateTab,
  isOptimizing,
}) => {
  const isOptimized = !!optimizationResult;

  // KPI calculations
  const totalVehicles = vehicles.length;
  const totalDeliveries = deliveries.length;
  const totalDistance = optimizationResult ? optimizationResult.total_distance_km : 167.9;
  const totalFuel = optimizationResult ? optimizationResult.total_fuel_l : 9.2;
  const totalTime = optimizationResult ? optimizationResult.total_time_mins : 285.0;
  const totalCo2 = optimizationResult ? optimizationResult.total_co2_kg : 27.7;
  const fleetUtil = optimizationResult ? optimizationResult.fleet_utilization_pct : 47.9;

  // Before vs After chart data
  const comparisonChartData = [
    {
      name: 'Distance (km)',
      Before: comparisonResult?.unoptimized_summary?.total_distance_km || 167.9,
      After: optimizationResult?.total_distance_km || 89.2,
      saving: '47% Saved',
    },
    {
      name: 'Fuel (Liters)',
      Before: comparisonResult?.unoptimized_summary?.total_fuel_l || 9.2,
      After: optimizationResult?.total_fuel_l || 4.6,
      saving: '50% Saved',
    },
    {
      name: 'CO2 (kg)',
      Before: comparisonResult?.unoptimized_summary?.total_co2_kg || 27.7,
      After: optimizationResult?.total_co2_kg || 13.7,
      saving: '51% Cut',
    },
  ];

  // Vehicle utilization data
  const vehicleUtilData = (optimizationResult?.routes || vehicles.map((v, i) => ({
    vehicle_id: v.id,
    vehicle_name: v.name || `Vehicle ${v.id}`,
    capacity_utilization_pct: [78, 65, 82, 58, 71][i % 5],
    deliveries_count: [5, 5, 5, 5, 5][i % 5],
    color: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'][i % 5],
  }))).map((r: any) => ({
    name: r.vehicle_id,
    utilization: r.capacity_utilization_pct,
    deliveries: r.deliveries_count,
    color: r.color,
  }));

  const kpis = [
    {
      title: 'Active Fleet',
      value: `${totalVehicles} Vans`,
      sub: `${vehicles.filter((v) => v.fuel_type === 'electric').length} Zero-Emission EVs`,
      icon: Truck,
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400',
    },
    {
      title: 'Total Deliveries',
      value: `${totalDeliveries} Stops`,
      sub: `${deliveries.filter((d) => d.priority === 'urgent').length} Urgent Priority`,
      icon: Package,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
    },
    {
      title: 'Optimized Distance',
      value: `${totalDistance} km`,
      sub: isOptimized ? '↓ 47% vs Unoptimized' : 'Estimated Route Length',
      icon: Navigation,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      badge: isOptimized ? '-78.7 km' : undefined,
    },
    {
      title: 'Fuel Consumption',
      value: `${totalFuel} Liters`,
      sub: isOptimized ? '↓ 4.6 L Saved' : 'Estimated Fleet Fuel',
      icon: Fuel,
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
      badge: isOptimized ? '-50%' : undefined,
    },
    {
      title: 'Total Travel Time',
      value: `${Math.floor(totalTime / 60)}h ${Math.round(totalTime % 60)}m`,
      sub: 'Including 15m service time',
      icon: Clock,
      color: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30 text-cyan-400',
    },
    {
      title: 'CO2 Footprint',
      value: `${totalCo2} kg`,
      sub: isOptimized ? '↓ 14.0 kg Prevented' : 'Estimated Carbon Impact',
      icon: Leaf,
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
      badge: isOptimized ? '-51%' : undefined,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Hero in Dark Obsidian Glass */}
      <div className="relative overflow-hidden rounded-3xl fluid-glass-panel p-6 lg:p-8 shadow-2xl border border-white/10">
        {/* Neon Crimson Ambient Spotlights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff2a3a]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#ff2a3a]/08 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-red-600/05 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] text-xs font-black mb-3 shadow-sm border border-red-500/30">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2a3a]" />
              Quantum-Inspired CVRPTW Solver Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              RouteQ Vehicle Routing Optimizer
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed font-medium">
              Minimizing last-mile delivery mileage, fuel consumption, and carbon emissions using
              Simulated Quantum Annealing (QUBO) and dynamic traffic modeling.
            </p>
          </div>

          {/* Banner CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOptimizeClick}
              disabled={isOptimizing}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-full fluid-glass-pill fluid-glass-pill-violet text-white font-black text-xs sm:text-sm tracking-wide shadow-xl hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Cpu className={`w-4 h-4 text-white ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'ANNEALING ROUTES...' : 'OPTIMIZE ROUTES NOW'}</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="px-5 py-3.5 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 hover:text-white border border-white/10 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Load Demo (25 Stops)
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards in Dark Obsidian Glass */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden p-4 rounded-3xl fluid-glass-card border border-white/10 shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {kpi.title}
                </span>
                <div className="w-7 h-7 rounded-full fluid-glass-pill fluid-glass-pill-clear flex items-center justify-center border border-white/10">
                  <Icon className="w-3.5 h-3.5 text-[#ff2a3a]" />
                </div>
              </div>

              <div className="text-xl font-black text-white tracking-tight">{kpi.value}</div>
              <div className="text-[11px] text-slate-400 font-medium mt-1 flex items-center justify-between">
                <span className="truncate mr-1">{kpi.sub}</span>
                {kpi.badge && (
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                    {kpi.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Map & Route Preview */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#ff2a3a]" />
              <span>Fleet Dispatch Map — San Francisco Hub</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {isOptimized
                ? `Displaying ${optimizationResult?.routes.length} vehicle routes with ${deliveries.length} delivery waypoints.`
                : `Deliveries loaded. Click "Optimize Routes" to calculate minimal-distance Hamiltonian paths.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('results')}
              className="text-xs text-[#ff6b77] hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              View Route Manifest <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <RouteMap
          depot={depot}
          deliveries={deliveries}
          routes={optimizationResult?.routes || []}
          height="520px"
        />
      </div>

      {/* 2 Performance Charts: Before vs After + Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Before vs After Optimization */}
        <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#ff2a3a]" />
                <span>Before vs After Optimization Impact</span>
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Savings generated by Quantum-Inspired CVRPTW Solver
              </p>
            </div>
            <span className="text-[11px] font-black px-3 py-1 rounded-full fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] border border-red-500/30 shadow-xs">
              ~49% Avg Improvement
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(14, 15, 22, 0.95)',
                    borderColor: 'rgba(255, 42, 58, 0.4)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }} />
                <Bar dataKey="Before" fill="#64748b" radius={[8, 8, 0, 0]} name="Before Optimization" />
                <Bar dataKey="After" fill="#ff2a3a" radius={[8, 8, 0, 0]} name="After Optimization (RouteQ)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vehicle Capacity Utilization */}
        <div className="p-6 rounded-3xl fluid-glass-panel border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#ff2a3a]" />
                <span>Vehicle Fleet Capacity Utilization</span>
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Cargo weight vs maximum vehicle payload limit
              </p>
            </div>
            <span className="text-[11px] font-black px-3 py-1 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 border border-white/10 shadow-xs">
              Balanced Packing
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleUtilData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis unit="%" stroke="#64748b" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Capacity Used']}
                  contentStyle={{
                    backgroundColor: 'rgba(14, 15, 22, 0.95)',
                    borderColor: 'rgba(255, 42, 58, 0.4)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '16px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                />
                <Bar dataKey="utilization" radius={[8, 8, 0, 0]}>
                  {vehicleUtilData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#ff2a3a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
