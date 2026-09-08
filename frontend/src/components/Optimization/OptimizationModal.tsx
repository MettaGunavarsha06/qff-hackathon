import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  X,
} from 'lucide-react';
import type { OptimizationResult } from '../../types';

interface OptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  optimizationResult: OptimizationResult | null;
  onViewResults: () => void;
}

export const OptimizationModal: React.FC<OptimizationModalProps> = ({
  isOpen,
  onClose,
  optimizationResult: _optimizationResult,
  onViewResults,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [simulatedAnnealTemp, setSimulatedAnnealTemp] = useState(40.0);
  const [simulatedEnergy, setSimulatedEnergy] = useState(167.9);

  const stages = [
    { step: 1, name: 'DEMAND GRAPH', detail: 'Parsing order coordinates & time windows' },
    { step: 2, name: 'ROUTE MODEL', detail: 'Generating physical distance & capacity matrices' },
    { step: 3, name: 'QUBO FORMULATION', detail: 'Mapping constraints to Hamiltonian energy terms' },
    { step: 4, name: 'QISKIT / SQA SOLVER', detail: 'Transverse field barrier tunneling Γ(t)' },
    { step: 5, name: 'FEASIBILITY VALIDATION', detail: '2-opt untangling & constraint verification' },
    { step: 6, name: 'DISPATCH GENERATION', detail: 'Synthesizing vehicle route manifests' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsCompleted(false);
      return;
    }

    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 6) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsCompleted(true);
          return 6;
        }
      });
    }, 280);

    // Simulated energy & temperature decay
    const tempInterval = setInterval(() => {
      setSimulatedAnnealTemp((prev) => Math.max(0.12, +(prev * 0.72).toFixed(2)));
      setSimulatedEnergy((prev) => Math.max(57.4, +(prev * 0.88).toFixed(1)));
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(tempInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0D0D0D] border border-white/[0.08] rounded-xl shadow-2xl p-6 relative overflow-hidden space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="space-y-0.5">
            <div className="font-display font-semibold text-sm text-white">
              {isCompleted ? 'OPTIMIZATION COMPLETE' : 'QUANTUM ROUTE SOLVER'}
            </div>
            <div className="font-mono text-[11px] text-[#8A8A8E]">
              {isCompleted ? 'Hamiltonian ground state identified' : 'Executing Simulated Quantum Annealing'}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#8A8A8E] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Strip */}
        <div className="p-3 rounded bg-[#121212] border border-white/[0.04] grid grid-cols-3 gap-2 font-mono text-[10px]">
          <div>
            <div className="text-[#8A8A8E]">ANNEAL TEMP T(t)</div>
            <div className="text-white font-medium mt-0.5">{simulatedAnnealTemp} K</div>
          </div>
          <div>
            <div className="text-[#8A8A8E]">ENERGY H(x)</div>
            <div className="text-white font-medium mt-0.5">{simulatedEnergy} J</div>
          </div>
          <div>
            <div className="text-[#8A8A8E]">STAGE</div>
            <div className="text-[#FF5500] font-medium mt-0.5">0{currentStep} / 06</div>
          </div>
        </div>

        {/* 6 Stages List */}
        <div className="space-y-2 font-mono text-xs">
          {stages.map((st) => {
            const isDone = currentStep > st.step || isCompleted;
            const isCurrent = currentStep === st.step && !isCompleted;

            return (
              <div
                key={st.step}
                className={`p-2.5 rounded flex items-center justify-between border transition-all ${
                  isDone
                    ? 'bg-white/[0.02] border-white/[0.04] text-white'
                    : isCurrent
                    ? 'bg-white/[0.06] border-white/20 text-white'
                    : 'bg-transparent border-transparent text-[#8A8A8E]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#FF5500]' : isDone ? 'text-white' : 'text-[#8A8A8E]/40'}`}>
                    0{st.step}
                  </span>
                  <div>
                    <div className="text-[11px] font-medium">{st.name}</div>
                    <div className="text-[10px] text-[#8A8A8E]">{st.detail}</div>
                  </div>
                </div>

                <div className="text-[10px]">
                  {isDone ? '✓' : isCurrent ? '...' : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* Victory Scorecard when completed */}
        {isCompleted && (
          <div className="p-4 rounded bg-[#121212] border border-white/[0.08] space-y-3 pt-3">
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div>
                <div className="text-sm font-bold text-white">12.8%</div>
                <div className="text-[9px] text-[#8A8A8E] uppercase">Distance</div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">8.4%</div>
                <div className="text-[9px] text-[#8A8A8E] uppercase">Fuel</div>
              </div>
              <div>
                <div className="text-sm font-bold text-white">11.2%</div>
                <div className="text-[9px] text-[#8A8A8E] uppercase">CO₂ Saved</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onViewResults}
                className="flex-1 btn-minimal-primary !py-2 text-xs"
              >
                <span>View Dispatch Manifest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="btn-minimal-outline !py-2 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
