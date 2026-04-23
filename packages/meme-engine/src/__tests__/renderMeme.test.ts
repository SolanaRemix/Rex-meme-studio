import { describe, expect, it } from 'vitest';
import { renderMemeSvg, type MemeStyle } from '../index';

const templates = ['bonk', 'wif', 'mew', 'jup', 'pengu'] as const;
const styles: MemeStyle[] = ['neoGlow', 'flash', 'glitch'];

describe('renderMemeSvg', () => {
  it.each(templates.flatMap((templateId) => styles.map((style) => [templateId, style] as const)))(
    'renders valid SVG for template %s with style %s',
    (templateId, style) => {
      const svg = renderMemeSvg({
        templateId,
        caption: `${templateId.toUpperCase()} ${style} test`,
        style,
      });

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain(templateId.toUpperCase());
    }
  );
});
