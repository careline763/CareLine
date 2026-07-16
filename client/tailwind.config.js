/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Luxury Dark Theme
        luxuryDark: {
          base: '#0A0A0A',
          card: '#141414',
          input: '#1A1A1A',
          border: '#242424',
        },
        luxuryGold: {
          DEFAULT: '#C5A880',
          light: '#DFCBAD',
          dark: '#A6875D',
        },
        // Legacy brand colors (for backward compatibility)
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        accent: {
          400: '#facc15',
          500: '#eab308',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
