'use client';

import React, { useState, useCallback } from 'react';
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
