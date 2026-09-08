import React, { useState } from 'react';
import {
  Menu,
  X,
  Database,
  ArrowRight,
} from 'lucide-react';

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
  isOptimizing: boolean;
  isOptimized: boolean;
  backendOnline: boolean;
  totalDeliveries: number;
  totalVehicles: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickOptimize,
  onLoadDemo,
  isOptimizing,
  isOptimized,
  totalDeliveries,
  totalVehicles,
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
          
          {/* Subtle Live Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[#8A8A8E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>QISKIT SQA</span>
          </div>

          <div className="hidden lg:block h-3.5 w-px bg-white/[0.08]" />

          {/* Load Demo Button */}
          <button
            onClick={onLoadDemo}
            title="Load 25 standard benchmark stops"
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
