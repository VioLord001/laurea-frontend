/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#8a7560', light: '#d4b896', dark: '#6b5a48' },
        dark: { DEFAULT: '#0d1b2a', light: '#1a2d42' },
        cream: { DEFAULT: '#ffffff', dark: '#f0f4f8' },
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
