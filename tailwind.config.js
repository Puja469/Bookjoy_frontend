/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        'scale-rotate': 'scaleRotate 5s infinite ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        scaleRotate: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
