/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/**/*.json',
    './sections/*.liquid',
    './snippets/*.liquid',
    './assets/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'n64-purple': '#6E00FF',
        'n64-gold': '#FFDF00',
        'n64-dark': '#1E1E1E',
        'n64-blade-start': '#6E00FF',
        'n64-blade-end': '#FFDF00'
      },
      backgroundImage: {
        'n64-gradient': 'linear-gradient(135deg, #6E00FF 0%, #FFDF00 100%)'
      },
      fontFamily: {
        'n64': ['Press Start 2P', 'system-ui', 'sans-serif']
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
}; 