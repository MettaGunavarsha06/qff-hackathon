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
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        ivory: {
          DEFAULT: '#F7F6F2',
          50: '#FAF9F6',
          100: '#F7F6F2',
          200: '#EFEFEB',
          300: '#E5E4DE',
          400: '#D6D4CC',
        },
        charcoal: {
          DEFAULT: '#1F2024',
          900: '#141518',
          800: '#1F2024',
          700: '#2E3036',
          600: '#474952',
          500: '#6B6D76',
          400: '#8E909A',
          300: '#B6B8C2',
          200: '#E0E1E8',
          100: '#F2F3F7',
        },
        surface: {
          bg: '#F7F6F2',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          border: '#E8E6DF',
          subtle: '#F2F1EC',
          dark: '#16161A',
          darkCard: '#1E1E24',
          darkBorder: 'rgba(255, 255, 255, 0.08)',
        },
        accent: {
          orange: '#FF5B37',
          coral: '#FF6347',
          pink: '#FF4D8D',
          magenta: '#F43F5E',
          amber: '#F59E0B',
          emerald: '#10B981',
        },
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #FF5B37 0%, #FF4D8D 100%)',
        'accent-gradient-h': 'linear-gradient(90deg, #FF5B37 0%, #FF4D8D 100%)',
        'accent-gradient-soft': 'linear-gradient(135deg, rgba(255, 91, 55, 0.08) 0%, rgba(255, 77, 141, 0.08) 100%)',
        'accent-gradient-glow': 'linear-gradient(135deg, rgba(255, 91, 55, 0.2) 0%, rgba(255, 77, 141, 0.2) 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #FAF9F6 0%, #F7F6F2 100%)',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(31, 32, 36, 0.04)',
        'soft': '0 8px 30px rgba(31, 32, 36, 0.06)',
        'soft-lg': '0 16px 40px rgba(31, 32, 36, 0.08)',
        'accent-glow': '0 4px 20px rgba(255, 91, 55, 0.25)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
