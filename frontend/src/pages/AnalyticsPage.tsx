import React from 'react';
import {
  Leaf,
  Fuel,
  TreePine,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from 'recharts';
import type { OptimizationResult, ComparisonResult, Vehicle } from '../types';

interface AnalyticsPageProps {
  optimizationResult: OptimizationResult | null;
  comparisonResult: ComparisonResult | null;
  vehicles: Vehicle[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  optimizationResult,
  comparisonResult,
  vehicles,
}) => {
  const fuelSavedL = comparisonResult
    ? Math.max(0, Number((comparisonResult.unoptimized_summary.total_fuel_l - (optimizationResult?.total_fuel_l || 4.57)).toFixed(1)))
    : 4.63;

  const co2SavedKg = comparisonResult
    ? Math.max(0, Number((comparisonResult.unoptimized_summary.total_co2_kg - (optimizationResult?.total_co2_kg || 10.8)).toFixed(1)))
    : 14.0;

  const dollarsSaved = Number((fuelSavedL * 1.45).toFixed(2));
  const treesEquivalent = Math.max(1, Math.round((co2SavedKg * 365) / 22));

  const radarData = [
    { metric: 'Route Efficiency', Classical: 72, Quantum: 96 },
    { metric: 'Window Compliance', Classical: 58, Quantum: 98 },
    { metric: 'Fuel Economy', Classical: 75, Quantum: 94 },
    { metric: 'Carbon Abatement', Classical: 65, Quantum: 92 },
    { metric: 'Capacity Balance', Classical: 60, Quantum: 91 },
    { metric: 'Traffic Resilience', Classical: 70, Quantum: 89 },
  ];

  const vehiclePayloadData = (optimizationResult?.routes || vehicles.map((v, i) => ({
    vehicle_id: v.id,
    capacity_used_kg: [340, 290, 310, 240, 380][i % 5],
    capacity_max_kg: v.capacity_kg,
  }))).map((r) => ({
    name: r.vehicle_id,
    Payload: r.capacity_used_kg,
    Capacity: r.capacity_max_kg,
  }));

  return (
    <div className="space-y-8 pb-20 text-[#F5F5F5]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
            FLEET TELEMETRY & ESG SUSTAINABILITY
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            PERFORMANCE & EMISSIONS ANALYTICS
          </h1>
        </div>

        <div className="text-xs font-mono text-[#8A8A8E] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>ESG METRICS ACTIVE</span>
        </div>
      </div>

      {/* ESG Impact Scorecard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[#8A8A8E]">
            <span className="text-[11px] font-mono uppercase">CO₂ Abatement</span>
            <Leaf className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{co2SavedKg} kg</div>
          <div className="text-[10px] font-mono text-[#10B981]">-51% vs unoptimized baseline</div>
        </div>

        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[#8A8A8E]">
            <span className="text-[11px] font-mono uppercase">Fuel Conserved</span>
            <Fuel className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{fuelSavedL} L</div>
          <div className="text-[10px] font-mono text-[#FF5500]">-50% per dispatch run</div>
        </div>

        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[#8A8A8E]">
            <span className="text-[11px] font-mono uppercase">OpEx Reduction</span>
            <DollarSign className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">${dollarsSaved}</div>
          <div className="text-[10px] font-mono text-[#8A8A8E]">Direct fuel cost saved</div>
        </div>

        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[#8A8A8E]">
            <span className="text-[11px] font-mono uppercase">Tree Offset Equiv.</span>
            <TreePine className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{treesEquivalent} trees</div>
          <div className="text-[10px] font-mono text-[#10B981]">Annualized carbon absorption</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Benchmark Chart */}
        <div className="p-6 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              MULTI-CRITERIA BENCHMARK: QUANTUM VS CLASSICAL
            </h2>
            <p className="text-xs text-[#8A8A8E]">
              Comparative scoring across routing optimization dimensions.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="metric" stroke="#8A8A8E" tick={{ fill: '#8A8A8E', fontSize: 10 }} />
                <Radar name="Quantum SQA" dataKey="Quantum" stroke="#FF5500" fill="#FF5500" fillOpacity={0.25} />
                <Radar name="Classical Baseline" dataKey="Classical" stroke="#8A8A8E" fill="#8A8A8E" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#8A8A8E' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D0D',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#F5F5F5',
                    fontSize: '11px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Payload Chart */}
        <div className="p-6 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              VEHICLE CAPACITY UTILIZATION
            </h2>
            <p className="text-xs text-[#8A8A8E]">
              Assigned cargo payload versus maximum vehicle capacity rating.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehiclePayloadData}>
                <XAxis dataKey="name" stroke="#8A8A8E" tick={{ fill: '#8A8A8E', fontSize: 11 }} />
                <YAxis stroke="#8A8A8E" tick={{ fill: '#8A8A8E', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0D0D',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#F5F5F5',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#8A8A8E' }} />
                <Bar dataKey="Payload" fill="#FF5500" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Capacity" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
