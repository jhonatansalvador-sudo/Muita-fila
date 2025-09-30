/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#4338ca',
        'brand-secondary': '#3b82f6',
        'brand-dark': '#1f2937',
        'status-on-break': '#f97316',
        'status-next': '#16a34a',
      }
    },
  },
  plugins: [],
}
