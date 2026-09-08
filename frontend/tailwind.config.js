/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#070b14',
          850: '#0b0f19',
          800: '#0f172a',
          750: '#151f33',
          700: '#1e293b',
          600: '#334155',
        },
        quantum: {
          cyan: '#06b6d4',
          teal: '#14b8a6',
          emerald: '#10b981',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
