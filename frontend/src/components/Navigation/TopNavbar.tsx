import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Play,
  ArrowLeft,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import type { TrafficStatus } from '../../types';
import { INDIA_HUBS } from '../../data/demoData';

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
  onExitToLanding?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickOptimize,
  onSelectHub,
  selectedHubKey = 'bengaluru',
  isOptimizing,
  trafficStatus,
  onExitToLanding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);

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
  const currentHubName = INDIA_HUBS[selectedHubKey]?.city || 'Bengaluru';

  return (
    <header className="fixed top-3 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto max-w-6xl w-full bg-white/90 backdrop-blur-xl border border-[#E8E6DF] shadow-[0_8px_32px_rgba(32,33,36,0.06)] rounded-full px-3 sm:px-5 py-2 flex items-center justify-between gap-2 transition-all">
        
        {/* Brand Monogram & Exit to Public Landing */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2 cursor-pointer group select-none pl-1"
            title="RouteQ Operations App"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#E95AA8] flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,74,0.35)] group-hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="font-sans font-bold text-sm tracking-wider text-[#202124]">
              ROUTEQ
            </span>
          </div>

          {/* Exit / Return to Public Landing Page Button */}
          {onExitToLanding && (
            <button
              onClick={onExitToLanding}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F6F3EC] hover:bg-[#EAE7F5] border border-[#E8E6DF] text-[11px] font-mono text-[#6B6D76] hover:text-[#202124] transition-colors cursor-pointer"
              title="Return to Public Landing Page"
            >
              <ArrowLeft className="w-3 h-3 text-[#FF6B4A]" />
              <span className="hidden sm:inline">Public Site</span>
            </button>
          )}
        </div>

        {/* Center: 6 Canonical Navigation Tabs with Sliding Spring Indicator */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#F6F3EC]/80 p-1 rounded-full border border-[#EBE9E2]">
          {primaryTabs.map((tab) => {
            const isActive = canonicalActive === tab.canonical;
            return (
              <button
                key={tab.canonical}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none ${
                  isActive ? 'text-white' : 'text-[#6B6D76] hover:text-[#202124]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="appActiveTabIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B4A] via-[#FF5B37] to-[#E95AA8] shadow-[0_2px_10px_rgba(255,107,74,0.3)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Hub Selector, Live Traffic & Run Optimization */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Hub Selector Dropdown */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F3EC] hover:bg-[#EFEFEB] border border-[#E8E6DF] text-[11px] font-mono text-[#202124] transition-colors cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[#FF6B4A]" />
              <span>{currentHubName}</span>
              <ChevronDown className="w-3 h-3 text-[#6B6D76]" />
            </button>

            <AnimatePresence>
              {hubDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-8 w-40 bg-white border border-[#E8E6DF] rounded-2xl shadow-soft p-1.5 z-50 text-xs font-mono"
                >
                  {Object.entries(INDIA_HUBS).map(([key, hub]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onSelectHub?.(key);
                        setHubDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                        selectedHubKey === key
                          ? 'bg-[#F6F3EC] text-[#202124] font-semibold'
                          : 'text-[#6B6D76] hover:bg-[#FAF9F6] hover:text-[#202124]'
                      }`}
                    >
                      <span>{hub.city}</span>
                      <span className="text-[10px] text-[#8E909A]">{hub.deliveries.length} stops</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtle Live Traffic Dot */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F3EC] border border-[#E8E6DF] text-[10px] font-mono text-[#6B6D76]"
            title={trafficStatus?.message || (isTrafficLive ? 'Live Mappls Traffic Active' : 'Traffic Offline')}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTrafficLive ? 'bg-[#10B981] animate-pulse' : 'bg-[#FF6B4A]'
              }`}
            />
            <span>{isTrafficLive ? 'Live' : 'Offline'}</span>
          </div>

          {/* Quick Action: Optimize */}
          <button
            onClick={onQuickOptimize}
            disabled={isOptimizing}
            className="btn-primary-gradient !py-1.5 !px-3.5 !text-xs !font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full bg-[#F6F3EC] text-[#202124] hover:bg-[#EFEFEB] border border-[#E8E6DF] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-xl border border-[#E8E6DF] rounded-2xl shadow-soft-lg p-3 md:hidden space-y-1 z-50"
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
                      ? 'bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8] text-white shadow-sm'
                      : 'text-[#6B6D76] hover:bg-[#F6F3EC] hover:text-[#202124]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}

            {onExitToLanding && (
              <div className="pt-2 border-t border-[#E8E6DF]">
                <button
                  onClick={() => {
                    onExitToLanding();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-xl text-xs font-mono text-[#FF6B4A] hover:bg-[#F6F3EC] flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit to Public Website</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopNavbar;
