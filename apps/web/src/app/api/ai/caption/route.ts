import { NextRequest, NextResponse } from 'next/server';
import { generateCaption } from 'meme-engine';

// TODO: Replace generateCaption in meme-engine with real AI provider (OpenAI, Anthropic, etc.)
// using process.env.AI_PROVIDER_KEY
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      prompt: string;
      token: string;
      style: string;
    };

    const { prompt, token, style } = body;

    if (!prompt || !token) {
      return NextResponse.json(
        { error: 'prompt and token are required' },
        { status: 400 }
      );
    }

    const validStyles = ['neoGlow', 'flash', 'glitch'] as const;
    type StyleKey = typeof validStyles[number];
    const isValidStyle = (validStyles as readonly string[]).includes(style);
    const styleKey: StyleKey = isValidStyle ? (style as StyleKey) : 'neoGlow';

    const caption = generateCaption({ prompt, token, style: styleKey });

    // Return the normalized styleKey so clients can trust the response (style may have been
    // silently fallen back to 'neoGlow' if the requested style was invalid).
    return NextResponse.json({ caption, token, style: styleKey });
  } catch (err) {
    console.error('[api/ai/caption]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
