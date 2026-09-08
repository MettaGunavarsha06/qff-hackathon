import React, { useState, useEffect } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onLaunchOptimizer: () => void;
  onExploreTech: () => void;
}

// Stagger & reveal animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' } 
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
}) => {
  // Hero Interactive Visual state
  const [heroOptimized, setHeroOptimized] = useState(true);

  // Problem section route collapse state
  const [problemCollapsed, setProblemCollapsed] = useState(false);

  // How it works active step
  const [activeStep, setActiveStep] = useState(0);

  // Live Map interactive node hover state
  const [hoveredNode, setHoveredNode] = useState<{
    id: string;
    label: string;
    demand: string;
    timeWindow: string;
    priority: string;
    x: number;
    y: number;
  } | null>(null);

  // Vehicle animation loop on Live Route map
  const [vehicleProgress, setVehicleProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleProgress((prev) => (prev >= 100 ? 0 : prev + 0.8));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Performance numbers counter animation
  const statsRef = React.useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-50px' });

  // Hero Nodes Data
  const heroNodes = [
    { id: 'n1', x: 80, y: 90 },
    { id: 'n2', x: 220, y: 60 },
    { id: 'n3', x: 340, y: 110 },
    { id: 'n4', x: 130, y: 230 },
    { id: 'n5', x: 310, y: 220 },
    { id: 'n6', x: 210, y: 310 },
  ];
  const heroDepot = { x: 210, y: 170 };

  // Live Route Visualization Nodes (10 delivery nodes + 1 depot)
  const mapNodes = [
    { id: 'D-014', label: 'Sector 4 Hub', demand: '8.4 kg', timeWindow: '10:00–12:00', priority: 'High', x: 120, y: 130 },
    { id: 'D-021', label: 'North Plaza', demand: '12.0 kg', timeWindow: '09:30–11:30', priority: 'Standard', x: 240, y: 80 },
    { id: 'D-035', label: 'BioPark Lab', demand: '4.2 kg', timeWindow: '11:00–13:00', priority: 'Critical', x: 380, y: 100 },
    { id: 'D-042', label: 'East Terminal', demand: '15.6 kg', timeWindow: '10:30–12:30', priority: 'Standard', x: 490, y: 160 },
    { id: 'D-058', label: 'Financial District', demand: '6.1 kg', timeWindow: '13:00–15:00', priority: 'Standard', x: 460, y: 280 },
    { id: 'D-063', label: 'Bay Logistics', demand: '18.0 kg', timeWindow: '11:30–13:30', priority: 'High', x: 360, y: 340 },
    { id: 'D-079', label: 'Civic Center', demand: '9.5 kg', timeWindow: '14:00–16:00', priority: 'Standard', x: 220, y: 360 },
    { id: 'D-088', label: 'Westside Medical', demand: '3.8 kg', timeWindow: '09:00–11:00', priority: 'Critical', x: 90, y: 270 },
    { id: 'D-092', label: 'Apex Tech Campus', demand: '14.2 kg', timeWindow: '13:30–15:30', priority: 'Standard', x: 180, y: 210 },
    { id: 'D-104', label: 'Central Depot Area', demand: '7.0 kg', timeWindow: '12:00–14:00', priority: 'High', x: 330, y: 200 },
  ];
  const mapDepot = { x: 280, y: 230, label: 'Central Fleet Base' };

  // Calculate vehicle point along route path
  const routeWaypoints = [
    mapDepot,
    mapNodes[1], // D-021
    mapNodes[2], // D-035
    mapNodes[3], // D-042
    mapNodes[4], // D-058
    mapNodes[5], // D-063
    mapNodes[6], // D-079
    mapNodes[7], // D-088
    mapNodes[0], // D-014
    mapNodes[8], // D-092
    mapNodes[9], // D-104
    mapDepot
  ];

  const totalSegments = routeWaypoints.length - 1;
  const currentSegmentIndex = Math.min(
    Math.floor((vehicleProgress / 100) * totalSegments),
    totalSegments - 1
  );
  const segmentFraction = ((vehicleProgress / 100) * totalSegments) - currentSegmentIndex;
  const currentP1 = routeWaypoints[currentSegmentIndex];
  const currentP2 = routeWaypoints[currentSegmentIndex + 1];
  const vehicleX = currentP1.x + (currentP2.x - currentP1.x) * segmentFraction;
  const vehicleY = currentP1.y + (currentP2.y - currentP1.y) * segmentFraction;

  const stepsData = [
    {
      num: '01',
      title: 'DEMAND',
      desc: 'Real-time order coordinates, load payload, time window SLA, and service duration ingestion.',
    },
    {
      num: '02',
      title: 'ROUTE MODEL',
      desc: 'Dynamic graph matrix construction with real-time congestion and physical vehicle capacity constraints.',
    },
    {
      num: '03',
      title: 'QUBO',
      desc: 'Quadratic Unconstrained Binary Optimization formulation penalizing SLA violations and sub-optimal distance.',
    },
    {
      num: '04',
      title: 'QISKIT',
      desc: 'Hybrid quantum annealing and classical heuristics resolving the combinatorial Hamiltonian energy landscape.',
    },
    {
      num: '05',
      title: 'DISPATCH',
      desc: 'Turn-by-turn fleet dispatch with deterministic waypoint sequencing and dynamic rerouting resilience.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] selection:bg-[#FF5500]/20 selection:text-white">
      
      {/* ─── MINIMAL NAVIGATION ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#080808]/85 backdrop-blur-md border-b border-white/[0.06] transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 tracking-widest font-display text-sm font-semibold uppercase text-white hover:text-white/80 transition-colors">
              <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#FF5500] to-[#EC4899]" />
              ROUTEQ
            </a>
            
            <div className="hidden md:flex items-center gap-6 text-xs text-[#8A8A8E]">
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a href="#live-route" className="hover:text-white transition-colors">Live Route</a>
              <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            </div>
          </div>

          <button
            onClick={onLaunchOptimizer}
            className="btn-minimal-primary text-xs !py-2 !px-4"
          >
            Launch App
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 space-y-36 pt-16 pb-28">

        {/* ─── SECTION 1: HERO ────────────────────────────────────────────── */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8"
        >
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#8A8A8E] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              ROUTEQ &bull; QISKIT FALL FEST 2026
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white"
            >
              THE SHORTEST<br />
              PATH BETWEEN<br />
              DEMAND AND<br />
              <span className="accent-gradient-text">DELIVERY.</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#8A8A8E] max-w-lg font-light leading-relaxed"
            >
              Quantum-inspired optimization for modern last-mile fleets. Solving high-dimensional vehicle routing in milliseconds.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchOptimizer}
                className="btn-minimal-primary"
              >
                Launch Optimizer
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreTech}
                className="btn-minimal-outline"
              >
                Explore Technology
              </button>
            </motion.div>
          </div>

          {/* Right Column: ONE Single Clean Visual (Abstract Route Network) */}
          <motion.div 
            variants={fadeInUp}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-2xl bg-[#0D0D0D] border border-white/[0.08] p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
              
              {/* Subtle top indicator */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8E]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
                  <span>HAMILTONIAN TOPOLOGY</span>
                </div>
                <button 
                  onClick={() => setHeroOptimized(!heroOptimized)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  [{heroOptimized ? 'OPTIMIZED' : 'UNORDERED'}]
                </button>
              </div>

              {/* Minimal SVG Network */}
              <div className="relative w-full flex-1 flex items-center justify-center">
                <svg viewBox="0 0 420 380" className="w-full h-full">
                  <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5500" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connecting Route Lines */}
                  {heroOptimized ? (
                    // Optimized Clean Loop
                    <g filter="url(#subtleGlow)">
                      <path
                        d="M 210,170 L 80,90 L 220,60 L 340,110 L 310,220 L 210,310 L 130,230 Z"
                        fill="none"
                        stroke="url(#heroGradient)"
                        strokeWidth="2"
                        strokeDasharray="400"
                        strokeDashoffset="0"
                        className="transition-all duration-700"
                      />
                    </g>
                  ) : (
                    // Unoptimized Criss-Cross
                    <g opacity="0.3">
                      <path
                        d="M 210,170 L 340,110 L 130,230 L 220,60 L 210,310 L 80,90 L 310,220 Z"
                        fill="none"
                        stroke="#8A8A8E"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                    </g>
                  )}

                  {/* Delivery Nodes */}
                  {heroNodes.map((node) => (
                    <g key={node.id} className="transition-transform duration-300 hover:scale-125">
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="4.5"
                        fill="#0D0D0D"
                        stroke="#F5F5F5"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="1.5"
                        fill="#FF5500"
                      />
                    </g>
                  ))}

                  {/* Central Depot Node */}
                  <g>
                    <rect
                      x={heroDepot.x - 7}
                      y={heroDepot.y - 7}
                      width="14"
                      height="14"
                      rx="3"
                      fill="#F5F5F5"
                    />
                    <rect
                      x={heroDepot.x - 3}
                      y={heroDepot.y - 3}
                      width="6"
                      height="6"
                      rx="1"
                      fill="#080808"
                    />
                  </g>
                </svg>
              </div>

              {/* Minimal Telemetry Footer */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#8A8A8E]">
                <span>NODES: 06</span>
                <span className="text-white">ENERGY H(x): {heroOptimized ? '-142.8 J' : '-48.2 J'}</span>
                <span className={heroOptimized ? 'text-[#FF5500]' : 'text-[#8A8A8E]'}>
                  {heroOptimized ? 'CONVERGED' : 'SEARCHING'}
                </span>
              </div>

            </div>
          </motion.div>
        </motion.section>

        {/* ─── SECTION 2: PROBLEM ─────────────────────────────────────────── */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="border-t border-white/[0.08] pt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Editorial Statement Left */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
                01 &bull; COMPLEXITY
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                DELIVERY IS EASY.<br />
                <span className="text-[#8A8A8E]">OPTIMIZATION ISN'T.</span>
              </h2>

              <p className="text-base text-[#8A8A8E] font-light leading-relaxed">
                Dynamic demand, traffic, vehicle capacity and delivery time windows create a difficult combinatorial optimization problem. As stop counts grow linearly, possible route permutations explode factorially at <span className="font-mono text-white">O(n!)</span>.
              </p>

              <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#8A8A8E]">
                <div>
                  <span className="block text-white text-lg font-semibold">25 Stops</span>
                  <span>1.5 &times; 10²⁵ combinations</span>
                </div>
                <div className="h-8 w-px bg-white/[0.08]" />
                <div>
                  <span className="block text-white text-lg font-semibold">&lt; 400 ms</span>
                  <span>RouteQ solution time</span>
                </div>
              </div>
            </div>

            {/* Simple Animated Route Network Right */}
            <div className="lg:col-span-6 flex justify-center">
              <div 
                onClick={() => setProblemCollapsed(!problemCollapsed)}
                className="w-full max-w-md bg-[#0D0D0D] border border-white/[0.08] rounded-xl p-6 cursor-pointer hover:border-white/20 transition-all"
              >
                <div className="flex justify-between text-[11px] font-mono text-[#8A8A8E] mb-4">
                  <span>SOLUTION SPACE COLLAPSE</span>
                  <span className="text-[#FF5500]">[CLICK TO TOGGLE]</span>
                </div>

                <svg viewBox="0 0 380 260" className="w-full h-48">
                  {/* Multiple faint potential routes */}
                  {!problemCollapsed && (
                    <g opacity="0.18" stroke="#8A8A8E" strokeWidth="1" strokeDasharray="2 3">
                      <path d="M 60,60 L 190,40 L 320,80 L 260,200 L 120,210 Z" fill="none" />
                      <path d="M 60,60 L 260,200 L 190,40 L 120,210 L 320,80 Z" fill="none" />
                      <path d="M 190,40 L 60,60 L 120,210 L 320,80 L 260,200 Z" fill="none" />
                    </g>
                  )}

                  {/* Clean Optimal Hamiltonian Path */}
                  <path
                    d="M 60,60 L 190,40 L 320,80 L 260,200 L 120,210 Z"
                    fill="none"
                    stroke={problemCollapsed ? '#FF5500' : 'rgba(255,255,255,0.85)'}
                    strokeWidth={problemCollapsed ? '2.5' : '1.5'}
                    className="transition-all duration-500"
                  />

                  {/* Nodes */}
                  {[
                    { x: 60, y: 60, label: 'N1' },
                    { x: 190, y: 40, label: 'N2' },
                    { x: 320, y: 80, label: 'N3' },
                    { x: 260, y: 200, label: 'N4' },
                    { x: 120, y: 210, label: 'N5' },
                  ].map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#0D0D0D"
                      stroke="#F5F5F5"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                <p className="text-xs text-[#8A8A8E] text-center font-mono mt-2">
                  {problemCollapsed 
                    ? '✓ Quantum Annealing collapsed 3.6M paths to 1 global minimum' 
                    : 'Searching 120 factorial permutations in classical matrix'}
                </p>
              </div>
            </div>

          </div>
        </motion.section>

        {/* ─── SECTION 3: HOW IT WORKS ────────────────────────────────────── */}
        <motion.section 
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="border-t border-white/[0.08] pt-24 space-y-12"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
                02 &bull; PIPELINE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                HOW IT WORKS
              </h2>
            </div>
            <p className="text-xs font-mono text-[#8A8A8E]">
              5-STAGE DETERMINISTIC REASONING
            </p>
          </div>

          {/* 5 Horizontal Steps Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {stepsData.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`relative p-5 rounded-lg border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#121212] border-white/20 shadow-lg'
                      : 'bg-[#0D0D0D] border-white/[0.06] hover:border-white/12'
                  }`}
                >
                  {/* Subtle top indicator bar */}
                  {isSelected && (
                    <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#FF5500] to-[#EC4899] rounded-full" />
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#8A8A8E] font-medium">
                      {step.num}
                    </span>
                    {idx < stepsData.length - 1 && (
                      <ChevronRight className="hidden md:block w-3.5 h-3.5 text-white/20" />
                    )}
                  </div>

                  <h3 className={`text-sm font-display font-semibold mb-2 tracking-wide ${
                    isSelected ? 'text-white' : 'text-[#8A8A8E]'
                  }`}>
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#8A8A8E] leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ─── SECTION 4: LIVE ROUTE VISUALIZATION & PERFORMANCE ───────────── */}
        <motion.section 
          id="live-route"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="border-t border-white/[0.08] pt-24 space-y-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
                03 &bull; LIVE CARTOGRAPHY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                LIVE ROUTE VISUALIZATION
              </h2>
            </div>
            <div className="text-xs font-mono text-[#8A8A8E] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>ACTIVE DISPATCH TELEMETRY</span>
            </div>
          </div>

          {/* Large Interactive Minimal Dark Map */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl bg-[#0D0D0D] border border-white/[0.08] overflow-hidden p-4 sm:p-8 flex items-center justify-center">
            
            <svg viewBox="0 0 580 420" className="w-full h-full max-w-4xl">
              <defs>
                <linearGradient id="routeGradLive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF5500" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />

              {/* Optimized SVG Route Polyline */}
              <path
                d="M 280,230 L 240,80 L 380,100 L 490,160 L 460,280 L 360,340 L 220,360 L 90,270 L 120,130 L 180,210 L 330,200 Z"
                fill="none"
                stroke="url(#routeGradLive)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Delivery Nodes */}
              {mapNodes.map((node) => (
                <g 
                  key={node.id} 
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={hoveredNode?.id === node.id ? "7" : "5"}
                    fill="#0D0D0D"
                    stroke={hoveredNode?.id === node.id ? "#FF5500" : "#F5F5F5"}
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="2"
                    fill={hoveredNode?.id === node.id ? "#FF5500" : "rgba(255,255,255,0.4)"}
                  />
                  <text
                    x={node.x + 8}
                    y={node.y + 3}
                    fill="#8A8A8E"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {node.id}
                  </text>
                </g>
              ))}

              {/* Depot Node */}
              <g>
                <rect
                  x={mapDepot.x - 9}
                  y={mapDepot.y - 9}
                  width="18"
                  height="18"
                  rx="4"
                  fill="#F5F5F5"
                />
                <rect
                  x={mapDepot.x - 4}
                  y={mapDepot.y - 4}
                  width="8"
                  height="8"
                  rx="1"
                  fill="#080808"
                />
                <text
                  x={mapDepot.x - 22}
                  y={mapDepot.y + 20}
                  fill="#F5F5F5"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  DEPOT
                </text>
              </g>

              {/* Moving Vehicle Marker Pulse */}
              <g transform={`translate(${vehicleX}, ${vehicleY})`}>
                <circle r="8" fill="rgba(255, 85, 0, 0.25)" className="animate-ping" />
                <circle r="4" fill="#FF5500" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredNode && (
              <div 
                className="absolute z-20 pointer-events-none bg-[#121212] border border-white/20 rounded-md p-3 text-xs shadow-2xl space-y-1 transition-all"
                style={{
                  left: `${(hoveredNode.x / 580) * 85}%`,
                  top: `${(hoveredNode.y / 420) * 80}%`,
                }}
              >
                <div className="font-mono font-semibold text-white flex items-center justify-between gap-4">
                  <span>{hoveredNode.id}</span>
                  <span className={`text-[10px] uppercase ${
                    hoveredNode.priority === 'Critical' ? 'text-[#EC4899]' : 'text-[#8A8A8E]'
                  }`}>
                    {hoveredNode.priority}
                  </span>
                </div>
                <div className="text-[11px] text-[#8A8A8E]">{hoveredNode.label}</div>
                <div className="text-[11px] font-mono text-white/80 pt-1 border-t border-white/[0.08] flex justify-between gap-4">
                  <span>Demand: {hoveredNode.demand}</span>
                  <span>{hoveredNode.timeWindow}</span>
                </div>
              </div>
            )}
          </div>

          {/* Performance Section: 4 Large Numbers Separated by Thin Vertical Lines */}
          <div ref={statsRef} className="pt-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-white/[0.08]">
              
              {/* Metric 1 */}
              <div className="space-y-1 text-center lg:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
                  {isStatsInView ? '12.8%' : '0.0%'}
                </div>
                <div className="text-xs font-mono text-[#8A8A8E] tracking-wider uppercase">
                  Distance Reduction
                </div>
              </div>

              {/* Metric 2 */}
              <div className="space-y-1 text-center lg:text-left lg:border-l lg:border-white/[0.08] lg:pl-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
                  {isStatsInView ? '8.4%' : '0.0%'}
                </div>
                <div className="text-xs font-mono text-[#8A8A8E] tracking-wider uppercase">
                  Fuel Saved
                </div>
              </div>

              {/* Metric 3 */}
              <div className="space-y-1 text-center lg:text-left lg:border-l lg:border-white/[0.08] lg:pl-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
                  {isStatsInView ? '11.2%' : '0.0%'}
                </div>
                <div className="text-xs font-mono text-[#8A8A8E] tracking-wider uppercase">
                  CO₂ Reduction
                </div>
              </div>

              {/* Metric 4 */}
              <div className="space-y-1 text-center lg:text-left lg:border-l lg:border-white/[0.08] lg:pl-8">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
                  {isStatsInView ? '2H 01M' : '0H 00M'}
                </div>
                <div className="text-xs font-mono text-[#8A8A8E] tracking-wider uppercase">
                  Time Saved / Shift
                </div>
              </div>

            </div>
          </div>
        </motion.section>

        {/* ─── SECTION 5: QUANTUM TECHNOLOGY + FINAL CTA ───────────────────── */}
        <motion.section 
          id="technology"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="border-t border-white/[0.08] pt-24 space-y-24"
        >
          {/* Quantum Technology Flow Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono text-[#8A8A8E] uppercase tracking-wider">
                04 &bull; HYBRID ARCHITECTURE
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                OPTIMIZATION,<br />
                <span className="accent-gradient-text">RETHOUGHT.</span>
              </h2>

              <div className="space-y-4 text-sm text-[#8A8A8E] font-light leading-relaxed">
                <p>
                  Classical solvers struggle with exponential state spaces when balancing multiple dynamic constraints. RouteQ transforms vehicle capacity, time windows, and traffic delays into a Quadratic Unconstrained Binary Optimization (QUBO) Hamiltonian.
                </p>
                <p>
                  Using IBM Qiskit and simulated quantum annealing algorithms, the solver tunnels through local energy barriers to identify mathematically optimal fleet configurations in sub-second intervals.
                </p>
              </div>
            </div>

            {/* Clean Flow Diagram Right */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md bg-[#0D0D0D] border border-white/[0.08] rounded-xl p-6 space-y-4">
                <div className="text-[11px] font-mono text-[#8A8A8E] uppercase tracking-wider border-b border-white/[0.06] pb-3 flex justify-between">
                  <span>EXECUTION WORKFLOW</span>
                  <span className="text-white">IBM QISKIT HYBRID</span>
                </div>

                {/* Workflow Stack */}
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { step: '01', title: 'CLASSICAL PREPROCESSING', desc: 'Haversine distance & traffic matrix' },
                    { step: '02', title: 'QUBO FORMULATION', desc: 'H(x) = xᵀ Q x + λ_penalties' },
                    { step: '03', title: 'QISKIT / SQA ENGINE', desc: 'Transverse field annealing Γ(t)' },
                    { step: '04', title: 'ENERGY MINIMIZATION', desc: 'Constraint validation & pruning' },
                    { step: '05', title: 'OPTIMAL ROUTE DISPATCH', desc: 'Deterministic turn-by-turn routes' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3 p-2.5 rounded bg-[#121212] border border-white/[0.04]">
                      <span className="text-[10px] text-[#FF5500] font-bold">{item.step}</span>
                      <div className="flex-1">
                        <div className="text-[#F5F5F5] font-semibold text-[11px]">{item.title}</div>
                        <div className="text-[10px] text-[#8A8A8E]">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* Final CTA: Large Heading & Single Button */}
          <div className="pt-16 pb-8 text-center space-y-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white">
              OPTIMIZE<br />
              <span className="text-[#8A8A8E]">THE LAST MILE.</span>
            </h2>

            <div className="flex justify-center pt-2">
              <button
                onClick={onLaunchOptimizer}
                className="btn-minimal-primary text-base !py-3.5 !px-8"
              >
                Launch Route Optimizer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#8A8A8E]">
              Zero installation required &bull; Browser-accelerated SQA & Qiskit API
            </p>
          </div>

        </motion.section>

      </main>

      {/* ─── MINIMAL FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-8 text-xs font-mono text-[#8A8A8E]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
            <span>ROUTEQ &bull; USE CASE 04</span>
          </div>
          <div>QISKIT FALL FEST 2026</div>
        </div>
      </footer>

    </div>
  );
};
