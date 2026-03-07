import type { RenderOptions } from './types';
import { getTemplate } from './templates';

const TOKEN_EMOJIS: Record<string, string> = {
  bonk: '🐕',
  wif: '🎩',
  mew: '🐱',
  jup: '🪐',
  pengu: '🐧',
};

const STYLE_FILTERS: Record<string, string> = {
  neoGlow: 'url(#neo-glow)',
  flash: 'url(#flash-filter)',
  glitch: 'url(#glitch-filter)',
};

/**
 * Render a meme as an SVG string.
 * Pure SVG approach — no native canvas/sharp required at render time.
 * For PNG/GIF export, pipe this SVG through sharp on the server.
 */
export function renderMemeSvg({ templateId, caption, style }: RenderOptions): string {
  const template = getTemplate(templateId);
  const token = template.token;
  const tokenKey = templateId.toLowerCase();
  const emoji = TOKEN_EMOJIS[tokenKey] ?? '🚀';

  // Get primary color from the text layer
  const textLayer = template.layers.find(
    (l) => l.id === 'caption' && l.type === 'text'
  );
  const primaryColor = textLayer?.style?.fill ?? '#00FFFF';
  const bgLayer = template.layers.find((l) => l.id === 'bg');
  const bgColor = bgLayer?.style?.fill ?? '#0A0A0F';

  // Truncate caption for display
  const maxLen = 60;
  const displayCaption =
    caption.length > maxLen ? caption.slice(0, maxLen - 3) + '...' : caption;

  // Split caption into two lines if long
  const words = displayCaption.split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const line1 = words.slice(0, midpoint).join(' ');
  const line2 = words.slice(midpoint).join(' ');
  const hasTwoLines = line2.length > 0;

  const glowFilter =
    style === 'neoGlow'
      ? `
    <filter id="neo-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`
      : style === 'flash'
        ? `
    <filter id="flash-filter">
      <feColorMatrix type="saturate" values="3"/>
    </filter>`
        : `
    <filter id="glitch-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;

  const gridOpacity = style === 'neoGlow' ? '0.08' : style === 'flash' ? '0.15' : '0.05';
  const glowFilterAttr = STYLE_FILTERS[style] ?? '';
  const scanlineOpacity = style === 'glitch' ? '0.12' : '0.05';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    ${glowFilter}
    <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="${primaryColor}" stroke-width="0.5" opacity="${gridOpacity}"/>
    </pattern>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0A0A0F;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="500" height="500" fill="url(#bg-gradient)"/>
  <rect width="500" height="500" fill="url(#grid)"/>

  <!-- Scanlines -->
  <rect width="500" height="500" fill="none"
    style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,${scanlineOpacity}) 2px, rgba(0,0,0,${scanlineOpacity}) 4px)"
    opacity="${scanlineOpacity}"/>

  <!-- Border glow -->
  <rect x="4" y="4" width="492" height="492" rx="12" ry="12"
    fill="none" stroke="${primaryColor}" stroke-width="1.5" opacity="0.4"
    filter="${glowFilterAttr}"/>
  <rect x="8" y="8" width="484" height="484" rx="10" ry="10"
    fill="none" stroke="${primaryColor}" stroke-width="0.5" opacity="0.2"/>

  <!-- Center emoji / mascot area -->
  <text x="250" y="280" text-anchor="middle" font-size="120"
    filter="${glowFilterAttr}" opacity="0.9">${emoji}</text>

  <!-- Token badge -->
  <rect x="16" y="16" width="${token.length * 11 + 20}" height="28" rx="6" ry="6"
    fill="${primaryColor}22" stroke="${primaryColor}" stroke-width="1" opacity="0.8"/>
  <text x="26" y="34" font-family="JetBrains Mono, monospace" font-size="14"
    font-weight="bold" fill="${primaryColor}" letter-spacing="2">${token}</text>

  <!-- Rex badge -->
  <rect x="${500 - 80}" y="16" width="64" height="28" rx="6" ry="6"
    fill="#00FFFF22" stroke="#00FFFF" stroke-width="1" opacity="0.6"/>
  <text x="${500 - 48}" y="34" font-family="JetBrains Mono, monospace" font-size="12"
    font-weight="600" fill="#00FFFF" text-anchor="middle" letter-spacing="1">REX</text>

  <!-- Caption text -->
  ${
    hasTwoLines
      ? `<text x="250" y="400" text-anchor="middle" font-family="JetBrains Mono, monospace"
      font-size="20" font-weight="bold" fill="${primaryColor}"
      filter="${glowFilterAttr}">${escapeXml(line1)}</text>
  <text x="250" y="428" text-anchor="middle" font-family="JetBrains Mono, monospace"
      font-size="20" font-weight="bold" fill="${primaryColor}"
      filter="${glowFilterAttr}">${escapeXml(line2)}</text>`
      : `<text x="250" y="415" text-anchor="middle" font-family="JetBrains Mono, monospace"
      font-size="22" font-weight="bold" fill="${primaryColor}"
      filter="${glowFilterAttr}">${escapeXml(displayCaption)}</text>`
  }

  <!-- Corner decorations -->
  <line x1="20" y1="50" x2="20" y2="460" stroke="${primaryColor}" stroke-width="1" opacity="0.15"/>
  <line x1="480" y1="50" x2="480" y2="460" stroke="${primaryColor}" stroke-width="1" opacity="0.15"/>
  <line x1="50" y1="490" x2="450" y2="490" stroke="${primaryColor}" stroke-width="1" opacity="0.2"/>

  <!-- Style indicator -->
  <text x="250" y="490" text-anchor="middle" font-family="JetBrains Mono, monospace"
    font-size="9" fill="${primaryColor}" opacity="0.3" letter-spacing="3">${style.toUpperCase()} · REX MEME STUDIO</text>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
