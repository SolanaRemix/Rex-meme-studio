import type { MemeTemplate } from '../types';

export const bonkTemplate: MemeTemplate = {
  id: 'bonk',
  token: 'BONK',
  name: 'BONK Dog Meme',
  baseSvg: '',
  layers: [
    {
      type: 'shape',
      id: 'bg',
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      style: { fill: '#1a0a00' },
    },
    {
      type: 'text',
      id: 'caption',
      x: 250,
      y: 420,
      style: {
        fill: '#FF6B00',
        fontSize: '28px',
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 'bold',
        textAnchor: 'middle',
      },
    },
    {
      type: 'text',
      id: 'token-badge',
      x: 40,
      y: 40,
      style: {
        fill: '#FF6B00',
        fontSize: '16px',
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: '600',
      },
    },
  ],
  styleHints: ['neoGlow', 'orange-glow', 'doge-character'],
};
