import { NextRequest, NextResponse } from 'next/server';
import { renderMemeSvg } from 'meme-engine';

export const runtime = 'nodejs';

const VALID_STYLES = ['neoGlow', 'flash', 'glitch'] as const;
type Style = (typeof VALID_STYLES)[number];

interface MemePayload {
  templateId?: string;
  caption?: string;
  style?: string;
  toPng?: boolean;
}

function normalizeStyle(style?: string): Style {
  return VALID_STYLES.includes((style ?? '') as Style) ? ((style ?? 'neoGlow') as Style) : 'neoGlow';
}

function parsePayloadFromSearch(req: NextRequest): MemePayload {
  const templateId = req.nextUrl.searchParams.get('templateId') ?? undefined;
  const caption = req.nextUrl.searchParams.get('caption') ?? undefined;
  const style = req.nextUrl.searchParams.get('style') ?? undefined;
  const toPngParam = req.nextUrl.searchParams.get('toPng');
  const toPng = toPngParam === '1' || toPngParam === 'true';
  return { templateId, caption, style, toPng };
}

async function buildMemeResponse(payload: MemePayload): Promise<NextResponse> {
  const templateId = payload.templateId?.toLowerCase() ?? 'bonk';
  const caption = payload.caption?.trim();
  if (!caption) {
    return NextResponse.json({ error: 'caption is required' }, { status: 400 });
  }

  const style = normalizeStyle(payload.style);
  const svg = renderMemeSvg({ templateId, caption, style });

  if (!payload.toPng) {
    return NextResponse.json({ svg });
  }

  try {
    const sharp = (await import('sharp')).default;
    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    return NextResponse.json({ svg, pngBase64: pngBuffer.toString('base64') });
  } catch (error) {
    console.error('[api/meme] PNG conversion unavailable:', error);
    return NextResponse.json({ svg, pngBase64: null });
  }
}

export async function GET(req: NextRequest) {
  try {
    return await buildMemeResponse(parsePayloadFromSearch(req));
  } catch (error) {
    console.error('[api/meme][GET]', error);
    return NextResponse.json({ error: 'Failed to render meme' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MemePayload;
    return await buildMemeResponse(body);
  } catch (error) {
    console.error('[api/meme][POST]', error);
    return NextResponse.json({ error: 'Failed to render meme' }, { status: 500 });
  }
}
