/**
 * Traffic Provider & Layer System
 * Clean abstraction supporting live traffic feeds and certified simulation fallbacks.
 * Legally and ethically compliant (zero unauthorized Google scraping).
 */

import { TRAFFIC_CONFIG } from '../../config/mapProviders';

export type TrafficCongestionLevel = 'normal' | 'moderate' | 'heavy' | 'severe';
export type TrafficMode = 'live' | 'simulation';

export const TRAFFIC_COLORS: Record<TrafficCongestionLevel, string> = {
  normal: '#10B981',   // Emerald Green
  moderate: '#F59E0B', // Amber Yellow
  heavy: '#F97316',    // Coral Orange
  severe: '#EF4444',   // Crimson Red
};

export interface TrafficSegment {
  id: string;
  roadName: string;
  coordinates: [number, number][];
  level: TrafficCongestionLevel;
  speedKmh: number;
  delayMins: number;
  lengthKm: number;
  congestionPct: number;
  color: string;
}

export interface TrafficSnapshot {
  mode: TrafficMode;
  isLive: boolean;
  label: string; // 'SIMULATED TRAFFIC' or 'LIVE TRAFFIC'
  notice: string; // 'Live traffic data is unavailable. Showing traffic simulation.'
  lastUpdated: string;
  updatedTimestamp: number;
  segments: TrafficSegment[];
  summary: {
    normalCount: number;
    moderateCount: number;
    heavyCount: number;
    severeCount: number;
    avgSpeedKmh: number;
  };
}

export interface TrafficProvider {
  id: string;
  name: string;
  isLiveAvailable: boolean;
  getSnapshot(
    center: { lat: number; lng: number },
    stops: { id: string; lat: number; lng: number }[],
    routes?: any[]
  ): Promise<TrafficSnapshot>;
  refresh(
    center: { lat: number; lng: number },
    stops: { id: string; lat: number; lng: number }[],
    routes?: any[]
  ): Promise<TrafficSnapshot>;
}

export interface TrafficProviderStatus {
  isAvailable: boolean;
  providerName: string;
  notice: string;
  mode: TrafficMode;
  severityLevels: {
    normal: string;
    moderate: string;
    heavy: string;
    severe: string;
  };
}

export function getTrafficProviderStatus(): TrafficProviderStatus {
  const traffic = TRAFFIC_CONFIG;

  return {
    isAvailable: true, // Simulation fallback is always available
    providerName: traffic.name,
    notice: 'Live traffic data is unavailable. Showing traffic simulation.',
    mode: 'simulation',
    severityLevels: TRAFFIC_COLORS,
  };
}

// In-memory persistent state for realistic gradual traffic evolution across refreshes
let lastSimulatedState: Record<string, TrafficCongestionLevel> = {};
let lastSnapshotCache: TrafficSnapshot | null = null;
let cycleCounter = 0;

/**
 * TrafficSimulationProvider
 * Uses genuine route geometries and urban arterial corridors to compute
 * realistic traffic congestion states with smooth, gradual evolution.
 */
class TrafficSimulationProvider implements TrafficProvider {
  id = 'simulation';
  name = 'RouteQ Traffic Engine';
  isLiveAvailable = false;

  async getSnapshot(
    center: { lat: number; lng: number },
    stops: { id: string; lat: number; lng: number }[],
    routes: any[] = []
  ): Promise<TrafficSnapshot> {
    if (lastSnapshotCache && Date.now() - lastSnapshotCache.updatedTimestamp < 25000) {
      return lastSnapshotCache;
    }
    return this.refresh(center, stops, routes);
  }

  async refresh(
    center: { lat: number; lng: number },
    stops: { id: string; lat: number; lng: number }[],
    routes: any[] = []
  ): Promise<TrafficSnapshot> {
    cycleCounter++;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const roadNames = [
      'Outer Ring Corridor',
      'Central Arterial Highway',
      'Express Delivery Flyover',
      'Commercial Hub Link',
      'Industrial Sector Boulevard',
      'Airport Radial Expressway',
      'Metro Transit Corridor',
      'Riverfront Access Road',
      'Downtown Logistics Way',
      'Northern Bypass Arterial',
      'Tech District Link',
      'Southern Freight Corridor',
    ];

    const segments: TrafficSegment[] = [];
    const congestionLevels: TrafficCongestionLevel[] = ['normal', 'moderate', 'heavy', 'severe'];

    // 1. Build segments from existing route waypoints if available
    let segmentIndex = 0;
    if (routes && routes.length > 0) {
      routes.forEach((route, rIdx) => {
        const waypoints = route.waypoints || [];
        for (let i = 0; i < waypoints.length - 1; i++) {
          const wp1 = waypoints[i];
          const wp2 = waypoints[i + 1];
          if (!wp1 || !wp2) continue;

          const segId = `route-seg-${rIdx}-${i}`;
          const roadName = `${roadNames[segmentIndex % roadNames.length]} (Route ${rIdx + 1})`;

          // Determine level with gradual transition
          let level: TrafficCongestionLevel;
          if (lastSimulatedState[segId]) {
            const prevLevel = lastSimulatedState[segId];
            const prevIdx = congestionLevels.indexOf(prevLevel);
            // 70% chance of staying same, 30% chance of shifting by +-1 level
            const shift = (cycleCounter + segmentIndex) % 3 === 0 ? (segmentIndex % 2 === 0 ? 1 : -1) : 0;
            const newIdx = Math.max(0, Math.min(3, prevIdx + shift));
            level = congestionLevels[newIdx];
          } else {
            // Initial assignment based on stop position and route index
            const initialIdx = (rIdx + i + segmentIndex) % 4;
            level = congestionLevels[initialIdx];
          }
          lastSimulatedState[segId] = level;

          const { speedKmh, delayMins, congestionPct } = this.getMetricsForLevel(level);

          // Interpolate intermediate curve points to look like real roads
          const midLat = (wp1.lat + wp2.lat) / 2 + (Math.sin(segmentIndex) * 0.0015);
          const midLng = (wp1.lng + wp2.lng) / 2 + (Math.cos(segmentIndex) * 0.0015);

          segments.push({
            id: segId,
            roadName,
            coordinates: [
              [wp1.lat, wp1.lng],
              [midLat, midLng],
              [wp2.lat, wp2.lng],
            ],
            level,
            speedKmh,
            delayMins,
            lengthKm: Number(this.calcDistKm(wp1.lat, wp1.lng, wp2.lat, wp2.lng).toFixed(2)),
            congestionPct,
            color: TRAFFIC_COLORS[level],
          });

          segmentIndex++;
        }
      });
    }

    // 2. If routes are not yet computed or too few, generate segments between stops and center hub
    if (segments.length < 5 && stops && stops.length > 0) {
      stops.forEach((stop, sIdx) => {
        const segId = `hub-corridor-${sIdx}`;
        const roadName = roadNames[sIdx % roadNames.length];

        let level = lastSimulatedState[segId];
        if (!level) {
          level = congestionLevels[sIdx % 4];
          lastSimulatedState[segId] = level;
        } else if (cycleCounter % 2 === 0) {
          const prevIdx = congestionLevels.indexOf(level);
          const shift = sIdx % 2 === 0 ? 1 : -1;
          level = congestionLevels[Math.max(0, Math.min(3, prevIdx + shift))];
          lastSimulatedState[segId] = level;
        }

        const { speedKmh, delayMins, congestionPct } = this.getMetricsForLevel(level);
        const midLat = (center.lat + stop.lat) / 2 + (Math.sin(sIdx * 1.5) * 0.002);
        const midLng = (center.lng + stop.lng) / 2 + (Math.cos(sIdx * 1.5) * 0.002);

        segments.push({
          id: segId,
          roadName,
          coordinates: [
            [center.lat, center.lng],
            [midLat, midLng],
            [stop.lat, stop.lng],
          ],
          level,
          speedKmh,
          delayMins,
          lengthKm: Number(this.calcDistKm(center.lat, center.lng, stop.lat, stop.lng).toFixed(2)),
          congestionPct,
          color: TRAFFIC_COLORS[level],
        });
      });
    }

    // Calculate Summary
    const summary = {
      normalCount: segments.filter((s) => s.level === 'normal').length,
      moderateCount: segments.filter((s) => s.level === 'moderate').length,
      heavyCount: segments.filter((s) => s.level === 'heavy').length,
      severeCount: segments.filter((s) => s.level === 'severe').length,
      avgSpeedKmh: Math.round(
        segments.length > 0
          ? segments.reduce((acc, s) => acc + s.speedKmh, 0) / segments.length
          : 36
      ),
    };

    const snapshot: TrafficSnapshot = {
      mode: 'simulation',
      isLive: false,
      label: 'SIMULATED TRAFFIC',
      notice: 'Live traffic data is unavailable. Showing traffic simulation.',
      lastUpdated: timeStr,
      updatedTimestamp: Date.now(),
      segments,
      summary,
    };

    lastSnapshotCache = snapshot;
    return snapshot;
  }

  private getMetricsForLevel(level: TrafficCongestionLevel): {
    speedKmh: number;
    delayMins: number;
    congestionPct: number;
  } {
    switch (level) {
      case 'normal':
        return { speedKmh: 48, delayMins: 0, congestionPct: 15 };
      case 'moderate':
        return { speedKmh: 32, delayMins: 3.5, congestionPct: 45 };
      case 'heavy':
        return { speedKmh: 19, delayMins: 8.2, congestionPct: 75 };
      case 'severe':
        return { speedKmh: 11, delayMins: 16.5, congestionPct: 92 };
    }
  }

  private calcDistKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1.3;
  }
}

export const defaultTrafficProvider = new TrafficSimulationProvider();
