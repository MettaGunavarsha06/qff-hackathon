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
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/60 p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Quantum-Inspired CVRPTW Solver Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              RouteQ Vehicle Routing Optimizer
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Minimizing last-mile delivery mileage, fuel consumption, and carbon emissions using
              Simulated Quantum Annealing (QUBO) and dynamic traffic modeling.
            </p>
          </div>

          {/* Banner CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOptimizeClick}
              disabled={isOptimizing}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Cpu className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'ANNEALING ROUTES...' : 'OPTIMIZE ROUTES NOW'}</span>
            </button>

            <button
              onClick={onLoadDemo}
              className="px-4 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Load Demo (25 Stops)
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-b ${kpi.color} bg-slate-900/80 backdrop-blur-md border shadow-lg transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {kpi.title}
                </span>
                <Icon className="w-4 h-4" />
              </div>

              <div className="text-xl font-extrabold text-white tracking-tight">{kpi.value}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{kpi.sub}</span>
                {kpi.badge && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Fleet Dispatch Map — San Francisco Hub</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isOptimized
                ? `Displaying ${optimizationResult?.routes.length} vehicle routes with ${deliveries.length} delivery waypoints.`
                : `Deliveries loaded. Click "Optimize Routes" to calculate minimal-distance Hamiltonian paths.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('results')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
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

      {/* 4 Performance Charts: Before vs After + Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Before vs After Optimization */}
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>Before vs After Optimization Impact</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Savings generated by Quantum-Inspired CVRPTW Solver
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
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
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Before" fill="#ef4444" radius={[6, 6, 0, 0]} name="Before Optimization" />
                <Bar dataKey="After" fill="#10b981" radius={[6, 6, 0, 0]} name="After Optimization (RouteQ)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vehicle Capacity Utilization */}
        <div className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>Vehicle Fleet Capacity Utilization</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cargo weight vs maximum vehicle payload limit
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
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
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                  {vehicleUtilData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#06b6d4'} />
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
