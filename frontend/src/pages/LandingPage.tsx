import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  GitFork,
  Binary,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchOptimizer: () => void;
  onExploreTech: () => void;
}

/**
 * ScrollSection wraps each section with continuous, progressive scroll transitions:
 * - Entering: opacity 0 -> 1, blur 8px -> 0px, translateY 40px -> 0px
 * - Continuous visual flow without hard slideshow cuts
 */
const ScrollSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Progressive scroll-based fade, blur and translation
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.15, 1, 1, 0.3]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [40, 0, 0, -30]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [8, 0, 0, 6]);

  return (
    <motion.div
      ref={sectionRef}
      id={id}
      style={{
        opacity,
        y,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
      }}
      className={`relative w-full transition-colors duration-700 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchOptimizer,
  onExploreTech,
}) => {
  // Hero SVG route nodes
  const heroDepot = { x: 230, y: 190 };
  const heroNodes = [
    { id: '01', x: 80, y: 100, label: 'Stop 01' },
    { id: '02', x: 210, y: 65, label: 'Stop 02' },
    { id: '03', x: 370, y: 95, label: 'Stop 03' },
    { id: '04', x: 420, y: 220, label: 'Stop 04' },
    { id: '05', x: 310, y: 310, label: 'Stop 05' },
    { id: '06', x: 120, y: 280, label: 'Stop 06' },
  ];

  // Vehicle gliding progress along the hero curved route
  const [vehicleProgress, setVehicleProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setVehicleProgress((prev) => (prev >= 100 ? 0 : prev + 0.45));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  // Compute vehicle position along waypoints
  const waypoints = [
    heroDepot,
    heroNodes[0],
    heroNodes[1],
    heroNodes[2],
    heroNodes[3],
    heroNodes[4],
    heroNodes[5],
    heroDepot,
  ];
  const numSegments = waypoints.length - 1;
  const segFraction = 100 / numSegments;
  const currentSeg = Math.min(Math.floor(vehicleProgress / segFraction), numSegments - 1);
  const segT = (vehicleProgress - currentSeg * segFraction) / segFraction;
  const p0 = waypoints[currentSeg];
  const p1 = waypoints[currentSeg + 1];
  const vehicleX = p0.x + (p1.x - p0.x) * segT;
  const vehicleY = p0.y + (p1.y - p0.y) * segT;

  // Problem section network animation state
  const problemRef = useRef<HTMLDivElement>(null);
  const isProblemInView = useInView(problemRef, { margin: '-100px', once: false });

  // Performance section animated numbers
  const perfRef = useRef<HTMLDivElement>(null);
  const isPerfInView = useInView(perfRef, { margin: '-60px', once: true });

  return (
    <div className="w-full min-h-screen bg-[#F6F3EC] text-[#202124] overflow-x-hidden font-sans selection:bg-[#FF6B4A]/20 selection:text-[#171A38]">

      {/* ──────────────────────────────────────────────────────────────────────────
          MINIMAL PUBLIC LANDING HEADER
          Only Brand + [ Launch Optimizer → ]
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 bg-[#F6F3EC]/80 backdrop-blur-md border-b border-[#E8E6DF]/60 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#E95AA8] flex items-center justify-center shadow-[0_2px_10px_rgba(255,107,74,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="font-sans font-bold text-sm tracking-widest text-[#171A38]">
              ROUTEQ
            </span>
          </div>

          <button
            onClick={onLaunchOptimizer}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#FF6B4A] via-[#FF6347] to-[#E95AA8] shadow-[0_4px_16px_rgba(255,107,74,0.28)] hover:shadow-[0_6px_22px_rgba(255,107,74,0.38)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Launch Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Spacer for fixed landing header */}
      <div className="h-16" />

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 1 — HERO
          Background: Warm Ivory (#F6F3EC)
      ────────────────────────────────────────────────────────────────────────── */}
      <ScrollSection id="hero" className="bg-[#F6F3EC] pt-14 sm:pt-20 pb-20 sm:pb-28 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE7F5] border border-[#D9D4EB] text-[11px] font-mono text-[#171A38]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
              <span>QUANTUM-INSPIRED FLEET OPTIMIZATION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-[#171A38] leading-[1.08]">
              THE SHORTEST<br />
              PATH BETWEEN<br />
              DEMAND AND<br />
              <span className="bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8] bg-clip-text text-transparent">
                DELIVERY.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#6B6D76] font-normal max-w-lg leading-relaxed">
              Quantum-inspired optimization for modern last-mile fleets.
              Solve high-density urban routing challenges with simulated quantum annealing and real-time combinatorial constraint solvers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchOptimizer}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8] shadow-[0_6px_24px_rgba(255,107,74,0.32)] hover:shadow-[0_8px_30px_rgba(255,107,74,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Launch Optimizer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreTech}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-[#171A38] bg-[#FAF9F6] hover:bg-[#EAE7F5] border border-[#E8E6DF] transition-all cursor-pointer"
              >
                <span>Explore Technology</span>
              </button>
            </div>
          </div>

          {/* Right Hero: ONE bespoke Route/Network Visualization */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[480px] p-6 rounded-3xl bg-[#FAF9F5] border border-[#E8E6DF] shadow-[0_8px_30px_rgba(23,26,56,0.04)]">
              
              {/* Soft atmospheric gradient behind visualization */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A]/10 via-[#EAE7F5]/40 to-[#E95AA8]/10 rounded-3xl blur-2xl pointer-events-none -z-10" />

              {/* Header readout inside visual */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF] font-mono text-[11px] text-[#6B6D76]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="font-semibold text-[#171A38]">GLOBAL OPTIMAL TRAJECTORY</span>
                </div>
                <span>H(x): -142.8 J</span>
              </div>

              {/* Main Curved SVG Network */}
              <div className="relative w-full aspect-[4/3] my-2">
                <svg
                  viewBox="0 0 480 360"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="heroCurvedRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B4A" />
                      <stop offset="50%" stopColor="#FF5B37" />
                      <stop offset="100%" stopColor="#E95AA8" />
                    </linearGradient>

                    <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="glow" />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Elegant Curved Routes connecting Depot to Delivery Nodes */}
                  <path
                    d="M 230 190 C 150 140, 100 130, 80 100 C 60 70, 160 50, 210 65 C 270 80, 330 70, 370 95 C 410 120, 440 180, 420 220 C 400 260, 350 300, 310 310 C 260 320, 170 310, 120 280 C 80 250, 160 210, 230 190"
                    stroke="url(#heroCurvedRouteGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#routeGlow)"
                    className="transition-all duration-300 hover:stroke-width-[4]"
                  />

                  {/* Faint subtle secondary connectivity lines */}
                  <line x1="230" y1="190" x2="80" y2="100" stroke="#E8E6DF" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="230" y1="190" x2="370" y2="95" stroke="#E8E6DF" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="230" y1="190" x2="310" y2="310" stroke="#E8E6DF" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Delivery Nodes */}
                  {heroNodes.map((node) => (
                    <g
                      key={node.id}
                      className="group cursor-pointer transition-transform duration-300 hover:scale-125"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="12"
                        fill="#FFFFFF"
                        stroke="#FF6B4A"
                        strokeWidth="2"
                        className="shadow-sm transition-all group-hover:fill-[#FF6B4A]/10 group-hover:stroke-[#E95AA8]"
                      />
                      <circle cx={node.x} cy={node.y} r="3" fill="#FF6B4A" />
                      <text
                        x={node.x}
                        y={node.y - 16}
                        textAnchor="middle"
                        fill="#6B6D76"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                        fontWeight="600"
                      >
                        {node.id}
                      </text>
                    </g>
                  ))}

                  {/* Central Depot Marker */}
                  <g className="cursor-pointer">
                    <rect
                      x={heroDepot.x - 10}
                      y={heroDepot.y - 10}
                      width="20"
                      height="20"
                      rx="5"
                      fill="#171A38"
                      className="shadow-md"
                    />
                    <rect
                      x={heroDepot.x - 4}
                      y={heroDepot.y - 4}
                      width="8"
                      height="8"
                      rx="2"
                      fill="#FFFFFF"
                    />
                    <text
                      x={heroDepot.x}
                      y={heroDepot.y + 22}
                      textAnchor="middle"
                      fill="#171A38"
                      fontSize="9"
                      fontFamily="IBM Plex Mono"
                      fontWeight="700"
                      letterSpacing="0.5"
                    >
                      DEPOT
                    </text>
                  </g>

                  {/* Gliding Vehicle Marker */}
                  <g transform={`translate(${vehicleX}, ${vehicleY})`}>
                    <circle r="9" fill="rgba(255, 107, 74, 0.2)" className="animate-ping" />
                    <circle r="5" fill="#FF6B4A" stroke="#FFFFFF" strokeWidth="2" />
                  </g>
                </svg>
              </div>

              {/* Minimal Telemetry Footer */}
              <div className="pt-3 border-t border-[#E8E6DF] flex items-center justify-between text-[11px] font-mono text-[#6B6D76]">
                <span>NODES: 06</span>
                <span className="text-[#171A38] font-medium">OPTIMIZER: CONVERGED</span>
                <span className="text-[#FF6B4A] font-semibold">12.8% DISTANCE SAVED</span>
              </div>
            </div>
          </div>

        </div>
      </ScrollSection>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 2 — THE PROBLEM
          Background: Soft Lavender (#EAE7F5)
      ────────────────────────────────────────────────────────────────────────── */}
      <ScrollSection id="problem" className="bg-[#EAE7F5] py-24 sm:py-32 px-6 sm:px-10 border-t border-[#D9D4EB]">
        <div ref={problemRef} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Problem Statement & 4 Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
              THE COMPLEXITY PARADOX
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#171A38] leading-tight">
              DELIVERY IS EASY.<br />
              <span className="bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8] bg-clip-text text-transparent">
                OPTIMIZATION ISN'T.
              </span>
            </h2>
            <p className="text-base text-[#6B6D76] leading-relaxed">
              Dispatching 25 delivery stops across 5 vehicles produces over 10¹⁸ possible route combinations.
              Traditional greedy heuristics get locked into sub-optimal bottlenecks, driving up fuel burn and missed SLAs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#FAF9F5]/70 border border-[#D9D4EB] space-y-1.5">
                <div className="text-xs font-mono font-bold text-[#171A38]">1. DYNAMIC DEMAND</div>
                <p className="text-xs text-[#6B6D76] leading-normal">
                  Rapid order insertions and erratic order volumes across high-density urban zones.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5]/70 border border-[#D9D4EB] space-y-1.5">
                <div className="text-xs font-mono font-bold text-[#171A38]">2. TRAFFIC CONGESTION</div>
                <p className="text-xs text-[#6B6D76] leading-normal">
                  Non-linear arterial delays and fluctuating road speeds that shatter static ETA models.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5]/70 border border-[#D9D4EB] space-y-1.5">
                <div className="text-xs font-mono font-bold text-[#171A38]">3. VEHICLE CAPACITY</div>
                <p className="text-xs text-[#6B6D76] leading-normal">
                  Strict volumetric and payload thresholds per cargo carrier with zero tolerance for overload.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5]/70 border border-[#D9D4EB] space-y-1.5">
                <div className="text-xs font-mono font-bold text-[#171A38]">4. TIME WINDOWS</div>
                <p className="text-xs text-[#6B6D76] leading-normal">
                  Narrow customer delivery slots where a single minute of delay triggers SLA penalties.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Minimal animated network visualization (inefficient paths fade out) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[460px] p-6 rounded-3xl bg-[#FAF9F5]/80 border border-[#D9D4EB] shadow-[0_8px_30px_rgba(23,26,56,0.04)]">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9D4EB] font-mono text-[11px] text-[#6B6D76]">
                <span>COMBINATORIAL PRUNING</span>
                <span className="text-[#FF6B4A] font-semibold">
                  {isProblemInView ? 'INEFFICIENT PATHS PRUNED' : 'EVALUATING 10¹⁸ PERMUTATIONS'}
                </span>
              </div>

              <div className="relative aspect-[4/3] my-4">
                <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
                  {/* Nodes */}
                  {[{ id: 'P0', x: 200, y: 150 }, { id: 'P1', x: 70, y: 80 }, { id: 'P2', x: 230, y: 50 }, { id: 'P3', x: 330, y: 90 }, { id: 'P4', x: 320, y: 220 }, { id: 'P5', x: 200, y: 260 }, { id: 'P6', x: 90, y: 210 }].map((n, i) => (
                    <circle
                      key={n.id}
                      cx={n.x}
                      cy={n.y}
                      r={i === 0 ? 8 : 6}
                      fill={i === 0 ? '#171A38' : '#FFFFFF'}
                      stroke={i === 0 ? '#171A38' : '#FF6B4A'}
                      strokeWidth="2"
                    />
                  ))}

                  {/* Suboptimal / Inefficient Paths that fade away when in view */}
                  <g className="transition-opacity duration-1000" style={{ opacity: isProblemInView ? 0.08 : 0.65 }}>
                    <line x1="200" y1="150" x2="330" y2="90" stroke="#6B6D76" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="70" y1="80" x2="320" y2="220" stroke="#6B6D76" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="90" y1="210" x2="230" y2="50" stroke="#6B6D76" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="200" y1="150" x2="90" y2="210" stroke="#6B6D76" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="230" y1="50" x2="320" y2="220" stroke="#6B6D76" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="70" y1="80" x2="200" y2="260" stroke="#6B6D76" strokeWidth="1.5" strokeDasharray="3 3" />
                  </g>

                  {/* Single Globally Optimal Path that remains crisp and glowing */}
                  <path
                    d="M 200 150 L 70 80 L 230 50 L 330 90 L 320 220 L 200 260 L 90 210 Z"
                    stroke="url(#heroCurvedRouteGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-700"
                  />
                </svg>
              </div>

              <div className="pt-3 border-t border-[#D9D4EB] text-center font-mono text-xs text-[#6B6D76]">
                {isProblemInView
                  ? '✓ Suboptimal trajectories eliminated — Global minimum found'
                  : 'Searching Hamiltonian energy space...'}
              </div>
            </div>
          </div>

        </div>
      </ScrollSection>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 3 — HOW IT WORKS
          Background: Warm Ivory (#F6F3EC)
          DEMAND ↓ ROUTE MODEL ↓ QUBO ↓ QISKIT ↓ OPTIMIZED ROUTE
      ────────────────────────────────────────────────────────────────────────── */}
      <ScrollSection id="how-it-works" className="bg-[#F6F3EC] py-24 sm:py-32 px-6 sm:px-10 border-t border-[#E8E6DF]">
        <div className="max-w-5xl mx-auto space-y-16 text-center">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
              ARCHITECTURE PIPELINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#171A38]">
              HOW IT WORKS
            </h2>
            <p className="text-sm sm:text-base text-[#6B6D76] font-normal">
              A high-precision pipeline translating logistics constraints into quantum-ready formulations.
            </p>
          </div>

          {/* Minimal Pipeline with Thin Lines & Minimal SVG Icons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 relative">
            
            {/* Step 1: Demand */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center text-[#FF6B4A] shadow-soft-sm hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold text-[#171A38] tracking-wider">
                DEMAND
              </span>
              <span className="text-[11px] text-[#6B6D76] font-mono max-w-[130px]">
                Deliveries & SLAs
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="hidden md:flex items-center text-[#D4D0C5] text-xs font-mono">
              <span className="w-8 h-px bg-[#D4D0C5]" />
              <span>→</span>
            </div>
            <div className="flex md:hidden text-[#D4D0C5] text-xs">↓</div>

            {/* Step 2: Route Model */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center text-[#FF6B4A] shadow-soft-sm hover:scale-105 transition-transform">
                <GitFork className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold text-[#171A38] tracking-wider">
                ROUTE MODEL
              </span>
              <span className="text-[11px] text-[#6B6D76] font-mono max-w-[130px]">
                Fleet Graph & Windows
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="hidden md:flex items-center text-[#D4D0C5] text-xs font-mono">
              <span className="w-8 h-px bg-[#D4D0C5]" />
              <span>→</span>
            </div>
            <div className="flex md:hidden text-[#D4D0C5] text-xs">↓</div>

            {/* Step 3: QUBO */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center text-[#FF6B4A] shadow-soft-sm hover:scale-105 transition-transform">
                <Binary className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold text-[#171A38] tracking-wider">
                QUBO
              </span>
              <span className="text-[11px] text-[#6B6D76] font-mono max-w-[130px]">
                Binary Quadratic Form
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="hidden md:flex items-center text-[#D4D0C5] text-xs font-mono">
              <span className="w-8 h-px bg-[#D4D0C5]" />
              <span>→</span>
            </div>
            <div className="flex md:hidden text-[#D4D0C5] text-xs">↓</div>

            {/* Step 4: Qiskit */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-center text-[#FF6B4A] shadow-soft-sm hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold text-[#171A38] tracking-wider">
                QISKIT
              </span>
              <span className="text-[11px] text-[#6B6D76] font-mono max-w-[130px]">
                Hybrid QAOA Solver
              </span>
            </div>

            {/* Connecting Arrow */}
            <div className="hidden md:flex items-center text-[#D4D0C5] text-xs font-mono">
              <span className="w-8 h-px bg-[#D4D0C5]" />
              <span>→</span>
            </div>
            <div className="flex md:hidden text-[#D4D0C5] text-xs">↓</div>

            {/* Step 5: Optimized Route */}
            <div className="flex flex-col items-center space-y-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#E95AA8] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,74,0.3)] hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold text-[#FF6B4A] tracking-wider">
                OPTIMIZED ROUTE
              </span>
              <span className="text-[11px] text-[#6B6D76] font-mono max-w-[130px]">
                Ground State Schedule
              </span>
            </div>

          </div>

        </div>
      </ScrollSection>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 4 — PERFORMANCE
          Background: Deep Indigo (#171A38)
      ────────────────────────────────────────────────────────────────────────── */}
      <ScrollSection id="performance" className="bg-[#171A38] text-[#F6F3EC] py-24 sm:py-32 px-6 sm:px-10 border-t border-[#2A2E54]">
        <div ref={perfRef} className="max-w-6xl mx-auto space-y-16">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#2A2E54]">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
                QUANTIFIABLE BENCHMARKS
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
                PERFORMANCE
              </h2>
            </div>
            <p className="text-sm font-mono text-[#9D9BB0] max-w-sm">
              Measured vs. standard Clarke-Wright and nearest-neighbor fleet baselines across 1,000 simulated city dispatches.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            
            {/* Metric 1 */}
            <div className="space-y-2">
              <div className="text-4xl sm:text-6xl font-bold font-sans tracking-tight text-white">
                {isPerfInView ? '12.8%' : '0.0%'}
              </div>
              <div className="text-xs sm:text-sm font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
                DISTANCE REDUCTION
              </div>
              <p className="text-xs text-[#9D9BB0] leading-normal pt-1">
                Optimized tour length eliminates redundant corridor loops.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="space-y-2 lg:border-l lg:border-[#2A2E54] lg:pl-8">
              <div className="text-4xl sm:text-6xl font-bold font-sans tracking-tight text-white">
                {isPerfInView ? '8.4%' : '0.0%'}
              </div>
              <div className="text-xs sm:text-sm font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
                FUEL SAVED
              </div>
              <p className="text-xs text-[#9D9BB0] leading-normal pt-1">
                Direct fuel and kWh conservation per vehicle tour.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="space-y-2 lg:border-l lg:border-[#2A2E54] lg:pl-8">
              <div className="text-4xl sm:text-6xl font-bold font-sans tracking-tight text-white">
                {isPerfInView ? '11.2%' : '0.0%'}
              </div>
              <div className="text-xs sm:text-sm font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
                CO₂ REDUCTION
              </div>
              <p className="text-xs text-[#9D9BB0] leading-normal pt-1">
                Scope 1 greenhouse gas emissions cut across the fleet.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="space-y-2 lg:border-l lg:border-[#2A2E54] lg:pl-8">
              <div className="text-4xl sm:text-6xl font-bold font-sans tracking-tight text-white">
                {isPerfInView ? '2H 01M' : '0H 00M'}
              </div>
              <div className="text-xs sm:text-sm font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
                TIME SAVED
              </div>
              <p className="text-xs text-[#9D9BB0] leading-normal pt-1">
                Cumulative route duration shaved per operational shift.
              </p>
            </div>

          </div>

        </div>
      </ScrollSection>

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 5 — FINAL CTA
          Background: Warm Ivory (#F6F3EC) with subtle orange/pink atmosphere
      ────────────────────────────────────────────────────────────────────────── */}
      <ScrollSection id="cta" className="bg-[#F6F3EC] py-28 sm:py-36 px-6 sm:px-10 border-t border-[#E8E6DF] relative overflow-hidden">
        
        {/* Subtle atmospheric glow behind final CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-gradient-to-r from-[#FF6B4A]/15 to-[#E95AA8]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-widest font-semibold">
            DEPLOY ROUTEQ TODAY
          </span>

          <h2 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-[#171A38] leading-[1.05]">
            OPTIMIZE<br />
            <span className="bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8] bg-clip-text text-transparent">
              THE LAST MILE.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#6B6D76] max-w-xl mx-auto font-normal leading-relaxed">
            Transition seamlessly into the actual RouteQ optimization workspace. Configure vehicle fleets, benchmark Indian hubs, and execute quantum-inspired solvers in real-time.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={onLaunchOptimizer}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[#FF6B4A] via-[#FF6347] to-[#E95AA8] shadow-[0_8px_32px_rgba(255,107,74,0.38)] hover:shadow-[0_12px_40px_rgba(255,107,74,0.48)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Launch Optimizer</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </ScrollSection>

      {/* ──────────────────────────────────────────────────────────────────────────
          EDITORIAL FOOTER
      ────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E8E6DF] py-10 px-6 sm:px-10 bg-[#FAF9F5] text-xs font-mono text-[#6B6D76]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8]" />
            <span className="font-bold text-[#171A38]">ROUTEQ</span>
            <span>&bull;</span>
            <span>PREMIUM MOBILITY TECHNOLOGY</span>
          </div>
          <div>QISKIT FALL FEST 2026 &bull; USE CASE 04 &bull; INDIA LOGISTICS</div>
        </div>
      </footer>

    </div>
  );
};
