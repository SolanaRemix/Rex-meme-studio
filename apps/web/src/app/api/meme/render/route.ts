import { NextRequest, NextResponse } from 'next/server';
import { renderMemeSvg } from 'meme-engine';

// TODO: For PNG/GIF, integrate sharp/gifencoder on a server environment.
// Next.js Edge runtime does not support native Node modules.
// PNG export uses sharp in a Node.js runtime (set runtime = 'nodejs' below).

export const runtime = 'nodejs';

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

    const svg = renderMemeSvg({ templateId, caption, style: style as 'neoGlow' | 'flash' | 'glitch' });

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
      } catch {
        // Fallback: return SVG with PNG content type hint
        return new NextResponse(svg, {
          headers: { 'Content-Type': 'image/svg+xml' },
        });
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

// GET for direct image embedding (e.g. Open Graph)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') ?? 'demo';
  const format = (searchParams.get('format') ?? 'svg') as 'png' | 'svg' | 'gif';

  const caption = `Rex Meme #${id}`;
  const svg = renderMemeSvg({ templateId: 'bonk', caption, style: 'neoGlow' });

  if (format === 'png') {
    try {
      const sharp = (await import('sharp')).default;
      const renderedPngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
      return new NextResponse(new Uint8Array(renderedPngBuffer), {
        headers: { 'Content-Type': 'image/png' },
      });
    } catch {
      return new NextResponse(svg, {
        headers: { 'Content-Type': 'image/svg+xml' },
      });
    }
  }

  return new NextResponse(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
