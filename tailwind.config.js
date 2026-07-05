/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7B6EF6',
          dark: '#6A5AE0',
          light: '#B4A9FF',
          extraLight: '#F0EDFF',
        },
        accent: {
          DEFAULT: '#00CEC9',
          dark: '#00B5B0',
        },
        cardDark: {
          DEFAULT: '#1E1438',
          light: '#2D1B5E',
        },
        dark: '#1E1438',
        darker: '#0F0A1F',
        background: '#F8F9FE',
        gray50: '#F8F9FE',
        gray100: '#F1F3FE',
        gray200: '#E8EAF6',
        gray300: '#D8DBE8',
        gray400: '#B8BCCE',
        gray500: '#8E92A6',
        gray600: '#6B6F85',
        gray700: '#4A4E63',
        gray800: '#2D3047',
        success: '#00B894',
        successLight: '#55EFC4',
        warning: '#FDCB6E',
        warningDark: '#E17055',
        danger: '#E84393',
        dangerLight: '#FAB1C7',
        info: '#0984E3',
        infoLight: '#74B9FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'fade-slide': 'fadeSlide 0.35s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'shimmer': 'shimmer 1.2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
