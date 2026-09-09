import React from 'react';

export interface AnimatedTruckProps {
  x?: number;
  y?: number;
  angle?: number;
  scale?: number;
}

export const AnimatedTruck = React.forwardRef<SVGGElement, AnimatedTruckProps>(
  ({ x = 0, y = 0, angle = 0, scale = 1 }, ref) => {
    return (
      <g
        ref={ref}
        transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}
        className="pointer-events-none"
        style={{
          filter: 'drop-shadow(0 3px 6px rgba(255, 91, 55, 0.35))',
          transformOrigin: '0px 0px',
        }}
      >
        {/* Underglow aura */}
        <circle
          cx="0"
          cy="0"
          r="14"
          fill="url(#truckGlowGrad)"
          opacity="0.5"
        />

        {/* Wheels (Top & Bottom pair, centered symmetrically) */}
        <rect x="-10" y="-8.5" width="4.5" height="2" rx="1" fill="#111322" />
        <rect x="5.5" y="-8.5" width="4.5" height="2" rx="1" fill="#111322" />
        <rect x="-10" y="6.5" width="4.5" height="2" rx="1" fill="#111322" />
        <rect x="5.5" y="6.5" width="4.5" height="2" rx="1" fill="#111322" />

        {/* Truck Body Shadow */}
        <rect
          x="-13.5"
          y="-7"
          width="27"
          height="14"
          rx="3"
          fill="#000000"
          opacity="0.12"
          transform="translate(1, 1.5)"
        />

        {/* Cargo Container (Main Body, -13.5 to 4.5) */}
        <rect
          x="-13.5"
          y="-7"
          width="18"
          height="14"
          rx="2"
          fill="#FFFFFF"
          stroke="#E8E6DF"
          strokeWidth="0.8"
        />

        {/* RouteQ Coral Accent Stripe */}
        <rect
          x="-12.5"
          y="-1"
          width="16"
          height="2"
          rx="1"
          fill="url(#routeQAccentGrad)"
        />

        {/* Driver Cab (4.5 to 13.5) */}
        <path
          d="M 4.5 -6.5 L 9.5 -6.5 C 11.5 -6.5 13.5 -4.5 13.5 -1.5 L 13.5 1.5 C 13.5 4.5 11.5 6.5 9.5 6.5 L 4.5 6.5 Z"
          fill="#111322"
        />

        {/* Aerodynamic Windshield */}
        <path
          d="M 5.5 -4.5 L 9 -4.5 C 10.5 -4.5 11.5 -3.5 11.8 -1.5 L 5.5 -1.5 Z"
          fill="#38BDF8"
          opacity="0.9"
        />

        {/* Headlights */}
        <circle cx="13" cy="-4" r="0.8" fill="#FBBF24" />
        <circle cx="13" cy="4" r="0.8" fill="#FBBF24" />

        {/* Center Pivot Guide Point (invisible, preserves 0,0 alignment) */}
        <circle cx="0" cy="0" r="0.1" fill="transparent" />
      </g>
    );
  }
);

AnimatedTruck.displayName = 'AnimatedTruck';
