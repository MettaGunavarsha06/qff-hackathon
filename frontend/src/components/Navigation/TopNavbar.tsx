import React, { useState } from 'react';
import {
  Menu,
  X,
  Database,
  ArrowRight,
  RefreshCw,
  Radio,
} from 'lucide-react';
import type { TrafficStatus } from '../../types';

export type NavTab =
  | 'landing'
  | 'dashboard'
  | 'deliveries'
  | 'vehicles'
  | 'optimize'
  | 'results'
  | 'quantum-ai'
  | 'analytics'
  | 'settings';

interface TopNavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickOptimize: () => void;
  onLoadDemo: () => void;
  onSelectHub?: (hubKey: string) => void;
  selectedHubKey?: string;
  isOptimizing: boolean;
  isOptimized: boolean;
  backendOnline: boolean;
  totalDeliveries: number;
  totalVehicles: number;
  trafficStatus?: TrafficStatus;
  onRefreshTraffic?: () => void;
  isRefreshingTraffic?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickOptimize,
  onLoadDemo,
  onSelectHub,
  selectedHubKey = 'bengaluru',
  isOptimizing,
  isOptimized,
  totalDeliveries,
  totalVehicles,
  trafficStatus,
  onRefreshTraffic,
  isRefreshingTraffic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string; tag?: string }[] = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Command Map' },
    { id: 'deliveries', label: 'Orders', tag: `${totalDeliveries}` },
    { id: 'vehicles', label: 'Fleet', tag: `${totalVehicles}` },
    { id: 'optimize', label: 'Solver' },
    { id: 'results', label: 'Manifest', tag: isOptimized ? 'Ready' : undefined },
    { id: 'quantum-ai', label: 'Technology' },
    { id: 'analytics', label: 'Telemetry' },
    { id: 'settings', label: 'Config' },
  ];

  const isTrafficLive = trafficStatus?.is_live ?? false;

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.06] text-xs">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identifier */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#EC4899] group-hover:scale-125 transition-transform" />
            <span className="font-display font-semibold text-sm tracking-widest text-white">
              ROUTEQ
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative px-3 py-1.5 rounded transition-all font-sans text-xs flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'text-white bg-white/[0.08] font-medium'
                      : 'text-[#8A8A8E] hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.tag && (
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.2 rounded ${
                        active
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/[0.06] text-[#8A8A8E]'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Telemetry Strip & Optimize Action */}
        <div className="flex items-center gap-3">
          
          {/* Traffic Status Indicator (India / Mappls) */}
          <div
            className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded border font-mono text-[10px] transition-all ${
              isTrafficLive
                ? 'bg-[#10B981]/10 border-[#10B981]/30 text-emerald-300'
                : 'bg-white/[0.03] border-white/[0.08] text-[#8A8A8E]'
            }`}
            title={trafficStatus?.message || (isTrafficLive ? 'Live Traffic Connected (Mappls)' : 'Traffic Data Unavailable')}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isTrafficLive ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'
              }`}
            />
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-semibold text-white">
                {isTrafficLive ? 'Live Traffic Connected' : 'Traffic Data Unavailable'}
              </span>
              <span className="text-white/40">|</span>
              <span className="text-[9px] text-[#A1A1AA]">
                Mappls {trafficStatus?.last_updated ? `(${trafficStatus.last_updated.split(', ')[1] || 'IST'})` : ''}
              </span>
            </div>
          </div>

          {/* Refresh Live Traffic Action */}
          {onRefreshTraffic && (
            <button
              onClick={onRefreshTraffic}
              disabled={isRefreshingTraffic}
              title="Refresh real-time Mappls road matrix & traffic-aware ETAs"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A8E] hover:text-white border border-white/[0.06] font-mono text-[10px] tracking-wider transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 text-[#00F0FF] ${isRefreshingTraffic ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">{isRefreshingTraffic ? 'FETCHING...' : 'REFRESH TRAFFIC'}</span>
            </button>
          )}

          <div className="hidden lg:block h-3.5 w-px bg-white/[0.08]" />

          {/* India Multi-Hub Corridor Switcher */}
          {onSelectHub && (
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-0.5 rounded border border-white/[0.06] font-mono text-[10px]">
              <span className="px-1.5 py-0.5 text-[#8A8A8E] flex items-center gap-1">
                <span>🇮🇳</span>
                <span className="hidden xl:inline">HUB:</span>
              </span>
              <button
                onClick={() => onSelectHub('bengaluru')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedHubKey === 'bengaluru' ? 'bg-white/10 text-white font-semibold' : 'text-[#8A8A8E] hover:text-white'
                }`}
                title="Bengaluru Logistics Corridor, Karnataka (25 stops)"
              >
                BLR (25)
              </button>
              <button
                onClick={() => onSelectHub('delhi')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedHubKey === 'delhi' ? 'bg-white/10 text-white font-semibold' : 'text-[#8A8A8E] hover:text-white'
                }`}
                title="Delhi-NCR Logistics Corridor, Delhi / Haryana (8 stops)"
              >
                DEL (8)
              </button>
              <button
                onClick={() => onSelectHub('mumbai')}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedHubKey === 'mumbai' ? 'bg-white/10 text-white font-semibold' : 'text-[#8A8A8E] hover:text-white'
                }`}
                title="Mumbai MMR Logistics Corridor, Maharashtra (8 stops)"
              >
                BOM (8)
              </button>
            </div>
          )}

          {/* Load Demo Button */}
          <button
            onClick={onLoadDemo}
            title="Load 25 Bengaluru benchmark delivery stops (India)"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A8E] hover:text-white border border-white/[0.06] font-mono text-[10px] tracking-wider transition-all cursor-pointer"
          >
            <Database className="w-3 h-3 text-[#FF5500]" />
            <span>25 STOPS DEMO</span>
          </button>

          {/* Quick Optimize Button */}
          <button
            onClick={onQuickOptimize}
            disabled={isOptimizing}
            className="btn-minimal-primary !py-1.5 !px-3 text-xs !font-medium"
          >
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize Network'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded bg-white/[0.04] text-[#8A8A8E] hover:text-white border border-white/[0.08]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>


      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/[0.06] bg-[#080808] px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded text-left font-sans text-xs flex items-center justify-between ${
                    active
                      ? 'text-white bg-white/[0.08] font-medium'
                      : 'text-[#8A8A8E] hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-white/[0.08] text-[#8A8A8E]">
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#8A8A8E]">
            <span className="font-mono">Engine: Qiskit SQA</span>
            <button
              onClick={() => {
                onLoadDemo();
                setMobileMenuOpen(false);
              }}
              className="text-[#FF5500] font-medium"
            >
              Reset 25 Stops
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
