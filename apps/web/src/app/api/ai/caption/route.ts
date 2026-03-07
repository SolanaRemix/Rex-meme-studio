import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with real AI provider (OpenAI, Anthropic, etc.) using AI_PROVIDER_KEY
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

    // Mock AI caption generation
    // TODO: Integrate real AI provider:
    // const response = await openai.chat.completions.create({ ... })
    const captions: Record<string, string[]> = {
      neoGlow: [
        `When ${token} hits ${prompt} — TO THE MOON 🚀`,
        `${token} holders watching ${prompt} 👀✨`,
        `Me after ${prompt} with ${token} in my wallet 💎`,
      ],
      flash: [
        `⚡ ${token} FLASH ALERT: ${prompt} ⚡`,
        `🔥 ${token} IS ON FIRE: ${prompt} 🔥`,
        `💥 BREAKING: ${token} just ${prompt} 💥`,
      ],
      glitch: [
        `${token} g̷l̷i̷t̷c̷h̷e̷d̷ when ${prompt}`,
        `[SYSTEM ERROR] ${token} ${prompt} [/SYSTEM ERROR]`,
        `<̷̡̛g̶̨̛l̵̛i̷t̵c̸h̴> ${token}: ${prompt} <̷/̶g̶l̶i̶t̶c̶h̶>`,
      ],
    };

    const styleKey = (style as keyof typeof captions) in captions ? (style as keyof typeof captions) : 'neoGlow';
    const options = captions[styleKey];
    const caption = options[Math.floor(Math.random() * options.length)];

    return NextResponse.json({ caption, token, style });
  } catch (err) {
    console.error('[api/ai/caption]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
