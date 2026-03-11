/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out both',
        'slide-up': 'slideUp 0.8s ease-out 0.4s both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both',
        'bounce-in': 'bounceIn 0.9s cubic-bezier(0.68,-0.55,0.265,1.55) both',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        gradientX: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-80px) rotateY(8deg)' },
          '100%': { opacity: '1', transform: 'translateX(0) rotateY(0deg)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(80px) rotateY(-8deg)' },
          '100%': { opacity: '1', transform: 'translateX(0) rotateY(0deg)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3) rotate(-5deg)' },
          '50%': { transform: 'scale(1.08) rotate(1deg)' },
          '70%': { transform: 'scale(0.95) rotate(-0.5deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.2)' },
        },
      },
    },
  },
  plugins: [],
}
