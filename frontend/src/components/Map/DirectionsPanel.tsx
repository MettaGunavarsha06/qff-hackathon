import React from 'react';
import { Car, Footprints, Bike, X, Navigation2, Clock, Route, Loader2 } from 'lucide-react';
import type { TravelMode, RouteResult } from '../../services/routing';

interface DirectionsPanelProps {
  originName: string;
  destinationName: string;
  routeResult: RouteResult | null;
  isLoading: boolean;
  selectedMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  onClear: () => void;
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  originName,
  destinationName,
  routeResult,
  isLoading,
  selectedMode,
  onSelectMode,
  onClear,
}) => {
  return (
    <div className="absolute top-16 left-3.5 z-[1001] w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E6DF] shadow-soft-xl p-4 font-sans space-y-3 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-[#F2F1EC] pb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1F2024]">
          <Route className="w-3.5 h-3.5 text-[#FF5B37]" />
          <span>DIRECTIONS</span>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded-lg text-[#8E909A] hover:text-[#1F2024] hover:bg-[#F2F1EC] transition-colors cursor-pointer"
          title="Clear route"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Origin & Destination Display */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0" />
          <span className="text-[#6B6D76] font-mono text-[10px] uppercase shrink-0">FROM:</span>
          <span className="text-[#1F2024] font-medium truncate">{originName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF5B37] shrink-0" />
          <span className="text-[#6B6D76] font-mono text-[10px] uppercase shrink-0">TO:</span>
          <span className="text-[#1F2024] font-medium truncate">{destinationName}</span>
        </div>
      </div>

      {/* Mode Selector (Driving, Walking, Cycling) */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF]">
        <button
          onClick={() => onSelectMode('driving')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            selectedMode === 'driving'
              ? 'bg-[#1F2024] text-white shadow-xs'
              : 'text-[#6B6D76] hover:text-[#1F2024]'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Drive</span>
        </button>
        <button
          onClick={() => onSelectMode('walking')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            selectedMode === 'walking'
              ? 'bg-[#1F2024] text-white shadow-xs'
              : 'text-[#6B6D76] hover:text-[#1F2024]'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>Walk</span>
        </button>
        <button
          onClick={() => onSelectMode('cycling')}
          className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            selectedMode === 'cycling'
              ? 'bg-[#1F2024] text-white shadow-xs'
              : 'text-[#6B6D76] hover:text-[#1F2024]'
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Cycle</span>
        </button>
      </div>

      {/* Route Telemetry (Distance & ETA) */}
      {isLoading ? (
        <div className="py-3 flex items-center justify-center gap-2 text-xs font-mono text-[#8E909A]">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF5B37]" />
          <span>Calculating road route...</span>
        </div>
      ) : routeResult ? (
        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#1F2024]">
              <Clock className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-bold text-sm">{routeResult.durationMins} mins</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#6B6D76] font-mono text-xs">
              <Navigation2 className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>{routeResult.distanceKm} km</span>
            </div>
          </div>
          {routeResult.errorMessage && (
            <p className="text-[10px] text-amber-700 font-mono">
              {routeResult.errorMessage}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};
