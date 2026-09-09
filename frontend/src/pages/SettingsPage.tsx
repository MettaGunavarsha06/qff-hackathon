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
    <div className="space-y-8 pb-24 max-w-4xl mx-auto pt-4 text-[#1F2024]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="text-xs font-mono text-[#FF5B37] uppercase tracking-wider font-semibold">
            ENVIRONMENT & SYSTEM CONFIGURATION
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#1F2024] tracking-tight mt-1">
            LOGISTICS HUB CONFIG
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-mono text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Hub settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Central Logistics Depot Coordinates */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1F2024] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#FF5B37]" />
            <span>1. Central Hub Coordinates & Timing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-[#6B6D76] uppercase mb-1">Hub Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37] font-sans"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#6B6D76] uppercase mb-1">Hub Identifier ID</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#6B6D76] uppercase mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#6B6D76] uppercase mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
              />
            </div>
          </div>
        </div>

        {/* ESG Conversion Factors */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1F2024] uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-[#10B981]" />
            <span>2. ESG & Commercial Benchmarks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] text-[#6B6D76] uppercase mb-1">Diesel Tariff (₹ / L - INR)</label>
              <input
                type="number"
                step="0.01"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#6B6D76] uppercase mb-1">CO₂ Factor (kg CO₂ / L)</label>
              <input
                type="number"
                step="0.01"
                value={co2Factor}
                onChange={(e) => setCo2Factor(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
              />
            </div>
          </div>
        </div>

        {/* Backend Solver Status */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1F2024] uppercase tracking-wider">
              <Server className="w-4 h-4 text-[#FF5B37]" />
              <span>3. Solver Engine & API Endpoint</span>
            </div>
            <span className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold ${
              backendOnline ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#F2F1EC] text-[#6B6D76]'
            }`}>
              {backendOnline ? 'BACKEND ONLINE' : 'IN-BROWSER SQA READY'}
            </span>
          </div>

          <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
            API Gateway: <span className="font-mono text-[#1F2024] font-medium">http://localhost:8000/api/v1</span> (Automatic client-side Simulated Quantum Annealing fallback is active).
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E8E6DF]">
          <button
            type="button"
            onClick={onResetAllData}
            className="btn-secondary-outline text-xs !py-2 !px-4"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF5B37]" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="btn-primary-gradient text-xs !py-2.5 !px-6 font-semibold"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
