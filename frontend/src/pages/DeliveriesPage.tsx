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

  const [formData, setFormData] = useState<Delivery>({
    id: '',
    customer_name: '',
    lat: 37.7749,
    lng: -122.4194,
    demand_kg: 25.0,
    priority: 'medium',
    time_window_start: '09:00',
    time_window_end: '12:00',
    service_time_mins: 15,
    address: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    const nextNum = deliveries.length + 1;
    const newId = `DEL-${nextNum < 10 ? '0' + nextNum : nextNum}`;
    setEditingDelivery(null);
    setFormData({
      id: newId,
      customer_name: '',
      lat: 37.775 + (Math.random() - 0.5) * 0.04,
      lng: -122.42 + (Math.random() - 0.5) * 0.06,
      demand_kg: 25.0,
      priority: 'medium',
      time_window_start: '10:00',
      time_window_end: '13:00',
      service_time_mins: 15,
      address: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (del: Delivery) => {
    setEditingDelivery(del);
    setFormData({ ...del });
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
    const matchesSearch =
      del.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      del.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (del.address && del.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority = priorityFilter === 'all' || del.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return 'bg-[#EC4899]/15 text-[#EC4899]';
      case 'high':
        return 'bg-[#FF5500]/15 text-[#FF5500]';
      case 'medium':
        return 'bg-white/[0.08] text-white';
      case 'low':
        return 'bg-white/[0.04] text-[#8A8A8E]';
    }
  };

  return (
    <div className="space-y-6 pb-20 text-[#F5F5F5]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
            DEMAND NETWORK &bull; {deliveries.length} NODES
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            DELIVERY ORDERS & WAYPOINTS
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDemo}
            className="btn-minimal-outline text-xs !py-2 !px-3"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Reset Demo (25)</span>
          </button>

          <button
            onClick={openAddModal}
            className="btn-minimal-primary text-xs !py-2 !px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3 rounded-lg bg-[#0D0D0D] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8E]" />
          <input
            type="text"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded bg-[#080808] border border-white/[0.06] text-white placeholder-[#8A8A8E] text-xs focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-[#8A8A8E] text-[10px] uppercase shrink-0">Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2 py-1 rounded uppercase text-[10px] font-mono transition-all cursor-pointer ${
                priorityFilter === p
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#080808] text-[#8A8A8E] hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="overflow-hidden rounded-lg bg-[#0D0D0D] border border-white/[0.06]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080808] text-[#8A8A8E] font-medium uppercase tracking-wider text-[10px] border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Stop ID</th>
                <th className="py-3 px-4">Customer Destination</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4">Demand</th>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-[#8A8A8E]">
              {filteredDeliveries.map((del) => (
                <tr key={del.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">
                    {del.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white text-xs">{del.customer_name}</div>
                    <div className="text-[11px] text-[#8A8A8E] truncate max-w-xs font-sans">
                      {del.address || 'San Francisco Corridor'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#8A8A8E] text-[11px]">
                    {del.lat.toFixed(4)}, {del.lng.toFixed(4)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white font-medium">{del.demand_kg} kg</div>
                    <div className="text-[10px] text-[#8A8A8E]">Service: {del.service_time_mins}m</div>
                  </td>
                  <td className="py-3 px-4 text-white">
                    {del.time_window_start} – {del.time_window_end}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityBadge(
                        del.priority
                      )}`}
                    >
                      {del.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(del)}
                        title="Edit Delivery"
                        className="p-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A8E] hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDelivery(del.id)}
                        title="Delete Delivery"
                        className="p-1.5 rounded bg-white/[0.04] hover:bg-[#EC4899]/20 text-[#8A8A8E] hover:text-[#EC4899] transition-colors cursor-pointer"
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
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0D0D0D] border border-white/[0.08] shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="font-semibold text-sm text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FF5500]" />
                <span>{editingDelivery ? 'EDIT DELIVERY STOP' : 'NEW DELIVERY STOP'}</span>
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
                    Stop ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!!editingDelivery}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Priority Tier
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                  Customer Destination Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex BioTech Labs"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Cargo Demand (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.demand_kg}
                    onChange={(e) => setFormData({ ...formData, demand_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Service Time (mins)
                  </label>
                  <input
                    type="number"
                    value={formData.service_time_mins}
                    onChange={(e) => setFormData({ ...formData, service_time_mins: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Window Start (HH:MM)
                  </label>
                  <input
                    type="time"
                    value={formData.time_window_start}
                    onChange={(e) => setFormData({ ...formData, time_window_start: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#080808] border border-white/[0.06] text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#8A8A8E] uppercase mb-1">
                    Window End (HH:MM)
                  </label>
                  <input
                    type="time"
                    value={formData.time_window_end}
                    onChange={(e) => setFormData({ ...formData, time_window_end: e.target.value })}
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
                  {editingDelivery ? 'Save Changes' : 'Register Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
