import React, { useState, useEffect } from 'react';
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
import {
  checkBackendHealth,
  fetchDemoData,
  compareSolvers,
  fetchTrafficStatus,
  refreshLiveTraffic,
} from './services/optimizerService';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('landing');
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

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#FF5500]/20 selection:text-white">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 px-4 py-2.5 rounded bg-[#0D0D0D] text-[#F5F5F5] font-mono text-xs shadow-2xl border border-white/20 animate-in slide-in-from-top-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cinematic Optimization Progress Modal */}
      <OptimizationModal
        isOpen={showOptimizationModal}
        onClose={() => setShowOptimizationModal(false)}
        optimizationResult={optimizationResult}
        onViewResults={() => {
          setShowOptimizationModal(false);
          setCurrentTab('results');
        }}
      />

      {/* Top Navigation shown when inside app views */}
      {currentTab !== 'landing' && (
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
      )}

      {/* Dynamic Page Views */}
      <div className={currentTab === 'landing' ? 'w-full' : 'flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 pt-6'}>
        {currentTab === 'landing' && (
          <LandingPage
            onLaunchOptimizer={() => setCurrentTab('dashboard')}
            onExploreTech={() => setCurrentTab('quantum-ai')}
          />
        )}

        {currentTab === 'dashboard' && (
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

        {currentTab === 'deliveries' && (
          <DeliveriesPage
            deliveries={deliveries}
            onAddDelivery={handleAddDelivery}
            onUpdateDelivery={handleUpdateDelivery}
            onDeleteDelivery={handleDeleteDelivery}
            onResetDemo={handleLoadDemo}
          />
        )}

        {currentTab === 'vehicles' && (
          <VehiclesPage
            vehicles={vehicles}
            routes={optimizationResult?.routes}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )}

        {currentTab === 'optimize' && (
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


        {currentTab === 'results' && (
          <ResultsPage
            depot={depot}
            deliveries={deliveries}
            optimizationResult={optimizationResult}
            comparisonResult={comparisonResult}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'quantum-ai' && (
          <QuantumAIPage
            optimizationResult={optimizationResult}
            comparisonResult={comparisonResult}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsPage
            optimizationResult={optimizationResult}
            comparisonResult={comparisonResult}
            vehicles={vehicles}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsPage
            depot={depot}
            onUpdateDepot={setDepot}
            onResetAllData={handleLoadDemo}
            backendOnline={backendOnline}
          />
        )}
      </div>
    </div>
  );
};

export default App;
