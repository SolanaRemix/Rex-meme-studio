import type { MemeTemplate } from '../types';
import { bonkTemplate } from './bonk';
import { wifTemplate } from './wif';
import { mewTemplate } from './mew';
import { jupTemplate } from './jup';
import { penguTemplate } from './pengu';

export const templateRegistry: Record<string, MemeTemplate> = {
  bonk: bonkTemplate,
  wif: wifTemplate,
  mew: mewTemplate,
  jup: jupTemplate,
  pengu: penguTemplate,
};

export function getTemplate(id: string): MemeTemplate {
  const template = templateRegistry[id.toLowerCase()];
  if (!template) {
    // Fall back to bonk for unknown tokens
    return bonkTemplate;
  }
  return template;
}

export { bonkTemplate, wifTemplate, mewTemplate, jupTemplate, penguTemplate };
