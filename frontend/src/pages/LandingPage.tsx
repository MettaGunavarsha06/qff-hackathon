import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Layers,
  Cpu,
  Route,
  Zap,
  GitCommit,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchOptimizer: () => void;
  onExploreTech?: () => void;
}

// Sophisticated, soft easing curve (POP -> SETTLE without cartoon bounce)
const popEase = [0.16, 1, 0.3, 1] as const;
const smoothEase = [0.22, 1, 0.36, 1] as const;

/* ─── SCROLL-DIRECTION-AWARE CONTINUOUS POP LAYER TRANSITIONS ──────────── */
interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  className = '',
  id,
  isFirst = false,
  isLast = false,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Viewport-relative scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: isFirst
      ? ['start start', 'end start']
      : isLast
      ? ['start end', 'end end']
      : ['start end', 'end start'],
  });

  // Reversible transforms with subtle POP -> SETTLE effect:
  // Scrolling DOWN:
  // - Entering: scale 0.95 -> 1.008 -> 1, y 60px -> -2px -> 0, opacity 0 -> 1, blur 6px -> 0
  // - Leaving: scale 1 -> 0.96, y 0 -> -60px, opacity 1 -> 0, blur 0 -> 6px
  // Scrolling UP:
  // - Upper section enters: scale 0.95 -> 1, y -60px -> 0, opacity 0 -> 1, blur 6px -> 0
  // - Lower section leaves: scale 1 -> 0.96, y 0 -> 60px, opacity 1 -> 0, blur 0 -> 6px

  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [0, 0.2, 0.65, 1.0]
      : isLast
      ? [0, 0.25, 0.7, 1.0]
      : [0, 0.16, 0.38, 0.68, 0.88, 1.0],
    isFirst
      ? [1, 1, 0.45, 0]
      : isLast
      ? [0, 0.4, 1, 1]
      : [0, 0.5, 1, 1, 0.5, 0]
  );

  const y = useTransform(
    scrollYProgress,
    isFirst
      ? [0, 0.2, 0.65, 1.0]
      : isLast
      ? [0, 0.25, 0.65, 0.75, 1.0]
      : [0, 0.16, 0.36, 0.42, 0.68, 0.88, 1.0],
    isFirst
      ? [0, 0, -25, -60]
      : isLast
      ? [60, 20, -2, 0, 0]
      : [60, 20, -2, 0, 0, -25, -60]
  );

  const blurAmount = useTransform(
    scrollYProgress,
    isFirst
      ? [0, 0.2, 0.65, 1.0]
      : isLast
      ? [0, 0.25, 0.7, 1.0]
      : [0, 0.16, 0.38, 0.68, 0.88, 1.0],
    isFirst
      ? [0, 0, 3, 6]
      : isLast
      ? [6, 2.5, 0, 0]
      : [6, 2.5, 0, 0, 2.5, 6]
  );

  const scale = useTransform(
    scrollYProgress,
    isFirst
      ? [0, 0.2, 0.65, 1.0]
      : isLast
      ? [0, 0.25, 0.65, 0.75, 1.0]
      : [0, 0.16, 0.36, 0.42, 0.68, 0.88, 1.0],
    isFirst
      ? [1, 1, 0.985, 0.96]
      : isLast
      ? [0.95, 0.985, 1.008, 1, 1]
      : [0.95, 0.985, 1.008, 1, 1, 0.985, 0.96]
  );

  const filter = useTransform(blurAmount, (v) =>
    shouldReduceMotion ? 'none' : `blur(${v}px)`
  );

  return (
    <section id={id} ref={sectionRef} className={`relative ${className}`}>
      <motion.div
        style={{
          opacity,
          y: shouldReduceMotion ? 0 : y,
          filter,
          scale: shouldReduceMotion ? 1 : scale,
        }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </section>
  );
};

/* ─── SUBTLE STAGGERED ELEMENT WRAPPER (15-25PX MOVEMENT) ──────────────── */
interface StaggerItemProps {
  children: React.ReactNode;
  delayMs?: number;
  yOffset?: number;
  scaleFrom?: number;
  className?: string;
}

const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  delayMs = 0,
  yOffset = 18,
  scaleFrom = 1,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, scale: scaleFrom }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: yOffset, scale: scaleFrom }
      }
      transition={{
        duration: 0.65,
        delay: delayMs / 1000,
        ease: popEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── ANIMATED STATISTIC NUMBER WITH POP & UPWARD COUNT ─────────────────── */
interface AnimatedStatNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  isTime?: boolean;
}

const AnimatedStatNumber: React.FC<AnimatedStatNumberProps> = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 1,
  isTime = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-60px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setDisplayValue(0);
      return;
    }

    let startTime: number | null = null;
    const duration = 1300; // 1.3s smooth upward counter

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Soft easeOutQuart curve
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(eased * value);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value]);

  if (isTime) {
    const totalMinutes = Math.round(displayValue);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.6, ease: popEase }}
        className="text-4xl sm:text-6xl font-bold font-sans text-white tracking-tight will-change-transform"
      >
        {hrs}H {mins.toString().padStart(2, '0')}M
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.6, ease: popEase }}
      className="text-4xl sm:text-6xl font-bold font-sans text-white tracking-tight will-change-transform"
    >
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </motion.div>
  );
};

/* ─── MAIN LANDING PAGE COMPONENT ───────────────────────────────────────── */
export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchOptimizer,
}) => {
  // Real-time Scroll Direction Detection
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    if (Math.abs(diff) > 2) {
      setScrollDirection(diff > 0 ? 'down' : 'up');
    }
  });

  // Hero Interactive Visual State
  const [heroOptimized, setHeroOptimized] = useState(true);

  // Section 2: Interactive Problem State
  const [problemStage, setProblemStage] = useState<'chaos' | 'pruning' | 'optimal'>('optimal');

  // Hero Animation Glider
  const [gliderStep, setGliderStep] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setGliderStep((prev) => (prev >= 100 ? 0 : prev + 0.65));
    }, 35);
    return () => clearInterval(timer);
  }, []);

  // Hero SVG Network Topology Coordinates
  const heroDepot = { x: 210, y: 190 };
  const heroNodes = [
    { id: '1', x: 80, y: 95, label: 'Koramangala' },
    { id: '2', x: 230, y: 60, label: 'Indiranagar' },
    { id: '3', x: 350, y: 115, label: 'Whitefield' },
    { id: '4', x: 320, y: 245, label: 'Bellandur' },
    { id: '5', x: 210, y: 325, label: 'HSR Layout' },
    { id: '6', x: 110, y: 235, label: 'Jayanagar' },
  ];

  // Glider calculation along waypoints
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
  const currentSegIdx = Math.min(
    Math.floor((gliderStep / 100) * numSegments),
    numSegments - 1
  );
  const segFraction = ((gliderStep / 100) * numSegments) - currentSegIdx;
  const pA = waypoints[currentSegIdx];
  const pB = waypoints[currentSegIdx + 1];
  const gliderX = pA.x + (pB.x - pA.x) * segFraction;
  const gliderY = pA.y + (pB.y - pA.y) * segFraction;

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#F6F3EC] text-[#202124] selection:bg-[#FF6B4A]/20 selection:text-[#202124] relative overflow-hidden font-sans">
      
      {/* ─── MINIMAL EDITORIAL PUBLIC HEADER (LANDING ONLY) ────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F6F3EC]/85 backdrop-blur-md border-b border-[#E8E6DF]/70 transition-all">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Monogram */}
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#E95AA8] flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,74,0.35)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="font-bold text-sm tracking-wider text-[#202124]">
              ROUTEQ
            </span>

            {/* Real-time Direction Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E8E6DF] text-[10px] font-mono text-[#6B6D76]">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  scrollDirection === 'down' ? 'bg-[#FF6B4A]' : 'bg-[#10B981]'
                }`}
              />
              <span className="font-medium">
                {scrollDirection === 'down' ? 'SCROLLING DOWN ↓' : 'SCROLLING UP ↑'}
              </span>
            </div>
          </div>

          {/* Minimal Section Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-[#6B6D76]">
            <button
              onClick={() => scrollToSection('problem')}
              className="hover:text-[#202124] transition-colors relative py-1 group cursor-pointer"
            >
              <span>The Problem</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#202124] transition-colors relative py-1 group cursor-pointer"
            >
              <span>Architecture</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => scrollToSection('performance')}
              className="hover:text-[#202124] transition-colors relative py-1 group cursor-pointer"
            >
              <span>Performance</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6B4A] group-hover:w-full transition-all duration-300" />
            </button>
          </nav>

          {/* Primary Action Button */}
          <button
            onClick={onLaunchOptimizer}
            className="btn-primary-gradient !py-2 !px-4 text-xs !font-semibold group cursor-pointer"
          >
            <span>Launch Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* ─── SECTION 1: HERO (WARM IVORY) — ELEGANT ENTRANCE ──────────────── */}
      <ScrollSection id="hero" isFirst={true} className="min-h-[92vh] flex flex-col justify-center pt-28 sm:pt-36 pb-20 sm:pb-28 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tag / Monogram */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 border border-[#E8E6DF] shadow-soft-sm text-xs font-mono text-[#6B6D76]">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8]" />
              <span className="font-semibold text-[#202124]">QUANTUM MOBILITY</span>
              <span className="text-[#D6D4CC]">&bull;</span>
              <span>ENTERPRISE LAST-MILE</span>
            </div>

            {/* Large Editorial Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#202124] leading-[1.02]">
                THE SHORTEST
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#202124] leading-[1.02]">
                PATH BETWEEN
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#202124] leading-[1.02]">
                DEMAND AND
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
                <span className="accent-gradient-text">DELIVERY.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6B6D76] max-w-lg font-light leading-relaxed">
              Quantum-inspired optimization for modern last-mile fleets.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onLaunchOptimizer}
                className="btn-primary-gradient !py-3.5 !px-7 text-sm !font-semibold group cursor-pointer"
              >
                <span>Launch Optimizer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="btn-secondary-outline !py-3.5 !px-6 text-sm cursor-pointer"
              >
                <span>Explore Technology</span>
              </button>
            </div>

          </div>

          {/* Right: ONE Beautiful Route / Network Visualization with Pop & Progressive Path */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: popEase }}
              className="relative w-full max-w-md aspect-square rounded-3xl bg-white/80 backdrop-blur-sm border border-[#E8E6DF] p-6 sm:p-7 flex flex-col justify-between shadow-soft overflow-hidden group"
            >
              {/* Atmospheric Background Glow */}
              <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br from-[#FF6B4A]/10 to-[#E95AA8]/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-[#FF6B4A]/10 to-[#E95AA8]/10 blur-3xl pointer-events-none" />

              {/* Visualization Header */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#6B6D76]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8]" />
                  <span className="font-semibold text-[#202124]">OPTIMIZED TOPOLOGY</span>
                </div>
                <button
                  onClick={() => setHeroOptimized(!heroOptimized)}
                  className="px-3 py-1 rounded-full bg-[#F6F3EC] hover:bg-[#EAE7F5] text-[#202124] font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  {heroOptimized ? 'OPTIMIZED' : 'UNORDERED'}
                </button>
              </div>

              {/* Minimal SVG Route Canvas */}
              <div className="relative z-10 w-full flex-1 flex items-center justify-center my-3">
                <svg viewBox="0 0 420 380" className="w-full h-full">
                  <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B4A" />
                      <stop offset="100%" stopColor="#E95AA8" />
                    </linearGradient>
                  </defs>

                  {/* Elegant Curved Route Paths */}
                  {heroOptimized ? (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: popEase }}
                      d="M 210,190 C 140,150 100,120 80,95 C 140,65 180,60 230,60 C 290,60 320,80 350,115 C 360,180 340,210 320,245 C 270,300 240,320 210,325 C 160,310 130,280 110,235 C 140,210 180,195 210,190 Z"
                      fill="none"
                      stroke="url(#heroGradient)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M 210,190 L 350,115 L 110,235 L 230,60 L 210,325 L 80,95 L 320,245 Z"
                      fill="none"
                      stroke="#C2BDDE"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Staggered Delivery Nodes */}
                  {heroNodes.map((node, idx) => (
                    <motion.g
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + idx * 0.05, duration: 0.5, ease: popEase }}
                      className="cursor-pointer group/node"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="9"
                        fill="rgba(255, 107, 74, 0.08)"
                        className="transition-transform group-hover/node:scale-150"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="5"
                        fill="#FFFFFF"
                        stroke="#FF6B4A"
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover/node:stroke-width-3"
                      />
                      <circle cx={node.x} cy={node.y} r="2" fill="#202124" />
                    </motion.g>
                  ))}

                  {/* Central Hub / Depot */}
                  <g>
                    <rect
                      x={heroDepot.x - 9}
                      y={heroDepot.y - 9}
                      width="18"
                      height="18"
                      rx="4"
                      fill="#202124"
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

                  {/* Subtle Vehicle Glider in Motion */}
                  {heroOptimized && (
                    <g transform={`translate(${gliderX}, ${gliderY})`}>
                      <circle r="7" fill="rgba(255, 107, 74, 0.25)" className="animate-ping" />
                      <circle r="4" fill="#FF6B4A" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Visualization Footer */}
              <div className="relative z-10 pt-3 border-t border-[#E8E6DF] flex items-center justify-between text-[11px] font-mono text-[#6B6D76]">
                <span>NODES: 06</span>
                <span className="text-[#202124] font-medium">
                  {heroOptimized ? 'E: -142.8 J (GROUND STATE)' : 'SEARCH SPACE: 6! = 720'}
                </span>
                <span className={heroOptimized ? 'text-[#FF6B4A] font-semibold' : 'text-[#6B6D76]'}>
                  {heroOptimized ? 'CONVERGED' : 'UNSORTED'}
                </span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="flex justify-center pt-14">
          <button
            onClick={() => scrollToSection('problem')}
            className="text-[#6B6D76] hover:text-[#202124] transition-colors p-2 flex flex-col items-center gap-1 text-xs font-mono cursor-pointer"
          >
            <span>SCROLL</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </ScrollSection>

      {/* ─── CONTINUOUS ROUTE CONNECTOR LINE (BETWEEN HERO & PROBLEM) ─────── */}
      <div className="w-full flex justify-center py-4 pointer-events-none opacity-40">
        <svg width="2" height="60" viewBox="0 0 2 60">
          <line x1="1" y1="0" x2="1" y2="60" stroke="#FF6B4A" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* ─── SECTION 2: THE PROBLEM (SOFT LAVENDER #EAE7F5) ───────────────── */}
      <ScrollSection id="problem" className="bg-[#EAE7F5] min-h-[92vh] flex flex-col justify-center py-24 sm:py-32 px-5 sm:px-8 border-y border-[#D9D5EB]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Problem Narrative (Internal Stagger: Heading 0ms, Desc 80ms, Pillars 150ms, Buttons 220ms) */}
          <div className="lg:col-span-6 space-y-7">
            
            {/* Heading: 0ms */}
            <StaggerItem delayMs={0} yOffset={18} className="space-y-1">
              <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold block mb-2">
                01 &bull; COMPLEXITY SCALING
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#202124] leading-tight">
                DELIVERY IS EASY.
              </h2>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
                <span className="accent-gradient-text">OPTIMIZATION ISN'T.</span>
              </h2>
            </StaggerItem>

            {/* Description: 80ms */}
            <StaggerItem delayMs={80} yOffset={18}>
              <p className="text-base text-[#474952] font-light leading-relaxed">
                Last-mile logistics accounts for over 50% of total transport cost.
                Routing $N$ deliveries across a commercial fleet escalates super-exponentially.
                Local greedy solvers get caught in local suboptimal traps:
              </p>
            </StaggerItem>

            {/* 4 Core Problem Pillars: 150ms */}
            <StaggerItem delayMs={150} yOffset={20} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D9D5EB] space-y-1">
                <div className="text-xs font-mono font-semibold text-[#202124] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                  Dynamic Demand
                </div>
                <div className="text-xs text-[#6B6D76] font-light">
                  Surging order bursts and fluctuating payload sizes across hubs.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D9D5EB] space-y-1">
                <div className="text-xs font-mono font-semibold text-[#202124] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                  Live Urban Traffic
                </div>
                <div className="text-xs text-[#6B6D76] font-light">
                  Non-linear stop-and-go congestion delays and fuel penalties.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D9D5EB] space-y-1">
                <div className="text-xs font-mono font-semibold text-[#202124] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                  Vehicle Capacity
                </div>
                <div className="text-xs text-[#6B6D76] font-light">
                  Strict payload kilogram limits and EV battery discharge boundaries.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D9D5EB] space-y-1">
                <div className="text-xs font-mono font-semibold text-[#202124] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
                  Delivery Time Windows
                </div>
                <div className="text-xs text-[#6B6D76] font-light">
                  Strict customer arrival SLA thresholds with early/late penalties.
                </div>
              </div>
            </StaggerItem>

            {/* Supporting Interactive Toggle Buttons: 220ms */}
            <StaggerItem delayMs={220} yOffset={16} className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setProblemStage('chaos')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  problemStage === 'chaos'
                    ? 'bg-[#202124] text-white shadow-sm'
                    : 'bg-white/60 border border-[#D9D5EB] text-[#6B6D76] hover:text-[#202124]'
                }`}
              >
                1. ALL EDGES (CHAOS)
              </button>
              <button
                onClick={() => setProblemStage('pruning')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  problemStage === 'pruning'
                    ? 'bg-[#202124] text-white shadow-sm'
                    : 'bg-white/60 border border-[#D9D5EB] text-[#6B6D76] hover:text-[#202124]'
                }`}
              >
                2. PRUNING PENALTIES
              </button>
              <button
                onClick={() => setProblemStage('optimal')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  problemStage === 'optimal'
                    ? 'btn-primary-gradient !py-1.5 !px-3'
                    : 'bg-white/60 border border-[#D9D5EB] text-[#6B6D76] hover:text-[#202124]'
                }`}
              >
                3. OPTIMAL TOUR
              </button>
            </StaggerItem>

          </div>

          {/* Right: Main Network Visualization Pop (150ms delay, scale: 0.97 -> 1) */}
          <div className="lg:col-span-6 flex justify-center">
            <StaggerItem
              delayMs={150}
              yOffset={22}
              scaleFrom={0.97}
              className="w-full bg-white/80 backdrop-blur-md border border-[#D9D5EB] rounded-3xl p-6 sm:p-8 shadow-soft relative overflow-hidden"
            >
              <div className="flex justify-between items-center text-xs font-mono text-[#6B6D76] mb-4">
                <span>STAGE: {problemStage.toUpperCase()}</span>
                <span className="text-[#FF6B4A] font-semibold">
                  {problemStage === 'chaos'
                    ? '120 FACTORIAL PERMUTATIONS'
                    : problemStage === 'pruning'
                    ? 'ELIMINATING SUBOPTIMAL EDGES'
                    : 'MINIMUM ENERGY GROUND STATE'}
                </span>
              </div>

              {/* Minimal SVG Path Pruning Canvas */}
              <svg viewBox="0 0 500 280" className="w-full h-64">
                <defs>
                  <linearGradient id="problemRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B4A" />
                    <stop offset="100%" stopColor="#E95AA8" />
                  </linearGradient>
                </defs>

                {/* Inefficient Paths that fade away */}
                {problemStage !== 'optimal' && (
                  <g
                    opacity={problemStage === 'chaos' ? 0.35 : 0.08}
                    stroke="#8E909A"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    className="transition-opacity duration-500"
                  >
                    <path d="M 70,70 L 250,45 L 430,90 L 350,230 L 150,235 Z" fill="none" />
                    <path d="M 70,70 L 350,230 L 250,45 L 150,235 L 430,90 Z" fill="none" />
                    <path d="M 250,45 L 70,70 L 150,235 L 430,90 L 350,230 Z" fill="none" />
                    <path d="M 150,235 L 430,90 L 70,70 L 350,230 L 250,45 Z" fill="none" />
                  </g>
                )}

                {/* Clean Optimal Route */}
                <motion.path
                  d="M 70,70 L 250,45 L 430,90 L 350,230 L 150,235 Z"
                  fill="none"
                  stroke={problemStage === 'optimal' ? 'url(#problemRouteGrad)' : '#202124'}
                  strokeWidth={problemStage === 'optimal' ? 3.5 : 2}
                  className="transition-all duration-700"
                />

                {/* Delivery Stops */}
                {[
                  { x: 70, y: 70, id: 'D-1' },
                  { x: 250, y: 45, id: 'D-2' },
                  { x: 430, y: 90, id: 'D-3' },
                  { x: 350, y: 230, id: 'D-4' },
                  { x: 150, y: 235, id: 'D-5' },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#FFFFFF"
                      stroke={problemStage === 'optimal' ? '#FF6B4A' : '#202124'}
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x + 10}
                      y={pt.y + 4}
                      fill="#6B6D76"
                      fontSize="10"
                      fontFamily="IBM Plex Mono"
                    >
                      {pt.id}
                    </text>
                  </g>
                ))}
              </svg>

              <p className="text-xs text-center font-mono text-[#6B6D76] mt-4 pt-4 border-t border-[#D9D5EB]">
                {problemStage === 'optimal'
                  ? '✓ Unviable permutations collapsed. Optimal trajectory preserved.'
                  : 'Evaluating combinatorial constraints: capacity thresholds & time windows.'}
              </p>
            </StaggerItem>
          </div>

        </div>
      </ScrollSection>

      {/* ─── CONTINUOUS ROUTE CONNECTOR LINE (BETWEEN PROBLEM & HOW IT WORKS) ── */}
      <div className="w-full flex justify-center py-4 pointer-events-none opacity-40">
        <svg width="2" height="60" viewBox="0 0 2 60">
          <line x1="1" y1="0" x2="1" y2="60" stroke="#FF6B4A" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* ─── SECTION 3: HOW IT WORKS (WARM IVORY) ─────────────────────────── */}
      <ScrollSection id="how-it-works" className="min-h-[85vh] flex flex-col justify-center py-24 sm:py-32 px-5 sm:px-8 max-w-6xl mx-auto">
        
        {/* Heading: 0ms & Description: 80ms */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <StaggerItem delayMs={0} yOffset={18}>
            <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold block mb-2">
              02 &bull; QUANTUM OPTIMIZATION PIPELINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#202124]">
              HOW IT WORKS.
            </h2>
          </StaggerItem>
          <StaggerItem delayMs={80} yOffset={18}>
            <p className="text-base text-[#6B6D76] font-light">
              A direct mathematical pipeline mapping last-mile demand directly into quantum Ising ground states.
            </p>
          </StaggerItem>
        </div>

        {/* The Direct 5-Stage Minimal Pipeline: DEMAND -> ROUTE MODEL -> QUBO -> QISKIT -> OPTIMIZED ROUTE */}
        <div className="relative max-w-4xl mx-auto w-full">
          
          {/* Thin connecting horizontal line (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-[#FF6B4A]/20 via-[#FF6B4A] to-[#E95AA8]/20 -translate-y-1/2 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
            
            {/* Step 1: DEMAND */}
            <StaggerItem delayMs={150} yOffset={20} scaleFrom={0.95} className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E6DF] flex items-center justify-center shadow-soft-sm group-hover:scale-110 transition-transform mb-4">
                <Layers className="w-6 h-6 text-[#202124]" />
              </div>
              <span className="text-xs font-mono text-[#FF6B4A] font-semibold mb-1">01</span>
              <h3 className="font-sans font-bold text-sm text-[#202124] tracking-wide">
                DEMAND
              </h3>
              <p className="text-[11px] font-mono text-[#6B6D76] mt-1">
                Stops, weights, windows
              </p>
            </StaggerItem>

            {/* Step 2: ROUTE MODEL */}
            <StaggerItem delayMs={195} yOffset={20} scaleFrom={0.95} className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E6DF] flex items-center justify-center shadow-soft-sm group-hover:scale-110 transition-transform mb-4">
                <Route className="w-6 h-6 text-[#202124]" />
              </div>
              <span className="text-xs font-mono text-[#FF6B4A] font-semibold mb-1">02</span>
              <h3 className="font-sans font-bold text-sm text-[#202124] tracking-wide">
                ROUTE MODEL
              </h3>
              <p className="text-[11px] font-mono text-[#6B6D76] mt-1">
                Graph cost matrix
              </p>
            </StaggerItem>

            {/* Step 3: QUBO */}
            <StaggerItem delayMs={240} yOffset={20} scaleFrom={0.95} className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E6DF] flex items-center justify-center shadow-soft-sm group-hover:scale-110 transition-transform mb-4">
                <GitCommit className="w-6 h-6 text-[#FF6B4A]" />
              </div>
              <span className="text-xs font-mono text-[#FF6B4A] font-semibold mb-1">03</span>
              <h3 className="font-sans font-bold text-sm text-[#202124] tracking-wide">
                QUBO
              </h3>
              <p className="text-[11px] font-mono text-[#6B6D76] mt-1">
                Penalty Hamiltonian
              </p>
            </StaggerItem>

            {/* Step 4: QISKIT */}
            <StaggerItem delayMs={285} yOffset={20} scaleFrom={0.95} className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E6DF] flex items-center justify-center shadow-soft-sm group-hover:scale-110 transition-transform mb-4">
                <Cpu className="w-6 h-6 text-[#E95AA8]" />
              </div>
              <span className="text-xs font-mono text-[#FF6B4A] font-semibold mb-1">04</span>
              <h3 className="font-sans font-bold text-sm text-[#202124] tracking-wide">
                QISKIT
              </h3>
              <p className="text-[11px] font-mono text-[#6B6D76] mt-1">
                Ising solver / Sampler
              </p>
            </StaggerItem>

            {/* Step 5: OPTIMIZED ROUTE */}
            <StaggerItem delayMs={330} yOffset={20} scaleFrom={0.95} className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E6DF] flex items-center justify-center shadow-soft-sm group-hover:scale-110 transition-transform mb-4">
                <Zap className="w-6 h-6 text-[#10B981]" />
              </div>
              <span className="text-xs font-mono text-[#FF6B4A] font-semibold mb-1">05</span>
              <h3 className="font-sans font-bold text-sm text-[#202124] tracking-wide">
                OPTIMIZED ROUTE
              </h3>
              <p className="text-[11px] font-mono text-[#6B6D76] mt-1">
                Fleet dispatch schedule
              </p>
            </StaggerItem>

          </div>

        </div>

      </ScrollSection>

      {/* ─── SECTION 4: PERFORMANCE (DEEP INDIGO #171A38) ─────────────────── */}
      <ScrollSection id="performance" className="bg-[#171A38] text-white min-h-[85vh] flex flex-col justify-center py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-16 w-full">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <StaggerItem delayMs={0} yOffset={18}>
              <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold block mb-2">
                03 &bull; BENCHMARKED RESULTS
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
                EMPIRICAL PERFORMANCE GAINS.
              </h2>
            </StaggerItem>
            <StaggerItem delayMs={80} yOffset={18}>
              <p className="text-sm sm:text-base text-[#B6B8C2] font-light">
                Benchmarked across metropolitan logistics routes against classical unoptimized baselines.
              </p>
            </StaggerItem>
          </div>

          {/* Large Typography Metric Grid (Pop scale 0.92 -> 1, subtle spring & count upward) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pt-4">
            
            {/* Metric 1: 12.8% */}
            <div className="space-y-2 text-center lg:text-left">
              <AnimatedStatNumber value={12.8} suffix="%" decimals={1} />
              <div className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
                DISTANCE REDUCTION
              </div>
              <p className="text-xs text-[#8E909A] font-light hidden sm:block">
                Minimized total fleet route kilometers.
              </p>
            </div>

            {/* Metric 2: 8.4% */}
            <div className="space-y-2 text-center lg:text-left lg:border-l lg:border-white/10 lg:pl-8">
              <AnimatedStatNumber value={8.4} suffix="%" decimals={1} />
              <div className="text-xs font-mono text-[#E95AA8] uppercase tracking-wider font-semibold">
                FUEL SAVED
              </div>
              <p className="text-xs text-[#8E909A] font-light hidden sm:block">
                Preserved diesel and EV battery kilowatt-hours.
              </p>
            </div>

            {/* Metric 3: 11.2% */}
            <div className="space-y-2 text-center lg:text-left lg:border-l lg:border-white/10 lg:pl-8">
              <AnimatedStatNumber value={11.2} suffix="%" decimals={1} />
              <div className="text-xs font-mono text-[#10B981] uppercase tracking-wider font-semibold">
                CO₂ REDUCTION
              </div>
              <p className="text-xs text-[#8E909A] font-light hidden sm:block">
                Verified ESG greenhouse gas abatement.
              </p>
            </div>

            {/* Metric 4: 2H 01M (121 minutes total) */}
            <div className="space-y-2 text-center lg:text-left lg:border-l lg:border-white/10 lg:pl-8">
              <AnimatedStatNumber value={121} isTime={true} />
              <div className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-semibold">
                TIME SAVED
              </div>
              <p className="text-xs text-[#8E909A] font-light hidden sm:block">
                Reduced driver dwell and transit times.
              </p>
            </div>

          </div>

        </div>
      </ScrollSection>

      {/* ─── CONTINUOUS ROUTE CONNECTOR LINE (BETWEEN PERFORMANCE & CTA) ──── */}
      <div className="w-full flex justify-center py-4 pointer-events-none opacity-40">
        <svg width="2" height="60" viewBox="0 0 2 60">
          <line x1="1" y1="0" x2="1" y2="60" stroke="#FF6B4A" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* ─── SECTION 5: FINAL CTA (WARM IVORY WITH ATMOSPHERIC GLOW) ──────── */}
      <ScrollSection id="cta" isLast={true} className="min-h-[80vh] flex flex-col justify-center py-24 sm:py-36 px-5 sm:px-8 max-w-5xl mx-auto text-center relative">
        
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-[#FF6B4A]/15 to-[#E95AA8]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
          
          <StaggerItem delayMs={0} yOffset={15}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E8E6DF] shadow-soft-sm text-xs font-mono text-[#6B6D76]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>FASTAPI + QISKIT SOLVER READY</span>
            </div>
          </StaggerItem>

          <StaggerItem delayMs={80} yOffset={20} className="space-y-1">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#202124] leading-tight">
              OPTIMIZE
            </h2>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-tight">
              <span className="accent-gradient-text">THE LAST MILE.</span>
            </h2>
          </StaggerItem>

          <StaggerItem delayMs={150} yOffset={18}>
            <p className="text-base sm:text-lg text-[#6B6D76] font-light leading-relaxed">
              Experience quantum-inspired vehicle routing. Benchmark classical heuristics against Qiskit QUBO solvers in real time.
            </p>
          </StaggerItem>

          <StaggerItem delayMs={220} yOffset={16} scaleFrom={0.96} className="pt-2 flex justify-center">
            <button
              onClick={onLaunchOptimizer}
              className="btn-primary-gradient !py-4 !px-9 text-base !font-semibold group shadow-accent-glow cursor-pointer"
            >
              <span>Launch Optimizer</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </StaggerItem>

        </div>
      </ScrollSection>

      {/* ─── EDITORIAL MINIMAL FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-[#E8E6DF] py-10 text-xs font-mono text-[#6B6D76]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#E95AA8]" />
            <span className="font-bold text-[#202124]">ROUTEQ</span>
            <span>&bull;</span>
            <span>QUANTUM MOBILITY ENGINE</span>
          </div>
          <div>QISKIT FALL FEST 2026 &bull; USE CASE 04</div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
