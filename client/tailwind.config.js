/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D4A574',
        secondary: '#8B6F47',
        background: '#FDF8F3',
        'text-dark': '#2C2C2C',
        accent: '#E8D5C4',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 4px 24px rgba(212, 165, 116, 0.18)',
        card: '0 2px 16px rgba(44, 44, 44, 0.08)',
      },
      borderRadius: {
        candle: '10px',
      },
    },
  },
  plugins: [],
};
