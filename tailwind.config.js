/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brandbook p.33 palette
        blue: { DEFAULT: '#253990', deep: '#1A2968' }, // Electric Blue
        sand: '#DDD3B9', // Sand Beige
        walnut: '#512314', // Walnut Brown
        sky: '#9EBEC9', // Sky Blue
        tan: '#865833', // Earthy Tan
        gold: '#F3BD25', // Golden Yellow
        // Dark, warm base for the darker site direction
        ink: { DEFAULT: '#0B0908', 2: '#14100D', 3: '#1D1712' },
      },
      fontFamily: {
        // Brand fonts first; Google stand-ins until the licensed files are added (see src/index.css)
        display: ['"Matiere Condensed"', '"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"FT Regola Neue"', 'Figtree', 'system-ui', 'sans-serif'],
        din: ['"DIN"', '"DIN Pro"', 'Barlow', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1920px' },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
