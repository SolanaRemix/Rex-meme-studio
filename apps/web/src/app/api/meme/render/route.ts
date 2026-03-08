import { NextRequest, NextResponse } from 'next/server';
import { renderMemeSvg } from 'meme-engine';

// TODO: For PNG/GIF, integrate sharp/gifencoder on a server environment.
// Next.js Edge runtime does not support native Node modules.
// PNG export uses sharp in a Node.js runtime (set runtime = 'nodejs' below).

export const runtime = 'nodejs';

const VALID_STYLES = new Set(['neoGlow', 'flash', 'glitch']);
const MAX_CAPTION_LENGTH = 500;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      templateId: string;
      caption: string;
      style: string;
      format: 'png' | 'svg' | 'gif';
      id?: string;
    };

    const { templateId, caption, style, format } = body;

    if (!templateId || !caption) {
      return NextResponse.json(
        { error: 'templateId and caption are required' },
        { status: 400 }
      );
    }

    // Validate style against an explicit allowlist before passing to the SVG renderer
    if (!VALID_STYLES.has(style)) {
      return NextResponse.json(
        { error: `Invalid style. Must be one of: ${[...VALID_STYLES].join(', ')}` },
        { status: 400 }
      );
    }

    // Constrain caption length to prevent oversized SVG generation
    const safeCaption = caption.slice(0, MAX_CAPTION_LENGTH);

    const svg = renderMemeSvg({ templateId, caption: safeCaption, style: style as 'neoGlow' | 'flash' | 'glitch' });

    if (format === 'svg') {
      return NextResponse.json({ svg });
    }

    if (format === 'png') {
      try {
        // Dynamically import sharp to avoid issues in environments without it
        const sharp = (await import('sharp')).default;
        const pngBuffer = await sharp(Buffer.from(svg))
          .png()
          .toBuffer();

        return new NextResponse(new Uint8Array(pngBuffer), {
          headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `inline; filename="rex-meme.png"`,
          },
        });
      } catch (pngErr) {
        console.error('[api/meme/render] PNG conversion failed:', pngErr);
        return NextResponse.json(
          { error: 'PNG export unavailable. Try SVG format instead.' },
          { status: 503 }
        );
      }
    }

    if (format === 'gif') {
      // TODO: Implement GIF generation using gifencoder
      // For now, return a stub response
      return NextResponse.json(
        { error: 'GIF export coming soon', stub: true },
        { status: 501 }
      );
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (err) {
    console.error('[api/meme/render]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET for direct image embedding (e.g. Open Graph, Blink icons, shared meme links)
// Accepts optional templateId/caption/style params so shared URLs reproduce the correct meme.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') ?? 'demo';
  const format = (searchParams.get('format') ?? 'svg') as 'png' | 'svg' | 'gif';

  // Use caller-supplied params if present (shared link reconstruction), else fall back to defaults
  const rawStyle = searchParams.get('style') ?? 'neoGlow';
  const style: 'neoGlow' | 'flash' | 'glitch' = VALID_STYLES.has(rawStyle)
    ? (rawStyle as 'neoGlow' | 'flash' | 'glitch')
    : 'neoGlow';
  const templateId = searchParams.get('templateId') ?? 'bonk';
  const rawCaption = searchParams.get('caption') ?? `Rex Meme #${id}`;
  const caption = rawCaption.slice(0, MAX_CAPTION_LENGTH);

  const svg = renderMemeSvg({ templateId, caption, style });

  if (format === 'png') {
    try {
      const sharp = (await import('sharp')).default;
      const renderedPngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
      return new NextResponse(new Uint8Array(renderedPngBuffer), {
        headers: { 'Content-Type': 'image/png' },
      });
    } catch (pngErr) {
      console.error('[api/meme/render] GET PNG conversion failed:', pngErr);
      return NextResponse.json(
        { error: 'PNG export unavailable. Try SVG format instead.' },
        { status: 503 }
      );
    }
  }

  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
