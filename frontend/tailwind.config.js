/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        surface: {
          bg: '#080808',
          card: '#0D0D0D',
          elevated: '#121212',
          border: '#1F1F1F',
          subtle: '#262626',
        },
        accent: {
          orange: '#FF5500',
          pink: '#EC4899',
          amber: '#F59E0B',
          emerald: '#10B981',
        },
        graphite: {
          950: '#050505',
          900: '#080808',
          850: '#0D0D0D',
          800: '#121212',
          750: '#171717',
          700: '#1F1F1F',
          600: '#2A2A2A',
          500: '#404040',
          400: '#737373',
          300: '#A3A3A3',
          200: '#E5E5E5',
          100: '#F5F5F5',
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #FF5500 0%, #EC4899 100%)',
        'accent-gradient-h': 'linear-gradient(90deg, #FF5500 0%, #EC4899 100%)',
        'accent-gradient-subtle': 'linear-gradient(135deg, rgba(255, 85, 0, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
