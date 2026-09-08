# RouteQ — Intelligent Vehicle Routing Optimizer
### Hackathon Use Case 04: Last-Mile Delivery and Vehicle Routing Optimization

**RouteQ** is an AI-powered logistics platform engineered to solve the NP-hard **Capacitated Vehicle Routing Problem with Time Windows (CVRPTW)**. It combines **Simulated Quantum Annealing (SQA)** over **Quadratic Unconstrained Binary Optimization (QUBO)** formulations with real-time urban traffic modeling to minimize mileage, delivery duration, fuel burn, and carbon emissions while guaranteeing customer delivery time-window compliance.

---

## 🌟 Key Features

1. **Operations Dashboard**:
   - 6 Live KPI telemetry cards: Active fleet, total stops, optimized mileage, estimated fuel, travel time, and CO2 emissions.
   - Interactive Leaflet dispatch map showing depot hubs, delivery markers, and color-coded vehicle routes.
   - Before vs After comparison bar charts and fleet capacity utilization gauges.

2. **Delivery Management (CRUD)**:
   - Complete CRUD interface for delivery destinations.
   - Configurable package demands (kg), priority levels (`urgent`, `high`, `medium`, `low`), and customer delivery time windows.
   - Quick one-click reload of 25 realistic San Francisco demo stops.

3. **Fleet & Vehicle Management**:
   - Configure vehicle powertrains (`electric`, `hybrid`, `diesel`), payload capacities (kg), fuel efficiencies (km/L), and maximum route thresholds.
   - Real-time post-optimization vehicle utilization gauge bars.

4. **Route Optimization Studio**:
   - **5 Optimization Objectives**: Balanced Multi-Objective, Minimize Distance, Minimize Travel Time, Minimize Fuel, and Minimize CO2 (Green Logistics).
   - **Urban Traffic Levels**: Clear ($1.00\times$), Moderate ($1.28\times$), Heavy ($1.75\times$), Peak Rush Hour ($2.45\times$).
   - **Solver Selection**: Quantum-Inspired SQA (QUBO), Classical Clarke-Wright Savings + 2-Opt, or Hybrid Ensemble.
   - Animated 4-stage optimization pipeline modal.

5. **Results & Turn-by-Turn Manifest**:
   - Head-to-head **Before vs After Optimization** scorecard calculating exact percentage improvements.
   - Expandable vehicle accordion with turn-by-turn waypoint schedules (arrival/departure, cargo weight, leg distance, on-time status).
   - Export Manifest to JSON.

6. **Quantum AI Technology Explorer**:
   - Interactive architectural flow: $\text{VRP} \rightarrow \text{QUBO / Ising Hamiltonian} \rightarrow \text{Transverse Field Annealing} \rightarrow \text{Optimized Routes}$.
   - Hardware transparency disclosures.
   - Convergence benchmark line chart (Classical local minima trap vs Quantum barrier tunneling).

7. **Analytics & ESG Sustainability Intelligence**:
   - Carbon offset calculator (kg CO2 prevented & urban tree equivalent).
   - Multi-dimensional efficiency radar chart.
   - Fleet payload vs capacity distribution analysis.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Leaflet.
- **Backend / API**: Python 3.11, FastAPI, Uvicorn, Pydantic, NumPy, SciPy.
- **Optimization Algorithms**:
  - *Quantum-Inspired SQA*: Transverse-field Hamiltonian barrier tunneling.
  - *Classical Baseline*: Clarke-Wright Savings heuristic + 2-Opt local search.
  - *Multi-Objective QUBO*: Dynamic balancing of distance, time windows, and powertrain emission weights.

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
API runs on: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: [http://localhost:5173](http://localhost:5173)

The Vite dev server automatically proxies all `/api` requests to the FastAPI backend running on port 8000.