import React from 'react';
import { Layers, Check } from 'lucide-react';
import { getSatelliteProviderStatus } from '../../services/satellite';
import { getTrafficProviderStatus } from '../../services/traffic';

export type ActiveMapLayer = 'street' | 'satellite' | 'terrain';

interface LayerControlProps {
  activeLayer: ActiveMapLayer;
  onSelectLayer: (layer: ActiveMapLayer) => void;
  trafficEnabled: boolean;
  onToggleTraffic: () => void;
  onShowNotice: (message: string) => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  activeLayer,
  onSelectLayer,
  trafficEnabled,
  onToggleTraffic,
  onShowNotice,
}) => {
  const satelliteStatus = getSatelliteProviderStatus();
  const trafficStatus = getTrafficProviderStatus();

  const handleSatelliteClick = () => {
    if (!satelliteStatus.isAvailable) {
      onShowNotice(satelliteStatus.notice || 'Satellite imagery provider not configured.');
      return;
    }
    onSelectLayer('satellite');
  };

  const handleTrafficClick = () => {
    onToggleTraffic();
  };

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E6DF] shadow-soft-sm font-mono text-[10px]">
      <div className="flex items-center pl-1.5 pr-1 text-[#8E909A] select-none">
        <Layers className="w-3.5 h-3.5" />
      </div>

      {/* Street Layer (OSM) */}
      <button
        type="button"
        onClick={() => onSelectLayer('street')}
        className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer select-none ${
          activeLayer === 'street'
            ? 'bg-[#1F2024] text-white shadow-xs'
            : 'text-[#6B6D76] hover:text-[#1F2024] hover:bg-[#FAF9F6]'
        }`}
        title="OpenStreetMap Standard Street Layer"
      >
        STREET
      </button>

      {/* Satellite Layer */}
      <button
        type="button"
        onClick={handleSatelliteClick}
        className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer select-none ${
          activeLayer === 'satellite'
            ? 'bg-[#1F2024] text-white shadow-xs'
            : 'text-[#6B6D76] hover:text-[#1F2024] hover:bg-[#FAF9F6]'
        }`}
        title={satelliteStatus.isAvailable ? 'Esri World Imagery Satellite' : 'Satellite provider not configured'}
      >
        SATELLITE
      </button>

      {/* Terrain Layer */}
      <button
        type="button"
        onClick={() => onSelectLayer('terrain')}
        className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer select-none ${
          activeLayer === 'terrain'
            ? 'bg-[#1F2024] text-white shadow-xs'
            : 'text-[#6B6D76] hover:text-[#1F2024] hover:bg-[#FAF9F6]'
        }`}
        title="OpenTopoMap Global Terrain Layer"
      >
        TERRAIN
      </button>

      <span className="text-[#E8E6DF] mx-0.5">|</span>

      {/* Traffic Layer Toggle */}
      <button
        type="button"
        onClick={handleTrafficClick}
        className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
          trafficEnabled
            ? 'bg-[#10B981] text-white shadow-xs shadow-emerald-500/20'
            : 'text-[#6B6D76] hover:text-[#1F2024] hover:bg-[#FAF9F6]'
        }`}
        title={trafficEnabled ? 'Traffic Overlay Active (Click to Hide)' : 'Show Traffic Overlay (Simulated)'}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            trafficEnabled ? 'bg-white animate-pulse' : 'bg-[#10B981]'
          }`}
        />
        <span>TRAFFIC</span>
      </button>
    </div>
  );
};
