import React from 'react';

interface AnimatedTruckProps {
  x: number;
  y: number;
  angle: number;
  scale?: number;
}

export const AnimatedTruck: React.FC<AnimatedTruckProps> = ({
  x,
  y,
  angle,
  scale = 1,
}) => {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}
      className="pointer-events-none transition-transform"
      style={{ filter: 'drop-shadow(0 3px 8px rgba(255, 91, 55, 0.35))' }}
    >
      {/* Subtle pulse underglow */}
      <circle
        cx="0"
        cy="0"
        r="14"
        fill="url(#truckGlowGrad)"
        opacity="0.6"
      />

      {/* Truck Body Shadow */}
      <rect
        x="-14"
        y="-7"
        width="28"
        height="14"
        rx="3"
        fill="#000000"
        opacity="0.15"
        transform="translate(1, 2)"
      />

      {/* Cargo Container (Main Body) */}
      <rect
        x="-14"
        y="-7"
        width="18"
        height="14"
        rx="2"
        fill="#FFFFFF"
        stroke="#E8E6DF"
        strokeWidth="0.8"
      />

      {/* Cargo Accent Line (RouteQ Coral) */}
      <rect
        x="-13"
        y="-1"
        width="16"
        height="2"
        rx="1"
        fill="url(#routeQAccentGrad)"
      />

      {/* Driver Cab */}
      <path
        d="M 4 -6 L 9 -6 C 11 -6 13 -4 13 -1 L 13 5 C 13 6 12 7 10 7 L 4 7 Z"
        fill="#1F2024"
      />

      {/* Windshield */}
      <path
        d="M 5 -4.5 L 8.5 -4.5 C 9.5 -4.5 10.5 -3.5 10.8 -2 L 5 -2 Z"
        fill="#38BDF8"
        opacity="0.85"
      />

      {/* Headlights */}
      <circle cx="12.5" cy="-4" r="0.8" fill="#FBBF24" />
      <circle cx="12.5" cy="5" r="0.8" fill="#FBBF24" />

      {/* Wheels */}
      <rect x="-11" y="-8.5" width="4" height="2" rx="1" fill="#111322" />
      <rect x="-11" y="6.5" width="4" height="2" rx="1" fill="#111322" />
      <rect x="6" y="-8.5" width="4" height="2" rx="1" fill="#111322" />
      <rect x="6" y="6.5" width="4" height="2" rx="1" fill="#111322" />
    </g>
  );
};
