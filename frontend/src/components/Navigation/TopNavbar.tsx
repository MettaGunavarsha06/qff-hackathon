import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ChevronDown,
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
  onExitToLanding?: () => void;
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
  onSelectHub,
  selectedHubKey = 'bengaluru',
  onExitToLanding,
  isOptimizing,
  trafficStatus,
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

  const hubs = [
    { key: 'bengaluru', name: 'Bengaluru Hub' },
    { key: 'mumbai', name: 'Mumbai Hub' },
    { key: 'delhi', name: 'Delhi NCR Hub' },
    { key: 'hyderabad', name: 'Hyderabad Hub' },
    { key: 'chennai', name: 'Chennai Hub' },
  ];

  const currentHubName = hubs.find((h) => h.key === selectedHubKey)?.name || 'Bengaluru Hub';
  const isTrafficLive = trafficStatus?.is_live ?? true;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto max-w-6xl w-full bg-white/90 backdrop-blur-xl border border-[#E8E6DF] shadow-[0_8px_32px_rgba(23,26,56,0.06)] rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between gap-2 transition-all">
        
        {/* Brand Monogram & Exit to Public Site */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2 cursor-pointer group select-none pl-1 pr-1"
            title="RouteQ Operations Console"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#E95AA8] flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,74,0.35)] group-hover:scale-105 transition-transform">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="font-sans font-bold text-sm tracking-wider text-[#171A38]">
              ROUTEQ
            </span>
          </div>

          {/* Quick Return to Public Site */}
          {onExitToLanding && (
            <button
              onClick={onExitToLanding}
              title="Return to Public Landing Page"
              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#6B6D76] hover:text-[#FF6B4A] px-2.5 py-1 rounded-full bg-[#FAF9F5] hover:bg-[#F2F1EC] border border-[#E8E6DF] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Public Site</span>
            </button>
          )}
        </div>

        {/* Center: 6 Canonical Navigation Tabs with Sliding Indicator */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#FAF9F5] p-1 rounded-full border border-[#E8E6DF]">
          {primaryTabs.map((tab) => {
            const isActive = canonicalActive === tab.canonical;
            return (
              <button
                key={tab.canonical}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none ${
                  isActive ? 'text-white font-semibold' : 'text-[#6B6D76] hover:text-[#171A38]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeAppNavIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B4A] via-[#FF6347] to-[#E95AA8] shadow-[0_2px_10px_rgba(255,107,74,0.3)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Hub Selector + Status + Quick Optimize */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Hub Selector Dropdown */}
          {onSelectHub && (
            <div className="relative hidden xl:block">
              <button
                onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#F2F1EC] border border-[#E8E6DF] font-mono text-[11px] text-[#171A38] transition-colors cursor-pointer"
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
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-white border border-[#E8E6DF] rounded-2xl shadow-lg p-1.5 z-50 font-mono text-xs"
                  >
                    {hubs.map((h) => (
                      <button
                        key={h.key}
                        onClick={() => {
                          onSelectHub(h.key);
                          setHubDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                          selectedHubKey === h.key
                            ? 'bg-[#FAF9F5] text-[#FF6B4A] font-bold'
                            : 'text-[#6B6D76] hover:bg-[#F2F1EC] hover:text-[#171A38]'
                        }`}
                      >
                        <span>{h.name}</span>
                        {selectedHubKey === h.key && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Autonomous Logistics Grid Status */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] text-[10px] font-mono text-[#6B6D76]"
            title="India Autonomous Logistics Network Active"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="hidden xl:inline">Live Fleet Matrix</span>
          </div>

          {/* Run Optimizer Trigger */}
          <button
            onClick={() => onSelectTab('optimize')}
            disabled={isOptimizing}
            className="btn-primary-gradient !py-1.5 !px-3.5 !text-xs !font-medium shadow-sm cursor-pointer"
          >
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full bg-[#FAF9F5] text-[#171A38] hover:bg-[#F2F1EC] border border-[#E8E6DF] transition-colors cursor-pointer"
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
            {onExitToLanding && (
              <button
                onClick={() => {
                  onExitToLanding();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-xl text-xs font-medium text-[#FF6B4A] bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-between mb-2"
              >
                <div className="flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Landing Page</span>
                </div>
              </button>
            )}

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
                      ? 'bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8] text-white shadow-sm font-semibold'
                      : 'text-[#6B6D76] hover:bg-[#FAF9F5] hover:text-[#171A38]'
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
