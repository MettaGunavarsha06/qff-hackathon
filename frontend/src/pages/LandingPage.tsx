import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Navigation,
  Clock,
  Fuel,
  Leaf,
  Shield,
  CheckCircle2,
  Atom,
  ChevronDown,
  Compass,
  Zap,
} from 'lucide-react';
import { HeroRouteVisualization } from '../components/Landing/HeroRouteVisualization';
import { ScrollReveal } from '../components/Landing/ScrollReveal';
import { ProblemNetwork } from '../components/Landing/ProblemNetwork';
import { PerformanceStats } from '../components/Landing/PerformanceStats';
import { QuantumWorkflow } from '../components/Landing/QuantumWorkflow';

interface LandingPageProps {
  onLaunchOptimizer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchOptimizer }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#1F2024] font-sans overflow-x-hidden selection:bg-[#FF5B37]/20 selection:text-[#111322]">
      
      {/* ─── FLOATING TRANSLUCENT GLASS NAVIGATION BAR ───────────────────────── */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className="w-full max-w-5xl h-14 rounded-full px-5 flex items-center justify-between pointer-events-auto shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-white/80"
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
            <div className="w-7 h-7 rounded-full bg-[#111322] flex items-center justify-center text-white font-bold text-xs tracking-wider">
              Q
            </div>
            <span className="font-bold text-sm tracking-wider text-[#111322] font-mono">
              ROUTE<span className="text-[#FF5B37]">Q</span>
            </span>
          </div>

          {/* Center Links (Smooth Scroll) */}
          <div className="hidden md:flex items-center gap-7 text-xs font-mono text-[#6B6D76]">
            <button
              onClick={() => scrollToSection('problem')}
              className="hover:text-[#111322] transition-colors cursor-pointer"
            >
              Product
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#111322] transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('performance')}
              className="hover:text-[#111322] transition-colors cursor-pointer"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('quantum')}
              className="hover:text-[#111322] transition-colors cursor-pointer"
            >
              Technology
            </button>
          </div>

          {/* Right Action: Launch Optimizer */}
          <button
            onClick={onLaunchOptimizer}
            className="btn-primary-gradient !py-2 !px-4 !text-xs font-semibold group cursor-pointer"
          >
            <span>Launch Optimizer</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </nav>
      </header>

      {/* ─── SECTION 01: HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Spacious Hero Typography */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E6DF] shadow-xs text-xs font-mono text-[#FF5B37]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B37] animate-pulse" />
              <span className="font-semibold tracking-wider uppercase">
                SMARTER ROUTES. CLEANER CITIES.
              </span>
            </div>

            {/* Main Heading (Approximately font-weight 600, elegant, readable) */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-[#111322] leading-[1.08]">
              THE SHORTEST<br />
              PATH BETWEEN<br />
              DEMAND AND<br />
              <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">
                DELIVERY.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#6B6D76] font-light max-w-lg leading-relaxed">
              Quantum-inspired optimization for modern last-mile fleets.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchOptimizer}
                className="btn-primary-gradient !py-3.5 !px-7 text-xs sm:text-sm font-semibold group cursor-pointer shadow-lg"
              >
                <span>Launch Optimizer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('quantum')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#E8E6DF] text-xs sm:text-sm font-semibold text-[#111322] hover:bg-[#FAF9F6] hover:border-[#D6D4CC] shadow-xs transition-all cursor-pointer"
              >
                <Atom className="w-4 h-4 text-[#FF5B37]" />
                <span>Explore Technology</span>
              </button>
            </div>

            {/* Subtle Capability Highlights */}
            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#6B6D76]">
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
            </div>

          </div>

          {/* Right Column: MAIN VISUAL (Realistic Route Map & Moving Truck) */}
          <div className="lg:col-span-6 w-full">
            <HeroRouteVisualization />
          </div>

        </div>
      </section>

      {/* ─── SECTION 02: THE PROBLEM ─────────────────────────────────────────── */}
      <section id="problem" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E6DF]">
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

          {/* Editorial Key Drivers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold text-[#FF5B37]">01 / SUPER-EXPONENTIAL</div>
              <h4 className="font-bold text-base text-[#111322]">Combinatorial Explosion</h4>
              <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                Routing N stops across K vehicles scales as N! &bull; C(N+K-1, K-1). Exhaustive brute-force search becomes mathematically intractable within seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold text-[#FF5B37]">02 / URBAN DYNAMICS</div>
              <h4 className="font-bold text-base text-[#111322]">Unpredictable Congestion</h4>
              <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                Fixed Euclidean distances fail in dense urban grids. Mappls live traffic multipliers penalize slow arterial roads and stop-and-go fuel burns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-2">
              <div className="text-xs font-mono font-bold text-[#FF5B37]">03 / TIGHT WINDOWS</div>
              <h4 className="font-bold text-base text-[#111322]">Rigid SLA Commitments</h4>
              <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                Arrivals outside scheduled 60-minute delivery slots damage customer satisfaction and trigger costly re-dispatch attempts.
              </p>
            </div>
          </div>

        </ScrollReveal>
      </section>

      {/* ─── SECTION 03: HOW IT WORKS ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E6DF]">
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

          {/* 5-Step Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
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
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs space-y-3 relative group hover:border-[#FF5B37]/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#FF5B37]">
                      {st.step}
                    </span>
                    <Icon className="w-4 h-4 text-[#6B6D76] group-hover:text-[#FF5B37] transition-colors" />
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
                </div>
              );
            })}
          </div>

        </ScrollReveal>
      </section>

      {/* ─── SECTION 04: PERFORMANCE (EDITORIAL STATISTICS) ──────────────────── */}
      <section id="performance" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E6DF]">
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
            <button
              onClick={onLaunchOptimizer}
              className="btn-primary-gradient !py-4 !px-9 text-sm sm:text-base font-semibold group cursor-pointer shadow-xl"
            >
              <span>Launch Optimizer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </ScrollReveal>
      </section>

      {/* ─── MINIMAL EDITORIAL FOOTER ────────────────────────────────────────── */}
      <footer className="py-12 border-t border-[#E8E6DF] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8E909A]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#111322]">ROUTEQ</span>
          <span>&bull;</span>
          <span>Python Qiskit 2.5 + FastAPI + React 19</span>
        </div>
        <div>
          Hackathon Use Case 04 &bull; Last-Mile Vehicle Routing Optimization
        </div>
      </footer>

    </div>
  );
};
