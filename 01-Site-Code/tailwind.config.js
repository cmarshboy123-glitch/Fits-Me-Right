/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        paper: '#FAF9F6',
        gold: {
          50: '#FBF6E8',
          100: '#F6EACB',
          200: '#ECD69D',
          300: '#DFBC6A',
          400: '#D3A11E',
          500: '#BF8F1B',
          600: '#A67816',
          700: '#8C6412',
          800: '#6E4E0F',
          900: '#4A340A',
        },
      },
      boxShadow: {
        soft: '0 2px 10px rgba(20, 17, 13, .04), 0 12px 30px rgba(20, 17, 13, .06)',
        lift: '0 8px 24px rgba(20, 17, 13, .10), 0 24px 48px rgba(20, 17, 13, .08)',
      },
    },
  },
  plugins: [],
}
