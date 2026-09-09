import React from 'react';

export interface DeliveryNodeProps {
  id: string;
  label: string;
  x: number;
  y: number;
  isDepot?: boolean;
  isActive?: boolean;
  isVisited?: boolean;
}

export const DeliveryNode: React.FC<DeliveryNodeProps> = ({
  id,
  label,
  x,
  y,
  isDepot = false,
  isActive = false,
  isVisited = false,
}) => {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="transition-all duration-300 select-none"
    >
      {/* Expanding Pulse Ring when Active */}
      {isActive && (
        <circle
          cx="0"
          cy="0"
          r={isDepot ? 18 : 14}
          fill="none"
          stroke={isDepot ? '#111322' : '#FF5B37'}
          strokeWidth="1.5"
          className="animate-ping"
          opacity="0.6"
        />
      )}

      {/* Outer Soft Glow */}
      <circle
        cx="0"
        cy="0"
        r={isActive ? (isDepot ? 14 : 11) : isDepot ? 10 : 7}
        fill={
          isActive
            ? isDepot
              ? 'rgba(17, 19, 34, 0.2)'
              : 'rgba(255, 91, 55, 0.25)'
            : 'rgba(255, 255, 255, 0.8)'
        }
        className="transition-all duration-300"
      />

      {/* Main Circular Marker */}
      <circle
        cx="0"
        cy="0"
        r={isDepot ? 7 : isActive ? 5.5 : 4}
        fill={
          isDepot
            ? '#111322'
            : isActive
            ? '#FF5B37'
            : isVisited
            ? '#FF7A3D'
            : '#FFFFFF'
        }
        stroke={isDepot ? '#FFFFFF' : isActive ? '#FFFFFF' : '#FF5B37'}
        strokeWidth={isActive || isDepot ? '2' : '1.5'}
        className="transition-all duration-300 shadow-sm cursor-pointer"
      />

      {/* Center Dot for Depot or Active Stop */}
      {isDepot && (
        <circle cx="0" cy="0" r="2" fill="#FF5B37" />
      )}

      {/* Elegant Map Label */}
      <g transform="translate(0, 16)" className="pointer-events-none">
        <rect
          x={-((label.length * 3.4) + 6)}
          y="-9"
          width={(label.length * 6.8) + 12}
          height="14"
          rx="7"
          fill={isActive ? '#111322' : 'rgba(255, 255, 255, 0.92)'}
          stroke={isActive ? '#FF5B37' : '#E8E6DF'}
          strokeWidth="0.8"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
          className="transition-all duration-200"
        />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill={isActive ? '#FFFFFF' : '#242731'}
          fontSize="8.5"
          fontWeight={isActive ? '700' : '600'}
          fontFamily="Manrope, sans-serif"
          className="transition-colors duration-200"
        >
          {label}
        </text>
      </g>
    </g>
  );
};
