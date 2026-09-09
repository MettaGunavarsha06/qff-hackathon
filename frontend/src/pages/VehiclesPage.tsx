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
    <div className="space-y-8 pb-24 text-[#1F2024] max-w-6xl mx-auto pt-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="text-xs font-mono text-[#FF5B37] uppercase tracking-wider font-semibold">
            FLEET INVENTORY &bull; {vehicles.length} UNITS
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#1F2024] tracking-tight mt-1">
            FLEET VEHICLES
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="btn-primary-gradient text-xs !py-2.5 !px-5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      {/* Vehicle Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((veh, i) => {
          const route = routes.find((r) => r.vehicle_id === veh.id);
          const palette = ['#FF5B37', '#FF4D8D', '#3B82F6', '#10B981', '#F59E0B'];
          const vehColor = route?.color || palette[i % palette.length];

          return (
            <div
              key={veh.id}
              className="p-6 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft space-y-4 hover:border-[#D6D4CC] transition-all"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: vehColor }} />
                  <div>
                    <div className="font-bold text-base text-[#1F2024]">{veh.name || veh.id}</div>
                    <div className="font-mono text-xs text-[#6B6D76]">{veh.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(veh)}
                    className="p-2 rounded-xl bg-[#F7F6F2] text-[#6B6D76] hover:text-[#1F2024] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteVehicle(veh.id)}
                    className="p-2 rounded-xl bg-[#F7F6F2] text-[#6B6D76] hover:text-[#FF4D8D] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#F7F6F2]">
                  <div className="text-[10px] text-[#8E909A]">CAPACITY</div>
                  <div className="text-[#1F2024] font-bold mt-0.5">{veh.capacity_kg} kg</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F6F2]">
                  <div className="text-[10px] text-[#8E909A]">RANGE LIMIT</div>
                  <div className="text-[#1F2024] font-bold mt-0.5">{veh.max_route_distance_km} km</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F6F2]">
                  <div className="text-[10px] text-[#8E909A]">POWERTRAIN</div>
                  <div className="text-[#1F2024] font-bold mt-0.5 capitalize">{veh.fuel_type}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F6F2]">
                  <div className="text-[10px] text-[#8E909A]">EFFICIENCY</div>
                  <div className="text-[#1F2024] font-bold mt-0.5">{veh.fuel_efficiency_km_per_l} km/L</div>
                </div>
              </div>

              {route && (
                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] text-xs font-mono flex justify-between items-center text-[#6B6D76]">
                  <span className="font-semibold text-[#1F2024]">Active Itinerary</span>
                  <span>{route.deliveries_count} stops &bull; {route.total_distance_km.toFixed(1)} km</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1F2024]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E8E6DF] shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div className="font-bold text-base text-[#1F2024] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF5B37]" />
                <span>{editingVehicle ? 'EDIT FLEET VEHICLE' : 'REGISTER NEW VEHICLE'}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#F7F6F2] text-[#6B6D76] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-[#FF4D8D]/10 border border-[#FF4D8D]/20 text-[#FF4D8D] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-[#6B6D76] block">Vehicle Model / Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  placeholder="e.g. Tata Ace EV Express"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Capacity (kg)</label>
                  <input
                    type="number"
                    value={formData.capacity_kg}
                    onChange={(e) => setFormData({ ...formData, capacity_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Max Range (km)</label>
                  <input
                    type="number"
                    value={formData.max_route_distance_km}
                    onChange={(e) => setFormData({ ...formData, max_route_distance_km: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Powertrain</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value as FuelType })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37] capitalize"
                  >
                    <option value="electric">Electric (EV)</option>
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Efficiency (km/L)</label>
                  <input
                    type="number"
                    value={formData.fuel_efficiency_km_per_l}
                    onChange={(e) => setFormData({ ...formData, fuel_efficiency_km_per_l: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary-outline !py-2 !px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient !py-2 !px-5 text-xs font-semibold"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
