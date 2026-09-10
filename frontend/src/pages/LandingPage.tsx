import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Navigation,
  CheckCircle2,
  Atom,
} from 'lucide-react';
import { HeroRouteVisualization } from '../components/Landing/HeroRouteVisualization';
import { ScrollReveal } from '../components/Landing/ScrollReveal';
import { ProblemNetwork } from '../components/Landing/ProblemNetwork';
import { PerformanceStats } from '../components/Landing/PerformanceStats';
import { QuantumWorkflow } from '../components/Landing/QuantumWorkflow';
import {
  AnimatedHeading,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  MotionButton,
  MotionCard,
  smoothEase,
} from '../components/Landing/AnimationPrimitives';

interface LandingPageProps {
  onLaunchOptimizer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchOptimizer }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>('');

  // Active section indication for navbar on scroll
  useEffect(() => {
    const sectionIds = ['problem', 'how-it-works', 'performance', 'quantum'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#1F2024] font-sans overflow-x-hidden selection:bg-[#FF5B37]/20 selection:text-[#111322]">
      
      {/* ─── FLOATING TRANSLUCENT GLASS NAVIGATION BAR ───────────────────────── */}
      <motion.header
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: smoothEase }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
      >
        <nav
          className="w-full max-w-5xl h-14 rounded-full px-5 flex items-center justify-between pointer-events-auto shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-white/80 transition-shadow duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-7 h-7 rounded-full bg-[#111322] flex items-center justify-center text-white font-bold text-xs tracking-wider transition-transform duration-200 group-hover:scale-105">
              Q
            </div>
            <span className="font-bold text-sm tracking-wider text-[#111322] font-mono">
              ROUTE<span className="text-[#FF5B37]">Q</span>
            </span>
          </div>

          {/* Center Links (Smooth Scroll & Active Section Indication) */}
          <div className="hidden md:flex items-center gap-7 text-xs font-mono text-[#6B6D76]">
            {[
              { id: 'problem', label: 'Product' },
              { id: 'how-it-works', label: 'How it works' },
              { id: 'performance', label: 'Impact' },
              { id: 'quantum', label: 'Technology' },
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-[#111322] font-semibold' : 'hover:text-[#111322]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="landingNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5B37] rounded-full"
                      transition={{ duration: 0.25, ease: smoothEase }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action: Clean spacing */}
        </nav>
      </motion.header>

      {/* ─── SECTION 01: HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Spacious Hero Typography */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Eyebrow Badge */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: smoothEase }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E6DF] shadow-xs text-xs font-mono text-[#FF5B37]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B37] animate-pulse" />
              <span className="font-semibold tracking-wider uppercase">
                SMARTER ROUTES. CLEANER CITIES.
              </span>
            </motion.div>

            {/* Main Heading (Each line animated individually inside overflow-hidden container) */}
            <AnimatedHeading className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-[#111322] leading-[1.08]" />

            {/* Description (Fades and moves upward following main heading) */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.68, ease: smoothEase }}
              className="text-base sm:text-lg text-[#6B6D76] font-light max-w-lg leading-relaxed"
            >
              Quantum-inspired optimization for modern last-mile fleets.
            </motion.p>

            {/* Action Buttons (Staggered entrance + interactive micro-animations) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.85, ease: smoothEase }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MotionButton
                onClick={onLaunchOptimizer}
                className="btn-primary-gradient !py-3.5 !px-7 text-xs sm:text-sm font-semibold group cursor-pointer shadow-lg"
              >
                <span>Launch Optimizer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </MotionButton>

              <MotionButton
                onClick={() => scrollToSection('quantum')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#E8E6DF] text-xs sm:text-sm font-semibold text-[#111322] hover:bg-[#FAF9F6] hover:border-[#D6D4CC] shadow-xs transition-all cursor-pointer"
              >
                <Atom className="w-4 h-4 text-[#FF5B37]" />
                <span>Explore Technology</span>
              </MotionButton>
            </motion.div>

            {/* Capability Highlights (Subtle Staggered Entrance) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05, ease: smoothEase }}
              className="pt-4 flex items-center gap-6 text-xs font-mono text-[#6B6D76]"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>IBM Qiskit 2.5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Live Mappls API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>5 Indian Hubs</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: MAIN VISUAL (Animated Route Map & Moving Truck) */}
          <div className="lg:col-span-6 w-full">
            <HeroRouteVisualization />
          </div>

        </div>
      </section>

      {/* ─── SECTION 02: THE PROBLEM ─────────────────────────────────────────── */}
      <section id="problem" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E6DF]/30">
        <ScrollReveal className="space-y-12">
          
          <div className="max-w-2xl space-y-3 text-left">
            <div className="text-xs font-mono font-semibold text-[#FF5B37] uppercase tracking-wider">
              02 &bull; THE COMBINATORIAL BOTTLENECK
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111322] leading-tight">
              DELIVERY IS EASY.<br />
              <span className="text-[#6B6D76]">OPTIMIZATION ISN'T.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6B6D76] font-light leading-relaxed">
              With only 10 stops, there are over 3.6 million possible tour permutations. Add strict customer time windows, dynamic traffic congestion, and EV payload limits, and classical greedy dispatchers stall in suboptimal local minima.
            </p>
          </div>

          {/* Interactive Network Visualization */}
          <ProblemNetwork />

          {/* Editorial Key Drivers (Staggered Cards with Micro-Interactions) */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" staggerDelay={0.1}>
            <StaggerItem>
              <MotionCard className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-2 h-full">
                <div className="text-xs font-mono font-bold text-[#FF5B37]">01 / SUPER-EXPONENTIAL</div>
                <h4 className="font-bold text-base text-[#111322]">Combinatorial Explosion</h4>
                <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                  Routing N stops across K vehicles scales as N! &bull; C(N+K-1, K-1). Exhaustive brute-force search becomes mathematically intractable within seconds.
                </p>
              </MotionCard>
            </StaggerItem>

            <StaggerItem>
              <MotionCard className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-2 h-full">
                <div className="text-xs font-mono font-bold text-[#FF5B37]">02 / URBAN DYNAMICS</div>
                <h4 className="font-bold text-base text-[#111322]">Unpredictable Congestion</h4>
                <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                  Fixed Euclidean distances fail in dense urban grids. Mappls live traffic multipliers penalize slow arterial roads and stop-and-go fuel burns.
                </p>
              </MotionCard>
            </StaggerItem>

            <StaggerItem>
              <MotionCard className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-2 h-full">
                <div className="text-xs font-mono font-bold text-[#FF5B37]">03 / TIGHT WINDOWS</div>
                <h4 className="font-bold text-base text-[#111322]">Rigid SLA Commitments</h4>
                <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                  Arrivals outside scheduled 60-minute delivery slots damage customer satisfaction and trigger costly re-dispatch attempts.
                </p>
              </MotionCard>
            </StaggerItem>
          </StaggerContainer>

        </ScrollReveal>
      </section>

      {/* ─── SECTION 03: HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E6DF]/30">
        <ScrollReveal className="space-y-12">
          
          <div className="max-w-2xl space-y-3 text-left">
            <div className="text-xs font-mono font-semibold text-[#FF5B37] uppercase tracking-wider">
              03 &bull; THE PIPELINE
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111322] leading-tight">
              FIVE STEPS FROM<br />
              <span className="bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D] bg-clip-text text-transparent">
                DEMAND TO DISPATCH.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#6B6D76] font-light leading-relaxed">
              RouteQ translates physical logistics operations into mathematical operators, executing QAOA variational circuits to extract optimal minimum-energy vehicle routes.
            </p>
          </div>

          {/* 5-Step Flow (Staggered Cards) */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left" staggerDelay={0.08}>
            {[
              {
                step: '01',
                title: 'DEMAND',
                subtitle: 'Order Ingestion',
                desc: 'Parsing delivery coordinates, package demands, service durations, and customer time window SLAs.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'ROUTE MODEL',
                subtitle: 'Matrix Construction',
                desc: 'Computing real road distance and travel times using Mappls real-time traffic APIs.',
                icon: Navigation,
              },
              {
                step: '03',
                title: 'QUBO',
                subtitle: 'Ising Hamiltonian',
                desc: 'Formulating vehicle routing constraints into quadratic cost operators H_C = Σ h_i Z_i + Σ J_ij Z_i Z_j.',
                icon: Cpu,
              },
              {
                step: '04',
                title: 'QISKIT',
                subtitle: 'QAOA Simulation',
                desc: 'Executing parameterized quantum circuits with StatevectorSampler (1024 shots) in Python.',
                icon: Atom,
              },
              {
                step: '05',
                title: 'DISPATCH',
                subtitle: 'Driver Manifest',
                desc: 'Decoding ground-state bitstrings into conflict-free, turn-by-turn physical vehicle routes.',
                icon: CheckCircle2,
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <StaggerItem key={st.step}>
                  <MotionCard className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-3 relative group hover:border-[#FF5B37]/40 transition-all h-full">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#FF5B37]">
                        {st.step}
                      </span>
                      <Icon className="w-4 h-4 text-[#6B6D76] group-hover:text-[#FF5B37] transition-colors duration-200" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#111322] tracking-wide">
                        {st.title}
                      </h4>
                      <div className="text-[11px] font-mono text-[#6B6D76] mt-0.5">
                        {st.subtitle}
                      </div>
                    </div>
                    <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                      {st.desc}
                    </p>
                  </MotionCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

        </ScrollReveal>
      </section>

      {/* ─── SECTION 04: PERFORMANCE (EDITORIAL STATISTICS) ──────────────────── */}
      <section id="performance" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E6DF]/30">
        <ScrollReveal className="space-y-10 text-left">
          
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-mono font-semibold text-[#FF5B37] uppercase tracking-wider">
              04 &bull; BENCHMARKED IMPACT
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111322] leading-tight">
              MEASURABLE GAINS ON<br />
              <span className="text-[#6B6D76]">EVERY SINGLE RUN.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6B6D76] font-light leading-relaxed">
              Empirically verified against traditional greedy heuristics across Indian metro delivery corridors.
            </p>
          </div>

          {/* Large Editorial Counter Numbers */}
          <PerformanceStats />

        </ScrollReveal>
      </section>

      {/* ─── SECTION 05: QUANTUM TECHNOLOGY (DEEP NAVY CONTRAST SECTION) ─────── */}
      <section id="quantum" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal>
          <QuantumWorkflow />
        </ScrollReveal>
      </section>

      {/* ─── SECTION 06: FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <ScrollReveal className="space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E6DF] text-xs font-mono text-[#FF5B37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE LOGISTICS INTELLIGENCE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#111322] leading-[1.06]">
            OPTIMIZE<br />
            <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">
              THE LAST MILE.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#6B6D76] font-light max-w-md mx-auto leading-relaxed">
            Transition to the RouteQ fleet optimizer workspace to plan, simulate, and dispatch conflict-free delivery routes.
          </p>

          <div className="pt-4 flex justify-center">
            <MotionButton
              onClick={onLaunchOptimizer}
              className="btn-primary-gradient !py-4 !px-9 text-sm sm:text-base font-semibold group cursor-pointer shadow-xl"
            >
              <span>Launch Optimizer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </MotionButton>
          </div>

        </ScrollReveal>
      </section>

      {/* ─── MINIMAL EDITORIAL FOOTER ────────────────────────────────────────── */}
      <footer className="py-12 border-t border-[#E8E6DF]/30 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8E909A]">
        <FadeIn direction="none" distance={0} duration={0.6}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#111322]">ROUTEQ</span>
            <span>&bull;</span>
            <span>Python Qiskit 2.5 + FastAPI + React 19</span>
          </div>
        </FadeIn>
        <FadeIn direction="none" distance={0} duration={0.6} delay={0.1}>
          <div>
            Hackathon Use Case 04 &bull; Last-Mile Vehicle Routing Optimization
          </div>
        </FadeIn>
      </footer>

    </div>
  );
};

export default LandingPage;
