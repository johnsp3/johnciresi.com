/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Apple's actual website background colors (2025) - softer
        dark: {
          bg: '#000000',           // Pure black like Apple
          surface: '#1a1a1a',      // Softer dark surface
          elevated: '#242424',     // Softer elevated surface
          muted: '#2a2a2a',        // Softer muted surface
          border: '#333333',       // Softer border color
        },
        // Apple's actual website colors (2025) - muted and sophisticated
        accent: {
          primary: '#0066CC',      // Apple's main brand blue (interactive elements)
          secondary: '#6E6E73',    // Apple's gray text (muted)
          tertiary: '#8E8E93',     // Apple's light gray (subtle)
          blue: '#0055B3',         // Apple's hover blue (darker)
        },
        // Apple's actual text colors
        text: {
          primary: '#1D1D1F',      // Apple's main text (Shark)
          secondary: '#6E6E73',    // Apple's gray text
          muted: '#8E8E93',        // Apple's muted text
          inverse: '#FFFFFF',      // White text on dark backgrounds
        },
      },
      fontFamily: {
        sans: [
          'Inter var',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'system-ui',
          'sans-serif',
        ],
        display: ['Inter var', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        glow: '0 0 40px rgba(0, 102, 204, 0.15)',
        'glow-lg': '0 0 60px rgba(0, 102, 204, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(0, 102, 204, 0.1)',
        'premium': '0 20px 60px rgba(0, 0, 0, 0.3)',
        'premium-lg': '0 30px 80px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-x': 'gradientX 3s ease infinite',
        'gradient-y': 'gradientY 3s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 102, 204, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 102, 204, 0.3)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientY: {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
