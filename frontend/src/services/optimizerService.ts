import type {
  Depot,
  Vehicle,
  Delivery,
  OptimizationRequest,
  OptimizationResult,
  ComparisonResult,
  VehicleRoute,
  Waypoint,
  ConvergencePoint,
  MetricComparison,
  TrafficLevel,
  OptimizationObjective,
} from '../types';
import { DEMO_DEPOT, DEMO_VEHICLES, DEMO_DELIVERIES } from '../data/demoData';

const API_BASE_URL = '/api';

const VEHICLE_COLORS = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ec4899', // Rose/Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
];

const TRAFFIC_MULTIPLIERS: Record<TrafficLevel, number> = {
  clear: 1.0,
  moderate: 1.28,
  heavy: 1.75,
  rush_hour: 2.45,
};

function haversineDistKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1.3; // Road network factor
}

function parseTimeToMins(timeStr: string): number {
  try {
    const parts = timeStr.trim().split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  } catch {
    return 540; // 09:00 default
  }
}

function minsToTimeStr(mins: number): string {
  const total = Math.round(mins) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function calcFuelAndCo2(
  distKm: number,
  vehicle: Vehicle,
  avgLoadKg: number,
  trafficLevel: TrafficLevel
): { fuelL: number; co2Kg: number } {
  if (distKm <= 0) return { fuelL: 0, co2Kg: 0 };
  const baseLPer100 = 100 / Math.max(1, vehicle.fuel_efficiency_km_per_l);
  const cargoPenalty = (avgLoadKg / 100) * 0.04;
  const trafficPenalty = TRAFFIC_MULTIPLIERS[trafficLevel] || 1.1;
  const effLPer100 = (baseLPer100 + cargoPenalty) * (1 + (trafficPenalty - 1) * 0.35);

  let fuelL = 0;
  let co2Kg = 0;

  if (vehicle.fuel_type === 'electric') {
    fuelL = 0;
    co2Kg = Number((distKm * 0.048 * (1 + (avgLoadKg / 1000) * 0.15)).toFixed(2));
  } else if (vehicle.fuel_type === 'hybrid') {
    fuelL = Number(((distKm / 100) * effLPer100 * 0.68).toFixed(2));
    co2Kg = Number((fuelL * 2.31).toFixed(2));
  } else {
    fuelL = Number(((distKm / 100) * effLPer100).toFixed(2));
    co2Kg = Number((fuelL * 2.68).toFixed(2));
  }

  return { fuelL, co2Kg };
}

function localRun2Opt(
  route: string[],
  getDist: (a: string, b: string) => number
): string[] {
  if (route.length <= 2) return [...route];
  let best = [...route];
  let improved = true;
  let iter = 0;

  const totalDist = (r: string[]) => {
    let sum = 0;
    for (let i = 0; i < r.length - 1; i++) {
      sum += getDist(r[i], r[i + 1]);
    }
    return sum;
  };

  let bestDist = totalDist(best);

  while (improved && iter < 35) {
    improved = false;
    iter++;
    for (let i = 1; i < best.length - 2; i++) {
      for (let j = i + 1; j < best.length - 1; j++) {
        const sub = best.slice(i, j + 1).reverse();
        const candidate = [...best.slice(0, i), ...sub, ...best.slice(j + 1)];
        const candDist = totalDist(candidate);
        if (candDist < bestDist - 0.001) {
          best = candidate;
          bestDist = candDist;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  return best;
}

// Built-in Client Solver (Identical algorithms to Python Backend)
export function solveLocalOptimization(
  req: OptimizationRequest,
  mode: 'quantum_inspired' | 'classical_baseline' | 'unoptimized'
): OptimizationResult {
  const startTime = performance.now();
  const depot = req.depot || DEMO_DEPOT;
  const vehicles = req.vehicles.length > 0 ? req.vehicles : DEMO_VEHICLES;
  const deliveries = req.deliveries.length > 0 ? req.deliveries : DEMO_DELIVERIES;
  const traffic = req.traffic_level || 'moderate';

  const nodeCoords: Record<string, { lat: number; lng: number }> = {
    DEPOT: { lat: depot.lat, lng: depot.lng },
  };
  const delivMap: Record<string, Delivery> = {};
  for (const d of deliveries) {
    nodeCoords[d.id] = { lat: d.lat, lng: d.lng };
    delivMap[d.id] = d;
  }

  const getDist = (a: string, b: string): number => {
    if (a === b) return 0;
    const p1 = nodeCoords[a];
    const p2 = nodeCoords[b];
    if (!p1 || !p2) return 0;
    return haversineDistKm(p1.lat, p1.lng, p2.lat, p2.lng);
  };

  const getTime = (a: string, b: string): number => {
    const d = getDist(a, b);
    const speed = Math.max(8, 38 / TRAFFIC_MULTIPLIERS[traffic]);
    return (d / speed) * 60;
  };

  const k = vehicles.length;
  let assignments: string[][] = Array.from({ length: k }, () => []);
  const convergence: ConvergencePoint[] = [];

  if (mode === 'unoptimized') {
    // Arbitrary round robin
    deliveries.forEach((d, i) => {
      assignments[i % k].push(d.id);
    });
  } else if (mode === 'classical_baseline') {
    // Classical Clarke-Wright savings
    const pairs: { s: number; i: string; j: string }[] = [];
    for (let i = 0; i < deliveries.length; i++) {
      for (let j = i + 1; j < deliveries.length; j++) {
        const idI = deliveries[i].id;
        const idJ = deliveries[j].id;
        const s = getDist('DEPOT', idI) + getDist('DEPOT', idJ) - getDist(idI, idJ);
        pairs.push({ s, i: idI, j: idJ });
      }
    }
    pairs.sort((a, b) => b.s - a.s);

    let routes: string[][] = deliveries.map((d) => [d.id]);
    let loads: number[] = deliveries.map((d) => d.demand_kg);
    const maxCap = Math.max(...vehicles.map((v) => v.capacity_kg));

    for (const p of pairs) {
      const idxI = routes.findIndex((r) => r.includes(p.i));
      const idxJ = routes.findIndex((r) => r.includes(p.j));
      if (idxI !== -1 && idxJ !== -1 && idxI !== idxJ) {
        if (loads[idxI] + loads[idxJ] <= maxCap) {
          const rI = routes[idxI];
          const rJ = routes[idxJ];
          let merged: string[] | null = null;
          if (rI[rI.length - 1] === p.i && rJ[0] === p.j) merged = [...rI, ...rJ];
          else if (rJ[rJ.length - 1] === p.j && rI[0] === p.i) merged = [...rJ, ...rI];
          else if (rI[rI.length - 1] === p.i && rJ[rJ.length - 1] === p.j)
            merged = [...rI, ...[...rJ].reverse()];
          else if (rI[0] === p.i && rJ[0] === p.j) merged = [[...rI].reverse(), ...rJ].flat();

          if (merged) {
            routes[idxI] = merged;
            loads[idxI] += loads[idxJ];
            routes.splice(idxJ, 1);
            loads.splice(idxJ, 1);
          }
        }
      }
    }

    // Bin pack into available vehicles
    const vehLoads = new Array(k).fill(0);
    routes.sort((a, b) => b.length - a.length);
    for (const r of routes) {
      const rLoad = r.reduce((acc, id) => acc + (delivMap[id]?.demand_kg || 0), 0);
      let bestV = 0;
      let bestRemaining = Infinity;
      for (let v = 0; v < k; v++) {
        if (vehLoads[v] + rLoad <= vehicles[v].capacity_kg) {
          const rem = vehicles[v].capacity_kg - (vehLoads[v] + rLoad);
          if (rem < bestRemaining) {
            bestRemaining = rem;
            bestV = v;
          }
        }
      }
      assignments[bestV].push(...r);
      vehLoads[bestV] += rLoad;
    }

    // Untangle 2-opt
    assignments = assignments.map((a) => {
      if (a.length <= 2) return a;
      const full = ['DEPOT', ...a, 'DEPOT'];
      return localRun2Opt(full, getDist).filter((n) => n !== 'DEPOT');
    });
  } else {
    // Quantum-Inspired SQA with Sector Pre-Clustering & Multi-Objective Hamiltonian
    const delivAngles = deliveries.map((d) => {
      let ang = Math.atan2(d.lat - depot.lat, d.lng - depot.lng);
      if (ang < 0) ang += 2 * Math.PI;
      return { ang, d };
    });
    delivAngles.sort((a, b) => a.ang - b.ang);

    const target = Math.floor(deliveries.length / k);
    const extra = deliveries.length % k;
    let curV = 0;
    let countInCur = 0;
    let limit = target + (curV < extra ? 1 : 0);

    for (const item of delivAngles) {
      if (countInCur >= limit && curV < k - 1) {
        curV++;
        countInCur = 0;
        limit = target + (curV < extra ? 1 : 0);
      }
      assignments[curV].push(item.d.id);
      countInCur++;
    }

    // Evaluate Hamiltonian
    const evalEnergy = (state: string[][]) => {
      let energy = 0;
      for (let vIdx = 0; vIdx < k; vIdx++) {
        const route = state[vIdx];
        if (route.length === 0) continue;
        const full = ['DEPOT', ...route, 'DEPOT'];
        let curTime = 510; // 08:30
        let routeLoad = 0;

        for (let i = 0; i < full.length - 1; i++) {
          const u = full[i];
          const v = full[i + 1];
          energy += getDist(u, v) * 0.9;
          if (v !== 'DEPOT') {
            const del = delivMap[v];
            routeLoad += del.demand_kg;
            curTime += getTime(u, v);
            const startM = parseTimeToMins(del.time_window_start);
            const endM = parseTimeToMins(del.time_window_end);
            if (curTime < startM) curTime = startM;
            else if (curTime > endM) energy += (curTime - endM) * 3.5;
            curTime += del.service_time_mins;
          }
        }
        const excess = Math.max(0, routeLoad - vehicles[vIdx].capacity_kg);
        energy += excess * 150;
      }
      return energy;
    };

    let curEnergy = evalEnergy(assignments);
    let bestEnergy = curEnergy;
    let bestState = assignments.map((r) => [...r]);

    convergence.push({ iteration: 0, energy: Number(curEnergy.toFixed(1)), best_energy: Number(bestEnergy.toFixed(1)) });

    // Annealing iterations
    const iters = 200;
    for (let it = 1; it <= iters; it++) {
      const s = it / iters;
      const gamma = 4.0 * (1 - s);
      const temp = Math.max(0.1, 40 * Math.pow(0.985, it));

      const candidate = assignments.map((r) => [...r]);
      const nonEmpties = candidate
        .map((r, i) => (r.length > 0 ? i : -1))
        .filter((i) => i !== -1);

      if (nonEmpties.length >= 2) {
        const v1 = nonEmpties[Math.floor(Math.random() * nonEmpties.length)];
        const v2 = Math.floor(Math.random() * k);
        if (v1 !== v2 && candidate[v1].length > 0) {
          const cIdx = Math.floor(Math.random() * candidate[v1].length);
          const cust = candidate[v1].splice(cIdx, 1)[0];
          candidate[v2].push(cust);

          const candEnergy = evalEnergy(candidate);
          const delta = candEnergy - curEnergy;
          const denom = Math.max(0.001, temp + gamma * Math.sqrt(Math.abs(delta) + 1));

          if (delta < 0 || Math.random() < Math.exp(-delta / denom)) {
            assignments = candidate;
            curEnergy = candEnergy;
            if (curEnergy < bestEnergy) {
              bestEnergy = curEnergy;
              bestState = candidate.map((r) => [...r]);
            }
          }
        }
      }

      if (it % 20 === 0 || it === iters) {
        convergence.push({
          iteration: it,
          energy: Number(curEnergy.toFixed(1)),
          best_energy: Number(bestEnergy.toFixed(1)),
        });
      }
    }

    assignments = bestState.map((a) => {
      if (a.length <= 2) return a;
      const full = ['DEPOT', ...a, 'DEPOT'];
      return localRun2Opt(full, getDist).filter((n) => n !== 'DEPOT');
    });
  }

  // Construct Routes
  const vehicleRoutes: VehicleRoute[] = [];
  const depotStartMins = 510; // 08:30

  assignments.forEach((nodeIds, vIdx) => {
    const veh = vehicles[vIdx];
    const color = VEHICLE_COLORS[vIdx % VEHICLE_COLORS.length];
    const fullSeq = nodeIds.length > 0 ? ['DEPOT', ...nodeIds, 'DEPOT'] : ['DEPOT', 'DEPOT'];

    let curTime = depotStartMins;
    let distKm = 0;
    let timeMins = 0;
    let totalCargo = nodeIds.reduce((acc, id) => acc + (delivMap[id]?.demand_kg || 0), 0);
    let remainingCap = veh.capacity_kg - totalCargo;
    let lateStops = 0;

    const waypoints: Waypoint[] = [];

    // Depot Departure
    waypoints.push({
      sequence_index: 0,
      stop_id: depot.id,
      location_name: depot.name,
      lat: depot.lat,
      lng: depot.lng,
      arrival_time: minsToTimeStr(curTime),
      departure_time: minsToTimeStr(curTime),
      demand_kg: 0,
      remaining_capacity_kg: Number(remainingCap.toFixed(1)),
      distance_from_prev_km: 0,
      travel_time_mins: 0,
      is_depot: true,
      is_late: false,
    });

    for (let i = 1; i < fullSeq.length; i++) {
      const fromN = fullSeq[i - 1];
      const toN = fullSeq[i];
      const legDist = getDist(fromN, toN);
      const legTime = getTime(fromN, toN);

      distKm += legDist;
      timeMins += legTime;
      curTime += legTime;

      const arrStr = minsToTimeStr(curTime);

      if (toN === 'DEPOT') {
        waypoints.push({
          sequence_index: i,
          stop_id: depot.id,
          location_name: `${depot.name} (Return)`,
          lat: depot.lat,
          lng: depot.lng,
          arrival_time: arrStr,
          departure_time: arrStr,
          demand_kg: 0,
          remaining_capacity_kg: veh.capacity_kg,
          distance_from_prev_km: Number(legDist.toFixed(2)),
          travel_time_mins: Number(legTime.toFixed(1)),
          is_depot: true,
          is_late: false,
        });
      } else {
        const del = delivMap[toN];
        const sMins = del.service_time_mins;
        timeMins += sMins;

        const startM = parseTimeToMins(del.time_window_start);
        const endM = parseTimeToMins(del.time_window_end);

        if (curTime < startM) {
          const wait = startM - curTime;
          timeMins += wait;
          curTime = startM;
        }

        const isLate = curTime > endM + 5;
        if (isLate) lateStops++;

        curTime += sMins;
        remainingCap += del.demand_kg;

        waypoints.push({
          sequence_index: i,
          stop_id: del.id,
          location_name: del.customer_name,
          lat: del.lat,
          lng: del.lng,
          arrival_time: arrStr,
          departure_time: minsToTimeStr(curTime),
          demand_kg: del.demand_kg,
          remaining_capacity_kg: Number(Math.max(0, remainingCap).toFixed(1)),
          distance_from_prev_km: Number(legDist.toFixed(2)),
          travel_time_mins: Number(legTime.toFixed(1)),
          is_depot: false,
          is_late: isLate,
          time_window_start: del.time_window_start,
          time_window_end: del.time_window_end,
        });
      }
    }

    const { fuelL, co2Kg } = calcFuelAndCo2(distKm, veh, totalCargo / 2, traffic);
    const utilPct = Number(((totalCargo / Math.max(1, veh.capacity_kg)) * 100).toFixed(1));
    const onTimePct = nodeIds.length === 0 ? 100 : Number((((nodeIds.length - lateStops) / nodeIds.length) * 100).toFixed(1));

    vehicleRoutes.push({
      vehicle_id: veh.id,
      vehicle_name: veh.name || `Vehicle ${veh.id}`,
      color,
      assigned_delivery_ids: nodeIds,
      waypoints,
      total_distance_km: Number(distKm.toFixed(2)),
      total_time_mins: Number(timeMins.toFixed(1)),
      capacity_used_kg: Number(totalCargo.toFixed(1)),
      capacity_max_kg: veh.capacity_kg,
      capacity_utilization_pct: Math.min(100, utilPct),
      fuel_consumed_l: fuelL,
      co2_emissions_kg: co2Kg,
      deliveries_count: nodeIds.length,
      on_time_rate_pct: onTimePct,
    });
  });

  const totalDist = Number(vehicleRoutes.reduce((acc, r) => acc + r.total_distance_km, 0).toFixed(2));
  const totalTime = Number(vehicleRoutes.reduce((acc, r) => acc + r.total_time_mins, 0).toFixed(1));
  const totalFuel = Number(vehicleRoutes.reduce((acc, r) => acc + r.fuel_consumed_l, 0).toFixed(2));
  const totalCo2 = Number(vehicleRoutes.reduce((acc, r) => acc + r.co2_emissions_kg, 0).toFixed(2));
  const totalCapUsed = vehicleRoutes.reduce((acc, r) => acc + r.capacity_used_kg, 0);
  const totalCapMax = vehicleRoutes.reduce((acc, r) => acc + r.capacity_max_kg, 0);
  const fleetUtil = Number(((totalCapUsed / Math.max(1, totalCapMax)) * 100).toFixed(1));
  const totalLate = vehicleRoutes.reduce((acc, r) => acc + r.waypoints.filter((w) => w.is_late).length, 0);
  const totalDelivs = vehicleRoutes.reduce((acc, r) => acc + r.deliveries_count, 0);
  const onTimePct = Number((((totalDelivs - totalLate) / Math.max(1, totalDelivs)) * 100).toFixed(1));

  return {
    solver_type: mode,
    solver_name:
      mode === 'quantum_inspired'
        ? 'Quantum-Inspired Simulated Annealing (QUBO)'
        : mode === 'classical_baseline'
        ? 'Classical Clarke-Wright Savings + 2-Opt'
        : 'Unoptimized Baseline',
    execution_time_ms: Number((performance.now() - startTime).toFixed(1)),
    routes: vehicleRoutes,
    unassigned_deliveries: [],
    total_distance_km: totalDist,
    total_time_mins: totalTime,
    total_fuel_l: totalFuel,
    total_co2_kg: totalCo2,
    fleet_utilization_pct: fleetUtil,
    late_deliveries_count: totalLate,
    on_time_percentage: onTimePct,
    convergence_history: convergence,
    objective_score: totalDist,
  };
}

function makeMetrics(
  before: OptimizationResult,
  after: OptimizationResult
): MetricComparison[] {
  const list = [
    { key: 'total_distance_km', label: 'Total Distance', b: before.total_distance_km, a: after.total_distance_km, u: 'km', lower: true },
    { key: 'total_time_mins', label: 'Total Travel Time', b: before.total_time_mins, a: after.total_time_mins, u: 'mins', lower: true },
    { key: 'total_fuel_l', label: 'Fuel Consumption', b: before.total_fuel_l, a: after.total_fuel_l, u: 'L', lower: true },
    { key: 'total_co2_kg', label: 'CO2 Emissions', b: before.total_co2_kg, a: after.total_co2_kg, u: 'kg', lower: true },
    { key: 'late_deliveries_count', label: 'Late Deliveries', b: before.late_deliveries_count, a: after.late_deliveries_count, u: 'deliveries', lower: true },
    { key: 'fleet_utilization_pct', label: 'Fleet Utilization', b: before.fleet_utilization_pct, a: after.fleet_utilization_pct, u: '%', lower: false },
  ];

  return list.map((item) => {
    const diff = Number((item.lower ? item.b - item.a : item.a - item.b).toFixed(2));
    const pct = item.b > 0 ? Number(((diff / item.b) * 100).toFixed(1)) : 0;
    return {
      metric: item.key,
      label: item.label,
      before: item.b,
      after: item.a,
      difference: diff,
      improvement_pct: pct,
      unit: item.u,
      is_favorable_direction_down: item.lower,
    };
  });
}

// Compare Classical vs Quantum-Inspired vs Unoptimized
export function compareLocalSolvers(req: OptimizationRequest): ComparisonResult {
  const unopt = solveLocalOptimization(req, 'unoptimized');
  const classic = solveLocalOptimization(req, 'classical_baseline');
  const quantum = solveLocalOptimization(req, 'quantum_inspired');

  const distSaved = Number((unopt.total_distance_km - quantum.total_distance_km).toFixed(1));
  const fuelSaved = Number((unopt.total_fuel_l - quantum.total_fuel_l).toFixed(1));
  const co2Saved = Number((unopt.total_co2_kg - quantum.total_co2_kg).toFixed(1));

  return {
    classical: classic,
    quantum_inspired: quantum,
    improvements_over_classical: makeMetrics(classic, quantum),
    improvements_over_unoptimized: makeMetrics(unopt, quantum),
    unoptimized_summary: {
      total_distance_km: unopt.total_distance_km,
      total_time_mins: unopt.total_time_mins,
      total_fuel_l: unopt.total_fuel_l,
      total_co2_kg: unopt.total_co2_kg,
      late_deliveries_count: unopt.late_deliveries_count,
      fleet_utilization_pct: unopt.fleet_utilization_pct,
    },
    summary_analysis: `Quantum-Inspired QUBO Optimization yielded a ${distSaved} km reduction in total travel distance, saving ${fuelSaved} L of fuel and cutting ${co2Saved} kg of CO2 emissions compared to unoptimized logistics operations. On-time delivery compliance reached ${quantum.on_time_percentage}%.`,
  };
}

// API Service Callers with seamless client fallback
export async function checkBackendHealth(): Promise<{ online: boolean; solvers?: any[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, solvers: data.solvers };
  } catch {
    return { online: false };
  }
}

export async function fetchDemoData(): Promise<{
  depot: Depot;
  vehicles: Vehicle[];
  deliveries: Delivery[];
  quantum_demo?: { depot: Depot; vehicles: Vehicle[]; deliveries: Delivery[] };
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/demo-data`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return {
    depot: DEMO_DEPOT,
    vehicles: DEMO_VEHICLES,
    deliveries: DEMO_DELIVERIES,
    quantum_demo: {
      depot: DEMO_DEPOT,
      vehicles: DEMO_VEHICLES.slice(0, 2),
      deliveries: DEMO_DELIVERIES.slice(0, 4),
    },
  };
}

export async function optimizeClassical(req: OptimizationRequest): Promise<OptimizationResult> {
  const payload = {
    depot: req.depot || DEMO_DEPOT,
    vehicles: req.vehicles,
    deliveries: req.deliveries,
    optimization_method: 'classical',
    traffic_level: req.traffic_level || 'medium',
    objective: req.objective || 'balanced',
    time_window_mode: req.time_window_mode || 'soft',
    capacity_mode: req.capacity_mode || 'strict',
  };

  try {
    const res = await fetch(`${API_BASE_URL}/optimize/classical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return adaptBackendResponse(data, req);
    }
  } catch {
    // fallback to local solver
  }
  return solveLocalOptimization(req, 'classical_baseline');
}

export async function optimizeQiskit(req: OptimizationRequest): Promise<OptimizationResult> {
  const payload = {
    depot: req.depot || DEMO_DEPOT,
    vehicles: req.vehicles,
    deliveries: req.deliveries,
    optimization_method: 'qiskit',
    traffic_level: req.traffic_level || 'medium',
    objective: req.objective || 'balanced',
    time_window_mode: req.time_window_mode || 'soft',
    capacity_mode: req.capacity_mode || 'strict',
  };

  try {
    const res = await fetch(`${API_BASE_URL}/optimize/qiskit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return adaptBackendResponse(data, req);
    } else {
      const err = await res.json();
      throw new Error(err.detail || 'Qiskit optimization error');
    }
  } catch (err: any) {
    if (err.message && err.message.includes('supports small routing instances')) {
      throw err;
    }
    // fallback
  }
  return solveLocalOptimization(req, 'quantum_inspired');
}

export async function optimizeRoutes(req: OptimizationRequest): Promise<OptimizationResult> {
  if (req.solver_type === 'classical' || req.solver_type === 'classical_baseline') {
    return optimizeClassical(req);
  } else {
    return optimizeQiskit(req);
  }
}

function adaptBackendResponse(data: any, req: OptimizationRequest): OptimizationResult {
  const routes: VehicleRoute[] = (data.routes || []).map((r: any, idx: number) => ({
    vehicle_id: r.vehicle_id,
    vehicle_name: r.vehicle_name || `Vehicle ${r.vehicle_id}`,
    color: r.color || VEHICLE_COLORS[idx % VEHICLE_COLORS.length],
    assigned_delivery_ids: r.deliveries || [],
    waypoints: (r.waypoints || []).map((wp: any) => ({
      sequence_index: wp.sequence_index,
      stop_id: wp.stop_id,
      location_name: wp.location_name,
      lat: wp.lat,
      lng: wp.lng,
      arrival_time: wp.arrival_time,
      departure_time: wp.departure_time,
      demand_kg: wp.demand_delivered_kg || wp.demand_kg || 0,
      remaining_capacity_kg: wp.remaining_capacity_kg || 0,
      distance_from_prev_km: wp.distance_from_prev_km || 0,
      travel_time_mins: wp.travel_time_mins || 0,
      is_depot: wp.is_depot || false,
      is_late: wp.is_late || false,
      time_window_start: wp.time_window_start,
      time_window_end: wp.time_window_end,
    })),
    total_distance_km: r.distance_km,
    total_time_mins: r.travel_time_minutes,
    capacity_used_kg: r.capacity_used,
    capacity_max_kg:
      r.capacity_used > 0 && r.capacity_utilization > 0
        ? r.capacity_used / (r.capacity_utilization / 100)
        : 500,
    capacity_utilization_pct: r.capacity_utilization,
    fuel_consumed_l: r.fuel_liters,
    co2_emissions_kg: r.co2_kg,
    deliveries_count: (r.deliveries || []).length,
    on_time_rate_pct: data.on_time_delivery_percentage || 100,
  }));

  const totalCapUsed = routes.reduce((acc, r) => acc + r.capacity_used_kg, 0);
  const totalCapMax = routes.reduce((acc, r) => acc + r.capacity_max_kg, 0);

  return {
    solver_type: data.method || 'qiskit',
    solver_name: data.solver ? `${data.solver.name} (${data.solver.backend})` : 'Qiskit + AerSimulator',
    execution_time_ms: Math.round((data.execution_time_seconds || 0.1) * 1000),
    routes,
    unassigned_deliveries: data.unassigned_deliveries || [],
    total_distance_km: data.total_distance_km,
    total_time_mins: data.estimated_time_minutes,
    total_fuel_l: data.estimated_fuel_liters,
    total_co2_kg: data.estimated_co2_kg,
    fleet_utilization_pct:
      totalCapMax > 0 ? Number(((totalCapUsed / totalCapMax) * 100).toFixed(1)) : 50.0,
    late_deliveries_count: routes.reduce(
      (acc, r) => acc + r.waypoints.filter((w) => w.is_late).length,
      0
    ),
    on_time_percentage: data.on_time_delivery_percentage,
    convergence_history: [],
    objective_score: data.total_distance_km,
  };
}

export async function compareSolvers(req: OptimizationRequest): Promise<ComparisonResult> {
  try {
    const payload = {
      depot: req.depot || DEMO_DEPOT,
      vehicles: req.vehicles,
      deliveries: req.deliveries,
      traffic_level: req.traffic_level || 'moderate',
      objective: req.objective || 'balanced',
      time_window_mode: req.time_window_mode || 'soft',
      capacity_mode: req.capacity_mode || 'strict',
    };
    const res = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.classical) {
        const classicRes = adaptBackendResponse(data.classical, req);
        const quantumRes = data.qiskit
          ? adaptBackendResponse(data.qiskit, req)
          : solveLocalOptimization(req, 'quantum_inspired');
        const unoptRes = solveLocalOptimization(req, 'unoptimized');
        return {
          classical: classicRes,
          quantum_inspired: quantumRes,
          improvements_over_classical: makeMetrics(classicRes, quantumRes),
          improvements_over_unoptimized: makeMetrics(unoptRes, quantumRes),
          unoptimized_summary: {
            total_distance_km: unoptRes.total_distance_km,
            total_time_mins: unoptRes.total_time_mins,
            total_fuel_l: unoptRes.total_fuel_l,
            total_co2_kg: unoptRes.total_co2_kg,
            late_deliveries_count: unoptRes.late_deliveries_count,
            fleet_utilization_pct: unoptRes.fleet_utilization_pct,
          },
          summary_analysis: `RouteQ Optimization completed. Classical total distance: ${classicRes.total_distance_km} km; Quantum-simulated total distance: ${quantumRes.total_distance_km} km with ${quantumRes.on_time_percentage}% on-time rate.`,
        };
      }
    }
  } catch (err) {
    console.warn('Backend compare endpoint fallback:', err);
  }
  return compareLocalSolvers(req);
}

