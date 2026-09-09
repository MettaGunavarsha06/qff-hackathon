import React from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { TRAFFIC_COLORS } from '../../services/traffic';
import type { TrafficSnapshot } from '../../services/traffic';

interface TrafficLegendProps {
  snapshot: TrafficSnapshot | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TrafficLegend: React.FC<TrafficLegendProps> = ({
  snapshot,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="absolute bottom-14 right-3.5 z-[1000] bg-white/95 backdrop-blur-md border border-[#E8E6DF] rounded-2xl p-3 shadow-soft-lg font-sans text-xs min-w-[170px] space-y-2.5 animate-in fade-in zoom-in-95">
      {/* Header with Traffic Mode Badge */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#F2F1EC]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#FF5B37]" />
          <span className="font-bold text-[#1F2024] tracking-wide text-[11px]">TRAFFIC</span>
        </div>
        <span className="px-1.5 py-0.5 rounded-md bg-[#F2F1EC] text-[#6B6D76] font-mono text-[8.5px] font-bold tracking-wider">
          {snapshot?.label || 'SIMULATED TRAFFIC'}
        </span>
      </div>

      {/* Severity Color List */}
      <div className="space-y-1.5 font-mono text-[10.5px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: TRAFFIC_COLORS.normal }}
            />
            <span className="text-[#1F2024]">Normal</span>
          </div>
          <span className="text-[#8E909A] text-[9.5px]">&gt; 40 km/h</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: TRAFFIC_COLORS.moderate }}
            />
            <span className="text-[#1F2024]">Moderate</span>
          </div>
          <span className="text-[#8E909A] text-[9.5px]">25–40 km/h</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: TRAFFIC_COLORS.heavy }}
            />
            <span className="text-[#1F2024]">Heavy</span>
          </div>
          <span className="text-[#8E909A] text-[9.5px]">15–25 km/h</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: TRAFFIC_COLORS.severe }}
            />
            <span className="text-[#1F2024]">Severe</span>
          </div>
          <span className="text-[#8E909A] text-[9.5px]">&lt; 15 km/h</span>
        </div>
      </div>

      {/* Footer Status & Refresh */}
      <div className="pt-1.5 border-t border-[#F2F1EC] flex items-center justify-between text-[9px] font-mono text-[#8E909A]">
        <span className="truncate">Updated: {snapshot?.lastUpdated ? 'just now' : 'syncing'}</span>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Traffic Data"
            className="p-1 rounded-md hover:bg-[#F2F1EC] text-[#6B6D76] hover:text-[#FF5B37] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#FF5B37]' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
