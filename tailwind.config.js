/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#b8966a', light: '#d4b896', dark: '#8a6e4e' },
        dark: { DEFAULT: '#1c1208', light: '#2d1f0a' },
        cream: { DEFAULT: '#f5ede0', dark: '#e8ddd0' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: { widest: '0.3em', ultra: '0.4em' },
    },
  },
  plugins: [],
};
