/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        body:    ['Geist', 'system-ui', 'sans-serif'],
        mono:    ['Geist Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
