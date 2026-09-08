import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Trash2,
  Edit2,
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
    starting_depot_id: 'DEPOT-BLR',
    max_route_distance_km: 140.0,
    fuel_efficiency_km_per_l: 18.0,
    fuel_type: 'electric',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    const nextNum = vehicles.length + 1;
    const newId = `IND-V${nextNum < 10 ? '0' + nextNum : nextNum}`;
    const indianFleetNames = [
      'Tata Ace EV Express',
      'Mahindra Bolero Maxi Truck',
      'Ashok Leyland Bada Dost',
      'Euler HiLoad EV Delivery',
      'Piaggio Ape E-City Cargo',
      'Mahindra Zor Grand EV',
      'Tata Intra V50 Cargo',
    ];
    const defaultName = indianFleetNames[(nextNum - 1) % indianFleetNames.length];
    setEditingVehicle(null);
    setFormData({
      id: newId,
      name: defaultName,
      capacity_kg: 500.0,
      starting_depot_id: vehicles[0]?.starting_depot_id || 'DEPOT-BLR',
      max_route_distance_km: 130.0,
      fuel_efficiency_km_per_l: 19.0,
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
      setFormError('Vehicle model / identifier name is required');
      return;
    }
    if (formData.capacity_kg <= 0) {
      setFormError('Payload capacity must be greater than 0 kg');
      return;
    }

    if (editingVehicle) {
      onUpdateVehicle(formData);
    } else {
      onAddVehicle(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 text-[#F5F5F5]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
            FLEET INVENTORY &bull; {vehicles.length} UNITS
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            AUTONOMOUS & ELECTRIC FLEET
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="btn-minimal-primary text-xs !py-2 !px-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Vehicle Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((veh, i) => {
          const route = routes.find((r) => r.vehicle_id === veh.id);
          const palette = ['#FF5500', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];
          const vehColor = route?.color || palette[i % palette.length];

          return (
            <div
              key={veh.id}
              className="p-5 rounded-lg bg-[#0D0D0D] border border-white/[0.06] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: vehColor }} />
                  <div>
                    <div className="font-semibold text-sm text-white">{veh.name || veh.id}</div>
                    <div className="font-mono text-[10px] text-[#8A8A8E]">{veh.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(veh)}
                    className="p-1.5 rounded bg-white/[0.04] text-[#8A8A8E] hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteVehicle(veh.id)}
                    className="p-1.5 rounded bg-white/[0.04] text-[#8A8A8E] hover:text-[#EC4899] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-[#8A8A8E]">CAPACITY</div>
                  <div className="text-white font-medium mt-0.5">{veh.capacity_kg} kg</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8A8A8E]">RANGE LIMIT</div>
                  <div className="text-white font-medium mt-0.5">{veh.max_route_distance_km} km</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8A8A8E]">POWERTRAIN</div>
                  <div className="text-white font-medium mt-0.5 capitalize">{veh.fuel_type}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8A8A8E]">EFFICIENCY</div>
                  <div className="text-white font-medium mt-0.5">{veh.fuel_efficiency_km_per_l} km/L</div>
                </div>
              </div>

              {route && (
                <div className="p-2.5 rounded bg-[#121212] border border-white/[0.04] text-xs font-mono flex justify-between items-center text-[#8A8A8E]">
                  <span>Active Mission</span>
                  <span className="text-white font-medium">{route.deliveries_count} stops &bull; {route.total_distance_km.toFixed(1)} km</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0D0D0D] border border-white/[0.08] shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="font-semibold text-sm text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF5500]" />
                <span>{editingVehicle ? 'EDIT FLEET VEHICLE' : 'REGISTER NEW VEHICLE'}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-[#8A8A8E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded bg-[#EC4899]/10 border border-[#EC4899]/30 text-[#EC4899] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Vehicle ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!!editingVehicle}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Powertrain Type
                  </label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value as FuelType })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="electric">Electric (EV - Zero Emission)</option>
                    <option value="diesel">Diesel (Standard Cargo)</option>
                    <option value="petrol">Petrol (Urban Light)</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                  Model / Vehicle Identifier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. VoltExpress Cargo E01"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Max Payload Capacity (kg)
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={formData.capacity_kg}
                    onChange={(e) => setFormData({ ...formData, capacity_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Max Range Distance (km)
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={formData.max_route_distance_km}
                    onChange={(e) => setFormData({ ...formData, max_route_distance_km: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-minimal-outline text-xs !py-2 !px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-minimal-primary text-xs !py-2 !px-4"
                >
                  {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
