import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  RotateCcw,
  Clock,
  Weight,
  MapPin,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import type { Delivery, Priority } from '../types';
import { DEMO_DELIVERIES } from '../data/demoData';

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

  // Form State
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
      setFormError('Customer name is required.');
      return;
    }
    if (isNaN(formData.lat) || formData.lat < -90 || formData.lat > 90) {
      setFormError('Valid latitude between -90 and 90 is required.');
      return;
    }
    if (isNaN(formData.lng) || formData.lng < -180 || formData.lng > 180) {
      setFormError('Valid longitude between -180 and 180 is required.');
      return;
    }
    if (formData.demand_kg <= 0) {
      setFormError('Package demand must be greater than 0 kg.');
      return;
    }
    if (formData.time_window_start >= formData.time_window_end) {
      setFormError('Time window end must be after time window start.');
      return;
    }

    if (editingDelivery) {
      onUpdateDelivery(formData);
    } else {
      onAddDelivery(formData);
    }
    setIsModalOpen(false);
  };

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.address && d.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority =
      priorityFilter === 'all' || d.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/15 text-red-400 border border-red-500/30';
      case 'high':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'medium':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'low':
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <span>Delivery Management ({deliveries.length} Total)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure delivery stops, package demands, service durations, and customer time windows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onResetDemo}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reload 25 Demo Stops</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, ID, or street..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Priority:
          </span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                priorityFilter === p
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3.5 px-4">Stop ID</th>
                <th className="py-3.5 px-4">Customer / Destination</th>
                <th className="py-3.5 px-4">Coordinates</th>
                <th className="py-3.5 px-4">Demand</th>
                <th className="py-3.5 px-4">Time Window</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredDeliveries.map((del) => (
                <tr key={del.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                    {del.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{del.customer_name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">
                      {del.address || 'San Francisco Metro'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {del.lat.toFixed(4)}, {del.lng.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <Weight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{del.demand_kg} kg</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Service: {del.service_time_mins}m
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-1 text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{del.time_window_start} – {del.time_window_end}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getPriorityBadge(
                        del.priority
                      )}`}
                    >
                      {del.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(del)}
                        title="Edit Delivery"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDelivery(del.id)}
                        title="Delete Delivery"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No deliveries match your search query or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Delivery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <span>{editingDelivery ? 'Edit Delivery Stop' : 'Add New Delivery Stop'}</span>
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
                    Stop ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!!editingDelivery}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Customer / Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex BioTech Labs"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 550 Howard St, Financial District"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
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
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Package Demand (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.demand_kg}
                    onChange={(e) => setFormData({ ...formData, demand_kg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Service Time (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.service_time_mins}
                    onChange={(e) => setFormData({ ...formData, service_time_mins: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Window Start (HH:MM)
                  </label>
                  <input
                    type="text"
                    placeholder="09:00"
                    value={formData.time_window_start}
                    onChange={(e) => setFormData({ ...formData, time_window_start: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Window End (HH:MM)
                  </label>
                  <input
                    type="text"
                    placeholder="12:00"
                    value={formData.time_window_end}
                    onChange={(e) => setFormData({ ...formData, time_window_end: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
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
                  {editingDelivery ? 'Save Changes' : 'Create Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
