import type { MemeTemplate } from '../types';

export const penguTemplate: MemeTemplate = {
  id: 'pengu',
  token: 'PENGU',
  name: 'Pudgy Penguin',
  baseSvg: '',
  layers: [
    {
      type: 'shape',
      id: 'bg',
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      style: { fill: '#1a0000' },
    },
    {
      type: 'text',
      id: 'caption',
      x: 250,
      y: 420,
      style: {
        fill: '#E74C3C',
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
        fill: '#E74C3C',
        fontSize: '16px',
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: '600',
      },
    },
  ],
  styleHints: ['red-glow', 'pudgy-energy'],
};
