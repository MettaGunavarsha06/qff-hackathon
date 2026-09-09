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
  Building2,
  ChevronRight,
} from 'lucide-react';
import type { TrafficStatus } from '../../types';
import {
  indiaLocations,
  TOTAL_STATES_COUNT,
  TOTAL_UT_COUNT,
  TOTAL_DISTRICTS_COUNT,
  searchIndiaLocations,
  findStateOrUT,
  getAllDistrictsList,
  type StateInfo,
  type DistrictInfo,
} from '../../data/indiaLocations';
import { resolveDistrictHub } from '../../data/indiaDistricts';

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
  onSelectState?: (stateName: string) => void;
  selectedHubKey?: string;
  selectedStateName?: string;
  selectedDistrictName?: string;
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
  onLoadDemo: _onLoadDemo,
  onSelectHub,
  onSelectState,
  selectedHubKey = 'bengaluru',
  selectedStateName = 'Karnataka',
  selectedDistrictName = 'Bengaluru Urban',
  isOptimizing = false,
  trafficStatus,
  onExitToLanding,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [hubSearch, setHubSearch] = useState<string>('');
  const [hubTab, setHubTab] = useState<'states' | 'uts' | 'all_districts'>('states');
  const [drilledDownState, setDrilledDownState] = useState<StateInfo | null>(null);

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

  const currentHub = resolveDistrictHub(selectedHubKey, selectedStateName, selectedDistrictName);
  const displayDistrict = selectedDistrictName || currentHub?.district || 'Bengaluru Urban';
  const displayState = selectedStateName || currentHub?.state || 'Karnataka';

  // Handle drilling into a state/UT
  const handleStateClick = (state: StateInfo) => {
    setDrilledDownState(state);
    setHubSearch('');
    onSelectState?.(state.name);
    window.dispatchEvent(
      new CustomEvent('routeq_map_flyto', {
        detail: {
          lat: state.lat,
          lng: state.lng,
          zoom: state.isUT ? 10 : 7,
        },
      })
    );
  };

  // Handle clicking a specific district
  const handleDistrictClick = (districtName: string, stateName: string) => {
    const dynamicHubKey = `hub-${districtName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    onSelectHub?.(dynamicHubKey, stateName, districtName);

    // Look up district coordinates
    const stateObj = findStateOrUT(stateName);
    const distObj = stateObj?.districts.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase() ||
             (d.alias && d.alias.toLowerCase().includes(districtName.toLowerCase()))
    );

    const lat = distObj ? distObj.lat : 12.9716;
    const lng = distObj ? distObj.lng : 77.5946;

    window.dispatchEvent(
      new CustomEvent('routeq_map_flyto', {
        detail: { lat, lng, zoom: 13 },
      })
    );

    setHubDropdownOpen(false);
    setHubSearch('');
  };

  const searchResults = hubSearch.trim() ? searchIndiaLocations(hubSearch) : [];
  const allDistrictsList = hubTab === 'all_districts' ? getAllDistrictsList() : [];

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

        {/* Right Actions: Location Selector, Live Traffic & Run Optimization */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Location Selector (States -> Districts) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => {
                setHubDropdownOpen(!hubDropdownOpen);
                setHubSearch('');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F6F3EC] hover:bg-[#EFEFEB] border border-[#E8E6DF] text-xs font-mono text-[#202124] transition-colors cursor-pointer shadow-xs"
              title="Select Location (States & Districts of India)"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                {displayDistrict ? (
                  <>
                    <span className="font-bold text-[11px] text-[#1F2024] truncate max-w-[120px] sm:max-w-[160px]">
                      {displayDistrict}
                    </span>
                    <span className="text-[9px] text-[#8E909A] truncate max-w-[120px] sm:max-w-[160px]">
                      {displayState || 'India'}
                    </span>
                  </>
                ) : displayState ? (
                  <>
                    <span className="font-bold text-[11px] text-[#1F2024] truncate max-w-[120px] sm:max-w-[160px]">
                      {displayState}
                    </span>
                    <span className="text-[9px] text-[#8E909A]">India</span>
                  </>
                ) : (
                  <span className="font-bold text-[11px] text-[#1F2024]">India</span>
                )}
              </div>
              <ChevronDown
                className={`w-3 h-3 text-[#6B6D76] transition-transform duration-200 ${
                  hubDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {hubDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-10 w-84 sm:w-[410px] bg-white border border-[#E8E6DF] rounded-2xl shadow-soft-xl p-3 z-50 text-xs font-mono"
                >
                  {/* Top Header: Tabs OR Breadcrumb / Back Button */}
                  {!drilledDownState ? (
                    <div className="flex items-center gap-1 p-0.5 bg-[#F6F3EC] rounded-xl mb-2 text-[10px]">
                      <button
                        onClick={() => {
                          setHubTab('states');
                          setHubSearch('');
                        }}
                        className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center font-medium ${
                          hubTab === 'states'
                            ? 'bg-white text-[#202124] shadow-xs font-bold'
                            : 'text-[#6B6D76] hover:text-[#202124]'
                        }`}
                      >
                        States ({TOTAL_STATES_COUNT})
                      </button>
                      <button
                        onClick={() => {
                          setHubTab('uts');
                          setHubSearch('');
                        }}
                        className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center font-medium ${
                          hubTab === 'uts'
                            ? 'bg-white text-[#202124] shadow-xs font-bold'
                            : 'text-[#6B6D76] hover:text-[#202124]'
                        }`}
                      >
                        Union Territories ({TOTAL_UT_COUNT})
                      </button>
                      <button
                        onClick={() => {
                          setHubTab('all_districts');
                          setHubSearch('');
                        }}
                        className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center font-medium ${
                          hubTab === 'all_districts'
                            ? 'bg-white text-[#202124] shadow-xs font-bold'
                            : 'text-[#6B6D76] hover:text-[#202124]'
                        }`}
                      >
                        All Districts
                      </button>
                    </div>
                  ) : (
                    /* Drilldown Header & Breadcrumb when inside a State or UT */
                    <div className="mb-2.5 pb-2 border-b border-[#F2F1EC] space-y-1.5">
                      {/* Back Navigation Button */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            setDrilledDownState(null);
                            setHubSearch('');
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#FF6B4A] hover:text-[#FF5B37] px-2 py-1 rounded-lg hover:bg-[#FFF2EE] transition-colors cursor-pointer"
                          title="Back to parent list without closing dropdown"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>← Back to {drilledDownState.isUT ? 'Union Territories' : 'States'}</span>
                        </button>

                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F6F3EC] text-[#6B6D76] font-semibold">
                          {drilledDownState.districts.length} districts
                        </span>
                      </div>

                      {/* Breadcrumb Hierarchy */}
                      <div className="flex items-center gap-1 text-[10px] px-1 text-[#8E909A]">
                        <span
                          onClick={() => {
                            setDrilledDownState(null);
                            setHubSearch('');
                          }}
                          className="cursor-pointer hover:text-[#202124] hover:underline"
                        >
                          India
                        </span>
                        <span>→</span>
                        <span className="font-semibold text-[#202124]">{drilledDownState.name}</span>
                        {selectedDistrictName && selectedStateName === drilledDownState.name && (
                          <>
                            <span>→</span>
                            <span className="font-bold text-[#FF6B4A]">{selectedDistrictName}</span>
                          </>
                        )}
                      </div>

                      {/* Current State Title & District Count */}
                      <div className="px-1 text-[11px] flex items-center justify-between text-[#6B6D76]">
                        <span className="font-bold text-[#1F2024] text-xs">
                          {drilledDownState.name} Districts ({drilledDownState.districts.length})
                        </span>
                        <span className="text-[9px] text-[#8E909A]">Capital: {drilledDownState.capital}</span>
                      </div>
                    </div>
                  )}

                  {/* Search input */}
                  <div className="relative mb-2 px-0.5">
                    <input
                      type="text"
                      value={hubSearch}
                      onChange={(e) => setHubSearch(e.target.value)}
                      placeholder={
                        drilledDownState
                          ? `Search ${drilledDownState.name} districts...`
                          : `Search states, districts...`
                      }
                      className="w-full px-2.5 py-1.5 pl-7 pr-7 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-[11px] text-[#202124] focus:outline-none focus:border-[#FF6B4A]"
                      autoFocus
                    />
                    <Search className="w-3.5 h-3.5 text-[#8E909A] absolute left-2.5 top-2 pointer-events-none" />
                    {hubSearch && (
                      <button
                        onClick={() => setHubSearch('')}
                        className="absolute right-2.5 top-2 text-[#8E909A] hover:text-[#202124] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* CONTENT VIEW 1: SEARCH ACTIVE */}
                  {hubSearch.trim() ? (
                    <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
                      {drilledDownState ? (
                        // Search inside currently drilled-down state
                        drilledDownState.districts
                          .filter((d) =>
                            d.name.toLowerCase().includes(hubSearch.toLowerCase().trim()) ||
                            (d.alias && d.alias.toLowerCase().includes(hubSearch.toLowerCase().trim()))
                          )
                          .map((dist) => {
                            const isCurrent =
                              displayDistrict.toLowerCase() === dist.name.toLowerCase() &&
                              displayState.toLowerCase() === drilledDownState.name.toLowerCase();

                            return (
                              <button
                                key={dist.name}
                                onClick={() => handleDistrictClick(dist.name, drilledDownState.name)}
                                className={`w-full text-left px-2.5 py-2 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                  isCurrent
                                    ? 'border-[#FF6B4A] bg-[#FFF2EE] text-[#FF6B4A] font-bold shadow-xs'
                                    : 'border-[#E8E6DF] hover:bg-[#FAF9F6] text-[#202124] hover:border-[#FF6B4A]/40'
                                }`}
                              >
                                <div className="truncate pr-2">
                                  <div className="font-semibold text-[#1F2024]">{dist.name}</div>
                                  <div className="text-[10px] text-[#8E909A]">{drilledDownState.name}</div>
                                </div>
                                <span className="text-[9px] text-[#FF6B4A] font-bold shrink-0">
                                  {isCurrent ? '● Active' : 'Dispatch Hub'}
                                </span>
                              </button>
                            );
                          })
                      ) : searchResults.length > 0 ? (
                        // Global search results across States, UTs, and Districts
                        searchResults.map((res) => {
                          if (res.type === 'state' || res.type === 'ut') {
                            const stateObj = res.item as StateInfo;
                            return (
                              <button
                                key={`res-${stateObj.name}`}
                                onClick={() => handleStateClick(stateObj)}
                                className="w-full text-left px-2.5 py-2 rounded-xl border border-[#E8E6DF] hover:bg-[#FAF9F6] hover:border-[#FF6B4A]/40 text-[#202124] flex items-center justify-between transition-colors cursor-pointer"
                              >
                                <div>
                                  <div className="font-bold text-[#1F2024] flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#FF6B4A]" />
                                    <span>{stateObj.name}</span>
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F6F3EC] text-[#6B6D76] font-normal">
                                      {stateObj.isUT ? 'Union Territory' : 'State'}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[#8E909A] ml-5">
                                    Capital: {stateObj.capital} · {stateObj.districts.length} districts
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-[#FF6B4A] font-semibold shrink-0">
                                  <span>View Districts</span>
                                  <ChevronRight className="w-3 h-3" />
                                </div>
                              </button>
                            );
                          }

                          // District match
                          const distObj = res.item as DistrictInfo;
                          const isCurrent =
                            displayDistrict.toLowerCase() === distObj.name.toLowerCase() &&
                            displayState.toLowerCase() === distObj.state.toLowerCase();

                          return (
                            <button
                              key={`res-dist-${distObj.state}-${distObj.name}`}
                              onClick={() => handleDistrictClick(distObj.name, distObj.state)}
                              className={`w-full text-left px-2.5 py-2 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'border-[#FF6B4A] bg-[#FFF2EE] text-[#FF6B4A] font-bold shadow-xs'
                                  : 'border-[#E8E6DF] hover:bg-[#FAF9F6] text-[#202124] hover:border-[#FF6B4A]/40'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <div className="font-semibold text-[#1F2024] flex items-center gap-1.5">
                                  <span>{distObj.name}</span>
                                  {distObj.alias && (
                                    <span className="text-[9px] text-[#8E909A] font-normal">({distObj.alias})</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#8E909A]">{distObj.state}</div>
                              </div>
                              <span className="text-[9px] text-[#FF6B4A] font-bold shrink-0">
                                {isCurrent ? '● Active' : 'Dispatch'}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-[#8E909A] text-[11px]">
                          No states or districts matching &quot;{hubSearch}&quot;
                        </div>
                      )}
                    </div>
                  ) : drilledDownState ? (
                    /* CONTENT VIEW 2: STATE DRILLDOWN (DISTRICTS OF THIS STATE) */
                    <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
                      {drilledDownState.districts.map((dist) => {
                        const isCurrent =
                          displayDistrict.toLowerCase() === dist.name.toLowerCase() &&
                          displayState.toLowerCase() === drilledDownState.name.toLowerCase();

                        return (
                          <button
                            key={dist.name}
                            onClick={() => handleDistrictClick(dist.name, drilledDownState.name)}
                            className={`w-full text-left px-2.5 py-2 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'border-[#FF6B4A] bg-[#FFF2EE] text-[#FF6B4A] font-bold shadow-xs'
                                : 'border-[#E8E6DF] bg-[#FAFAF8] hover:bg-[#FAF9F6] text-[#202124] hover:border-[#FF6B4A]/40'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="font-semibold text-[#1F2024] flex items-center gap-1.5">
                                <span>{dist.name}</span>
                                {dist.alias && (
                                  <span className="text-[9px] text-[#8E909A] font-normal">({dist.alias})</span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#8E909A]">
                                {dist.lat.toFixed(4)}°N, {dist.lng.toFixed(4)}°E
                              </div>
                            </div>
                            <span className="text-[9px] text-[#FF6B4A] font-bold shrink-0">
                              {isCurrent ? '● Active' : 'Dispatch Hub'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : hubTab === 'states' ? (
                    /* CONTENT VIEW 3: 28 STATES LIST */
                    <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
                      {indiaLocations.states.map((state) => {
                        const isCurrent = displayState.toLowerCase() === state.name.toLowerCase();
                        return (
                          <button
                            key={state.name}
                            onClick={() => handleStateClick(state)}
                            className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'border-[#FF6B4A] bg-[#FFF8F5] text-[#202124] shadow-xs'
                                : 'border-[#E8E6DF] hover:bg-[#FAF9F6] text-[#202124] hover:border-[#FF6B4A]/40'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-[#1F2024] flex items-center gap-1.5">
                                <span>{state.name}</span>
                                <span className="text-[9px] text-[#8E909A] font-normal">({state.code})</span>
                              </div>
                              <div className="text-[10px] text-[#8E909A]">
                                Capital: {state.capital}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F6F3EC] text-[#FF6B4A] font-bold">
                                {state.districts.length} districts
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#8E909A]" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : hubTab === 'uts' ? (
                    /* CONTENT VIEW 4: 8 UNION TERRITORIES LIST */
                    <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
                      {indiaLocations.unionTerritories.map((ut) => {
                        const isCurrent = displayState.toLowerCase() === ut.name.toLowerCase();
                        return (
                          <button
                            key={ut.name}
                            onClick={() => handleStateClick(ut)}
                            className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'border-[#FF6B4A] bg-[#FFF8F5] text-[#202124] shadow-xs'
                                : 'border-[#E8E6DF] hover:bg-[#FAF9F6] text-[#202124] hover:border-[#FF6B4A]/40'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-[#1F2024] flex items-center gap-1.5">
                                <span>{ut.name}</span>
                                <span className="text-[9px] text-[#8E909A] font-normal">({ut.code})</span>
                              </div>
                              <div className="text-[10px] text-[#8E909A]">
                                Capital: {ut.capital}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#F6F3EC] text-[#FF6B4A] font-bold">
                                {ut.districts.length} districts
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#8E909A]" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* CONTENT VIEW 5: ALL DISTRICTS ACROSS INDIA */
                    <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5">
                      {allDistrictsList.map((dist) => {
                        const isCurrent =
                          displayDistrict.toLowerCase() === dist.name.toLowerCase() &&
                          displayState.toLowerCase() === dist.state.toLowerCase();

                        return (
                          <button
                            key={`${dist.state}-${dist.name}`}
                            onClick={() => handleDistrictClick(dist.name, dist.state)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? 'border-[#FF6B4A] bg-[#FFF2EE] text-[#FF6B4A] font-bold'
                                : 'border-[#E8E6DF] hover:bg-[#FAF9F6] text-[#202124] hover:border-[#FF6B4A]/30'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <span className="font-semibold text-[#1F2024]">{dist.name}</span>
                              <span className="text-[9px] text-[#8E909A] ml-2">
                                {dist.state} {dist.isUT ? '(UT)' : ''}
                              </span>
                            </div>
                            <span className="text-[9px] text-[#FF6B4A] font-bold shrink-0">
                              {isCurrent ? '● Selected' : 'Dispatch'}
                            </span>
                          </button>
                        );
                      })}
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
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-xl border border-[#E8E6DF] rounded-2xl shadow-soft-lg p-3 md:hidden space-y-2 z-50 max-h-[85vh] overflow-y-auto font-mono text-xs"
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

            {/* Mobile Location Selector: States -> Districts */}
            <div className="pt-2 border-t border-[#E8E6DF] space-y-1.5">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] text-[#8E909A] uppercase font-bold">
                  {drilledDownState ? `${drilledDownState.name} Districts` : 'India Administrative Locations'}
                </span>
                {drilledDownState && (
                  <button
                    onClick={() => setDrilledDownState(null)}
                    className="text-[10px] text-[#FF6B4A] font-bold"
                  >
                    ← Back to States
                  </button>
                )}
              </div>

              {!drilledDownState ? (
                <div className="max-h-56 overflow-y-auto space-y-1 px-1">
                  <div className="text-[9px] text-[#8E909A] uppercase px-1 font-semibold">States (28)</div>
                  {indiaLocations.states.map((st) => (
                    <button
                      key={st.name}
                      onClick={() => handleStateClick(st)}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl border border-[#E8E6DF] flex items-center justify-between text-xs hover:bg-[#FAF9F6]"
                    >
                      <span className="font-semibold text-[#1F2024]">{st.name}</span>
                      <span className="text-[9px] text-[#FF6B4A] font-bold">{st.districts.length} districts</span>
                    </button>
                  ))}
                  <div className="text-[9px] text-[#8E909A] uppercase px-1 pt-2 font-semibold">Union Territories (8)</div>
                  {indiaLocations.unionTerritories.map((ut) => (
                    <button
                      key={ut.name}
                      onClick={() => handleStateClick(ut)}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl border border-[#E8E6DF] flex items-center justify-between text-xs hover:bg-[#FAF9F6]"
                    >
                      <span className="font-semibold text-[#1F2024]">{ut.name}</span>
                      <span className="text-[9px] text-[#FF6B4A] font-bold">{ut.districts.length} districts</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto space-y-1 px-1">
                  {drilledDownState.districts.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => {
                        handleDistrictClick(d.name, drilledDownState.name);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl border border-[#E8E6DF] flex items-center justify-between text-xs hover:bg-[#FAF9F6]"
                    >
                      <span className="font-medium text-[#1F2024]">{d.name}</span>
                      <span className="text-[9px] text-[#FF6B4A] font-bold">Select</span>
                    </button>
                  ))}
                </div>
              )}
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

