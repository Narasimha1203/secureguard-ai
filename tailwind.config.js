/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040b16',
          900: '#071426',
          800: '#0b1d36',
          700: '#102744',
          600: '#1a3a5f',
        },
        neon: {
          cyan: '#00E5FF',
          violet: '#8B5CF6',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 24px rgba(0, 229, 255, 0.25)',
        'glow-violet': '0 0 24px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
};
