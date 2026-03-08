# Meme Engine

Core meme generation logic for Rex Meme Studio. Pure TypeScript, no native dependencies required for SVG rendering.

## Features

- 5 token templates: BONK, WIF, MEW, JUP, PENGU
- 3 visual styles: `neoGlow`, `flash`, `glitch`
- Pure SVG rendering (no canvas required)
- PNG export via `sharp` on server
- AI caption generation (mock + real AI integration stub)

## Usage

```typescript
import { renderMemeSvg, generateCaption } from 'meme-engine';

const caption = generateCaption({ prompt: 'when it moons', token: 'BONK', style: 'neoGlow' });
const svg = renderMemeSvg({ templateId: 'bonk', caption, style: 'neoGlow' });
```

## Templates

| Token  | Color     | Style Hints          |
|--------|-----------|----------------------|
| BONK   | `#FF6B00` | orange-glow, doge    |
| WIF    | `#9B59B6` | purple-glow, hat     |
| MEW    | `#1ABC9C` | teal-glow, cat       |
| JUP    | `#3498DB` | blue-glow, defi      |
| PENGU  | `#E74C3C` | red-glow, pudgy      |
