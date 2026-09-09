import React, { useState } from 'react';
import { ArrowRight, Cpu, Layers, GitBranch, Atom, CheckCircle2, Shield } from 'lucide-react';

interface Stage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
}

const STAGES: Stage[] = [
  {
    id: 'prep',
    step: '01',
    title: 'CLASSICAL PREPROCESSING',
    subtitle: 'Graph Reduction & Live Traffic',
    desc: 'Transforms stop coordinates into real distance and Mappls travel-time matrices C[i][j]. Clusters orders into vehicle domains.',
    icon: Layers,
  },
  {
    id: 'qubo',
    step: '02',
    title: 'QUBO FORMULATION',
    subtitle: 'Ising Hamiltonian Mapping',
    desc: 'Encodes binary stop assignments x_i into Ising spin operators: H = Σ h_i Z_i + Σ J_ij Z_i Z_j. Normalizes energy penalties.',
    icon: GitBranch,
  },
  {
    id: 'qiskit',
    step: '03',
    title: 'QISKIT CIRCUIT',
    subtitle: 'QAOA Variational Circuit',
    desc: 'Constructs parameterized QuantumCircuit with Hadamard superpositions H^⊗n, two-qubit R_ZZ phase gates, and transverse R_X mixers.',
    icon: Atom,
  },
  {
    id: 'opt',
    step: '04',
    title: 'OPTIMIZATION',
    subtitle: 'StatevectorSampler Execution',
    desc: 'Executes 1024 measurement shots on StatevectorSampler. Quantum state interference explores non-convex combinatorial energy minima.',
    icon: Cpu,
  },
  {
    id: 'feas',
    step: '05',
    title: 'FEASIBILITY CHECK',
    subtitle: 'SLA & Capacity Verification',
    desc: 'Decodes sampled ground-state bitstring into permutation order. Validates vehicle payload boundaries and time windows.',
    icon: Shield,
  },
  {
    id: 'route',
    step: '06',
    title: 'ROUTE DISPATCH',
    subtitle: 'Physical Turn-by-Turn Manifest',
    desc: 'Synthesizes final driver manifest with turn-by-turn waypoints, precise arrival ETAs, fuel estimates, and CO₂ savings.',
    icon: CheckCircle2,
  },
];

export const QuantumWorkflow: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string>('qiskit');

  return (
    <div className="w-full rounded-3xl bg-[#111322] text-[#F7F6F2] p-8 sm:p-14 border border-white/10 shadow-2xl relative overflow-hidden select-none">
      
      {/* Subtle Ambient Background Gradient */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#FF5B37]/15 to-[#FF4D8D]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#38BDF8]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-3 pb-8 border-b border-white/10 relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF5B37]">
          <Atom className="w-4 h-4" />
          <span className="uppercase tracking-widest font-semibold">
            IBM QISKIT &bull; COMBINATORIAL PIPELINE
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
          OPTIMIZATION,<br />
          <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">
            RETHOUGHT.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-[#8E909A] max-w-2xl font-light leading-relaxed">
          From customer addresses to quantum circuit execution. RouteQ formulates delivery routing into Ising Hamiltonian spin operators executed on Python Qiskit primitives.
        </p>
      </div>

      {/* ─── 6-STAGE WORKFLOW PIPELINE ────────────────────────────────────── */}
      <div className="py-10 space-y-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((st, idx) => {
            const Icon = st.icon;
            const isSelected = activeStage === st.id;
            return (
              <div
                key={st.id}
                onClick={() => setActiveStage(st.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                  isSelected
                    ? 'bg-white/10 border-[#FF5B37] shadow-[0_0_24px_rgba(255,91,55,0.2)] ring-1 ring-[#FF5B37]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#FF5B37] font-semibold">
                    {st.step}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF5B37]' : 'text-[#8E909A]'}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    {st.title}
                  </div>
                  <div className="text-[10.5px] text-[#8E909A] font-mono mt-0.5 leading-tight truncate">
                    {st.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Detail Card for Selected Stage */}
        {(() => {
          const stage = STAGES.find((s) => s.id === activeStage) || STAGES[2];
          return (
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FF5B37]">
                  <span>STAGE {stage.step}</span>
                  <span className="text-white/20">&bull;</span>
                  <span className="text-white font-semibold">{stage.title}</span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  {stage.subtitle}
                </h4>
                <p className="text-xs sm:text-sm text-[#8E909A] font-light leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              {/* Minimal Quantum Math / Telemetry Badge */}
              <div className="md:col-span-4 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] space-y-1.5 text-[#38BDF8]">
                <div className="text-[9.5px] text-[#8E909A] uppercase tracking-wider">
                  MATHEMATICAL OPERATOR
                </div>
                {stage.id === 'qubo' && <div>H_C = Σ h_i Z_i + Σ J_ij Z_i Z_j</div>}
                {stage.id === 'qiskit' && <div>U(C, γ) = e^(-i γ H_C) &bull; R_ZZ</div>}
                {stage.id === 'opt' && <div>Sampler(shots=1024) → |b_opt⟩</div>}
                {stage.id === 'prep' && <div>C[i][j] = dist + time + fuel</div>}
                {stage.id === 'feas' && <div>Σ demand_i ≤ Capacity_k</div>}
                {stage.id === 'route' && <div>Manifest: Depot → Stops → Depot</div>}
                <div className="text-[10px] text-[#10B981]">Status: Verified Active</div>
              </div>
            </div>
          );
        })()}
      </div>

    </div>
  );
};
