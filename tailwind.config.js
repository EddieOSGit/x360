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
        'n64-blade-end': '#FFDF00',
        'n64-blue': '#003CD0',
        'n64-red': '#FF0000',
        'n64-green': '#00B800',
        'n64-shadow': '#000066'
      },
      backgroundImage: {
        'n64-gradient': 'linear-gradient(135deg, #6E00FF 0%, #FFDF00 100%)',
        'n64-button': 'linear-gradient(to bottom, #FFDF00 0%, #FFA000 100%)',
        'n64-logo': 'radial-gradient(circle, #6E00FF 0%, #000066 100%)'
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