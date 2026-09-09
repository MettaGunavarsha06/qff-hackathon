import React, { useEffect, useRef, useState } from 'react';
import { AnimatedTruck } from './AnimatedTruck';
import { DeliveryNode } from './DeliveryNode';
import { GlassPanel } from './GlassPanel';
import { Activity, ShieldCheck, Gauge, Zap } from 'lucide-react';

interface StopPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  isDepot?: boolean;
}

const STOPS: StopPoint[] = [
  { id: 'DEPOT', label: 'Central Hub', x: 120, y: 260, isDepot: true },
  { id: 'ST-01', label: '01 Indiranagar', x: 230, y: 140 },
  { id: 'ST-02', label: '02 CBD Plaza', x: 380, y: 110 },
  { id: 'ST-03', label: '03 Tech Park', x: 570, y: 155 },
  { id: 'ST-04', label: '04 Ring Road', x: 635, y: 285 },
  { id: 'ST-05', label: '05 Bellandur', x: 505, y: 380 },
  { id: 'ST-06', label: '06 HSR Campus', x: 365, y: 415 },
  { id: 'ST-07', label: '07 Koramangala', x: 235, y: 355 },
];

// Natural road curve SVG path (Organic city journey, no heart/circle)
const OPTIMIZED_ROUTE_PATH = `
  M 120 260
  C 140 210, 180 165, 230 140
  C 280 115, 330 110, 380 110
  C 450 110, 510 125, 570 155
  C 615 180, 645 230, 635 285
  C 625 340, 565 365, 505 380
  C 450 395, 410 420, 365 415
  C 310 410, 275 385, 235 355
  C 185 320, 145 295, 120 260
  Z
`;

// Alternative sub-optimal routes (low opacity, thin dashed lines)
const ALT_ROUTE_1 = `
  M 120 260
  C 260 210, 420 180, 635 285
  C 580 200, 360 80, 230 140
  C 310 320, 440 400, 505 380
  C 410 340, 290 320, 120 260
`;

const ALT_ROUTE_2 = `
  M 120 260
  C 170 340, 310 430, 365 415
  C 440 400, 530 200, 570 155
  C 510 130, 420 100, 380 110
  C 290 120, 190 220, 120 260
`;

export const HeroRouteVisualization: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const [truckPos, setTruckPos] = useState<{ x: number; y: number; angle: number }>({
    x: 120,
    y: 260,
    angle: -45,
  });
  const [activeStopId, setActiveStopId] = useState<string | null>('DEPOT');
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();
    let distance = 0;
    const speed = 1.35; // smooth natural speed

    const animate = () => {
      distance = (distance + speed) % totalLength;

      const pt = path.getPointAtLength(distance);
      const lookAhead = (distance + 2) % totalLength;
      const ptNext = path.getPointAtLength(lookAhead);

      const dx = ptNext.x - pt.x;
      const dy = ptNext.y - pt.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      setTruckPos({ x: pt.x, y: pt.y, angle });

      // Determine proximity to delivery stops
      let closestId: string | null = null;
      let minDistance = 26; // detection radius

      for (let i = 0; i < STOPS.length; i++) {
        const stop = STOPS[i];
        const distToStop = Math.hypot(pt.x - stop.x, pt.y - stop.y);
        if (distToStop < minDistance) {
          closestId = stop.id;
          setActiveSegmentIndex(i);
          break;
        }
      }

      if (closestId) {
        setActiveStopId(closestId);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden border border-[#E8E6DF] bg-[#F7F6F2] shadow-[0_12px_40px_rgba(0,0,0,0.04)] select-none">
      
      {/* ─── SVG CANVAS (Subtle City Map + Route + Animated Truck) ───────── */}
      <svg
        viewBox="0 0 760 520"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="routeQAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5B37" />
            <stop offset="60%" stopColor="#FF7A3D" />
            <stop offset="100%" stopColor="#FF4D8D" />
          </linearGradient>

          <linearGradient id="routeGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5B37" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FF4D8D" stopOpacity="0.45" />
          </linearGradient>

          <radialGradient id="truckGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5B37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF5B37" stopOpacity="0" />
          </radialGradient>

          <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#EBE8DF"
              strokeWidth="0.6"
              strokeDasharray="2 3"
            />
          </pattern>
        </defs>

        {/* ─── 1. ABSTRACT STYLIZED MAP BACKGROUND ────────────────────────── */}
        <rect width="100%" height="100%" fill="#F7F6F2" />
        <rect width="100%" height="100%" fill="url(#cityGrid)" opacity="0.75" />

        {/* Subtle City Blocks & Geographic Zones */}
        <g opacity="0.5" className="text-[#E8E5DC]">
          {/* Green corridor / River curve */}
          <path
            d="M 0 340 C 180 320, 320 280, 500 310 C 650 330, 720 280, 760 270 L 760 330 C 700 340, 600 370, 480 350 C 310 330, 160 380, 0 400 Z"
            fill="#EFECE3"
          />
          {/* City blocks */}
          <rect x="140" y="80" width="80" height="45" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="250" y="60" width="100" height="40" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="420" y="80" width="110" height="50" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="580" y="70" width="90" height="60" rx="6" fill="#EDE9DF" opacity="0.6" />
          
          <rect x="60" y="170" width="70" height="60" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="160" y="180" width="110" height="65" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="300" y="170" width="120" height="80" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="450" y="190" width="130" height="70" rx="6" fill="#EDE9DF" opacity="0.6" />
          
          <rect x="130" y="380" width="90" height="60" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="250" y="420" width="100" height="55" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="420" y="410" width="120" height="60" rx="6" fill="#EDE9DF" opacity="0.6" />
          <rect x="580" y="340" width="100" height="70" rx="6" fill="#EDE9DF" opacity="0.6" />
        </g>

        {/* Abstract Street Network (Low-Contrast Roads) */}
        <g stroke="#E2DFD6" strokeWidth="1.2" fill="none" opacity="0.7">
          <line x1="0" y1="130" x2="760" y2="130" />
          <line x1="0" y1="260" x2="760" y2="260" />
          <line x1="0" y1="390" x2="760" y2="390" />
          <line x1="200" y1="0" x2="200" y2="520" />
          <line x1="390" y1="0" x2="390" y2="520" />
          <line x1="560" y1="0" x2="560" y2="520" />
        </g>

        {/* Tiny Map Labels */}
        <g fill="#A6A49B" fontSize="7.5" fontFamily="IBM Plex Mono" opacity="0.65" className="select-none pointer-events-none">
          <text x="70" y="120">NORTH LOGISTICS RING</text>
          <text x="430" y="70">CBD EXPRESS CORRIDOR</text>
          <text x="630" y="240">EAST ARTERIAL</text>
          <text x="250" y="500">SOUTH INDUSTRIAL BYPASS</text>
          <text x="140" y="248">CENTRAL DEPOT AVE</text>
        </g>

        {/* ─── 2. ALTERNATIVE CANDIDATE ROUTES (Muted, Dashed, Sub-Optimal) ─── */}
        <path
          d={ALT_ROUTE_1}
          fill="none"
          stroke="#C5C1D8"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.28"
        />
        <path
          d={ALT_ROUTE_2}
          fill="none"
          stroke="#C5C1D8"
          strokeWidth="1.2"
          strokeDasharray="4 6"
          opacity="0.25"
        />

        {/* ─── 3. OPTIMIZED ROUTE PATH (Dominant Coral/Pink Glow) ─────────── */}
        {/* Soft Outer Glow */}
        <path
          d={OPTIMIZED_ROUTE_PATH}
          fill="none"
          stroke="url(#routeGlowGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />

        {/* Core Vibrant Line */}
        <path
          ref={pathRef}
          d={OPTIMIZED_ROUTE_PATH}
          fill="none"
          stroke="url(#routeQAccentGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Brighter Core */}
        <path
          d={OPTIMIZED_ROUTE_PATH}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* ─── 4. DELIVERY STOPS (Map Markers with Pulse) ─────────────────── */}
        {STOPS.map((stop) => (
          <DeliveryNode
            key={stop.id}
            id={stop.id}
            label={stop.label}
            x={stop.x}
            y={stop.y}
            isDepot={stop.isDepot}
            isActive={activeStopId === stop.id}
          />
        ))}

        {/* ─── 5. ANIMATED SMALL DELIVERY TRUCK (Motion Along Path) ─────────── */}
        <AnimatedTruck
          x={truckPos.x}
          y={truckPos.y}
          angle={truckPos.angle}
          scale={0.95}
        />
      </svg>

      {/* ─── FLOATING GLASS HUD PANELS (Selective Glassmorphism) ──────────── */}
      
      {/* Top Left: Optimization Engine Status */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <GlassPanel glow className="flex items-center gap-3 !py-2.5 !px-3.5">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#111322] tracking-wider uppercase">
              OPTIMIZATION ENGINE
            </span>
            <span className="text-[9px] text-[#FF5B37] font-semibold">
              ● ONLINE &bull; QISKIT HYBRID SOLVER
            </span>
          </div>
        </GlassPanel>
      </div>

      {/* Top Right: Active Route Telemetry */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <GlassPanel className="flex items-center gap-4 !py-2.5 !px-4">
          <div className="flex items-center gap-1.5 text-[#FF5B37]">
            <Gauge className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-wide text-[#111322]">
              ACTIVE ROUTE
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#242731]">
            <span className="font-bold">42.8 KM</span>
            <span className="text-[#A6A49B]">&bull;</span>
            <span className="font-bold">7 STOPS</span>
            <span className="text-[#A6A49B]">&bull;</span>
            <span className="text-[#FF5B37] font-bold">1H 48M</span>
          </div>
        </GlassPanel>
      </div>

      {/* Bottom Right: Live Vehicle Telemetry */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:block">
        <GlassPanel className="flex items-center gap-3 !py-2 !px-3.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF5B37] to-[#FF4D8D] flex items-center justify-center text-white text-[9px] font-bold">
            01
          </div>
          <div className="flex flex-col text-[9.5px]">
            <span className="text-[#111322] font-bold">
              TRUCK #01 (EV VAN)
            </span>
            <span className="text-[#6B6D76]">
              SPEED: 38 KM/H &bull; SLA 100%
            </span>
          </div>
        </GlassPanel>
      </div>

    </div>
  );
};
