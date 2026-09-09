import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  decimals: number;
  label: string;
  subtext: string;
  customDisplay?: string;
}

const STATS_DATA: StatItem[] = [
  {
    value: 12.8,
    suffix: '%',
    decimals: 1,
    label: 'DISTANCE REDUCTION',
    subtext: 'Average route length cut across urban delivery clusters',
  },
  {
    value: 8.4,
    suffix: '%',
    decimals: 1,
    label: 'FUEL SAVED',
    subtext: 'Fuel burn and battery expenditure minimized',
  },
  {
    value: 11.2,
    suffix: '%',
    decimals: 1,
    label: 'CO₂ REDUCTION',
    subtext: 'Scope-1 fleet tailpipe emissions eliminated',
  },
  {
    value: 121, // 121 mins = 2h 01m
    suffix: '',
    decimals: 0,
    label: 'TIME SAVED',
    subtext: 'Daily driver hours recovered from traffic congestion',
    customDisplay: '2H 01M',
  },
];

export const PerformanceStats: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1600; // ms
    const startTime = performance.now();

    const animateCounts = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts(STATS_DATA.map((st) => Number((st.value * ease).toFixed(st.decimals))));

      if (progress < 1) {
        requestAnimationFrame(animateCounts);
      }
    };

    requestAnimationFrame(animateCounts);
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="w-full py-12 border-y border-[#E8E6DF] grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 select-none"
    >
      {STATS_DATA.map((item, idx) => (
        <div key={item.label} className="space-y-2">
          {/* Large Editorial Metric Value */}
          <div className="font-mono text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#111322]">
            {item.customDisplay && isInView ? (
              item.customDisplay
            ) : (
              <>
                {item.prefix || ''}
                {counts[idx]}
                <span className="text-[#FF5B37] ml-0.5 text-3xl sm:text-4xl lg:text-5xl font-light">
                  {item.suffix}
                </span>
              </>
            )}
          </div>

          {/* Metric Label */}
          <div className="text-xs font-mono font-bold tracking-wider text-[#111322] uppercase">
            {item.label}
          </div>

          {/* Editorial Subtext */}
          <p className="text-xs text-[#6B6D76] font-light leading-relaxed max-w-[220px]">
            {item.subtext}
          </p>
        </div>
      ))}
    </div>
  );
};
