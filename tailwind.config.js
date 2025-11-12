/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          50: '#18181b',
          100: '#1a1a1d',
          200: '#1c1c1f',
          300: '#27272a',
          400: '#3f3f46',
          500: '#52525b',
          600: '#71717a',
          700: '#a1a1aa',
          800: '#d4d4d8',
          900: '#f4f4f5',
        },
      },
    },
  },
  plugins: [],
};
