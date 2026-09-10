import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedTruck } from './AnimatedTruck';
import { DeliveryNode } from './DeliveryNode';
import { GlassPanel } from './GlassPanel';
import { Gauge } from 'lucide-react';
import { smoothEase } from './AnimationPrimitives';

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

// Exact visible optimized route path (Realistic road curves starting & ending at Depot)
const OPTIMIZED_ROUTE_PATH = `
  M 120 260
  C 140 205, 180 160, 230 140
  C 280 115, 330 110, 380 110
  C 450 110, 510 125, 570 155
  C 615 180, 645 230, 635 285
  C 625 340, 565 365, 505 380
  C 450 395, 410 420, 365 415
  C 310 410, 275 385, 235 355
  C 185 320, 145 295, 120 260
  Z
`;

// Alternative candidate routes (thin dashed lines with low opacity)
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
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const truckRef = useRef<SVGGElement>(null);
  const [activeStopId, setActiveStopId] = useState<string | null>('DEPOT');
  const lastActiveStopRef = useRef<string | null>('DEPOT');
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    let totalLength = path.getTotalLength();
    if (totalLength <= 0) return;

    // 1. Initial positioning: Truck starts EXACTLY at the depot (distance = 0)
    const initialPt = path.getPointAtLength(0);
    const initialAhead = path.getPointAtLength(Math.min(totalLength, 2));
    const initialAngle =
      Math.atan2(initialAhead.y - initialPt.y, initialAhead.x - initialPt.x) * (180 / Math.PI);

    if (truckRef.current) {
      truckRef.current.setAttribute(
        'transform',
        `translate(${initialPt.x}, ${initialPt.y}) rotate(${initialAngle}) scale(0.95)`
      );
    }

    // 2. High-precision continuous RAF animation loop along exact SVG path
    let currentDistance = 0;
    let lastTimestamp = performance.now();
    const speedPixelsPerSecond = 88; // smooth, realistic road speed

    const animate = (timestamp: number) => {
      const dt = Math.min(0.08, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      // Advance distance along the exact SVG path
      currentDistance = (currentDistance + speedPixelsPerSecond * dt) % totalLength;

      // Sample exact point on the visible path stroke
      const pt = path.getPointAtLength(currentDistance);

      // Compute smooth continuous path tangent angle (smooth across loop boundary)
      const delta = 1.5;
      let dAhead = currentDistance + delta;
      let dBehind = currentDistance - delta;

      if (dAhead >= totalLength) dAhead -= totalLength;
      if (dBehind < 0) dBehind += totalLength;

      const ptBehind = path.getPointAtLength(dBehind);
      const ptAhead = path.getPointAtLength(dAhead);

      const dx = ptAhead.x - ptBehind.x;
      const dy = ptAhead.y - ptBehind.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Update truck position and rotation directly in the SVG DOM
      // (Bypasses React render queue for 60/120fps hardware acceleration with 0 drift)
      if (truckRef.current) {
        truckRef.current.setAttribute(
          'transform',
          `translate(${pt.x}, ${pt.y}) rotate(${angle}) scale(0.95)`
        );
      }

      // Check proximity to delivery stops to trigger pulsing arrival rings
      let matchedStopId: string | null = null;
      for (let i = 0; i < STOPS.length; i++) {
        const stop = STOPS[i];
        const dist = Math.hypot(pt.x - stop.x, pt.y - stop.y);
        if (dist < 26) {
          matchedStopId = stop.id;
          break;
        }
      }

      if (matchedStopId !== lastActiveStopRef.current) {
        lastActiveStopRef.current = matchedStopId;
        setActiveStopId(matchedStopId);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // 3. Responsive recalculation on container or window resize
    const handleResize = () => {
      if (pathRef.current) {
        totalLength = pathRef.current.getTotalLength();
        if (currentDistance >= totalLength) {
          currentDistance = 0;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden border border-[#E8E6DF] bg-[#F7F6F2] shadow-[0_12px_40px_rgba(0,0,0,0.04)] select-none"
    >
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
            <stop offset="0%" stopColor="#FF5B37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF4D8D" stopOpacity="0.4" />
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
        <g
          fill="#A6A49B"
          fontSize="7.5"
          fontFamily="IBM Plex Mono"
          opacity="0.65"
          className="select-none pointer-events-none"
        >
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

        {/* ─── 3. OPTIMIZED ROUTE PATH (The Exact Motion Path) ─────────────── */}
        {/* Soft Outer Glow - Animated Path Length Drawing */}
        <motion.path
          d={OPTIMIZED_ROUTE_PATH}
          fill="none"
          stroke="url(#routeGlowGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.38 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.38 }}
          transition={{ duration: 1.5, delay: 0.5, ease: smoothEase }}
        />

        {/* Core Vibrant Line (The exact reference for truck motion) */}
        <motion.path
          ref={pathRef}
          d={OPTIMIZED_ROUTE_PATH}
          fill="none"
          stroke="url(#routeQAccentGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: smoothEase }}
        />

        {/* Inner Brighter Core */}
        <motion.path
          d={OPTIMIZED_ROUTE_PATH}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, delay: 0.5, ease: smoothEase }}
        />

        {/* Subtle, unobtrusive pulsing energy flow along the route */}
        {!shouldReduceMotion && (
          <motion.path
            d={OPTIMIZED_ROUTE_PATH}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.4"
            strokeDasharray="10 32"
            strokeLinecap="round"
            initial={{ opacity: 0, strokeDashoffset: 0 }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              strokeDashoffset: -320,
            }}
            transition={{
              opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
              strokeDashoffset: { duration: 14, repeat: Infinity, ease: 'linear' },
              delay: 2.0,
            }}
          />
        )}

        {/* ─── 4. DELIVERY STOPS (Map Markers with Staggered Entrance) ──────── */}
        {STOPS.map((stop, idx) => (
          <motion.g
            key={stop.id}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.65 + idx * 0.08,
              ease: smoothEase,
            }}
          >
            <DeliveryNode
              id={stop.id}
              label={stop.label}
              x={stop.x}
              y={stop.y}
              isDepot={stop.isDepot}
              isActive={activeStopId === stop.id}
            />
          </motion.g>
        ))}

        {/* ─── 5. ANIMATED DELIVERY TRUCK (Direct Motion Along SVG Path) ─────── */}
        <motion.g
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <AnimatedTruck
            ref={truckRef}
            x={120}
            y={260}
            angle={-45}
            scale={0.95}
          />
        </motion.g>
      </svg>

      {/* ─── FLOATING GLASS HUD PANELS (Selective Glassmorphism) ──────────── */}
      {/* Top Left: Optimization Engine Status */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ease: smoothEase }}
        className="absolute top-4 left-4 z-20 pointer-events-none"
      >
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
      </motion.div>

      {/* Top Right: Active Route Telemetry */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: smoothEase }}
        className="absolute top-4 right-4 z-20 pointer-events-none"
      >
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
      </motion.div>

      {/* Bottom Right: Live Vehicle Telemetry */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: smoothEase }}
        className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:block"
      >
        <GlassPanel className="flex items-center gap-3 !py-2 !px-3.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF5B37] to-[#FF4D8D] flex items-center justify-center text-white text-[9px] font-bold">
            01
          </div>
          <div className="flex flex-col text-[9.5px]">
            <span className="text-[#111322] font-bold">TRUCK #01 (EV VAN)</span>
            <span className="text-[#6B6D76]">SPEED: 38 KM/H &bull; SLA 100%</span>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
};
