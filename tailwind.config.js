/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',   // blue-800
        },
      },
      colors: {
        trust: {
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e40af',   // blue-800
        },
      },
      fontFamily: {
        sans: [
          'Montserrat',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Inter',
          'Arial',
        ],
      },
    },
  },
  plugins: [],
};
