import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_PLATFORMS = ['farcaster', 'zora', 'lens', 'blinks', 'x'] as const;
type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number];

function normalizePlatforms(platforms: string[] | undefined): SupportedPlatform[] {
  if (!platforms || platforms.length === 0) return [...SUPPORTED_PLATFORMS];
  return platforms
    .map((platform) => platform.toLowerCase())
    .filter((platform): platform is SupportedPlatform =>
      SUPPORTED_PLATFORMS.includes(platform as SupportedPlatform)
    );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      memeId?: string;
      platforms?: string[];
    };

    const memeId = body.memeId?.trim();
    if (!memeId) {
      return NextResponse.json({ error: 'memeId is required' }, { status: 400 });
    }

    const queued = normalizePlatforms(body.platforms);
    queued.forEach((platform) => {
      console.log(`[api/marketing] queued ${platform} fan-out for meme ${memeId}`);
    });

    return NextResponse.json({ queued });
  } catch (error) {
    console.error('[api/marketing]', error);
    return NextResponse.json({ error: 'Failed to queue marketing ping' }, { status: 500 });
  }
}
