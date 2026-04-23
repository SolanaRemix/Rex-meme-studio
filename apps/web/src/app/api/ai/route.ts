import { NextRequest, NextResponse } from 'next/server';
import { generateCaption } from 'meme-engine';

const VALID_STYLES = ['neoGlow', 'flash', 'glitch'] as const;
type Style = (typeof VALID_STYLES)[number];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      prompt?: string;
      token?: string;
      style?: string;
    };

    if (!body.prompt?.trim() || !body.token?.trim()) {
      return NextResponse.json({ error: 'prompt and token are required' }, { status: 400 });
    }

    const style: Style = VALID_STYLES.includes((body.style ?? '') as Style)
      ? ((body.style ?? 'neoGlow') as Style)
      : 'neoGlow';

    const caption = generateCaption({
      prompt: body.prompt.trim(),
      token: body.token.trim().toUpperCase(),
      style,
    });

    return NextResponse.json({ caption });
  } catch (error) {
    console.error('[api/ai]', error);
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 });
  }
}
