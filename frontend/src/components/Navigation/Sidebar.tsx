import React from 'react';
import {
  LayoutDashboard,
  Package,
  Truck,
  Cpu,
  Route,
  BarChart3,
  Settings,
  Database,
  Sparkles,
  Zap,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'deliveries'
  | 'vehicles'
  | 'optimize'
  | 'results'
  | 'quantum-ai'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onLoadDemo: () => void;
  onLoadQuantumDemo?: () => void;
  onQuickOptimize: () => void;
  backendOnline: boolean;
  totalDeliveries: number;
  totalVehicles: number;
  isOptimized: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLoadDemo,
  onLoadQuantumDemo,
  onQuickOptimize,
  backendOnline,
  totalDeliveries,
  totalVehicles,
  isOptimized,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deliveries' as NavTab, label: 'Deliveries', icon: Package, badge: totalDeliveries },
    { id: 'vehicles' as NavTab, label: 'Vehicles', icon: Truck, badge: totalVehicles },
    { id: 'optimize' as NavTab, label: 'Optimize Studio', icon: Cpu, highlight: true },
    { id: 'results' as NavTab, label: 'Results & Routes', icon: Route, badge: isOptimized ? 'Ready' : undefined },
    { id: 'quantum-ai' as NavTab, label: 'Quantum AI Tech', icon: Sparkles },
    { id: 'analytics' as NavTab, label: 'Analytics & ESG', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0d0e15]/85 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-[8px_0_30px_rgba(0,0,0,0.7)] ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Project Branding */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl fluid-glass-pill fluid-glass-pill-violet shadow-md flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-tight">RouteQ</span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] border border-red-500/30 shadow-sm">
                  AI+QUBO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                Quantum Logistics
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-3.5 border-b border-white/10 space-y-2">
          <button
            onClick={() => {
              onQuickOptimize();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-full fluid-glass-pill fluid-glass-pill-violet text-white font-black text-xs tracking-wider shadow-lg hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span>OPTIMIZE ROUTES</span>
          </button>

          <button
            onClick={onLoadDemo}
            className="w-full py-1.5 px-3 rounded-full fluid-glass-pill fluid-glass-pill-clear text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-[#ff2a3a]" />
            <span>Load Demo Data (25)</span>
          </button>

          {onLoadQuantumDemo && (
            <button
              onClick={onLoadQuantumDemo}
              className="w-full py-1.5 px-3 rounded-full fluid-glass-pill fluid-glass-pill-cyan text-[#ff6b77] hover:text-white text-xs font-bold border border-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#ff2a3a] fill-current" />
              <span>Load Quantum Demo (4)</span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'fluid-glass-pill fluid-glass-pill-violet text-white shadow-md border-red-400/40 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      typeof item.badge === 'string'
                        ? 'fluid-glass-pill fluid-glass-pill-mint text-emerald-300 border border-emerald-500/40'
                        : isActive
                        ? 'bg-black/30 text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Backend Status & System Health */}
        <div className="p-3.5 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="p-2.5 rounded-2xl fluid-glass-card border border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Engine Status
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendOnline
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-[#ff2a3a]'
                  }`}
                />
                <span className="text-[11px] font-bold text-slate-300">
                  {backendOnline ? 'FastAPI Online' : 'Client Simulator'}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between font-medium">
              <span>Port: {backendOnline ? '8000' : 'In-Browser'}</span>
              <span className="text-[#ff6b77] font-mono font-bold">v1.0 (QUBO)</span>
            </div>
          </div>

          {/* User Profile Stub */}
          <div className="flex items-center gap-2.5 mt-3 px-1">
            <div className="w-8 h-8 rounded-full fluid-glass-pill fluid-glass-pill-violet flex items-center justify-center text-xs font-black text-white shadow-sm">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Fleet Operator</div>
              <div className="text-[10px] text-slate-400 truncate font-medium">Obsidian Red Theme</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
