import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNavbar } from './components/Navigation/TopNavbar';
import type { NavTab } from './components/Navigation/TopNavbar';
import { OptimizationModal } from './components/Optimization/OptimizationModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { OptimizationPage } from './pages/OptimizationPage';
import { ResultsPage } from './pages/ResultsPage';
import { QuantumAIPage } from './pages/QuantumAIPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

import type {
  Depot,
  Vehicle,
  Delivery,
  OptimizationResult,
  ComparisonResult,
  OptimizationRequest,
  TrafficStatus,
} from './types';
import { DEMO_DEPOT, DEMO_VEHICLES, DEMO_DELIVERIES, INDIA_HUBS } from './data/demoData';
import { resolveDistrictHub } from './data/indiaDistricts';
import {
  checkBackendHealth,
  fetchDemoData,
  optimizeWithMethod,
  optimizeQiskit,
  compareSolvers,
  compareLocalSolvers,
  solveLocalOptimization,
  makeMetrics,
  fetchTrafficStatus,
  refreshLiveTraffic,
} from './services/optimizerService';

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const App: React.FC = () => {
  // TWO DISTINCT EXPERIENCES: 'landing' (public site) vs 'app' (optimizer application)
  const [experienceMode, setExperienceMode] = useState<'landing' | 'app'>('landing');

  // Application Tab State
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [selectedHubKey, setSelectedHubKey] = useState<string>('bengaluru');
  const [depot, setDepot] = useState<Depot>(DEMO_DEPOT);
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEMO_VEHICLES);
  const [deliveries, setDeliveries] = useState<Delivery[]>(DEMO_DELIVERIES);

  // Shared persistent optimization state (restored across tab navigation and browser refresh)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(() => {
    try {
      const saved = sessionStorage.getItem('routeq_optimization_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(() => {
    try {
      const saved = sessionStorage.getItem('routeq_comparison_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [optimizationError, setOptimizationError] = useState<string | null>(null);

  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [showOptimizationModal, setShowOptimizationModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [trafficStatus, setTrafficStatus] = useState<TrafficStatus>({
    status: 'traffic_unavailable',
    provider: 'Mappls',
    is_live: false,
    message: 'Live traffic data is currently unavailable.',
  });
  const [isRefreshingTraffic, setIsRefreshingTraffic] = useState<boolean>(false);

  // Sync optimization results to sessionStorage for resilient navigation
  useEffect(() => {
    if (optimizationResult) {
      try {
        sessionStorage.setItem('routeq_optimization_result', JSON.stringify(optimizationResult));
      } catch {
        // ignore storage errors
      }
    }
    if (comparisonResult) {
      try {
        sessionStorage.setItem('routeq_comparison_result', JSON.stringify(comparisonResult));
      } catch {
        // ignore
      }
    }
  }, [optimizationResult, comparisonResult]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check Backend, Traffic Service & Pre-solve initial routes on mount if not already present
  useEffect(() => {
    const initApp = async () => {
      const health = await checkBackendHealth();
      setBackendOnline(health.online);

      if (health.online) {
        const demo = await fetchDemoData();
        setDepot(demo.depot);
        setVehicles(demo.vehicles);
        setDeliveries(demo.deliveries);

        const tr = await fetchTrafficStatus();
        setTrafficStatus(tr);
      }

      // If already restored from sessionStorage, do not re-solve
      if (optimizationResult) return;

      const initialReq: OptimizationRequest = {
        depot: DEMO_DEPOT,
        vehicles: DEMO_VEHICLES,
        deliveries: DEMO_DELIVERIES,
        objective: 'balanced',
        traffic_level: 'moderate',
        time_window_mode: 'soft',
        capacity_mode: 'strict',
        solver_type: 'qiskit',
        use_live_traffic: false,
        allow_non_traffic_fallback: true,
      };

      try {
        console.log('[RouteQ Init] Running initial optimization via /api/optimize...');
        const res = await optimizeWithMethod(initialReq);
        setOptimizationResult(res);
        setOptimizationError(null);

        const unopt = solveLocalOptimization(initialReq, 'unoptimized');
        const comp: ComparisonResult = {
          classical: res,
          quantum_inspired: res,
          improvements_over_classical: makeMetrics(res, res),
          improvements_over_unoptimized: makeMetrics(unopt, res),
          unoptimized_summary: {
            total_distance_km: unopt.total_distance_km,
            total_time_mins: unopt.total_time_mins,
            total_fuel_l: unopt.total_fuel_l,
            total_co2_kg: unopt.total_co2_kg,
            late_deliveries_count: unopt.late_deliveries_count,
            fleet_utilization_pct: unopt.fleet_utilization_pct,
          },
          summary_analysis: `Initial optimization completed. Solver: ${res.solver?.name || res.solver_type}. Total distance: ${res.total_distance_km} km.`,
        };
        setComparisonResult(comp);
      } catch (err) {
        console.warn('[RouteQ Init] Initial solve failed, using local fallback:', err);
        const fallback = compareLocalSolvers(initialReq);
        setComparisonResult(fallback);
        setOptimizationResult(fallback.quantum_inspired);
      }
    };

    initApp();
  }, []);

  // Handler: Transition into Application
  const handleLaunchOptimizer = (tab: NavTab = 'overview') => {
    setExperienceMode('app');
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handler: Run Optimization Sequence
  // Uses the FULL current depot/vehicles/deliveries from state.
  // Respects solver_type from the OptimizationPage UI.
  // Clears previous result immediately so the map shows a loading/empty state.
  const handleRunOptimization = async (req?: OptimizationRequest) => {
    setIsOptimizing(true);
    setOptimizationError(null);
    setShowOptimizationModal(true);

    // ─── Capture BEFORE baseline for savings comparison ───────────────────
    const baselineResult = optimizationResult;

    // ─── CRITICAL: Clear old result so map + metrics reset immediately ────
    setOptimizationResult(null);
    // Also clear sessionStorage so stale data doesn't persist on error
    try { sessionStorage.removeItem('routeq_optimization_result'); } catch { /* ignore */ }

    // ─── Build the optimization request from current app state ────────────
    const optimizationReq: OptimizationRequest = req || {
      depot,
      vehicles,
      deliveries,
      objective: 'balanced',
      traffic_level: 'moderate',
      time_window_mode: 'soft',
      capacity_mode: 'strict',
      solver_type: 'qiskit',
      use_live_traffic: false,
      allow_non_traffic_fallback: true,
    };

    const solverLabel = optimizationReq.solver_type === 'classical'
      ? 'Classical Clarke-Wright'
      : 'Qiskit QAOA';

    try {
      console.log(`[RouteQ] Running ${solverLabel} optimizer — ${optimizationReq.deliveries.length} stops, ${optimizationReq.vehicles.length} vehicles`);

      // ─── Call unified backend endpoint (respects solver_type) ──────────
      const res = await optimizeWithMethod(optimizationReq);

      console.log(`[RouteQ] Optimization done: ${res.total_distance_km}km, ${res.routes.length} routes, solver: ${res.solver?.name || res.solver_type}`);

      setOptimizationResult(res);
      setOptimizationError(null);

      // ─── Compute before/after improvements ─────────────────────────────
      const unopt = baselineResult || solveLocalOptimization(optimizationReq, 'unoptimized');
      const comp: ComparisonResult = {
        classical: res,
        quantum_inspired: res,
        improvements_over_classical: makeMetrics(unopt, res),
        improvements_over_unoptimized: makeMetrics(unopt, res),
        unoptimized_summary: {
          total_distance_km: unopt.total_distance_km,
          total_time_mins: unopt.total_time_mins,
          total_fuel_l: unopt.total_fuel_l,
          total_co2_kg: unopt.total_co2_kg,
          late_deliveries_count: unopt.late_deliveries_count,
          fleet_utilization_pct: unopt.fleet_utilization_pct,
        },
        summary_analysis: `${solverLabel} optimization completed. ${res.routes.length} routes, ${res.total_distance_km} km total. Solver: ${res.solver?.name || res.solver_type}. Execution: ${res.execution_time_ms}ms.`,
      };
      setComparisonResult(comp);

      showToast(`✓ Optimization complete: ${res.routes.length} routes · ${res.total_distance_km} km · ${res.solver?.name || solverLabel}`);
      setCurrentTab('routes');
    } catch (err: any) {
      console.error('[RouteQ] Optimization failed:', err);
      const errMsg = err?.message || 'Failed to execute optimization';
      setOptimizationError(errMsg);
      // Restore previous result so the page doesn't stay blank
      setOptimizationResult(baselineResult);
      showToast('Optimization error: ' + errMsg);
      setCurrentTab('routes');
    } finally {
      setIsOptimizing(false);
      setShowOptimizationModal(false);
    }
  };

  // Handler: Load Demo Data (Bengaluru 25 stops) then run real optimization
  const handleLoadDemo = () => {
    setDepot(DEMO_DEPOT);
    setVehicles(DEMO_VEHICLES);
    setDeliveries(DEMO_DELIVERIES);
    setSelectedHubKey('bengaluru');
    showToast('Loaded 25 Bengaluru benchmark stops — running optimization...');
    // Trigger real backend optimization with the demo data immediately
    setTimeout(() => {
      handleRunOptimization({
        depot: DEMO_DEPOT,
        vehicles: DEMO_VEHICLES,
        deliveries: DEMO_DELIVERIES,
        objective: 'balanced',
        traffic_level: 'moderate',
        time_window_mode: 'soft',
        capacity_mode: 'strict',
        solver_type: 'qiskit',
        use_live_traffic: false,
        allow_non_traffic_fallback: true,
      });
    }, 50);
  };

  // Handler: Select Specific India Hub — loads data & triggers real backend optimization
  const handleSelectHub = (hubKey: string, stateName?: string, districtName?: string) => {
    let hub = INDIA_HUBS[hubKey];
    if (!hub) {
      hub = resolveDistrictHub(hubKey, stateName, districtName);
    }
    if (hub) {
      const enrichedDepot: Depot = {
        ...hub.depot,
        district: hub.district,
        state: hub.state,
      };
      const enrichedDeliveries: Delivery[] = hub.deliveries.map((del) => ({
        ...del,
        district: del.district || hub.district,
        state: del.state || hub.state,
      }));
      setDepot(enrichedDepot);
      setVehicles(hub.vehicles);
      setDeliveries(enrichedDeliveries);
      setSelectedHubKey(hub.id || hubKey);
      showToast(`Loading ${hub.name} (${hub.district}, ${hub.state}) — optimizing...`);
      // Trigger real backend optimization with hub data
      setTimeout(() => {
        handleRunOptimization({
          depot: enrichedDepot,
          vehicles: hub.vehicles,
          deliveries: enrichedDeliveries,
          objective: 'balanced',
          traffic_level: 'moderate',
          time_window_mode: 'soft',
          capacity_mode: 'strict',
          solver_type: 'qiskit',
          use_live_traffic: false,
          allow_non_traffic_fallback: true,
        });
      }, 50);
    }
  };

  // Delivery CRUD
  const handleAddDelivery = (d: Delivery) => {
    setDeliveries((prev) => [d, ...prev]);
    showToast(`Added stop ${d.id}: ${d.customer_name}`);
  };

  const handleUpdateDelivery = (d: Delivery) => {
    setDeliveries((prev) => prev.map((item) => (item.id === d.id ? d : item)));
    showToast(`Updated stop ${d.id}`);
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveries((prev) => prev.filter((item) => item.id !== id));
    showToast(`Deleted stop ${id}`);
  };

  // Vehicle CRUD
  const handleAddVehicle = (v: Vehicle) => {
    setVehicles((prev) => [...prev, v]);
    showToast(`Added vehicle ${v.id}: ${v.name}`);
  };

  const handleUpdateVehicle = (v: Vehicle) => {
    setVehicles((prev) => prev.map((item) => (item.id === v.id ? v : item)));
    showToast(`Updated vehicle ${v.id}`);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((item) => item.id !== id));
    showToast(`Deleted vehicle ${id}`);
  };

  // Handler: Refresh Live Traffic (Mappls)
  const handleRefreshLiveTraffic = async () => {
    setIsRefreshingTraffic(true);
    try {
      const res = await refreshLiveTraffic(depot, deliveries);
      setTrafficStatus({
        status: res.status as any,
        provider: res.provider || 'Mappls',
        is_live: res.is_live,
        message: res.message,
        last_updated: res.last_updated,
      });

      if (res.is_live) {
        showToast(res.message || `Live traffic updated: ${res.last_updated}`);
        await handleRunOptimization();
      } else {
        showToast(res.message || 'Live traffic data is currently unavailable.');
      }
    } catch {
      setTrafficStatus({
        status: 'traffic_unavailable',
        provider: 'Mappls',
        is_live: false,
        message: 'Live traffic data is currently unavailable.',
      });
      showToast('Live traffic data is currently unavailable.');
    } finally {
      setIsRefreshingTraffic(false);
    }
  };

  // Normalization for canonical active tab
  const activeCanonical = (() => {
    if (currentTab === 'landing' || currentTab === 'dashboard') return 'overview';
    if (currentTab === 'results') return 'routes';
    if (currentTab === 'quantum-ai') return 'technology';
    return currentTab;
  })();

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#202124] flex flex-col font-sans selection:bg-[#FF6B4A]/20 selection:text-[#202124] overflow-x-hidden">
      
      {/* Toast Notification Alert (Warm Ivory Card) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-white text-[#202124] font-mono text-xs shadow-soft-lg border border-[#E8E6DF] flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6-Stage Optimization Progress Modal */}
      <OptimizationModal
        isOpen={showOptimizationModal}
        onClose={() => setShowOptimizationModal(false)}
        optimizationResult={optimizationResult}
        onViewResults={() => {
          setShowOptimizationModal(false);
          setCurrentTab('routes');
        }}
      />

      {/* ─── TWO DISTINCT EXPERIENCES SWITCHER ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        
        {/* EXPERIENCE 1: PUBLIC LANDING PAGE (NO APP CONTROLS / NO NAV TABS) */}
        {experienceMode === 'landing' ? (
          <motion.div
            key="experience-landing"
            initial={{ opacity: 0, filter: 'blur(8px)', y: -12 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', y: -16 }}
            transition={{ duration: 0.55, ease: smoothEase }}
            className="w-full flex-1"
          >
            <LandingPage
              onLaunchOptimizer={() => handleLaunchOptimizer('overview')}
            />
          </motion.div>
        ) : (
          
          /* EXPERIENCE 2: ACTUAL ROUTE OPTIMIZER APPLICATION */
          <motion.div
            key="experience-app"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
            transition={{ duration: 0.55, ease: smoothEase }}
            className="w-full flex-1 flex flex-col"
          >
            {/* Application-Only Floating Navigation Bar */}
            <TopNavbar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              onQuickOptimize={() => handleRunOptimization()}
              onLoadDemo={handleLoadDemo}
              onSelectHub={handleSelectHub}
              selectedHubKey={selectedHubKey}
              isOptimizing={isOptimizing}
              isOptimized={!!optimizationResult}
              backendOnline={backendOnline}
              totalDeliveries={deliveries.length}
              totalVehicles={vehicles.length}
              trafficStatus={trafficStatus}
              onRefreshTraffic={handleRefreshLiveTraffic}
              isRefreshingTraffic={isRefreshingTraffic}
              onExitToLanding={() => {
                setExperienceMode('landing');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            />

            {/* Application Content with 500-650ms Page Blur/Fade/Translate Transitions */}
            <div className="w-full flex-1 pt-20 sm:pt-24 pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCanonical}
                  initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                  transition={{ duration: 0.58, ease: smoothEase }}
                  className="w-full h-full"
                >
                  {activeCanonical === 'overview' && (
                    <DashboardPage
                      depot={depot}
                      vehicles={vehicles}
                      deliveries={deliveries}
                      optimizationResult={optimizationResult}
                      comparisonResult={comparisonResult}
                      onOptimizeClick={() => handleRunOptimization()}
                      onLoadDemo={handleLoadDemo}
                      onNavigateTab={setCurrentTab}
                      isOptimizing={isOptimizing}
                    />
                  )}

                  {activeCanonical === 'routes' && (
                    <ResultsPage
                      depot={depot}
                      deliveries={deliveries}
                      vehicles={vehicles}
                      optimizationResult={optimizationResult}
                      comparisonResult={comparisonResult}
                      optimizationError={optimizationError}
                      onNavigateTab={setCurrentTab}
                      onRunOptimization={handleRunOptimization}
                      isOptimizing={isOptimizing}
                    />
                  )}

                  {activeCanonical === 'vehicles' && (
                    <VehiclesPage
                      vehicles={vehicles}
                      routes={optimizationResult?.routes}
                      onAddVehicle={handleAddVehicle}
                      onUpdateVehicle={handleUpdateVehicle}
                      onDeleteVehicle={handleDeleteVehicle}
                    />
                  )}

                  {activeCanonical === 'optimize' && (
                    <OptimizationPage
                      depot={depot}
                      vehicles={vehicles}
                      deliveries={deliveries}
                      optimizationResult={optimizationResult}
                      comparisonResult={comparisonResult}
                      isOptimizing={isOptimizing}
                      onRunOptimization={handleRunOptimization}
                      onNavigateTab={setCurrentTab}
                      trafficStatus={trafficStatus}
                      onRefreshTraffic={handleRefreshLiveTraffic}
                      isRefreshingTraffic={isRefreshingTraffic}
                    />
                  )}

                  {activeCanonical === 'analytics' && (
                    <AnalyticsPage
                      optimizationResult={optimizationResult}
                      comparisonResult={comparisonResult}
                      vehicles={vehicles}
                    />
                  )}

                  {activeCanonical === 'technology' && (
                    <QuantumAIPage
                      optimizationResult={optimizationResult}
                      comparisonResult={comparisonResult}
                    />
                  )}

                  {activeCanonical === 'deliveries' && (
                    <DeliveriesPage
                      deliveries={deliveries}
                      onAddDelivery={handleAddDelivery}
                      onUpdateDelivery={handleUpdateDelivery}
                      onDeleteDelivery={handleDeleteDelivery}
                      onResetDemo={handleLoadDemo}
                    />
                  )}

                  {activeCanonical === 'settings' && (
                    <SettingsPage
                      depot={depot}
                      onUpdateDepot={setDepot}
                      onResetAllData={handleLoadDemo}
                      backendOnline={backendOnline}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default App;
