/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#209927',
          neon: '#68E70F',
          yellow: '#FFCF26',
          red: '#BF1A1F',
          blue: '#035C88',
          light: '#F1F1F1',
          dark: '#2E2E2E',
          grad1: '#7AB802',
          grad2: '#00621A',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
