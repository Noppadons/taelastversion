/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#111827',
        'surface': '#1F2937',
        'accent': '#DC2626',
        'text-main': '#F9FAFB',
        'text-secondary': '#9CA3AF',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}