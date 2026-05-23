/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        harbor: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bce0fd',
          300: '#7fc4fc',
          400: '#3aa2f8',
          500: '#0f86e9',
          600: '#0267c7',
          700: '#0352a1',
          800: '#074685',
          900: '#0c3c6f',
          950: '#08264a',
        }
      }
    },
  },
  plugins: [],
}
