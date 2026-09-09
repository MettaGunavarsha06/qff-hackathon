import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  Radio,
  Sparkles,
} from 'lucide-react';
import type { TrafficStatus } from '../../types';

export type NavTab =
  | 'overview'
  | 'routes'
  | 'vehicles'
  | 'optimize'
  | 'analytics'
  | 'technology'
  // Backwards-compatible aliases
  | 'landing'
  | 'dashboard'
  | 'deliveries'
  | 'results'
  | 'quantum-ai'
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
  isOptimizing,
  trafficStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Normalize active tab to one of the 6 canonical tabs
  const getCanonicalTab = (tab: NavTab): string => {
    if (tab === 'landing' || tab === 'dashboard') return 'overview';
    if (tab === 'results') return 'routes';
    if (tab === 'quantum-ai') return 'technology';
    return tab;
  };

  const canonicalActive = getCanonicalTab(currentTab);

  const primaryTabs: { id: NavTab; label: string; canonical: string }[] = [
    { id: 'overview', label: 'Overview', canonical: 'overview' },
    { id: 'routes', label: 'Routes', canonical: 'routes' },
    { id: 'vehicles', label: 'Vehicles', canonical: 'vehicles' },
    { id: 'optimize', label: 'Optimize', canonical: 'optimize' },
    { id: 'analytics', label: 'Analytics', canonical: 'analytics' },
    { id: 'technology', label: 'Technology', canonical: 'technology' },
  ];

  const isTrafficLive = trafficStatus?.is_live ?? false;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto max-w-5xl w-full bg-white/85 backdrop-blur-xl border border-[#E8E6DF] shadow-[0_8px_32px_rgba(31,32,36,0.06)] rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between gap-2 transition-all">
        
        {/* Brand Monogram & Logo */}
        <div
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2.5 cursor-pointer group select-none pl-1 pr-2 shrink-0"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF5B37] to-[#FF4D8D] flex items-center justify-center shadow-[0_2px_8px_rgba(255,91,55,0.3)] group-hover:scale-105 transition-transform">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="font-sans font-bold text-sm tracking-wider text-[#1F2024]">
            ROUTEQ
          </span>
        </div>

        {/* Center: 6 Canonical Navigation Tabs with Sliding Indicator */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#F7F6F2]/80 p-1 rounded-full border border-[#EBE9E2]">
          {primaryTabs.map((tab) => {
            const isActive = canonicalActive === tab.canonical;
            return (
              <button
                key={tab.canonical}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none ${
                  isActive ? 'text-white' : 'text-[#6B6D76] hover:text-[#1F2024]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF5B37] via-[#FF6347] to-[#FF4D8D] shadow-[0_2px_10px_rgba(255,91,55,0.28)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action: Launch Optimizer */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Subtle Live Traffic Dot */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F6F2] border border-[#E8E6DF] text-[10px] font-mono text-[#6B6D76]"
            title={trafficStatus?.message || (isTrafficLive ? 'Live Mappls Traffic Active' : 'Traffic Offline')}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTrafficLive ? 'bg-[#10B981] animate-pulse' : 'bg-[#FF5B37]'
              }`}
            />
            <span className="hidden xl:inline">{isTrafficLive ? 'Traffic Live' : 'Mappls Ready'}</span>
          </div>

          <button
            onClick={() => {
              onSelectTab('optimize');
            }}
            disabled={isOptimizing}
            className="btn-primary-gradient !py-1.5 !px-3.5 !text-xs !font-medium"
          >
            <span>Launch Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full bg-[#F7F6F2] text-[#1F2024] hover:bg-[#EFEFEB] border border-[#E8E6DF] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-xl border border-[#E8E6DF] rounded-2xl shadow-xl p-3 md:hidden space-y-1"
          >
            {primaryTabs.map((tab) => {
              const isActive = canonicalActive === tab.canonical;
              return (
                <button
                  key={tab.canonical}
                  onClick={() => {
                    onSelectTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D] text-white shadow-sm'
                      : 'text-[#6B6D76] hover:bg-[#F7F6F2] hover:text-[#1F2024]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
