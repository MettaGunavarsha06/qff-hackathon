import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Trash2,
  Edit2,
  Zap,
  Fuel,
  Weight,
  Navigation,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import type { Vehicle, FuelType, VehicleRoute } from '../types';

interface VehiclesPageProps {
  vehicles: Vehicle[];
  routes?: VehicleRoute[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
}

export const VehiclesPage: React.FC<VehiclesPageProps> = ({
  vehicles,
  routes = [],
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState<Vehicle>({
    id: '',
    name: '',
    capacity_kg: 500.0,
    starting_depot_id: 'DEPOT-01',
    max_route_distance_km: 140.0,
    fuel_efficiency_km_per_l: 12.0,
    fuel_type: 'electric',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    const nextNum = vehicles.length + 1;
    const newId = `V-${nextNum < 10 ? '0' + nextNum : nextNum}`;
    setEditingVehicle(null);
    setFormData({
      id: newId,
      name: `VoltExpress Cargo E${nextNum}`,
      capacity_kg: 500.0,
      starting_depot_id: 'DEPOT-01',
      max_route_distance_km: 140.0,
      fuel_efficiency_km_per_l: 18.0,
      fuel_type: 'electric',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setFormData({ ...veh });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setFormError('Vehicle name is required.');
      return;
    }
    if (formData.capacity_kg <= 0) {
      setFormError('Capacity must be greater than 0 kg.');
      return;
    }
    if (formData.fuel_efficiency_km_per_l <= 0) {
      setFormError('Fuel efficiency must be greater than 0.');
      return;
    }

    if (editingVehicle) {
      onUpdateVehicle(formData);
    } else {
      onAddVehicle(formData);
    }
    setIsModalOpen(false);
  };

  const getPowertrainBadge = (type: FuelType) => {
    switch (type) {
      case 'electric':
        return 'fluid-glass-pill fluid-glass-pill-mint text-emerald-300 border border-emerald-500/40 shadow-xs';
      case 'hybrid':
        return 'fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] border border-red-500/40 shadow-xs';
      case 'diesel':
        return 'fluid-glass-pill fluid-glass-pill-amber text-amber-300 border border-amber-500/40 shadow-xs';
    }
  };

  const totalFleetCapacity = vehicles.reduce((acc, v) => acc + v.capacity_kg, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#ff2a3a]" />
            <span>Fleet & Vehicle Management ({vehicles.length} Active)</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Total Combined Fleet Capacity: <strong className="text-[#ff2a3a] font-black">{totalFleetCapacity} kg</strong>.
            Configure vehicle powertrains, capacities, and route thresholds.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full fluid-glass-pill fluid-glass-pill-violet text-white text-xs font-black transition-all shadow-lg hover:shadow-red-500/40 flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicle Grid in Dark Obsidian Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const assignedRoute = routes.find((r) => r.vehicle_id === v.id);
          const utilPct = assignedRoute ? assignedRoute.capacity_utilization_pct : 0;
          const assignedStops = assignedRoute ? assignedRoute.deliveries_count : 0;

          return (
            <div
              key={v.id}
              className="p-6 rounded-3xl fluid-glass-card border border-white/10 shadow-lg space-y-4 hover:-translate-y-1 transition-all"
            >
              {/* Top Row: ID, Name, Actions */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[#ff2a3a] text-xs">{v.id}</span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getPowertrainBadge(
                        v.fuel_type
                      )}`}
                    >
                      {v.fuel_type}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1">{v.name || `Vehicle ${v.id}`}</h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1.5 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 hover:text-white border border-white/10 cursor-pointer shadow-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteVehicle(v.id)}
                    className="p-1.5 rounded-full fluid-glass-pill text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xs">
                  <div className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                    <Weight className="w-3 h-3 text-[#ff2a3a]" /> Max Capacity
                  </div>
                  <div className="text-sm font-black text-white mt-0.5">{v.capacity_kg} kg</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xs">
                  <div className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-emerald-400" /> Efficiency
                  </div>
                  <div className="text-sm font-black text-white mt-0.5">
                    {v.fuel_efficiency_km_per_l} km/L
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xs">
                  <div className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#ff2a3a]" /> Max Range
                  </div>
                  <div className="text-sm font-black text-white mt-0.5">
                    {v.max_route_distance_km} km
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xs">
                  <div className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-400" /> Starting Hub
                  </div>
                  <div className="text-sm font-black text-white mt-0.5 truncate">
                    {v.starting_depot_id}
                  </div>
                </div>
              </div>

              {/* Utilization Gauge */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-bold">Post-Optimization Utilization</span>
                  <span className="font-black text-white">
                    {assignedRoute ? `${utilPct}%` : 'Unassigned'}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${Math.min(100, utilPct)}%`,
                      backgroundColor: assignedRoute?.color || '#ff2a3a',
                    }}
                  />
                </div>
                {assignedRoute && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-2">
                    <span>Assigned Stops: <strong className="text-white">{assignedStops}</strong></span>
                    <span>Route Dist: <strong className="text-white">{assignedRoute.total_distance_km} km</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl fluid-glass-panel border border-white/15 shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#ff2a3a]" />
                <span>{editingVehicle ? 'Edit Fleet Vehicle' : 'Register New Fleet Vehicle'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#ff2a3a]" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Vehicle ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!!editingVehicle}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 fluid-glass-input font-mono text-xs font-bold disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Powertrain
                  </label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value as FuelType })}
                    className="w-full px-3 py-2 fluid-glass-input text-xs font-bold bg-[#0d0e15]"
                  >
                    <option value="electric">Electric (EV)</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Model / Vehicle Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. VoltExpress Cargo E1"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 fluid-glass-input text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Payload Capacity (kg)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={formData.capacity_kg}
                    onChange={(e) => setFormData({ ...formData, capacity_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 fluid-glass-input font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Fuel Efficiency (km/L)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="50"
                    value={formData.fuel_efficiency_km_per_l}
                    onChange={(e) => setFormData({ ...formData, fuel_efficiency_km_per_l: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 fluid-glass-input font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Max Route Range (km)
                </label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={formData.max_route_distance_km}
                  onChange={(e) => setFormData({ ...formData, max_route_distance_km: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 fluid-glass-input font-mono text-xs font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 hover:text-white text-xs font-bold border border-white/10 cursor-pointer shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full fluid-glass-pill fluid-glass-pill-violet text-white text-xs font-black shadow-lg hover:shadow-red-500/40 cursor-pointer"
                >
                  {editingVehicle ? 'Save Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
