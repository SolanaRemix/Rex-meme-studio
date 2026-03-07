import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${req.headers.get('host') ?? 'localhost:3000'}`;

  const blinkAction = {
    title: 'Create a Rex Meme',
    icon: `${baseUrl}/icon.png`,
    description:
      'Generate an AI-powered meme with NEO GLOW aesthetics. Earn rewards on Solana & Base.',
    label: 'Generate Meme',
    links: {
      actions: [
        {
          label: 'Generate with BONK',
          href: `${baseUrl}/?token=BONK`,
        },
        {
          label: 'Generate with WIF',
          href: `${baseUrl}/?token=WIF`,
        },
        {
          label: 'Generate with MEW',
          href: `${baseUrl}/?token=MEW`,
        },
      ],
    },
  };

  return NextResponse.json(blinkAction, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
