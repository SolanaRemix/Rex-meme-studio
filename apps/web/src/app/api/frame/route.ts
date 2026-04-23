import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const imageUrl = `${baseUrl}/api/meme?templateId=bonk&caption=${encodeURIComponent('Build memes with Rex Meme Studio')}&style=neoGlow&toPng=1`;
  const postUrl = `${baseUrl}/api/frame`;
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:title" content="Rex Meme Studio" />
    <meta property="og:description" content="Create and share token memes in seconds." />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${imageUrl}" />
    <meta name="fc:frame:post_url" content="${postUrl}" />
    <meta name="fc:frame:button:1" content="Open Studio" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="${baseUrl}" />
  </head>
  <body><p>Rex Meme Studio</p></body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
