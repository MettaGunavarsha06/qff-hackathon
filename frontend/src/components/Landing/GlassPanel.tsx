import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  glow = false,
}) => {
  return (
    <div
      className={`relative rounded-2xl p-3.5 sm:p-4 text-xs font-mono transition-all duration-300 ${
        glow ? 'shadow-[0_8px_30px_rgba(255,91,55,0.12)]' : 'shadow-soft'
      } ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.85)',
      }}
    >
      {/* Subtle top reflection gradient */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 rounded-t-2xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
