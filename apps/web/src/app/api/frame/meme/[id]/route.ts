import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${req.headers.get('host') ?? 'localhost:3000'}`;

  const imageUrl = `${baseUrl}/api/meme/render?id=${id}&format=png`;
  const postUrl = `${baseUrl}/api/frame/meme/${id}`;
  const memeUrl = `${baseUrl}/meme/${id}`;

  // Farcaster Frame v2 HTML
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:title" content="Rex Meme #${id}" />
    <meta property="og:description" content="AI-generated meme on Rex Meme Studio" />
    <meta property="og:image" content="${imageUrl}" />

    <!-- Farcaster Frame v2 -->
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${imageUrl}" />
    <meta name="fc:frame:image:aspect_ratio" content="1:1" />
    <meta name="fc:frame:post_url" content="${postUrl}" />
    <meta name="fc:frame:button:1" content="Remix This Meme" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="${memeUrl}" />
    <meta name="fc:frame:button:2" content="Create Your Own" />
    <meta name="fc:frame:button:2:action" content="link" />
    <meta name="fc:frame:button:2:target" content="${baseUrl}" />
  </head>
  <body>
    <p>Rex Meme #${id}</p>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
