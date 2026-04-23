import type { MemeTemplate } from '../types';

export const mewTemplate: MemeTemplate = {
  id: 'mew',
  token: 'MEW',
  name: 'MEW Cat',
  baseSvg: '',
  layers: [
    {
      type: 'shape',
      id: 'bg',
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      style: { fill: '#001a15' },
    },
    {
      type: 'text',
      id: 'caption',
      x: 250,
      y: 420,
      style: {
        fill: '#1ABC9C',
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
        fill: '#1ABC9C',
        fontSize: '16px',
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: '600',
      },
    },
  ],
  styleHints: ['neoGlow', 'teal-glow', 'cat-character'],
};
