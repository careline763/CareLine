/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 600: '#4f46e5', 700: '#4338ca', 50: '#eef2ff' },
      },
    },
  },
  plugins: [],
};
