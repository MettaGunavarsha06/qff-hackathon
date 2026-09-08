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
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
      case 'hybrid':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'diesel':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    }
  };

  const totalFleetCapacity = vehicles.reduce((acc, v) => acc + v.capacity_kg, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            <span>Fleet & Vehicle Management ({vehicles.length} Active)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total Combined Fleet Capacity: <strong className="text-cyan-400">{totalFleetCapacity} kg</strong>.
            Configure vehicle powertrains, capacities, and route thresholds.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const assignedRoute = routes.find((r) => r.vehicle_id === v.id);
          const utilPct = assignedRoute ? assignedRoute.capacity_utilization_pct : 0;
          const assignedStops = assignedRoute ? assignedRoute.deliveries_count : 0;

          return (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Top Row: ID, Name, Actions */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{v.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getPowertrainBadge(
                        v.fuel_type
                      )}`}
                    >
                      {v.fuel_type}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{v.name || `Vehicle ${v.id}`}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteVehicle(v.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Weight className="w-3 h-3 text-cyan-400" /> Max Capacity
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{v.capacity_kg} kg</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-emerald-400" /> Efficiency
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5">
                    {v.fuel_efficiency_km_per_l} km/L
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-purple-400" /> Max Route Range
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5">
                    {v.max_route_distance_km} km
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-400" /> Starting Hub
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5 truncate">
                    {v.starting_depot_id}
                  </div>
                </div>
              </div>

              {/* Utilization Gauge */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-semibold">Post-Optimization Utilization</span>
                  <span className="font-extrabold text-white">
                    {assignedRoute ? `${utilPct}%` : 'Unassigned'}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, utilPct)}%`,
                      backgroundColor: assignedRoute?.color || '#06b6d4',
                    }}
                  />
                </div>
                {assignedRoute && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>Assigned Deliveries: <strong className="text-slate-200">{assignedStops}</strong></span>
                    <span>Route Dist: <strong className="text-slate-200">{assignedRoute.total_distance_km} km</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span>{editingVehicle ? 'Edit Fleet Vehicle' : 'Register New Fleet Vehicle'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Vehicle ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!!editingVehicle}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Powertrain
                  </label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value as FuelType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="electric">Electric (EV)</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Model / Vehicle Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. VoltExpress Cargo E1"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Payload Capacity (kg)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={formData.capacity_kg}
                    onChange={(e) => setFormData({ ...formData, capacity_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Fuel Efficiency (km/L)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="50"
                    value={formData.fuel_efficiency_km_per_l}
                    onChange={(e) => setFormData({ ...formData, fuel_efficiency_km_per_l: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Max Route Range (km)
                </label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={formData.max_route_distance_km}
                  onChange={(e) => setFormData({ ...formData, max_route_distance_km: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
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
