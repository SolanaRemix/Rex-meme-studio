import { NextRequest, NextResponse } from 'next/server';

const PLATFORM_TARGETS = ['farcaster', 'zora', 'lens', 'blinks', 'x'] as const;
type PlatformTarget = (typeof PLATFORM_TARGETS)[number];

function isValidId(input: string): boolean {
  return /^[a-zA-Z0-9_]{3,64}$/.test(input);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      memeId?: string;
      templateId?: string;
      style?: string;
      platforms?: string[];
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

    const queuedPlatforms: PlatformTarget[] = body.platforms?.length
      ? body.platforms
          .map((platform) => platform.toLowerCase())
          .filter((platform): platform is PlatformTarget =>
            PLATFORM_TARGETS.includes(platform as PlatformTarget)
          )
      : [...PLATFORM_TARGETS];

    // Simulated marketing fan-out. Replace this with real webhooks/queue workers in production.
    const results = queuedPlatforms.map((platform) => ({
      platform,
      delivered: true,
      ref: `${platform.toLowerCase().replace(/\s+/g, '-')}:${memeId}`,
    }));

    return NextResponse.json({
      success: true,
      queued: queuedPlatforms,
      memeId,
      templateId,
      style,
      delivered: results.length,
      total: queuedPlatforms.length,
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
