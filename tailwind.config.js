/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layout/*.liquid",
    "./templates/*.liquid",
    "./templates/**/*.json",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./assets/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'xbox-green': '#107C10',
        'xbox-sub-green': '#33A10E',
        'xbox-dark': '#0F0F0F',
        'xbox-blade-start': '#066501',
        'xbox-blade-end': '#0DA90D'
      },
      backgroundImage: {
        'blade-gradient': 'linear-gradient(135deg, #066501 0%, #0DA90D 100%)'
      },
      fontFamily: {
        'xbox': ['Segoe UI', 'system-ui', 'sans-serif']
      },
      animation: {
        'blade-slide': 'bladeSlide 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        'tile-hover': 'tileHover 0.2s ease-out',
        'achievement-toast': 'achievementToast 3s ease-in-out'
      },
      keyframes: {
        bladeSlide: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        tileHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' }
        },
        achievementToast: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '10%': { transform: 'translateX(0)', opacity: '1' },
          '90%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
} 