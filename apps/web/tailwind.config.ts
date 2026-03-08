import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/design-system/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neoCyan: '#00FFFF',
        neoMagenta: '#FF00FF',
        neoPurple: '#8B00FF',
        neoLime: '#ADFF2F',
        neoAmber: '#FFB300',
        neoDark: '#0A0A0F',
        neoCard: '#12121A',
        bonk: '#FF6B00',
        wif: '#9B59B6',
        mew: '#1ABC9C',
        jup: '#3498DB',
        pengu: '#E74C3C',
        gxq: '#00FFFF',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px #00FFFF, 0 0 40px #00FFFF44',
        'glow-magenta': '0 0 20px #FF00FF, 0 0 40px #FF00FF44',
        'glow-purple': '0 0 20px #8B00FF, 0 0 40px #8B00FF44',
        'glow-lime': '0 0 20px #ADFF2F, 0 0 40px #ADFF2F44',
        'glow-amber': '0 0 20px #FFB300, 0 0 40px #FFB30044',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'flash-strobe': 'flash-strobe 0.3s step-end infinite',
        'glitch': 'glitch 0.5s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.7', filter: 'brightness(1.5)' },
        },
        'flash-strobe': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
          '100%': { transform: 'translate(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'neo-gradient': 'linear-gradient(135deg, #00FFFF22 0%, #FF00FF22 50%, #8B00FF22 100%)',
        'neo-grid': 'linear-gradient(#00FFFF11 1px, transparent 1px), linear-gradient(90deg, #00FFFF11 1px, transparent 1px)',
      },
    },
  },
  plugins: [typography],
};

export default config;
