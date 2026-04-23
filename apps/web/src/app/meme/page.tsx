'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { NeoButton } from '@design-system/components/NeoButton';
import { renderMemeSvg, type MemeStyle } from 'meme-engine';
import { MemePreview } from '@/components/MemePreview';

const VALID_STYLES: MemeStyle[] = ['neoGlow', 'flash', 'glitch'];
const MAX_TEMPLATE_LENGTH = 32;

function getStyle(style: string | null): MemeStyle {
  return VALID_STYLES.includes((style ?? '') as MemeStyle) ? (style as MemeStyle) : 'neoGlow';
}

export default function MemeGalleryPage() {
  const [params, setParams] = useState({
    memeId: 'demo',
    template: 'bonk',
    caption: 'Rex Meme #demo',
    style: 'neoGlow' as MemeStyle,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const memeId = searchParams.get('id')?.trim() || 'demo';
    const template = (searchParams.get('template')?.trim().toLowerCase() || 'bonk').slice(
      0,
      MAX_TEMPLATE_LENGTH
    );
    const caption = searchParams.get('caption')?.trim() || `Rex Meme #${memeId}`;
    const style = getStyle(searchParams.get('style'));
    setParams({ memeId, template, caption, style });
  }, []);

  const { memeId, template, caption, style } = params;
  const token = template.toUpperCase();

  const svg = useMemo(
    () =>
      renderMemeSvg({
        templateId: template,
        caption,
        style,
      }),
    [template, caption, style]
  );

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTargets: Array<{ label: string; variant: 'cyan' | 'magenta' | 'purple' | 'lime' | 'amber'; href: string }> = [
    {
      label: 'Farcaster',
      variant: 'purple',
      href: `https://warpcast.com/~/compose?text=${encodeURIComponent(caption)}&embeds[]=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: 'ZORA',
      variant: 'amber',
      href: 'https://zora.co/create',
    },
    {
      label: 'Lens',
      variant: 'magenta',
      href: 'https://lens.xyz',
    },
    {
      label: 'Blinks',
      variant: 'lime',
      href: `/api/blink/meme/${encodeURIComponent(memeId)}`,
    },
    {
      label: 'X',
      variant: 'cyan',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <main className="min-h-screen bg-neoDark text-white p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-mono text-neoCyan">Meme Gallery</h1>
          <Link href="/" className="text-sm text-neoCyan/70 hover:text-neoCyan">
            ← Back to Studio
          </Link>
        </div>

        <MemePreview svg={svg} token={token} caption={caption} style={style} memeId={memeId} />

        <div className="neo-card p-4 md:p-6 space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-neoCyan/80">Share</h2>
          <div className="flex flex-wrap gap-2">
            {shareTargets.map((target) => (
              <NeoButton
                key={target.label}
                variant={target.variant}
                size="sm"
                glow
                onClick={() => {
                  window.open(target.href, '_blank', 'noopener,noreferrer');
                }}
              >
                {target.label}
              </NeoButton>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
