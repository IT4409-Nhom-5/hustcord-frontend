/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          dark: '#36393f',
          darker: '#2c2f33',
          darkest: '#23272a',
          light: '#99aab5',
          lighter: '#dcddde',
          purple: '#7289da',
          green: '#43b581',
          red: '#f04747',
        }
      }
    },
  },
  plugins: [],
}
