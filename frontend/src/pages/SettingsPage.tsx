import React, { useState } from 'react';
import {
  Settings,
  MapPin,
  Clock,
  Fuel,
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
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>System & Depot Configuration</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust central logistics hub parameters, ESG conversion constants, and solver endpoints.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully! Depot coordinates and parameters updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hub Depot Settings */}
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Central Logistics Hub (Starting Depot)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Depot ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Hub Facility Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Operating Hours Start
              </label>
              <input
                type="text"
                value={formData.operating_hours_start}
                onChange={(e) => setFormData({ ...formData, operating_hours_start: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Operating Hours End
              </label>
              <input
                type="text"
                value={formData.operating_hours_end}
                onChange={(e) => setFormData({ ...formData, operating_hours_end: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* ESG & Economic Cost Factors */}
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Economic & Sustainability Conversion Rates</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Average Diesel Price ($/Liter)
              </label>
              <input
                type="number"
                step="0.05"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 1.45)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Diesel CO2 Emissions Factor (kg CO2 / L)
              </label>
              <input
                type="number"
                step="0.01"
                value={co2Factor}
                onChange={(e) => setCo2Factor(parseFloat(e.target.value) || 2.68)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>Python FastAPI Backend Endpoint</span>
          </h3>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-mono text-white font-bold">http://localhost:8000/api</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {backendOnline
                  ? 'Connected to local FastAPI Uvicorn service'
                  : 'FastAPI offline — utilizing built-in high-performance client simulator'}
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                backendOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
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
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Deliveries & Fleet</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
