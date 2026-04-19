import { NextRequest, NextResponse } from 'next/server';

const PLATFORM_TARGETS = [
  'OpenSea',
  'Magic Eden',
  'Tensor',
  'Rarible',
  'Farcaster',
  'X Feed',
  'Discord Webhook',
  'Telegram Channel',
];

function isValidId(input: string): boolean {
  return /^[a-zA-Z0-9_]{3,64}$/.test(input);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      memeId?: string;
      templateId?: string;
      style?: string;
    };

    const memeId = body.memeId?.trim() ?? '';
    if (!isValidId(memeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid memeId. Use 3-64 alphanumeric/underscore characters.' },
        { status: 400 }
      );
    }

    const templateId = (body.templateId ?? 'unknown').slice(0, 50);
    const style = (body.style ?? 'neoGlow').slice(0, 20);

    // Simulated marketing fan-out. Replace this with real webhooks/queue workers in production.
    const results = PLATFORM_TARGETS.map((platform) => ({
      platform,
      delivered: true,
      ref: `${platform.toLowerCase().replace(/\s+/g, '-')}:${memeId}`,
    }));

    return NextResponse.json({
      success: true,
      memeId,
      templateId,
      style,
      delivered: results.length,
      total: PLATFORM_TARGETS.length,
      results,
      mode: 'simulated',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[api/marketing/ping]', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process marketing ping' },
      { status: 500 }
    );
  }
}
