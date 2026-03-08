import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${req.headers.get('host') ?? 'localhost:3000'}`;

  // URL-encode id to prevent injection when id contains special characters
  const encodedId = encodeURIComponent(id);

  const blinkAction = {
    title: `Rex Meme #${id}`,
    icon: `${baseUrl}/api/meme/render?id=${encodedId}&format=png`,
    description: 'AI-generated meme on Rex Meme Studio',
    label: 'Remix Meme',
    links: {
      actions: [
        {
          label: 'Remix',
          href: `${baseUrl}/meme/${encodedId}?remix=1`,
        },
        {
          label: 'Share on X',
          // Use raw id (not encodedId) here since encodeURIComponent will encode the whole inner URL
          href: `https://twitter.com/intent/tweet?text=Check this meme!&url=${encodeURIComponent(`${baseUrl}/meme/${id}`)}`,
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
