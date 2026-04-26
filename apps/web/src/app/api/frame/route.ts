import { NextRequest, NextResponse } from 'next/server';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const imageUrl = `${baseUrl}/api/meme?templateId=bonk&caption=${encodeURIComponent('Build memes with Rex Meme Studio')}&style=neoGlow&toPng=1`;
  const postUrl = `${baseUrl}/api/frame`;
  const safeBaseUrl = escapeHtml(baseUrl);
  const safeImageUrl = escapeHtml(imageUrl);
  const safePostUrl = escapeHtml(postUrl);
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:title" content="Rex Meme Studio" />
    <meta property="og:description" content="Create and share token memes in seconds." />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${safeImageUrl}" />
    <meta name="fc:frame:post_url" content="${safePostUrl}" />
    <meta name="fc:frame:button:1" content="Open Studio" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="${safeBaseUrl}" />
  </head>
  <body><p>Rex Meme Studio</p></body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
