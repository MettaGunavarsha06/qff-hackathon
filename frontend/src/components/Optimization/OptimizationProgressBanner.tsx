import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu } from 'lucide-react';

export interface OptimizationProgressState {
  isRunning: boolean;
  stage: string;
  percent: number;
}

interface OptimizationProgressBannerProps {
  progress: OptimizationProgressState;
}

export const OptimizationProgressBanner: React.FC<OptimizationProgressBannerProps> = ({ progress }) => {
  if (!progress.isRunning) return null;

  const isComplete = progress.percent >= 100;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[3000] pointer-events-none w-[92%] max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-[#E8E6DF] rounded-2xl p-4 shadow-soft-xl space-y-2.5"
      >
        {/* Header with Stage and Percentage */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF5B37] to-[#FF4D8D] flex items-center justify-center text-white shadow-xs">
              {isComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#8E909A] tracking-wider uppercase">
                {isComplete ? 'OPTIMIZATION COMPLETE' : 'OPTIMIZING ROUTES...'}
              </div>
              <div className="text-xs font-bold text-[#1F2024] tracking-tight">
                {progress.stage}
              </div>
            </div>
          </div>

          <div className="font-mono text-base font-bold text-[#1F2024]">
            {Math.min(100, Math.round(progress.percent))}%
          </div>
        </div>

        {/* Progress Bar with Gradient */}
        <div className="w-full h-2 rounded-full bg-[#F2F1EC] overflow-hidden p-0.5 border border-[#E8E6DF]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF5B37] via-[#FF4D8D] to-[#10B981] transition-all duration-150 ease-out shadow-xs"
            style={{ width: `${Math.min(100, Math.max(2, progress.percent))}%` }}
          />
        </div>
      </motion.div>
    </div>
  );
};
