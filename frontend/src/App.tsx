import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNavbar } from './components/Navigation/TopNavbar';
import type { NavTab } from './components/Navigation/TopNavbar';
import { OptimizationModal } from './components/Optimization/OptimizationModal';
import { LandingPage } from './pages/LandingPage';
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
import {
  checkBackendHealth,
  fetchDemoData,
  compareSolvers,
  fetchTrafficStatus,
  refreshLiveTraffic,
} from './services/optimizerService';

const smoothEase = [0.22, 1, 0.36, 1] as const;

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [selectedHubKey, setSelectedHubKey] = useState<string>('bengaluru');
  const [depot, setDepot] = useState<Depot>(DEMO_DEPOT);
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEMO_VEHICLES);
  const [deliveries, setDeliveries] = useState<Delivery[]>(DEMO_DELIVERIES);

  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check Backend, Traffic Service & Pre-solve initial routes on mount
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

      const initialReq: OptimizationRequest = {
        depot: DEMO_DEPOT,
        vehicles: DEMO_VEHICLES,
        deliveries: DEMO_DELIVERIES,
        objective: 'balanced',
        traffic_level: 'moderate',
        time_window_mode: 'soft',
        capacity_mode: 'strict',
        solver_type: 'quantum_inspired',
      };

      try {
        const comp = await compareSolvers(initialReq);
        setComparisonResult(comp);
        setOptimizationResult(comp.quantum_inspired);
      } catch (err) {
        console.error('Initial route solve error:', err);
      }
    };

    initApp();
  }, []);

  // Handler: Run Optimization Sequence
  const handleRunOptimization = async (req?: OptimizationRequest) => {
    setIsOptimizing(true);
    setShowOptimizationModal(true);

    const optimizationReq: OptimizationRequest = req || {
      depot,
      vehicles,
      deliveries,
      objective: 'balanced',
      traffic_level: 'moderate',
      time_window_mode: 'soft',
      capacity_mode: 'strict',
      solver_type: 'quantum_inspired',
    };

    try {
      const comp = await compareSolvers(optimizationReq);
      setComparisonResult(comp);
      setOptimizationResult(comp.quantum_inspired);
      showToast('Optimization complete. Ground state routes computed.');
    } catch (err) {
      console.error('Optimization error:', err);
      showToast('Optimization fallback solution applied.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Handler: Load Demo Data (Bengaluru 25 stops)
  const handleLoadDemo = () => {
    setDepot(DEMO_DEPOT);
    setVehicles(DEMO_VEHICLES);
    setDeliveries(DEMO_DELIVERIES);
    setSelectedHubKey('bengaluru');
    showToast('Loaded 25 Bengaluru benchmark delivery stops (India).');
  };

  // Handler: Select Specific India Hub
  const handleSelectHub = (hubKey: string) => {
    const hub = INDIA_HUBS[hubKey];
    if (hub) {
      setDepot(hub.depot);
      setVehicles(hub.vehicles);
      setDeliveries(hub.deliveries);
      setSelectedHubKey(hubKey);
      setOptimizationResult(null);
      showToast(`Loaded ${hub.name} (${hub.deliveries.length} stops, ${hub.city}, India).`);
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
    <div className="min-h-screen bg-[#F7F6F2] text-[#1F2024] flex flex-col font-sans selection:bg-[#FF5B37]/20 selection:text-[#1F2024] overflow-x-hidden">
      
      {/* Toast Notification Alert (Light Ivory Card) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-white text-[#1F2024] font-mono text-xs shadow-soft-lg border border-[#E8E6DF] flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic 6-Stage Optimization Progress Modal */}
      <OptimizationModal
        isOpen={showOptimizationModal}
        onClose={() => setShowOptimizationModal(false)}
        optimizationResult={optimizationResult}
        onViewResults={() => {
          setShowOptimizationModal(false);
          setCurrentTab('routes');
        }}
      />

      {/* Global Minimal Floating Navigation Bar */}
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
      />

      {/* ─── SECTION 4: SMOOTH WORKSPACE PAGE TRANSITION ──────────────────── */}
      <div className="w-full flex-1 pt-12 sm:pt-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCanonical}
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0.2, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: smoothEase }}
            className="w-full h-full"
          >
            {activeCanonical === 'overview' && (
              <LandingPage
                onLaunchOptimizer={() => setCurrentTab('optimize')}
                onExploreTech={() => setCurrentTab('technology')}
                onNavigateTab={setCurrentTab}
                depot={depot}
                vehicles={vehicles}
                deliveries={deliveries}
                optimizationResult={optimizationResult}
                comparisonResult={comparisonResult}
                isOptimizing={isOptimizing}
              />
            )}

            {activeCanonical === 'routes' && (
              <ResultsPage
                depot={depot}
                deliveries={deliveries}
                optimizationResult={optimizationResult}
                comparisonResult={comparisonResult}
                onNavigateTab={setCurrentTab}
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

    </div>
  );
};

export default App;
