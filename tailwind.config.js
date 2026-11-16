/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#ffe6ec',
          200: '#fcd0da',
          300: '#f7a8ba',
          400: '#f2728f',
          500: '#e75480',
          600: '#d13a68',
          700: '#ae2a53',
          800: '#8f2546',
          900: '#76223c',
        },
      },
    },
  },
  plugins: [],
};
