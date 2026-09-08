import React from 'react';
import {
  LayoutDashboard,
  Package,
  Truck,
  Cpu,
  Route,
  Award,
  BarChart3,
  Settings,
  Database,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
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
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Project Branding */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">RouteQ</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AI+QUBO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                Intelligent Fleet Optimizer
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-3 border-b border-slate-800/60 space-y-2">
          <button
            onClick={() => {
              onQuickOptimize();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Cpu className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>OPTIMIZE ROUTES</span>
          </button>

          <button
            onClick={onLoadDemo}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Demo Data (25)</span>
          </button>

          {onLoadQuantumDemo && (
            <button
              onClick={onLoadQuantumDemo}
              className="w-full py-1.5 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>Load Quantum Demo (4)</span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-cyan-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      typeof item.badge === 'string'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isActive
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
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
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Engine Status
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendOnline
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-cyan-400'
                  }`}
                />
                <span className="text-[11px] font-semibold text-slate-300">
                  {backendOnline ? 'FastAPI Online' : 'Client Simulator'}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Port: {backendOnline ? '8000' : 'In-Browser'}</span>
              <span className="text-cyan-400 font-mono">v1.0 (QUBO)</span>
            </div>
          </div>

          {/* User Profile Stub */}
          <div className="flex items-center gap-2.5 mt-3 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              OP
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">Fleet Operator</div>
              <div className="text-[10px] text-slate-400 truncate">Hackathon Demo Mode</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
