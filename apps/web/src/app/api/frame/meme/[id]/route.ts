import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

/** Escape characters that are unsafe inside HTML attribute values and text nodes. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${req.headers.get('host') ?? 'localhost:3000'}`;

  // Escape id before interpolating into HTML to prevent injection
  const safeId = escapeHtml(id);
  const imageUrl = `${baseUrl}/api/meme/render?id=${encodeURIComponent(id)}&format=png`;
  // post_url now points to the same route which handles both GET (initial frame)
  // and POST (button interactions returning the next frame)
  const postUrl = `${baseUrl}/api/frame/meme/${encodeURIComponent(id)}`;
  const memeUrl = `${baseUrl}/meme/${encodeURIComponent(id)}`;

  // Farcaster Frame v2 HTML
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:title" content="Rex Meme #${safeId}" />
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
    <p>Rex Meme #${safeId}</p>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

/**
 * POST handler for Farcaster Frame button interactions.
 * Farcaster sends a POST to post_url when a user clicks a frame button.
 * This returns the next frame (or the same frame as a fallback).
 */
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${req.headers.get('host') ?? 'localhost:3000'}`;

  // Parse the frame action payload (button index, etc.)
  let buttonIndex = 1;
  try {
    const body = (await req.json()) as { untrustedData?: { buttonIndex?: number } };
    buttonIndex = body.untrustedData?.buttonIndex ?? 1;
  } catch {
    // Proceed with default
  }

  const safeId = escapeHtml(id);
  const imageUrl = `${baseUrl}/api/meme/render?id=${encodeURIComponent(id)}&format=png`;
  const postUrl = `${baseUrl}/api/frame/meme/${encodeURIComponent(id)}`;
  // Button 1 → "Remix This Meme" → link to /meme/[id]?remix=1
  // Button 2 → "Create Your Own" → link to home
  // Any other or unknown button index → fall back to home
  const targetUrl =
    buttonIndex === 1 ? `${baseUrl}/meme/${encodeURIComponent(id)}?remix=1` : baseUrl;

  // Return the next frame response. Since both buttons use action="link",
  // Farcaster navigates the user directly to `target` and does not POST again.
  // This response is returned as a fallback for any future non-link button types.
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta property="og:title" content="Rex Meme #${safeId}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="fc:frame" content="vNext" />
    <meta name="fc:frame:image" content="${imageUrl}" />
    <meta name="fc:frame:post_url" content="${postUrl}" />
    <meta name="fc:frame:button:1" content="Open Studio" />
    <meta name="fc:frame:button:1:action" content="link" />
    <meta name="fc:frame:button:1:target" content="${targetUrl}" />
  </head>
  <body><p>Rex Meme #${safeId}</p></body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
