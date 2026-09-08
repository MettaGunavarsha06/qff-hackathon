import React, { useState } from 'react';
import {
  MapPin,
  Leaf,
  Server,
  RotateCcw,
  Save,
  CheckCircle2,
} from 'lucide-react';
import type { Depot } from '../types';

interface SettingsPageProps {
  depot: Depot;
  onUpdateDepot: (depot: Depot) => void;
  onResetAllData: () => void;
  backendOnline: boolean;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  depot,
  onUpdateDepot,
  onResetAllData,
  backendOnline,
}) => {
  const [formData, setFormData] = useState<Depot>({ ...depot });
  const [fuelPrice, setFuelPrice] = useState<number>(96.50);
  const [co2Factor, setCo2Factor] = useState<number>(2.68);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDepot(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl text-[#F5F5F5]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
            ENVIRONMENT & SYSTEM CONFIGURATION
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            LOGISTICS HUB PARAMETERS
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-lg bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] font-mono text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Central Logistics Depot Coordinates */}
        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#FF5500]" />
            <span>1. Central Hub Geographical Location</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-[#8A8A8E] uppercase mb-1">Hub Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30 font-sans"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#8A8A8E] uppercase mb-1">Hub Identifier ID</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#8A8A8E] uppercase mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#8A8A8E] uppercase mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* ESG Conversion Factors */}
        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-[#10B981]" />
            <span>2. ESG & Carbon Conversion Factors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-[#8A8A8E] uppercase mb-1">Fuel Price (₹ / L - INR)</label>
              <input
                type="number"
                step="0.01"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#8A8A8E] uppercase mb-1">Diesel CO₂ Factor (kg CO₂ / L)</label>
              <input
                type="number"
                step="0.01"
                value={co2Factor}
                onChange={(e) => setCo2Factor(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        {/* Backend Solver Status */}
        <div className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-white uppercase tracking-wider">
              <Server className="w-4 h-4 text-[#FF5500]" />
              <span>3. Quantum Solver Service Endpoints</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              backendOnline ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-white/[0.06] text-white'
            }`}>
              {backendOnline ? 'BACKEND ONLINE' : 'IN-BROWSER SQA ACTIVE'}
            </span>
          </div>

          <p className="text-xs text-[#8A8A8E] font-light">
            Target Service: <span className="font-mono text-white">http://localhost:8000/api/v1</span> (Automatic client-side Simulated Quantum Annealing fallback is enabled).
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onResetAllData}
            className="btn-minimal-outline text-xs !py-2 !px-4"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Reset All Application Data</span>
          </button>

          <button
            type="submit"
            className="btn-minimal-primary text-xs !py-2 !px-6"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Hub Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
