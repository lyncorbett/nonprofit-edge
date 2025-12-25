/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a365d',
          dark: '#122443',
          light: '#2d4a7c',
        },
        teal: {
          DEFAULT: '#00a0b0',
          dark: '#008090',
          light: '#00b8c9',
          bg: '#e6f7f9',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
