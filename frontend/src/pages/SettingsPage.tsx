import React, { useState } from 'react';
import {
  Settings,
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
  const [fuelPrice, setFuelPrice] = useState<number>(1.45);
  const [co2Factor, setCo2Factor] = useState<number>(2.68);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDepot(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-full fluid-glass-pill-violet flex items-center justify-center shadow-sm">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <span>System & Depot Configuration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust central logistics hub parameters, ESG conversion constants, and solver endpoints.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully! Depot coordinates and parameters updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hub Depot Settings */}
        <div className="p-6 rounded-3xl fluid-glass-card border border-white/10 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-full fluid-glass-pill fluid-glass-pill-clear flex items-center justify-center border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#ff2a3a]" />
            </div>
            <span>Central Logistics Hub (Starting Depot)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Depot ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Hub Facility Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Operating Hours Start
              </label>
              <input
                type="text"
                value={formData.operating_hours_start}
                onChange={(e) => setFormData({ ...formData, operating_hours_start: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Operating Hours End
              </label>
              <input
                type="text"
                value={formData.operating_hours_end}
                onChange={(e) => setFormData({ ...formData, operating_hours_end: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ESG & Economic Cost Factors */}
        <div className="p-6 rounded-3xl fluid-glass-card border border-white/10 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-full fluid-glass-pill fluid-glass-pill-clear flex items-center justify-center border border-white/10">
              <Leaf className="w-3.5 h-3.5 text-[#ff2a3a]" />
            </div>
            <span>Economic & Sustainability Conversion Rates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Average Diesel Price ($/Liter)
              </label>
              <input
                type="number"
                step="0.05"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 1.45)}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Diesel CO2 Emissions Factor (kg CO2 / L)
              </label>
              <input
                type="number"
                step="0.01"
                value={co2Factor}
                onChange={(e) => setCo2Factor(parseFloat(e.target.value) || 2.68)}
                className="w-full px-3.5 py-2.5 rounded-xl fluid-glass-input text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div className="p-6 rounded-3xl fluid-glass-card border border-white/10 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-full fluid-glass-pill fluid-glass-pill-clear flex items-center justify-center border border-white/10">
              <Server className="w-3.5 h-3.5 text-[#ff2a3a]" />
            </div>
            <span>Python FastAPI Backend Endpoint</span>
          </h3>
          <div className="p-4 rounded-2xl bg-[#0d0e15]/70 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <div className="font-mono text-white font-bold">http://localhost:8000/api</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {backendOnline
                  ? 'Connected to local FastAPI Uvicorn service'
                  : 'FastAPI offline — utilizing built-in high-performance client simulator'}
              </div>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm ${
                backendOnline
                  ? 'fluid-glass-pill-mint text-emerald-300 border border-emerald-500/30'
                  : 'fluid-glass-pill-clear text-slate-300 border border-white/10'
              }`}
            >
              {backendOnline ? 'Online' : 'In-Browser Emulation'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetAllData}
            className="px-5 py-2.5 rounded-full fluid-glass-pill-clear border border-white/10 hover:border-red-500/40 text-slate-400 hover:text-red-400 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Deliveries & Fleet</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-full fluid-glass-pill fluid-glass-pill-violet text-white font-bold text-xs shadow-lg shadow-red-950/40 border border-red-500/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

