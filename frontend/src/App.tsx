import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Navigation/Sidebar';
import type { NavTab } from './components/Navigation/Sidebar';
import { Navbar } from './components/Navigation/Navbar';
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
} from './types';
import { DEMO_DEPOT, DEMO_VEHICLES, DEMO_DELIVERIES } from './data/demoData';
import {
  checkBackendHealth,
  fetchDemoData,
  optimizeRoutes,
  optimizeClassical,
  optimizeQiskit,
  compareSolvers,
} from './services/optimizerService';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [depot, setDepot] = useState<Depot>(DEMO_DEPOT);
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEMO_VEHICLES);
  const [deliveries, setDeliveries] = useState<Delivery[]>(DEMO_DELIVERIES);

  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check Backend & Load Initial Data on Mount
  useEffect(() => {
    const initApp = async () => {
      const health = await checkBackendHealth();
      setBackendOnline(health.online);

      if (health.online) {
        const demo = await fetchDemoData();
        setDepot(demo.depot);
        setVehicles(demo.vehicles);
        setDeliveries(demo.deliveries);
      }

      // Automatically generate initial routes so dashboard is populated on first view
      const initialReq: OptimizationRequest = {
        depot: DEMO_DEPOT,
        vehicles: DEMO_VEHICLES,
        deliveries: DEMO_DELIVERIES,
        objective: 'balanced',
        traffic_level: 'moderate',
        time_window_mode: 'soft',
        capacity_mode: 'strict',
        solver_type: 'classical',
      };

      try {
        const comp = await compareSolvers(initialReq);
        setComparisonResult(comp);
        setOptimizationResult(comp.classical || comp.quantum_inspired);
      } catch (err) {
        console.error('Initial route solve error:', err);
      }
    };

    initApp();
  }, []);

  // Handler: Run Optimization
  const handleRunOptimization = async (req?: OptimizationRequest) => {
    setIsOptimizing(true);
    const optimizationReq: OptimizationRequest = req || {
      depot,
      vehicles,
      deliveries,
      objective: 'balanced',
      traffic_level: 'moderate',
      time_window_mode: 'soft',
      capacity_mode: 'strict',
      solver_type: deliveries.length <= 6 ? 'qiskit' : 'classical',
    };

    // Multi-stage animation pause
    await new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      let result: OptimizationResult;
      if (
        optimizationReq.solver_type === 'classical' ||
        optimizationReq.solver_type === 'classical_baseline'
      ) {
        result = await optimizeClassical(optimizationReq);
      } else if (optimizationReq.solver_type === 'qiskit') {
        result = await optimizeQiskit(optimizationReq);
      } else {
        result = await optimizeRoutes(optimizationReq);
      }

      setOptimizationResult(result);

      // Comparative benchmark
      try {
        const comp = await compareSolvers(optimizationReq);
        setComparisonResult(comp);
      } catch (err) {
        console.warn('Comparison calculation skipped:', err);
      }

      showToast(`Optimization complete! Solver: ${result.solver_name}`);
      setCurrentTab('results');
    } catch (err: any) {
      console.error('Optimization error:', err);
      showToast(err?.message || 'Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Handler: Load Demo Data (25 stops)
  const handleLoadDemo = () => {
    setDepot(DEMO_DEPOT);
    setVehicles(DEMO_VEHICLES);
    setDeliveries(DEMO_DELIVERIES);
    showToast('Loaded 25 realistic San Francisco delivery stops & 5 fleet vehicles.');
  };

  // Handler: Load Quantum Demo Data (4 stops)
  const handleLoadQuantumDemo = async () => {
    try {
      const demo = await fetchDemoData();
      if (demo.quantum_demo) {
        setDepot(demo.quantum_demo.depot);
        setVehicles(demo.quantum_demo.vehicles);
        setDeliveries(demo.quantum_demo.deliveries);
        showToast('Loaded Quantum Demo: 4 stops & 2 vehicles for Qiskit Aer simulation.');
        return;
      }
    } catch {
      // fallback
    }
    setDepot(DEMO_DEPOT);
    setVehicles(DEMO_VEHICLES.slice(0, 2));
    setDeliveries(DEMO_DELIVERIES.slice(0, 4));
    showToast('Loaded Quantum Demo: 4 stops & 2 vehicles for Qiskit Aer simulation.');
  };

  // Delivery CRUD
  const handleAddDelivery = (d: Delivery) => {
    setDeliveries((prev) => [d, ...prev]);
    showToast(`Added delivery stop ${d.id}: ${d.customer_name}`);
  };

  const handleUpdateDelivery = (d: Delivery) => {
    setDeliveries((prev) => prev.map((item) => (item.id === d.id ? d : item)));
    showToast(`Updated delivery ${d.id}`);
  };

  const handleDeleteDelivery = (id: string) => {
    setDeliveries((prev) => prev.filter((item) => item.id !== id));
    showToast(`Deleted delivery stop ${id}`);
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

  return (
    <div className="min-h-screen fluid-glass-bg text-slate-100 flex relative selection:bg-[#ff2a3a] selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded-full fluid-glass-pill fluid-glass-pill-violet text-white font-bold text-xs shadow-2xl border border-red-400/40 animate-in slide-in-from-top-4 backdrop-blur-xl">
          ✨ {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLoadDemo={handleLoadDemo}
        onLoadQuantumDemo={handleLoadQuantumDemo}
        onQuickOptimize={() => handleRunOptimization()}
        backendOnline={backendOnline}
        totalDeliveries={deliveries.length}
        totalVehicles={vehicles.length}
        isOptimized={!!optimizationResult}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Sticky Navbar Header */}
        <Navbar
          currentTab={currentTab}
          onOpenMobile={() => setIsOpenMobile(true)}
          isOptimized={!!optimizationResult}
          onOptimizeClick={() => handleRunOptimization()}
          isOptimizing={isOptimizing}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
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
              onLoadQuantumDemo={handleLoadQuantumDemo}
              onLoadFullDemo={handleLoadDemo}
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
        </main>
      </div>
    </div>
  );
};

export default App;
