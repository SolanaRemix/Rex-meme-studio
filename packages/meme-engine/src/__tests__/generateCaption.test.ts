import { describe, expect, it } from 'vitest';
import { generateCaption } from '../generateCaption';
import type { MemeStyle } from '../types';

describe('generateCaption', () => {
  const cases: Array<{ prompt: string; token: string; style: MemeStyle }> = [
    { prompt: 'price breaks resistance', token: 'BONK', style: 'neoGlow' },
    { prompt: 'volume spikes overnight', token: 'WIF', style: 'flash' },
    { prompt: 'chart glitches after launch', token: 'MEW', style: 'glitch' },
  ];

  it.each(cases)('returns non-empty caption for $token $style', ({ prompt, token, style }) => {
    const caption = generateCaption({ prompt, token, style });
    expect(caption.trim().length).toBeGreaterThan(0);
    expect(caption).toContain(token);
  });
});
