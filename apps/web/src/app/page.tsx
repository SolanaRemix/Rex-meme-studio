'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MemePreview } from '@/components/MemePreview';
import { TokenSelector } from '@/components/TokenSelector';
import { StyleSelector } from '@/components/StyleSelector';
import { RewardsPanel } from '@/components/RewardsPanel';
import { ExportButtons } from '@/components/ExportButtons';
import type { MemeStyle } from 'meme-engine';

const SUPPORTED_TOKENS = (
  process.env.NEXT_PUBLIC_SUPPORTED_TOKENS ?? 'BONK,WIF,MEW,JUP,PENGU'
).split(',');

type DashboardTab = 'templates' | 'marketplace' | 'launchpad';

interface PremadeTemplate {
  id: string;
  name: string;
  token: string;
  prompt: string;
  style: MemeStyle;
}

const PREMADE_TEMPLATES: PremadeTemplate[] = [
  {
    id: 'bonk',
    name: 'BONK Breakout',
    token: 'BONK',
    prompt: 'BONK holders when the chart finally breaks resistance',
    style: 'flash',
  },
  {
    id: 'wif',
    name: 'WIF Weekend Pump',
    token: 'WIF',
    prompt: 'Weekend traders watching WIF make a surprise move',
    style: 'neoGlow',
  },
  {
    id: 'mew',
    name: 'MEW Laser Eyes',
    token: 'MEW',
    prompt: 'MEW community adding laser eyes before launch',
    style: 'glitch',
  },
  {
    id: 'jup',
    name: 'JUP Routing Alpha',
    token: 'JUP',
    prompt: 'JUP power users routing the cleanest trade path',
    style: 'neoGlow',
  },
  {
    id: 'pengu',
    name: 'PENGU Freeze Frame',
    token: 'PENGU',
    prompt: 'PENGU whales sliding into the timeline at max speed',
    style: 'flash',
  },
];

const MARKETPLACE_LISTINGS = Array.from({ length: 40 }, (_, index) => {
  const template = PREMADE_TEMPLATES[index % PREMADE_TEMPLATES.length];
  return {
    id: index + 1,
    title: `${template.name} #${index + 1}`,
    creator: `creator_${(index % 12) + 1}`,
    token: template.token,
    price: ((index % 9) + 1) * 0.05,
    likes: 12 + index,
    comments: 3 + (index % 7),
  };
});

const INITIAL_LISTING_STATS = Object.fromEntries(
  MARKETPLACE_LISTINGS.map((listing) => [listing.id, { likes: listing.likes, comments: listing.comments }])
) as Record<number, { likes: number; comments: number }>;

export default function HomePage() {
  const [selectedToken, setSelectedToken] = useState<string>(
    SUPPORTED_TOKENS[0]
  );
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<MemeStyle>('neoGlow');
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [memeId] = useState<string>(() =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12)
  );
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [showRewards, setShowRewards] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState<DashboardTab>('templates');
  const [likedListings, setLikedListings] = useState<Record<number, boolean>>({});
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [listingStats, setListingStats] = useState<Record<number, { likes: number; comments: number }>>(
    INITIAL_LISTING_STATS
  );

  // Apply ?token= from URL (e.g. from Solana Blink deep links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam && SUPPORTED_TOKENS.includes(tokenParam)) {
      setSelectedToken(tokenParam);
    }
  }, []);

  const handleGenerateCaption = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, token: selectedToken, style }),
      });
      const data = (await res.json()) as { caption: string };
      setCaption(data.caption);

      // Generate SVG preview
      const renderRes = await fetch('/api/meme/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedToken.toLowerCase(),
          caption: data.caption,
          style,
          format: 'svg',
        }),
      });
      const renderData = (await renderRes.json()) as { svg?: string };
      if (renderData.svg) {
        setGeneratedSvg(renderData.svg);
        setShowRewards(true);
      }
    } catch (err) {
      console.error('Caption generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedToken, style]);

  const handleApplyTemplate = useCallback((template: PremadeTemplate) => {
    setSelectedToken(template.token);
    setStyle(template.style);
    setPrompt(template.prompt);
  }, []);

  const toggleLike = useCallback((listingId: number) => {
    setLikedListings((prev) => {
      const isLiked = !!prev[listingId];
      setListingStats((current) => ({
        ...current,
        [listingId]: {
          ...current[listingId],
          likes: current[listingId].likes + (isLiked ? -1 : 1),
        },
      }));
      return { ...prev, [listingId]: !isLiked };
    });
  }, []);

  const toggleFollow = useCallback((creator: string) => {
    setFollowedCreators((prev) => ({ ...prev, [creator]: !prev[creator] }));
  }, []);

  const addComment = useCallback((listingId: number) => {
    setListingStats((current) => ({
      ...current,
      [listingId]: {
        ...current[listingId],
        comments: current[listingId].comments + 1,
      },
    }));
  }, []);

  return (
    <main className="min-h-screen bg-neoDark relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(#00FFFF 1px, transparent 1px), linear-gradient(90deg, #00FFFF 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl">🦖</span>
              <h1
                className="text-5xl md:text-7xl font-bold font-mono tracking-tight neo-glow-text text-neoCyan"
                data-text="Rex Meme Studio"
              >
                Rex Meme Studio
              </h1>
            </div>
            <p className="text-neoCyan/60 font-mono text-lg">
              AI-powered meme generator ·{' '}
              <span className="text-neoMagenta">NEO GLOW</span> edition
            </p>
          </motion.div>

          {/* Chain badges */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="px-3 py-1 rounded-full text-xs font-mono border border-neoCyan/30 text-neoCyan bg-neoCyan/5">
              ◎ Solana
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono border border-neoMagenta/30 text-neoMagenta bg-neoMagenta/5">
              🔵 Base
            </span>
          </motion.div>
        </header>

        {/* Wallet connections */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="solana-wallet-btn">
            <WalletMultiButton />
          </div>
          <ConnectButton label="Connect EVM Wallet" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Token selector */}
            <div className="neo-card p-6">
              <label className="block text-xs font-mono text-neoCyan/60 uppercase tracking-widest mb-3">
                Select Token
              </label>
              <TokenSelector
                tokens={SUPPORTED_TOKENS}
                selected={selectedToken}
                onSelect={setSelectedToken}
              />
            </div>

            {/* Prompt input */}
            <div className="neo-card p-6">
              <label className="block text-xs font-mono text-neoCyan/60 uppercase tracking-widest mb-3">
                Meme Prompt
              </label>
              <textarea
                className="neo-input resize-none h-28"
                placeholder="e.g. 'when it moons 100x' or 'buying the dip at 3am'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerateCaption();
                }}
              />
              <p className="text-neoCyan/30 text-xs mt-1 font-mono">
                ⌘/Ctrl+Enter to generate
              </p>
            </div>

            {/* Style selector */}
            <div className="neo-card p-6">
              <label className="block text-xs font-mono text-neoCyan/60 uppercase tracking-widest mb-3">
                Visual Style
              </label>
              <StyleSelector selected={style} onSelect={setStyle} />
            </div>

            {/* Generate button */}
            <motion.button
              className="w-full neo-button-primary py-4 text-base"
              onClick={handleGenerateCaption}
              disabled={isGenerating || !prompt.trim()}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> Generating...
                </span>
              ) : (
                '⚡ Generate AI Caption'
              )}
            </motion.button>

            {/* Caption display */}
            <AnimatePresence>
              {caption && (
                <motion.div
                  className="neo-card p-4 border-neoCyan/40"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-xs text-neoCyan/60 font-mono uppercase tracking-widest mb-2">
                    Generated Caption
                  </p>
                  <p className="text-white font-mono text-sm leading-relaxed">
                    &quot;{caption}&quot;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Preview + Export */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Meme preview */}
            <div className="neo-card p-6">
              <label className="block text-xs font-mono text-neoCyan/60 uppercase tracking-widest mb-3">
                Meme Preview
              </label>
              <MemePreview
                svg={generatedSvg}
                token={selectedToken}
                caption={caption}
                style={style}
                memeId={memeId}
              />
            </div>

            {/* Export buttons */}
            <AnimatePresence>
              {generatedSvg && (
                <motion.div
                  className="neo-card p-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-xs font-mono text-neoCyan/60 uppercase tracking-widest mb-3">
                    Export
                  </label>
                  <ExportButtons
                    memeId={memeId}
                    templateId={selectedToken.toLowerCase()}
                    caption={caption}
                    style={style}
                    svgContent={generatedSvg}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rewards panel */}
            <AnimatePresence>
              {showRewards && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <RewardsPanel memeId={memeId} token={selectedToken} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <section className="mt-12 neo-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-mono font-bold text-neoCyan uppercase tracking-widest">
                Studio Dashboards
              </h2>
              <p className="text-xs font-mono text-neoCyan/40 mt-1">
                Responsive Web/Mobile/Tablet views · Marketplace supports up to 40 listings
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                ['templates', 'Templates'],
                ['marketplace', 'Marketplace + Social'],
                ['launchpad', 'Launchpad'],
              ] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveDashboard(tab)}
                  className={`px-3 py-2 text-xs rounded-lg font-mono border transition-all ${
                    activeDashboard === tab
                      ? 'border-neoCyan/60 text-neoCyan bg-neoCyan/10'
                      : 'border-neoCyan/20 text-neoCyan/60 hover:border-neoCyan/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeDashboard === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="templates-dashboard">
              {PREMADE_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl border border-neoCyan/20 bg-neoCyan/5 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono text-neoCyan font-bold">{template.name}</p>
                    <span className="text-[10px] px-2 py-1 rounded bg-neoDark/60 text-neoMagenta font-mono uppercase">
                      {template.style}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neoCyan/50">{template.prompt}</p>
                  <button
                    className="neo-button text-xs px-3 py-2"
                    onClick={() => handleApplyTemplate(template)}
                  >
                    Use Template ({template.token})
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeDashboard === 'marketplace' && (
            <div className="space-y-4" id="marketplace-dashboard">
              <p className="text-xs font-mono text-neoCyan/40">
                Permissionless listing board · {MARKETPLACE_LISTINGS.length} active slots
              </p>
              <div className="max-h-[32rem] overflow-y-auto pr-1 grid grid-cols-1 lg:grid-cols-2 gap-3">
                {MARKETPLACE_LISTINGS.map((listing) => {
                  const stats = listingStats[listing.id] ?? {
                    likes: listing.likes,
                    comments: listing.comments,
                  };
                  const isLiked = Boolean(likedListings[listing.id]);
                  const isFollowing = Boolean(followedCreators[listing.creator]);

                  return (
                    <div
                      key={listing.id}
                      className="rounded-xl border border-neoMagenta/20 bg-neoMagenta/5 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-mono text-neoMagenta font-semibold">
                            {listing.title}
                          </p>
                          <p className="text-xs font-mono text-neoCyan/40 mt-1">
                            {listing.token} · by @{listing.creator}
                          </p>
                        </div>
                        <p className="text-xs font-mono text-neoCyan/70">
                          {listing.price.toFixed(2)} ◎
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-mono">
                        <button
                          onClick={() => toggleLike(listing.id)}
                          className={`px-2.5 py-1 rounded border ${
                            isLiked
                              ? 'border-neoLime/40 text-neoLime'
                              : 'border-neoCyan/20 text-neoCyan/70'
                          }`}
                        >
                          ❤️ {stats.likes}
                        </button>
                        <button
                          onClick={() => toggleFollow(listing.creator)}
                          className={`px-2.5 py-1 rounded border ${
                            isFollowing
                              ? 'border-neoLime/40 text-neoLime'
                              : 'border-neoMagenta/30 text-neoMagenta'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button
                          onClick={() => addComment(listing.id)}
                          className="px-2.5 py-1 rounded border border-neoCyan/20 text-neoCyan/70"
                        >
                          💬 {stats.comments}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeDashboard === 'launchpad' && (
            <div className="space-y-5" id="launchpad-dashboard">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    role: 'Users',
                    features: 'Create memes, list NFTs, and earn rewards',
                  },
                  {
                    role: 'Developers',
                    features: 'Use frame/blink APIs and permissionless import endpoints',
                  },
                  {
                    role: 'Admins',
                    features: 'Track launch campaigns and platform pings on a single node',
                  },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="rounded-xl border border-neoCyan/20 bg-neoDark/60 p-4"
                  >
                    <p className="text-xs font-mono uppercase tracking-widest text-neoCyan/60">
                      {item.role}
                    </p>
                    <p className="text-sm font-mono text-white mt-2">{item.features}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-neoMagenta/20 bg-neoMagenta/5 p-4 space-y-2">
                <p className="text-xs font-mono uppercase tracking-widest text-neoMagenta/70">
                  Farcaster + Blink Import
                </p>
                <p className="text-xs font-mono text-neoCyan/50 break-all">
                  Frame Poster: /api/frame/meme/{memeId}
                </p>
                <p className="text-xs font-mono text-neoCyan/50 break-all">
                  Blinks Import: /api/blink/create
                </p>
                <p className="text-xs font-mono text-neoCyan/30">
                  Use export actions to ping platform feeds right after meme generation.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-neoCyan/20 font-mono text-xs">
            Rex Meme Studio · Built on Solana & Base ·{' '}
            <span className="text-neoMagenta/40">NEO GLOW</span> Edition
          </p>
        </footer>
      </div>
    </main>
  );
}
