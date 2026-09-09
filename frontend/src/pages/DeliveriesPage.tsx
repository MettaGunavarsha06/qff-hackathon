import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Search,
  RotateCcw,
  AlertCircle,
  X,
} from 'lucide-react';
import type { Delivery, Priority } from '../types';
import { getAllStates, getDistrictsForState } from '../data/indiaDistricts';

interface DeliveriesPageProps {
  deliveries: Delivery[];
  onAddDelivery: (delivery: Delivery) => void;
  onUpdateDelivery: (delivery: Delivery) => void;
  onDeleteDelivery: (id: string) => void;
  onResetDemo: () => void;
}

export const DeliveriesPage: React.FC<DeliveriesPageProps> = ({
  deliveries,
  onAddDelivery,
  onUpdateDelivery,
  onDeleteDelivery,
  onResetDemo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);

  const defaultState = deliveries[0]?.state || 'Karnataka';
  const defaultDistrict = deliveries[0]?.district || 'Bengaluru Urban';

  const [formData, setFormData] = useState<Delivery>({
    id: '',
    customer_name: '',
    lat: 12.9279,
    lng: 77.6271,
    demand_kg: 25.0,
    priority: 'medium',
    time_window_start: '09:00',
    time_window_end: '12:00',
    service_time_mins: 15,
    address: '',
    district: defaultDistrict,
    state: defaultState,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    const nextNum = deliveries.length + 1;
    const prefix = deliveries[0]?.id ? deliveries[0].id.split('-')[0] : 'BLR';
    const newId = `${prefix}-D${nextNum < 10 ? '0' + nextNum : nextNum}`;
    const baseLat = deliveries[0]?.lat || 12.9279;
    const baseLng = deliveries[0]?.lng || 77.6271;
    const activeState = deliveries[0]?.state || 'Karnataka';
    const activeDistrict = deliveries[0]?.district || 'Bengaluru Urban';

    setEditingDelivery(null);
    setFormData({
      id: newId,
      customer_name: '',
      lat: Number((baseLat + (Math.random() - 0.5) * 0.05).toFixed(4)),
      lng: Number((baseLng + (Math.random() - 0.5) * 0.05).toFixed(4)),
      demand_kg: 25.0,
      priority: 'medium',
      time_window_start: '10:00',
      time_window_end: '13:00',
      service_time_mins: 15,
      address: '',
      district: activeDistrict,
      state: activeState,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (del: Delivery) => {
    setEditingDelivery(del);
    setFormData({
      ...del,
      district: del.district || defaultDistrict,
      state: del.state || defaultState,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name.trim()) {
      setFormError('Customer destination name is required');
      return;
    }
    if (formData.demand_kg <= 0) {
      setFormError('Cargo payload must be greater than 0 kg');
      return;
    }

    if (editingDelivery) {
      onUpdateDelivery(formData);
    } else {
      onAddDelivery(formData);
    }
    setIsModalOpen(false);
  };

  const filteredDeliveries = deliveries.filter((del) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      del.customer_name.toLowerCase().includes(q) ||
      del.id.toLowerCase().includes(q) ||
      (del.district && del.district.toLowerCase().includes(q)) ||
      (del.state && del.state.toLowerCase().includes(q)) ||
      (del.address && del.address.toLowerCase().includes(q));

    const matchesPriority = priorityFilter === 'all' || del.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return 'bg-[#FF4D8D]/15 text-[#FF4D8D] font-bold';
      case 'high':
        return 'bg-[#FF5B37]/15 text-[#FF5B37] font-bold';
      case 'medium':
        return 'bg-[#F2F1EC] text-[#1F2024] font-medium';
      case 'low':
        return 'bg-[#F7F6F2] text-[#6B6D76]';
    }
  };

  return (
    <div className="space-y-8 pb-24 text-[#1F2024] max-w-6xl mx-auto pt-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div>
          <div className="text-xs font-mono text-[#FF5B37] uppercase tracking-wider font-semibold">
            DEMAND NETWORK &bull; {deliveries.length} NODES
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-[#1F2024] tracking-tight mt-1">
            DELIVERY ORDERS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetDemo}
            className="btn-secondary-outline text-xs !py-2 !px-3.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF5B37]" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={openAddModal}
            className="btn-primary-gradient text-xs !py-2 !px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8E6DF] shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E909A]" />
          <input
            type="text"
            placeholder="Search destination or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-full bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] placeholder-[#8E909A] text-xs focus:outline-none focus:border-[#FF5B37]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-[#6B6D76] text-[11px] uppercase shrink-0">Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-full uppercase text-[10px] font-mono transition-all cursor-pointer ${
                priorityFilter === p
                  ? 'bg-[#1F2024] text-white font-bold'
                  : 'bg-[#F7F6F2] text-[#6B6D76] hover:text-[#1F2024]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="overflow-hidden rounded-3xl bg-white border border-[#E8E6DF] shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F7F6F2] text-[#6B6D76] font-medium uppercase tracking-wider text-[10px] border-b border-[#E8E6DF]">
              <tr>
                <th className="py-3.5 px-5">Stop ID</th>
                <th className="py-3.5 px-5">Customer Destination</th>
                <th className="py-3.5 px-5">District & State</th>
                <th className="py-3.5 px-5">Coordinates</th>
                <th className="py-3.5 px-5">Demand</th>
                <th className="py-3.5 px-5">Time Window</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E6DF]">
              {filteredDeliveries.map((del) => (
                <tr key={del.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#1F2024]">{del.id}</td>
                  <td className="py-3.5 px-5 font-sans">
                    <div className="font-semibold text-sm text-[#1F2024]">{del.customer_name}</div>
                    <div className="text-[11px] text-[#6B6D76] font-mono">{del.address || 'Grid Location'}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-[#1F2024]">{del.district || 'District Centre'}</div>
                    <div className="text-[10px] text-[#8E909A]">{del.state || 'Karnataka'}</div>
                  </td>
                  <td className="py-3.5 px-5 text-[#6B6D76]">{del.lat.toFixed(4)}, {del.lng.toFixed(4)}</td>
                  <td className="py-3.5 px-5 font-bold text-[#1F2024]">{del.demand_kg} kg</td>
                  <td className="py-3.5 px-5 text-[#6B6D76]">{del.time_window_start} – {del.time_window_end}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase ${getPriorityBadge(del.priority)}`}>
                      {del.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(del)}
                        className="p-1.5 rounded-lg hover:bg-[#F7F6F2] text-[#6B6D76] hover:text-[#1F2024] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDelivery(del.id)}
                        className="p-1.5 rounded-lg hover:bg-[#F7F6F2] text-[#6B6D76] hover:text-[#FF4D8D] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Delivery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1F2024]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E8E6DF] shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div className="font-bold text-base text-[#1F2024] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FF5B37]" />
                <span>{editingDelivery ? 'EDIT STOP DESTINATION' : 'ADD NEW STOP'}</span>
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
                <label className="text-[#6B6D76] block">Customer Destination Name</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  placeholder="e.g. Indiranagar Retail Hub"
                />
              </div>

              {/* State & District Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">State / UT</label>
                  <select
                    value={formData.state || 'Karnataka'}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const dists = getDistrictsForState(newState);
                      setFormData({
                        ...formData,
                        state: newState,
                        district: dists[0] || '',
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  >
                    {getAllStates().map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">District</label>
                  <select
                    value={formData.district || ''}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  >
                    {getDistrictsForState(formData.state || 'Karnataka').map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Demand Payload (kg)</label>
                  <input
                    type="number"
                    value={formData.demand_kg}
                    onChange={(e) => setFormData({ ...formData, demand_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#6B6D76] block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[#1F2024] focus:outline-none focus:border-[#FF5B37] capitalize"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
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
                  {editingDelivery ? 'Update Stop' : 'Save Delivery Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
