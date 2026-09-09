import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  currentZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  currentZoom,
  minZoom = 1,
  maxZoom = 22,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const isMinZoom = currentZoom !== undefined && currentZoom <= minZoom;
  const isMaxZoom = currentZoom !== undefined && currentZoom >= maxZoom;

  return (
    <div className="flex flex-col gap-1.5 items-center">
      <button
        type="button"
        onClick={onZoomIn}
        disabled={isMaxZoom}
        title={`Zoom In (Max: ${maxZoom})`}
        className={`p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] shadow-sm transition-all select-none ${
          isMaxZoom
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:text-[#FF5B37] hover:bg-white active:scale-95 cursor-pointer'
        }`}
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {/* Zoom Level Indicator */}
      {currentZoom !== undefined && (
        <div
          title={`Current Zoom: ${Math.round(currentZoom)} (Range: ${minZoom} - ${maxZoom})`}
          className="w-full text-center py-0.5 px-1 bg-white/95 backdrop-blur-md rounded-lg border border-[#E8E6DF] font-mono text-[9px] font-bold text-[#6B6D76] shadow-sm select-none pointer-events-none"
        >
          {Math.round(currentZoom)}z
        </div>
      )}

      <button
        type="button"
        onClick={onZoomOut}
        disabled={isMinZoom}
        title={`Zoom Out (Min: ${minZoom})`}
        className={`p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] shadow-sm transition-all select-none ${
          isMinZoom
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:text-[#FF5B37] hover:bg-white active:scale-95 cursor-pointer'
        }`}
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={onRecenter}
        title="Fit All Locations & Routes"
        className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white active:scale-95 shadow-sm transition-all cursor-pointer select-none"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {onToggleFullscreen && (
        <button
          type="button"
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          className="p-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] text-[#1F2024] hover:text-[#FF5B37] hover:bg-white active:scale-95 shadow-sm transition-all cursor-pointer select-none"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 rotate-45" />}
        </button>
      )}
    </div>
  );
};
