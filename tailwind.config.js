/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        desert: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        campfire: {
          black: '#000000',
          dark: '#0f0502',
          card: '#1c0b05',
          border: '#3d1609',
          flame: '#ff4d00',
          ember: '#f97316',
          glow: '#fb923c',
          text: '#fed7aa',
          muted: '#9a3412',
        }
      },
      fontFamily: {
        sans: ['Assistant', 'Rubik', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'field': '0 4px 20px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'fire': '0 0 25px -5px rgba(249, 115, 22, 0.35)',
      }
    },
  },
  plugins: [],
}
