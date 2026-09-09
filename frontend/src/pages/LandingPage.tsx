import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, type Variants } from 'framer-motion';
import { ArrowRight, ChevronRight, Sparkles, MapPin, Gauge, ShieldCheck } from 'lucide-react';
import { RouteMap } from '../components/Map/RouteMap';
import type { Depot, Vehicle, Delivery, OptimizationResult, ComparisonResult } from '../types';

interface LandingPageProps {
  onLaunchOptimizer: () => void;
  onExploreTech: () => void;
  onNavigateTab?: (tab: any) => void;
  depot?: Depot;
  vehicles?: Vehicle[];
  deliveries?: Delivery[];
  optimizationResult?: OptimizationResult | null;
  comparisonResult?: ComparisonResult | null;
  isOptimizing?: boolean;
}

// Stagger and smooth cubic-bezier easing
const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: smoothEase } 
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchOptimizer,
  onExploreTech,
  onNavigateTab,
  depot,
  vehicles = [],
  deliveries = [],
  optimizationResult,
  isOptimizing = false,
}) => {
  // Hero Interactive Visual state
  const [heroOptimized, setHeroOptimized] = useState(true);

  // Storytelling route step for scroll-based route section
  const [routeStage, setRouteStage] = useState<'possible' | 'filtering' | 'optimized'>('optimized');

  // Performance numbers in-view
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-60px' });

  // Scroll tracking for storytelling route section
  const routeStoryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: routeStoryRef,
    offset: ['start end', 'end start'],
  });

  // Hero Route Nodes Data
  const heroNodes = [
    { id: 'n1', x: 80, y: 90 },
    { id: 'n2', x: 220, y: 60 },
    { id: 'n3', x: 340, y: 110 },
    { id: 'n4', x: 130, y: 230 },
    { id: 'n5', x: 310, y: 220 },
    { id: 'n6', x: 210, y: 310 },
  ];
  const heroDepot = { x: 210, y: 170 };

  // Vehicle animation loop on hero path
  const [vehicleProgress, setVehicleProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleProgress((prev) => (prev >= 100 ? 0 : prev + 0.6));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const heroWaypoints = [
    heroDepot,
    heroNodes[0],
    heroNodes[1],
    heroNodes[2],
    heroNodes[4],
    heroNodes[5],
    heroNodes[3],
    heroDepot,
  ];
  const totalHeroSegments = heroWaypoints.length - 1;
  const currHeroSegIdx = Math.min(
    Math.floor((vehicleProgress / 100) * totalHeroSegments),
    totalHeroSegments - 1
  );
  const heroFraction = ((vehicleProgress / 100) * totalHeroSegments) - currHeroSegIdx;
  const p1 = heroWaypoints[currHeroSegIdx];
  const p2 = heroWaypoints[currHeroSegIdx + 1];
  const vehicleX = p1.x + (p2.x - p1.x) * heroFraction;
  const vehicleY = p1.y + (p2.y - p1.y) * heroFraction;

  // Telemetry metrics
  const totalVehicles = vehicles.length || 5;
  const totalDeliveries = deliveries.length || 25;
  const totalDistance = optimizationResult ? optimizationResult.total_distance_km : 89.2;
  const totalFuel = optimizationResult ? optimizationResult.total_fuel_l : 4.57;
  const totalTime = optimizationResult ? optimizationResult.total_time_mins : 121.0;
  const hours = Math.floor(totalTime / 60);
  const mins = Math.round(totalTime % 60);

  return (
    <div className="w-full bg-[#F7F6F2] text-[#1F2024] selection:bg-[#FF5B37]/20 selection:text-[#1F2024]">
      
      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="pt-24 sm:pt-32 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center"
        >
          {/* Left Column: Line-by-line reveal & editorial typography */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* ROUTEQ badge with slight upward movement */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6DF] shadow-soft-sm text-xs font-mono text-[#6B6D76]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D]" />
              <span className="font-semibold text-[#1F2024]">ROUTEQ</span>
              <span className="text-[#D6D4CC]">&bull;</span>
              <span>QUANTUM MOBILITY ENGINE</span>
            </motion.div>

            {/* Line-by-line reveal heading with font-weight 600 */}
            <div className="space-y-1">
              <div className="overflow-hidden">
                <motion.h1
                  variants={{
                    hidden: { y: 60, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: smoothEase } }
                  }}
                  className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1F2024] leading-[1.04]"
                >
                  THE SHORTEST
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  variants={{
                    hidden: { y: 60, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.08, ease: smoothEase } }
                  }}
                  className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1F2024] leading-[1.04]"
                >
                  PATH BETWEEN
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  variants={{
                    hidden: { y: 60, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.16, ease: smoothEase } }
                  }}
                  className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#1F2024] leading-[1.04]"
                >
                  DEMAND AND
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  variants={{
                    hidden: { y: 60, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.24, ease: smoothEase } }
                  }}
                  className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.04]"
                >
                  <span className="accent-gradient-text">DELIVERY.</span>
                </motion.h1>
              </div>
            </div>

            {/* Description: Light & spacious */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#6B6D76] max-w-lg font-light leading-relaxed"
            >
              Editorial vehicle routing intelligence for enterprise last-mile logistics.
              Dual-solver architecture harmonizing classical 2-opt heuristics with Qiskit QUBO optimization.
            </motion.p>

            {/* Buttons: Primary Coral/Pink & Secondary Charcoal Outline */}
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchOptimizer}
                className="btn-primary-gradient !py-3 !px-7 text-sm !font-semibold group"
              >
                <span>Launch Optimizer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreTech}
                className="btn-secondary-outline !py-3 !px-6 text-sm"
              >
                <span>Explore Technology</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: ONE Sophisticated Hero Visual (Map & Route lines) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.97 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.9, delay: 0.2, ease: smoothEase } }
            }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-white border border-[#E8E6DF] p-6 flex flex-col justify-between overflow-hidden shadow-soft">
              
              {/* Card Header Telemetry */}
              <div className="flex items-center justify-between text-xs font-mono text-[#6B6D76]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D]" />
                  <span className="font-semibold text-[#1F2024]">HAMILTONIAN TOPOLOGY</span>
                </div>
                <button
                  onClick={() => setHeroOptimized(!heroOptimized)}
                  className="px-2.5 py-1 rounded-full bg-[#F7F6F2] hover:bg-[#EFEFEB] text-[#1F2024] font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  {heroOptimized ? 'OPTIMIZED' : 'UNORDERED'}
                </button>
              </div>

              {/* Minimal Cartographic SVG Canvas */}
              <div className="relative w-full flex-1 flex items-center justify-center">
                <svg viewBox="0 0 420 380" className="w-full h-full">
                  <defs>
                    <linearGradient id="heroGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5B37" />
                      <stop offset="100%" stopColor="#FF4D8D" />
                    </linearGradient>
                    <pattern id="lightGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F2F1EC" strokeWidth="1" />
                    </pattern>
                  </defs>

                  {/* Subtle Cartographic Grid Lines */}
                  <rect width="100%" height="100%" fill="url(#lightGrid)" />

                  {/* Progressive Route Lines */}
                  {heroOptimized ? (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.4, ease: smoothEase }}
                      d="M 210,170 L 80,90 L 220,60 L 340,110 L 310,220 L 210,310 L 130,230 Z"
                      fill="none"
                      stroke="url(#heroGradientLight)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M 210,170 L 340,110 L 130,230 L 220,60 L 210,310 L 80,90 L 310,220 Z"
                      fill="none"
                      stroke="#B6B8C2"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Delivery Nodes: Small Elegant Circles */}
                  {heroNodes.map((node) => (
                    <g key={node.id} className="transition-transform duration-300 hover:scale-125">
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="5"
                        fill="#FFFFFF"
                        stroke="#FF5B37"
                        strokeWidth="2"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="2"
                        fill="#1F2024"
                      />
                    </g>
                  ))}

                  {/* Depot: Custom Geometric Marker */}
                  <g>
                    <rect
                      x={heroDepot.x - 8}
                      y={heroDepot.y - 8}
                      width="16"
                      height="16"
                      rx="4"
                      fill="#1F2024"
                    />
                    <rect
                      x={heroDepot.x - 3}
                      y={heroDepot.y - 3}
                      width="6"
                      height="6"
                      rx="1"
                      fill="#FFFFFF"
                    />
                  </g>

                  {/* Vehicle Gliding along route */}
                  {heroOptimized && (
                    <g transform={`translate(${vehicleX}, ${vehicleY})`}>
                      <circle r="7" fill="rgba(255, 91, 55, 0.2)" className="animate-ping" />
                      <circle r="4" fill="#FF5B37" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Minimal Telemetry Footer */}
              <div className="pt-3 border-t border-[#E8E6DF] flex items-center justify-between text-[11px] font-mono text-[#6B6D76]">
                <span>NODES: 06</span>
                <span className="text-[#1F2024] font-medium">H(x): {heroOptimized ? '-142.8 J' : '-48.2 J'}</span>
                <span className={heroOptimized ? 'text-[#FF5B37] font-semibold' : 'text-[#6B6D76]'}>
                  {heroOptimized ? 'CONVERGED' : 'SEARCHING'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── SECTION 9: SCROLL-BASED ROUTE STORYTELLING ANIMATION ─────────── */}
      <section
        ref={routeStoryRef}
        className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E8E6DF]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono text-[#FF5B37] uppercase tracking-wider font-semibold">
              01 &bull; COMBINATORIAL ROUTE SEARCH
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1F2024] leading-tight">
              FROM CHAOS TO<br />
              <span className="accent-gradient-text">OPTIMAL TRAJECTORY.</span>
            </h2>
            <p className="text-base text-[#6B6D76] font-light leading-relaxed">
              When routing delivery fleets, millions of possible vehicle paths exist.
              Conventional algorithms get trapped in local suboptimal loops. RouteQ progressively eliminates inefficient paths, collapsing the factorial search space to the globally optimal schedule.
            </p>

            {/* Interactive State Toggle Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRouteStage('possible')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  routeStage === 'possible'
                    ? 'bg-[#1F2024] text-white shadow-sm'
                    : 'bg-white border border-[#E8E6DF] text-[#6B6D76] hover:text-[#1F2024]'
                }`}
              >
                1. POSSIBLE ROUTES
              </button>
              <button
                onClick={() => setRouteStage('filtering')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  routeStage === 'filtering'
                    ? 'bg-[#1F2024] text-white shadow-sm'
                    : 'bg-white border border-[#E8E6DF] text-[#6B6D76] hover:text-[#1F2024]'
                }`}
              >
                2. FILTERING
              </button>
              <button
                onClick={() => setRouteStage('optimized')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  routeStage === 'optimized'
                    ? 'bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D] text-white shadow-[0_2px_10px_rgba(255,91,55,0.28)]'
                    : 'bg-white border border-[#E8E6DF] text-[#6B6D76] hover:text-[#1F2024]'
                }`}
              >
                3. OPTIMIZED ROUTE
              </button>
            </div>
          </div>

          {/* Right: SVG Storytelling Path Canvas */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full bg-white border border-[#E8E6DF] rounded-3xl p-6 sm:p-8 shadow-soft relative overflow-hidden">
              <div className="flex justify-between items-center text-xs font-mono text-[#6B6D76] mb-4">
                <span>STAGE: {routeStage.toUpperCase()}</span>
                <span className="text-[#FF5B37] font-semibold">
                  {routeStage === 'possible' ? '120 FACTORIAL PERMUTATIONS' : routeStage === 'filtering' ? 'PRUNING SUBOPTIMAL EDGES' : 'GLOBAL MINIMUM FOUND'}
                </span>
              </div>

              <svg viewBox="0 0 520 300" className="w-full h-64">
                <defs>
                  <linearGradient id="storyRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF5B37" />
                    <stop offset="100%" stopColor="#FF4D8D" />
                  </linearGradient>
                </defs>

                {/* Inefficient faint paths */}
                {routeStage !== 'optimized' && (
                  <g
                    opacity={routeStage === 'possible' ? 0.35 : 0.12}
                    stroke="#8E909A"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    className="transition-opacity duration-500"
                  >
                    <path d="M 80,80 L 260,50 L 440,100 L 360,240 L 160,250 Z" fill="none" />
                    <path d="M 80,80 L 360,240 L 260,50 L 160,250 L 440,100 Z" fill="none" />
                    <path d="M 260,50 L 80,80 L 160,250 L 440,100 L 360,240 Z" fill="none" />
                  </g>
                )}

                {/* Optimized Route Line */}
                <motion.path
                  d="M 80,80 L 260,50 L 440,100 L 360,240 L 160,250 Z"
                  fill="none"
                  stroke={routeStage === 'optimized' ? 'url(#storyRouteGrad)' : '#1F2024'}
                  strokeWidth={routeStage === 'optimized' ? 3.5 : 2}
                  className="transition-all duration-700"
                />

                {/* Nodes */}
                {[
                  { x: 80, y: 80, label: 'D-01' },
                  { x: 260, y: 50, label: 'D-02' },
                  { x: 440, y: 100, label: 'D-03' },
                  { x: 360, y: 240, label: 'D-04' },
                  { x: 160, y: 250, label: 'D-05' },
                ].map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      fill="#FFFFFF"
                      stroke={routeStage === 'optimized' ? '#FF5B37' : '#1F2024'}
                      strokeWidth="2"
                    />
                    <text
                      x={p.x + 9}
                      y={p.y + 4}
                      fill="#6B6D76"
                      fontSize="10"
                      fontFamily="IBM Plex Mono"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>

              <p className="text-xs text-center font-mono text-[#6B6D76] mt-4 pt-4 border-t border-[#E8E6DF]">
                {routeStage === 'optimized'
                  ? '✓ Minimum energy Hamiltonian state identified — 12.8% distance saved.'
                  : 'Evaluating penalty costs: vehicle capacities, road congestion & time window SLA.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: MINIMAL PERFORMANCE SECTION ──────────────────────── */}
      <section ref={statsRef} className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E8E6DF]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-4">
          
          {/* Metric 1 */}
          <div className="space-y-1 text-center lg:text-left">
            <div className="text-4xl sm:text-5xl font-bold font-sans text-[#1F2024] tracking-tight">
              {isStatsInView ? '12.8%' : '0.0%'}
            </div>
            <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider">
              Distance Reduction
            </div>
          </div>

          {/* Metric 2 */}
          <div className="space-y-1 text-center lg:text-left lg:border-l lg:border-[#E8E6DF] lg:pl-8">
            <div className="text-4xl sm:text-5xl font-bold font-sans text-[#1F2024] tracking-tight">
              {isStatsInView ? '8.4%' : '0.0%'}
            </div>
            <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider">
              Fuel Saved
            </div>
          </div>

          {/* Metric 3 */}
          <div className="space-y-1 text-center lg:text-left lg:border-l lg:border-[#E8E6DF] lg:pl-8">
            <div className="text-4xl sm:text-5xl font-bold font-sans text-[#1F2024] tracking-tight">
              {isStatsInView ? '11.2%' : '0.0%'}
            </div>
            <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider">
              CO₂ Reduction
            </div>
          </div>

          {/* Metric 4 */}
          <div className="space-y-1 text-center lg:text-left lg:border-l lg:border-[#E8E6DF] lg:pl-8">
            <div className="text-4xl sm:text-5xl font-bold font-sans text-[#1F2024] tracking-tight">
              {isStatsInView ? '2h 01m' : '0h 00m'}
            </div>
            <div className="text-xs font-mono text-[#6B6D76] uppercase tracking-wider">
              Time Saved
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 14: OPERATIONS CONSOLE (FLEET OVERVIEW) ──────────────── */}
      {depot && (
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E8E6DF] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#FF5B37] uppercase tracking-wider font-semibold">
                FLEET OVERVIEW
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F2024] mt-1">
                Real-time optimization environment
              </h2>
            </div>

            {/* Clean Horizontal Telemetry Strip */}
            <div className="flex items-center gap-4 text-xs font-mono bg-white border border-[#E8E6DF] rounded-full px-4 py-2 shadow-soft-sm text-[#6B6D76]">
              <span className="text-[#1F2024] font-semibold">{totalVehicles.toString().padStart(2, '0')} Vehicles</span>
              <span className="text-[#E8E6DF]">|</span>
              <span className="text-[#1F2024] font-semibold">{totalDeliveries} Deliveries</span>
              <span className="text-[#E8E6DF]">|</span>
              <span className="text-[#1F2024] font-semibold">{totalDistance.toFixed(1)} km</span>
              <span className="text-[#E8E6DF]">|</span>
              <span className="text-[#1F2024] font-semibold">{totalFuel.toFixed(2)} L</span>
              <span className="text-[#E8E6DF]">|</span>
              <span className="text-[#1F2024] font-semibold">{hours}h {mins}m</span>
            </div>
          </div>

          {/* Main Map & Side Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9 h-[520px] rounded-3xl overflow-hidden border border-[#E8E6DF] shadow-soft">
              <RouteMap
                depot={depot}
                vehicles={vehicles}
                deliveries={deliveries}
                optimizationResult={optimizationResult}
              />
            </div>

            {/* Side Panel: OPTIMIZATION STATUS */}
            <div className="lg:col-span-3 bg-white border border-[#E8E6DF] rounded-3xl p-6 shadow-soft flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="pb-3 border-b border-[#E8E6DF]">
                  <div className="text-xs font-mono text-[#8E909A] uppercase tracking-wider">
                    SIDE PANEL
                  </div>
                  <h3 className="text-base font-bold text-[#1F2024] mt-0.5">
                    OPTIMIZATION STATUS
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-[#F2F1EC]">
                    <span className="text-[#6B6D76]">Engine</span>
                    <span className="text-[#1F2024] font-semibold">Qiskit Hybrid</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F1EC]">
                    <span className="text-[#6B6D76]">Status</span>
                    <span className="text-[#10B981] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      {optimizationResult ? 'Optimized' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#F2F1EC]">
                    <span className="text-[#6B6D76]">Last run</span>
                    <span className="text-[#1F2024] font-semibold">09:42:18</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#6B6D76]">Convergence</span>
                    <span className="text-[#FF5B37] font-semibold">Sub-second</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onNavigateTab?.('routes')}
                  className="w-full btn-primary-gradient !py-2.5 !text-xs !font-semibold"
                >
                  <span>Explore Routes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onLaunchOptimizer}
                  disabled={isOptimizing}
                  className="w-full btn-secondary-outline !py-2 !text-xs"
                >
                  {isOptimizing ? 'Optimizing...' : 'Re-run Optimizer'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── EDITORIAL FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-[#E8E6DF] py-10 text-xs font-mono text-[#6B6D76]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D]" />
            <span className="font-bold text-[#1F2024]">ROUTEQ</span>
            <span>&bull;</span>
            <span>PREMIUM MOBILITY TECHNOLOGY</span>
          </div>
          <div>QISKIT FALL FEST 2026 &bull; USE CASE 04</div>
        </div>
      </footer>

    </div>
  );
};
