# RouteQ — Intelligent Vehicle Routing Optimizer
### Hackathon Use Case 04: Last-Mile Delivery and Vehicle Routing Optimization

**RouteQ** is a full-stack, enterprise-grade logistics optimization platform engineered to solve the NP-hard **Capacitated Vehicle Routing Problem with Time Windows (CVRPTW)**. It delivers a dual-solver architecture pairing a deterministic **Classical Baseline Optimizer** (Clarke-Wright Savings + 2-Opt) with a **Qiskit-based Quantum Optimizer** (QUBO formulation + QAOA circuit simulation on Qiskit Aer / Statevector simulator).

---

## 🎯 The Problem

Last-mile delivery represents up to **53% of overall logistics operational expenditures**. Urban delivery routing is an NP-hard combinatorial optimization challenge where complexity scales super-exponentially with stop count:
- **Combinatorial Explosion**: Routing $N$ packages across $K$ vehicles yields an astronomical search space $(N! \times \binom{N+K-1}{K-1})$.
- **Fleet Constraints**: Strict vehicle payload thresholds ($\text{kg}$) and battery/fuel limits.
- **Customer Time Windows**: Tight delivery arrival expectations penalizing early or late arrivals.
- **Urban Dynamics**: Real-time traffic congestion multipliers, stop-and-go fuel penalties, and CO2 emissions.

Traditional greedy algorithms frequently become trapped in local minima or fail to reconcile competing multi-objective tradeoffs (e.g., minimizing driver distance vs. respecting narrow delivery windows).

---

## 💡 The Solution: RouteQ Dual-Solver Architecture

RouteQ provides a side-by-side comparative framework allowing logistics dispatchers to benchmark classical heuristic routing against quantum-formulated optimization:

```
+-------------------------------------------------------------------------------+
|                             ROUTEQ ARCHITECTURE                               |
+-------------------------------------------------------------------------------+
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   |                   REACT 19 + TYPESCRIPT FRONTEND                      |   |
|   |  - Operations Dashboard & Telemetry Cards                             |   |
|   |  - Interactive Route Map (Leaflet)                                    |   |
|   |  - Delivery & Fleet CRUD Management                                   |   |
|   |  - Optimization Studio: Method Selector (Classical vs Qiskit)        |   |
|   |  - 5-Stage Animated Progress Pipeline                                 |   |
|   |  - Empirical Comparison Scorecard & ESG Analytics                     |   |
|   +-----------------------------------+-----------------------------------+   |
|                                       | HTTP / REST (Vite Proxy: /api)        |
|                                       v                                       |
|   +-----------------------------------------------------------------------+   |
|   |                         FASTAPI BACKEND                               |   |
|   |  - GET  /api/health              - POST /api/optimize/classical       |   |
|   |  - GET  /api/demo-data           - POST /api/optimize/qiskit          |   |
|   |  - GET  /api/optimization/status - POST /api/compare                  |   |
|   +-------------------+-----------------------------------+---------------+   |
|                       |                                   |                   |
|                       v                                   v                   |
|   +-------------------------------+   +-------------------------------+       |
|   |      CLASSICAL OPTIMIZER      |   |   QISKIT QUANTUM OPTIMIZER    |       |
|   | - Clarke-Wright Edge Savings  |   | - Binary Decision Variable    |       |
|   | - Bin-packing & Capacity      |   |   Mapping (CVRPTW -> QUBO)    |       |
|   | - 2-Opt Iterative Local Search|   | - Cost Hamiltonian H_C        |       |
|   | - Scales up to 50+ stops      |   | - QAOA Circuit Construction   |       |
|   +-------------------------------+   | - Qiskit Aer / Statevector    |       |
|                                       | - Solution Bitstring Decoding |       |
|                                       | - Max 6 stops (2^N scaling)   |       |
|                                       +-------------------------------+       |
+-------------------------------------------------------------------------------+
```

---

## ⚛️ Quantum Methodology (VRP $\rightarrow$ QUBO $\rightarrow$ QAOA $\rightarrow$ Aer Simulator)

RouteQ's quantum pipeline translates vehicle routing into quantum mechanical operators:

1. **Problem Formulation**:
   - For $N$ delivery stops and vehicle assignments, binary decision variables $x_{i,j,k} \in \{0, 1\}$ represent whether vehicle $k$ travels directly from location $i$ to location $j$.

2. **QUBO Cost Hamiltonian Construction**:
   $$\min H(x) = \alpha H_{\text{dist}} + \beta H_{\text{penalty}}$$
   Where:
   - $H_{\text{dist}} = \sum_{i,j} d_{ij} \sum_k x_{i,j,k}$ minimizes total Euclidean/Haversine road network distance.
   - $H_{\text{visit}} = P_1 \sum_{i=1}^N \left( \sum_{k} \sum_j x_{i,j,k} - 1 \right)^2$ penalizes unvisited or doubly-visited customer nodes.
   - $H_{\text{cap}} = P_2 \sum_k \max\left(0, \sum_i q_i y_{i,k} - Q_k\right)^2$ enforces vehicle weight constraints.
   - $H_{\text{time}} = P_3 \sum_i \max(0, \text{Arrival}_i - \text{End}_i)^2$ penalizes time-window lateness.

3. **QAOA Quantum Circuit Execution**:
   - The cost Hamiltonian $H_C$ is transformed into a parameterized quantum circuit using alternating applications of cost layer $e^{-i \gamma H_C}$ and mixer layer $e^{-i \beta H_M}$ with Hadamard initial state $\lvert + \rangle^{\otimes n}$.
   - The circuit is simulated on a local **Qiskit Aer / Statevector quantum simulator**, computing expectation values $\langle \psi(\gamma, \beta) \lvert H_C \rvert \psi(\gamma, \beta) \rangle$.

4. **Bitstring Decoding & Route Synthesis**:
   - The minimum-energy sampled bitstring is parsed into ordered vehicle routes starting and ending at the depot hub.
   - Waypoints are evaluated with speed-adjusted travel times (accounting for clear, moderate, heavy, or rush hour traffic), fuel burn ($L$), and carbon emissions ($kg\ \text{CO}_2$).

---

## 🔬 Honest Technical Notes & Limitations

- **Qubit State-Space Scaling ($2^N$)**: Simulating an $N$-qubit quantum system requires tracking a $2^N$-dimensional complex statevector. Because RouteQ runs locally on standard CPU hardware without an external quantum cloud cluster, the quantum demonstration is strictly limited to **3 to 6 delivery stops**.
- **Simulator vs Physical Hardware**: All quantum computations are executed via local **Qiskit AerSimulator / Statevector simulator**. This project does **NOT** claim quantum supremacy, physical quantum hardware execution, or runtime advantage over classical heuristics.
- **Enterprise Classical Complement**: For realistic city-wide fleets (20 to 50+ delivery stops), the platform provides the **Classical Clarke-Wright + 2-Opt** optimizer, resolving large-scale routes in milliseconds.

---

## 🌟 Core Application Features

1. **Operations Dashboard**:
   - 6 Live KPI telemetry cards: Active fleet, total stops, optimized mileage, fuel consumption, duration, and carbon footprint.
   - Interactive Leaflet dispatch map with color-coded vehicle itineraries.
   - Capacity utilization gauges and before-vs-after savings bar charts.

2. **Route Optimization Studio**:
   - **Method Selector**: Toggle between `[ Classical Clarke-Wright + 2-Opt ]` and `[ Qiskit QAOA (Aer Simulator) ]`.
   - **1-Click Demo Datasets**: 
     - ⚡ **Load Quantum Demo (4 stops)**: Pre-configured 4-stop instance tailored for instant quantum simulation.
     - 🚚 **Load Full Demo (25 stops)**: 25-stop realistic Bengaluru, India commercial logistics dataset for classical routing.
   - **5 Multi-Objective Profiles**: Balanced Multi-Objective, Minimize Distance, Minimize Travel Time, Minimize Fuel, and Minimize CO2 (Green Logistics).
   - **Dynamic Traffic Multipliers**: Clear ($1.00\times$), Moderate ($1.28\times$), Heavy ($1.75\times$), Peak Rush Hour ($2.45\times$).
   - **Animated 5-Stage Modal**:
     1. Preparing optimization problem...
     2. Running Qiskit / Classical optimization...
     3. Decoding solution bitstrings...
     4. Calculating route metrics, fuel & CO2...
     5. Optimization complete.

3. **Results & Turn-by-Turn Waypoint Manifest**:
   - Clear solver badge displaying `Classical Solver (Clarke-Wright + 2-Opt)` or `Qiskit + Aer Simulator (QAOA)`.
   - Dual-view Scorecard: Compare active routes vs **Unoptimized Baseline** or view **Classical vs Quantum Delta**.
   - Expandable vehicle itinerary table with arrival/departure timestamps, payload tracking, leg distances, and on-time compliance tags.
   - One-click JSON manifest download.

4. **Fleet & Delivery CRUD Management**:
   - Interactive CRUD for custom delivery stops and fleet vehicles (Diesel, Hybrid, Electric).

5. **Quantum AI Explorer & ESG Sustainability**:
   - Mathematical QUBO and Ising Hamiltonian breakdown.
   - Hardware transparency disclosures.
   - Carbon offset equivalency counter (kg $\text{CO}_2$ prevented & tree offset equivalent).

---

## 🚀 Installation & Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API root: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Interactive Swagger documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)
- The Vite dev server automatically proxies all `/api/*` traffic to `http://127.0.0.1:8000`.

### 3. Running Automated Tests
```bash
cd backend
python -m unittest test_suite.py
```

---

## 📦 API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend health, active simulator, and available solvers |
| `GET` | `/api/demo-data` | Returns 25-stop full demo and 4-stop quantum demo datasets |
| `GET` | `/api/optimization/status` | Real-time telemetry on the latest optimization run |
| `POST` | `/api/optimize/classical` | Executes Clarke-Wright Savings + 2-Opt on the requested instance |
| `POST` | `/api/optimize/qiskit` | Executes Qiskit QAOA / QUBO optimization on instances with $\le 6$ stops |
| `POST` | `/api/optimize` | Unified endpoint dispatching based on `optimization_method` |
| `POST` | `/api/compare` | Executes head-to-head empirical benchmark between Classical and Qiskit |

---

## 📜 License
Developed for Hackathon Use Case 04: Last-Mile Delivery and Vehicle Routing Optimization.