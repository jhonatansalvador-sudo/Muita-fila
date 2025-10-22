/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'brand-navy': '#1E2A4A',
        'brand-lime': '#D9E4AA',
        'text-primary': '#1E2A4A',
        'text-secondary': '#4A4A4A',
        'bg-light': '#F8F9FA',
        'status-on-break': '#f97316',
        'status-next': '#16a34a',
      }
    },
  },
  plugins: [],
}