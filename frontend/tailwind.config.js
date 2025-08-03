/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
      },
      colors: {
        'background': '#030712',
        'surface': '#111827',
        'accent': '#22d3ee',
        'text-main': '#F9FAFB',
        'text-secondary': '#9CA3AF',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}