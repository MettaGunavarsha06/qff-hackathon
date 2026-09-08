import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
} from 'lucide-react';
import type { NavTab } from './Sidebar';

interface NavbarProps {
  currentTab: NavTab;
  onOpenMobile: () => void;
  isOptimized: boolean;
  onOptimizeClick: () => void;
  isOptimizing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobile,
  isOptimized,
  onOptimizeClick,
  isOptimizing,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Operations Dashboard',
          subtitle: 'Real-time vehicle routing telemetry and performance KPIs',
        };
      case 'deliveries':
        return {
          title: 'Delivery Management',
          subtitle: 'Manage package destinations, time windows, and customer demands',
        };
      case 'vehicles':
        return {
          title: 'Fleet & Vehicle Management',
          subtitle: 'Configure vehicle capacities, powertrains, and route limits',
        };
      case 'optimize':
        return {
          title: 'Route Optimization Studio',
          subtitle: 'Configure objectives, traffic constraints, and solve via QUBO SQA',
        };
      case 'results':
        return {
          title: 'Optimization Results & Manifest',
          subtitle: 'Turn-by-turn vehicle itineraries and before-and-after improvements',
        };
      case 'quantum-ai':
        return {
          title: 'Quantum & AI Optimization Architecture',
          subtitle: 'CVRPTW mathematical formulation and transverse-field annealing mechanics',
        };
      case 'analytics':
        return {
          title: 'Analytics & ESG Sustainability',
          subtitle: 'Environmental impact, fuel economy, and operational radar benchmarking',
        };
      case 'settings':
        return {
          title: 'System Settings',
          subtitle: 'Depot parameters, speed calibrations, and emission constants',
        };
    }
  };

  const { title, subtitle } = getPageTitle(currentTab);

  const notifications = [
    {
      id: 1,
      title: 'Quantum Engine Ready',
      desc: 'QUBO simulated annealing matrix initialized with 25 stops.',
      time: 'Just now',
      icon: Zap,
      color: 'text-cyan-400',
    },
    {
      id: 2,
      title: 'Traffic Condition: Moderate',
      desc: 'Congestion multiplier 1.28x applied to travel time matrix.',
      time: '5m ago',
      icon: AlertTriangle,
      color: 'text-amber-400',
    },
    {
      id: 3,
      title: 'Green Logistics Protocol',
      desc: 'EV fleet assigned to zero-emission zones in downtown corridor.',
      time: '12m ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0d0e14]/75 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-xl fluid-glass-pill fluid-glass-pill-clear text-slate-300 hover:text-white border border-white/10 shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                {title}
              </h1>
              {isOptimized ? (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full fluid-glass-pill fluid-glass-pill-mint text-emerald-300 border border-emerald-500/40 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Optimized
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full fluid-glass-pill fluid-glass-pill-amber text-amber-300 border border-amber-500/40 shadow-sm">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Pending Optimization
                </span>
              )}
            </div>
            <p className="hidden md:block text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Right Side: Hackathon Tag, Quick Optimize Button, Notifications */}
        <div className="flex items-center gap-3">
          {/* Hackathon Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 text-xs font-semibold shadow-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#ff2a3a]" />
            <span>Hackathon Use Case 04</span>
          </div>

          {/* Quick Optimize Button */}
          <button
            onClick={onOptimizeClick}
            disabled={isOptimizing}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 shadow-lg cursor-pointer fluid-glass-pill ${
              isOptimizing
                ? 'fluid-glass-pill-clear text-slate-400 opacity-80'
                : 'fluid-glass-pill-violet text-white hover:brightness-110 shadow-red-500/30'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin text-white' : 'text-white'}`} />
            <span className="hidden sm:inline">
              {isOptimizing ? 'Solving Matrix...' : 'Optimize Routes'}
            </span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 hover:text-white border border-white/10 shadow-sm relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff2a3a] ring-2 ring-[#0d0e14] animate-pulse" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-3xl fluid-glass-panel shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-white/15">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#ff2a3a]" />
                    <span>System Notifications</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5">
                  {notifications.map((n) => {
                    const NIcon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="p-3 rounded-2xl fluid-glass-card flex items-start gap-3 border border-white/10 hover:border-white/20 transition-all shadow-sm"
                      >
                        <NIcon className={`w-4 h-4 mt-0.5 shrink-0 ${n.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white">{n.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-medium">
                            {n.desc}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 font-semibold">{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
