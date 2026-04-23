import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const VALID_STYLES = ['neoGlow', 'flash', 'glitch'] as const;
type Style = (typeof VALID_STYLES)[number];

function normalizeStyle(style?: string): Style {
  return VALID_STYLES.includes((style ?? '') as Style) ? ((style ?? 'neoGlow') as Style) : 'neoGlow';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      templateId?: string;
      caption?: string;
      style?: string;
      creator?: string;
    };

    const templateId = body.templateId?.trim().toLowerCase() ?? 'bonk';
    const caption = body.caption?.trim();
    if (!caption) {
      return NextResponse.json({ error: 'caption is required' }, { status: 400 });
    }

    const style = normalizeStyle(body.style);
    const creator = body.creator?.trim() || 'unknown';
    const memeId = randomUUID().replace(/-/g, '').slice(0, 12);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

    return NextResponse.json({
      name: `Rex Meme #${memeId}`,
      description: caption,
      image: `${baseUrl}/api/meme?templateId=${encodeURIComponent(templateId)}&caption=${encodeURIComponent(caption)}&style=${encodeURIComponent(style)}&toPng=1`,
      attributes: [
        { trait_type: 'Template', value: templateId.toUpperCase() },
        { trait_type: 'Style', value: style },
        { trait_type: 'Creator', value: creator },
      ],
    });
  } catch (error) {
    console.error('[api/nft]', error);
    return NextResponse.json({ error: 'Failed to generate metadata' }, { status: 500 });
  }
}
