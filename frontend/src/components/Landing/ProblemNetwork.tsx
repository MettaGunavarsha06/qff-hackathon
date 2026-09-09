import React, { useState, useEffect } from 'react';
import { Sparkles, XCircle, CheckCircle2, RotateCw } from 'lucide-react';

interface NetworkNode {
  id: string;
  name: string;
  x: number;
  y: number;
}

const NODES: NetworkNode[] = [
  { id: 'HUB', name: 'Hub', x: 70, y: 150 },
  { id: 'A', name: 'Stop A', x: 190, y: 70 },
  { id: 'B', name: 'Stop B', x: 330, y: 90 },
  { id: 'C', name: 'Stop C', x: 410, y: 210 },
  { id: 'D', name: 'Stop D', x: 260, y: 250 },
  { id: 'E', name: 'Stop E', x: 140, y: 230 },
];

export const ProblemNetwork: React.FC = () => {
  const [phase, setPhase] = useState<'all' | 'filtering' | 'optimized'>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'all') return 'filtering';
        if (prev === 'filtering') return 'optimized';
        return 'all';
      });
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full rounded-3xl bg-white border border-[#E8E6DF] p-6 sm:p-10 shadow-soft space-y-8 select-none">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
        <div className="space-y-1">
          <span className="text-xs font-mono font-semibold text-[#FF5B37] uppercase tracking-wider">
            COMBINATORIAL EXPLOSION
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-[#111322]">
            {phase === 'all' && 'N! Permutations Evaluated'}
            {phase === 'filtering' && 'Eliminating Traffic & Capacity Violations'}
            {phase === 'optimized' && 'Pareto-Optimal Hamiltonian Ground State'}
          </h3>
        </div>

        {/* Phase Pill Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF] font-mono text-xs">
          <button
            onClick={() => setPhase('all')}
            className={`px-3 py-1 rounded-xl transition-all ${
              phase === 'all' ? 'bg-white font-bold text-[#111322] shadow-sm' : 'text-[#6B6D76]'
            }`}
          >
            1. All Paths
          </button>
          <button
            onClick={() => setPhase('filtering')}
            className={`px-3 py-1 rounded-xl transition-all ${
              phase === 'filtering' ? 'bg-white font-bold text-[#111322] shadow-sm' : 'text-[#6B6D76]'
            }`}
          >
            2. Constraint Filter
          </button>
          <button
            onClick={() => setPhase('optimized')}
            className={`px-3 py-1 rounded-xl transition-all ${
              phase === 'optimized' ? 'bg-[#FF5B37] text-white font-bold shadow-sm' : 'text-[#6B6D76]'
            }`}
          >
            3. Qiskit Optimized
          </button>
        </div>
      </div>

      {/* Interactive Network Canvas */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF] overflow-hidden flex items-center justify-center">
        
        <svg viewBox="0 0 480 300" className="w-full h-full max-w-xl">
          <defs>
            <linearGradient id="optLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5B37" />
              <stop offset="100%" stopColor="#FF4D8D" />
            </linearGradient>
          </defs>

          {/* Inefficient Criss-Cross Paths (Visible in 'all' and fading in 'filtering') */}
          <g
            className="transition-opacity duration-700"
            opacity={phase === 'all' ? 0.35 : phase === 'filtering' ? 0.1 : 0.04}
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 4"
          >
            <line x1="70" y1="150" x2="330" y2="90" />
            <line x1="190" y1="70" x2="260" y2="250" />
            <line x1="330" y1="90" x2="140" y2="230" />
            <line x1="410" y1="210" x2="70" y2="150" />
            <line x1="260" y1="250" x2="190" y2="70" />
            <line x1="140" y1="230" x2="410" y2="210" />
          </g>

          {/* Sub-optimal alternative path (Rejected during filtering) */}
          <path
            d="M 70 150 L 330 90 L 190 70 L 410 210 L 140 230 L 260 250 Z"
            fill="none"
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="transition-opacity duration-700"
            opacity={phase === 'filtering' ? 0.6 : 0.05}
          />

          {/* Optimal Ground-State Route Path */}
          <path
            d="M 70 150 Q 120 90, 190 70 Q 260 70, 330 90 Q 380 140, 410 210 Q 340 260, 260 250 Q 190 260, 140 230 Q 90 200, 70 150 Z"
            fill="none"
            stroke={phase === 'optimized' ? 'url(#optLineGrad)' : '#CBD5E1'}
            strokeWidth={phase === 'optimized' ? '3.5' : '1.5'}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700"
            style={
              phase === 'optimized'
                ? { filter: 'drop-shadow(0 0 10px rgba(255,91,55,0.45))' }
                : undefined
            }
          />

          {/* Network Nodes */}
          {NODES.map((node) => {
            const isHub = node.id === 'HUB';
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={isHub ? 12 : 8}
                  fill={isHub ? '#111322' : phase === 'optimized' ? '#FF5B37' : '#FFFFFF'}
                  stroke={isHub ? '#FF5B37' : phase === 'optimized' ? '#FFFFFF' : '#64748B'}
                  strokeWidth="2"
                  className="transition-colors duration-500 shadow-sm"
                />
                {isHub && <circle cx="0" cy="0" r="3" fill="#FF5B37" />}
                <text
                  x="0"
                  y={isHub ? 22 : 18}
                  textAnchor="middle"
                  fill="#111322"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="Manrope, sans-serif"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Status Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E6DF] text-[10.5px] font-mono text-[#111322] shadow-xs">
          {phase === 'all' && (
            <>
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
              <span>UNFILTERED SEARCH SPACE: 720 TOURS</span>
            </>
          )}
          {phase === 'filtering' && (
            <>
              <XCircle className="w-3 h-3 text-[#EF4444]" />
              <span>REJECTING 719 SUB-OPTIMAL TOURS</span>
            </>
          )}
          {phase === 'optimized' && (
            <>
              <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
              <span className="font-bold text-[#FF5B37]">GROUND-STATE TOUR: -14.2% KM</span>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
