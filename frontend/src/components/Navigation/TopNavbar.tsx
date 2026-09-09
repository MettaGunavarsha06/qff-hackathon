import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Play,
  ArrowLeft,
  ChevronDown,
  MapPin,
  Search,
} from 'lucide-react';
import type { TrafficStatus } from '../../types';
import { INDIA_HUBS } from '../../data/demoData';
import {
  INDIA_STATES_AND_DISTRICTS,
  getAllStates,
  getDistrictsForState,
  getTotalDistrictCount,
  resolveDistrictHub,
} from '../../data/indiaDistricts';

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
  onQuickOptimize?: () => void;
  onLoadDemo?: () => void;
  onSelectHub?: (hubKey: string, stateName?: string, districtName?: string) => void;
  selectedHubKey?: string;
  isOptimizing?: boolean;
  isOptimized?: boolean;
  backendOnline?: boolean;
  totalDeliveries?: number;
  totalVehicles?: number;
  trafficStatus?: TrafficStatus | null;
  onRefreshTraffic?: () => void;
  isRefreshingTraffic?: boolean;
  onExitToLanding?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onSelectTab,
  onQuickOptimize,
  onLoadDemo,
  onSelectHub,
  selectedHubKey = 'bengaluru',
  isOptimizing = false,
  isOptimized = false,
  backendOnline = true,
  totalDeliveries = 0,
  totalVehicles = 0,
  trafficStatus,
  onRefreshTraffic,
  isRefreshingTraffic = false,
  onExitToLanding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [hubSearch, setHubSearch] = useState<string>('');
  const [hubTab, setHubTab] = useState<'corridors' | 'all_districts'>('corridors');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('Karnataka');

  // Unified Tabs for top bar
  const primaryTabs: { id: NavTab; label: string; canonical: NavTab }[] = [
    { id: 'overview', label: 'Operations', canonical: 'overview' },
    { id: 'routes', label: 'Routes & Waypoints', canonical: 'routes' },
    { id: 'vehicles', label: 'Fleet Hub', canonical: 'vehicles' },
    { id: 'optimize', label: 'Optimizer Studio', canonical: 'optimize' },
    { id: 'analytics', label: 'Telemetry & ESG', canonical: 'analytics' },
    { id: 'technology', label: 'Technology', canonical: 'technology' },
  ];

  const getCanonicalTab = (tab: NavTab): string => {
    if (tab === 'landing' || tab === 'dashboard') return 'overview';
    if (tab === 'results') return 'routes';
    if (tab === 'quantum-ai') return 'technology';
    return tab;
  };

  const canonicalActive = getCanonicalTab(currentTab);

  const isTrafficLive = trafficStatus?.is_live ?? false;
  const currentHub = resolveDistrictHub(selectedHubKey);
  const currentHubName = currentHub?.city || 'Bengaluru';
  const currentDistrict = currentHub?.district || 'Bengaluru Urban';

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
              onClick={() => {
                setHubDropdownOpen(!hubDropdownOpen);
                setHubSearch('');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F3EC] hover:bg-[#EFEFEB] border border-[#E8E6DF] text-[11px] font-mono text-[#202124] transition-colors cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[#FF6B4A]" />
              <span className="font-semibold">{currentHubName}</span>
              <span className="text-[9px] text-[#8E909A] font-normal hidden xl:inline">({currentDistrict})</span>
              <ChevronDown className="w-3 h-3 text-[#6B6D76]" />
            </button>

            <AnimatePresence>
              {hubDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-8 w-80 sm:w-96 bg-white border border-[#E8E6DF] rounded-2xl shadow-soft-xl p-2.5 z-50 text-xs font-mono"
                >
                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 p-0.5 bg-[#F6F3EC] rounded-xl mb-2 text-[10px]">
                    <button
                      onClick={() => setHubTab('corridors')}
                      className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center font-medium ${
                        hubTab === 'corridors'
                          ? 'bg-white text-[#202124] shadow-xs'
                          : 'text-[#6B6D76] hover:text-[#202124]'
                      }`}
                    >
                      Corridors ({Object.keys(INDIA_HUBS).length})
                    </button>
                    <button
                      onClick={() => setHubTab('all_districts')}
                      className={`flex-1 py-1 rounded-lg transition-colors cursor-pointer text-center font-medium ${
                        hubTab === 'all_districts'
                          ? 'bg-white text-[#202124] shadow-xs'
                          : 'text-[#6B6D76] hover:text-[#202124]'
                      }`}
                    >
                      All Districts ({getTotalDistrictCount()}+)
                    </button>
                  </div>

                  {/* Search input */}
                  <div className="relative mb-2 px-0.5">
                    <input
                      type="text"
                      value={hubSearch}
                      onChange={(e) => setHubSearch(e.target.value)}
                      placeholder={
                        hubTab === 'corridors'
                          ? `Search ${Object.keys(INDIA_HUBS).length} corridors, districts...`
                          : `Search across all ${getTotalDistrictCount()} districts...`
                      }
                      className="w-full px-2.5 py-1.5 pl-7 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[11px] text-[#202124] focus:outline-none focus:border-[#FF6B4A]"
                      autoFocus
                    />
                    <Search className="w-3.5 h-3.5 text-[#8E909A] absolute left-2.5 top-2 pointer-events-none" />
                  </div>

                  {/* Tab 1: Corridors List */}
                  {hubTab === 'corridors' && (
                    <div className="max-h-72 overflow-y-auto space-y-0.5 pr-0.5">
                      {Object.entries(INDIA_HUBS)
                        .filter(([_, hub]) => {
                          const q = hubSearch.toLowerCase().trim();
                          if (!q) return true;
                          return (
                            hub.city.toLowerCase().includes(q) ||
                            hub.name.toLowerCase().includes(q) ||
                            hub.state.toLowerCase().includes(q) ||
                            hub.district.toLowerCase().includes(q)
                          );
                        })
                        .map(([key, hub]) => (
                          <button
                            key={key}
                            onClick={() => {
                              onSelectHub?.(key);
                              setHubDropdownOpen(false);
                              setHubSearch('');
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                              selectedHubKey === key
                                ? 'bg-[#F6F3EC] text-[#202124] font-semibold ring-1 ring-[#FF6B4A]/20'
                                : 'text-[#6B6D76] hover:bg-[#FAF9F6] hover:text-[#202124]'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#1F2024]">{hub.city}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FFF2EE] border border-[#FFD8CD] text-[#FF6B4A] font-medium">
                                  {hub.district}
                                </span>
                              </div>
                              <div className="text-[10px] text-[#8E909A] truncate">{hub.state}</div>
                            </div>
                            <span className="text-[10px] text-[#FF6B4A] font-bold shrink-0 ml-1">
                              {hub.deliveries.length} stops
                            </span>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Tab 2: All 28 States & 8 UTs Districts Explorer */}
                  {hubTab === 'all_districts' && (
                    <div className="space-y-2">
                      {!hubSearch.trim() ? (
                        <>
                          <div className="flex items-center justify-between gap-1.5 px-1">
                            <label className="text-[10px] text-[#8E909A] font-semibold uppercase">State / UT:</label>
                            <select
                              value={selectedStateFilter}
                              onChange={(e) => setSelectedStateFilter(e.target.value)}
                              className="text-[10px] py-1 px-2 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] text-[#202124] focus:outline-none focus:border-[#FF6B4A] max-w-[210px]"
                            >
                              {getAllStates().map((st) => (
                                <option key={st} value={st}>
                                  {st} ({INDIA_STATES_AND_DISTRICTS[st]?.length || 0})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-[10px] text-[#8E909A] px-1">
                            Districts in <span className="text-[#202124] font-semibold">{selectedStateFilter}</span> ({getDistrictsForState(selectedStateFilter).length} total):
                          </div>

                          <div className="max-h-60 overflow-y-auto grid grid-cols-2 gap-1 pr-0.5">
                            {getDistrictsForState(selectedStateFilter).map((dist) => {
                              const matchingHubKey = Object.keys(INDIA_HUBS).find((k) =>
                                INDIA_HUBS[k].district.toLowerCase() === dist.toLowerCase() ||
                                dist.toLowerCase().includes(INDIA_HUBS[k].district.toLowerCase())
                              );
                              const dynamicHubKey = `hub-${dist.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${selectedStateFilter.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                              const hubKey = matchingHubKey || dynamicHubKey;
                              const isCurrent =
                                (currentHub?.district?.toLowerCase() === dist.toLowerCase() &&
                                  currentHub?.state?.toLowerCase() === selectedStateFilter.toLowerCase()) ||
                                selectedHubKey === hubKey ||
                                selectedHubKey === matchingHubKey;

                              return (
                                <div
                                  key={dist}
                                  onClick={() => {
                                    onSelectHub?.(hubKey, selectedStateFilter, dist);
                                    setHubDropdownOpen(false);
                                    setHubSearch('');
                                  }}
                                  className={`p-1.5 rounded-lg border text-[10px] transition-all flex flex-col justify-between cursor-pointer ${
                                    isCurrent
                                      ? 'border-[#FF6B4A] bg-[#FFF2EE] text-[#FF6B4A] shadow-sm ring-1 ring-[#FF6B4A]/30'
                                      : matchingHubKey
                                      ? 'border-[#FF6B4A]/40 bg-[#FFF9F6] text-[#202124] hover:bg-[#FFF2EE] shadow-xs'
                                      : 'border-[#E8E6DF] bg-[#FAFAF8] text-[#202124] hover:border-[#FF6B4A]/40 hover:bg-[#FFF9F6]'
                                  }`}
                                  title={`Click to load and dispatch ${dist} Hub (${selectedStateFilter})`}
                                >
                                  <span className="font-medium truncate">{dist}</span>
                                  <span className="text-[8px] text-[#FF6B4A] font-bold mt-0.5 flex items-center gap-0.5">
                                    ⚡ {matchingHubKey ? 'Primary Hub' : 'Active Hub'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        // Search across all districts
                        <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5">
                          {Object.entries(INDIA_STATES_AND_DISTRICTS).flatMap(([stateName, distList]) =>
                            distList
                              .filter((d) =>
                                d.toLowerCase().includes(hubSearch.toLowerCase().trim()) ||
                                stateName.toLowerCase().includes(hubSearch.toLowerCase().trim())
                              )
                              .map((dist) => {
                                const matchingHubKey = Object.keys(INDIA_HUBS).find((k) =>
                                  INDIA_HUBS[k].district.toLowerCase() === dist.toLowerCase() ||
                                  dist.toLowerCase().includes(INDIA_HUBS[k].district.toLowerCase())
                                );
                                const dynamicHubKey = `hub-${dist.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                                const hubKey = matchingHubKey || dynamicHubKey;
                                const isCurrent =
                                  (currentHub?.district?.toLowerCase() === dist.toLowerCase() &&
                                    currentHub?.state?.toLowerCase() === stateName.toLowerCase()) ||
                                  selectedHubKey === hubKey ||
                                  selectedHubKey === matchingHubKey;

                                return (
                                  <div
                                    key={`${stateName}-${dist}`}
                                    onClick={() => {
                                      onSelectHub?.(hubKey, stateName, dist);
                                      setHubDropdownOpen(false);
                                      setHubSearch('');
                                    }}
                                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] flex items-center justify-between cursor-pointer transition-colors ${
                                      isCurrent
                                        ? 'border-[#FF6B4A] bg-[#FFF2EE] text-[#FF6B4A]'
                                        : matchingHubKey
                                        ? 'border-[#FF6B4A]/30 bg-[#FFF8F5] text-[#202124] hover:bg-[#FFF2EE]'
                                        : 'border-[#E8E6DF] hover:bg-[#FAF9F6] text-[#202124] hover:border-[#FF6B4A]/30'
                                    }`}
                                  >
                                    <div>
                                      <span className="font-semibold text-[#1F2024]">{dist}</span>
                                      <span className="text-[9px] text-[#8E909A] ml-2">{stateName}</span>
                                    </div>
                                    <span className="text-[9px] text-[#FF6B4A] font-bold">
                                      ⚡ {matchingHubKey ? 'Primary Corridor' : 'Dispatch Hub'}
                                    </span>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      )}
                    </div>
                  )}
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
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-xl border border-[#E8E6DF] rounded-2xl shadow-soft-lg p-3 md:hidden space-y-2 z-50 max-h-[85vh] overflow-y-auto"
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

            {/* Mobile Hub Selector */}
            <div className="pt-2 border-t border-[#E8E6DF] space-y-1">
              <div className="text-[10px] font-mono text-[#8E909A] uppercase px-3">
                SELECT CORRIDOR & DISTRICT ({Object.keys(INDIA_HUBS).length} CORRIDORS)
              </div>
              <div className="max-h-52 overflow-y-auto space-y-1 px-1">
                {Object.entries(INDIA_HUBS).map(([key, hub]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSelectHub?.(key);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between ${
                      selectedHubKey === key
                        ? 'bg-[#F6F3EC] text-[#FF6B4A] font-bold'
                        : 'text-[#6B6D76] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#1F2024]">{hub.city}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFF2EE] text-[#FF6B4A]">
                          {hub.district}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8E909A]">{hub.state}</div>
                    </div>
                    <span className="text-[10px] text-[#8E909A] shrink-0 ml-2">{hub.deliveries.length} stops</span>
                  </button>
                ))}
              </div>
            </div>

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
