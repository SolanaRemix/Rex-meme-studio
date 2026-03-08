import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    templateId?: string;
    caption?: string;
    style?: string;
  }>;
}

/** Build the render URL, forwarding meme params from searchParams if present. */
function buildRenderUrl(
  baseUrl: string,
  id: string,
  templateId?: string,
  caption?: string,
  style?: string,
  format = 'png'
): string {
  const url = new URL(`${baseUrl}/api/meme/render`);
  url.searchParams.set('id', id);
  url.searchParams.set('format', format);
  if (templateId) url.searchParams.set('templateId', templateId);
  if (caption) url.searchParams.set('caption', caption);
  if (style) url.searchParams.set('style', style);
  return url.toString();
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { templateId, caption, style } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const imageUrl = buildRenderUrl(baseUrl, id, templateId, caption, style);

  return {
    title: `Rex Meme #${id} | Rex Meme Studio`,
    description: 'AI-generated meme on Rex Meme Studio',
    openGraph: {
      title: `Rex Meme #${id}`,
      description: 'AI-generated meme on Rex Meme Studio',
      images: [imageUrl],
    },
    other: {
      // Farcaster Frame meta tags
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:button:1': 'Remix',
      'fc:frame:post_url': `${baseUrl}/api/frame/meme/${id}`,
    },
  };
}

export default async function MemePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { templateId, caption, style } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const imageUrl = buildRenderUrl(baseUrl, id, templateId, caption, style);

  // Reconstruct the clean share URL (with meme params so the link reproduces the meme)
  const memeShareUrl = (() => {
    const u = new URL(`${baseUrl}/meme/${id}`);
    if (templateId) u.searchParams.set('templateId', templateId);
    if (caption) u.searchParams.set('caption', caption);
    if (style) u.searchParams.set('style', style);
    return u.toString();
  })();

  return (
    <main className="min-h-screen bg-neoDark flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="text-neoCyan/60 font-mono text-sm hover:text-neoCyan transition-colors"
          >
            ← Back to Studio
          </Link>
          <h1 className="text-3xl font-bold font-mono text-neoCyan mt-4 neo-glow-text">
            Rex Meme #{id}
          </h1>
        </div>

        <div className="neo-card p-6">
          {/* Meme image — rendered using the params from the share URL */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`Rex Meme #${id}`}
            className="w-full rounded-lg border border-neoCyan/20"
          />
        </div>

        <div className="neo-card p-6 space-y-4">
          <h2 className="text-sm font-mono text-neoCyan/60 uppercase tracking-widest">
            Share
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=Check out this meme on Rex Meme Studio!&url=${encodeURIComponent(memeShareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button text-sm"
            >
              𝕏 Twitter
            </a>
            <a
              href={`https://warpcast.com/~/compose?text=Check this meme!&embeds[]=${encodeURIComponent(memeShareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-button-magenta text-sm"
            >
              🟣 Warpcast
            </a>
          </div>
        </div>

        <div className="neo-card p-6 space-y-2">
          <h2 className="text-sm font-mono text-neoCyan/60 uppercase tracking-widest mb-3">
            Blink Actions
          </h2>
          <p className="text-xs text-neoCyan/40 font-mono">
            Solana Blink:{' '}
            <code className="text-neoCyan/60">
              {baseUrl}/api/blink/meme/{id}
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}

