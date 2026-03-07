'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MemeStyle } from 'meme-engine';

interface Props {
  svg: string | null;
  token: string;
  caption: string;
  style: MemeStyle;
  memeId: string;
}

export function MemePreview({ svg, token, caption, style, memeId }: Props) {
  if (!svg) {
    return (
      <div className="aspect-square w-full bg-neoCard/50 border border-neoCyan/10 rounded-xl flex flex-col items-center justify-center gap-4">
        <div className="text-6xl opacity-20">🦖</div>
        <p className="text-neoCyan/30 font-mono text-sm text-center px-4">
          Enter a prompt and click Generate to create your meme
        </p>
      </div>
    );
  }

  const animationClass =
    style === 'flash'
      ? 'animate-flash-strobe'
      : style === 'glitch'
        ? 'animate-glitch'
        : 'animate-glow-pulse';

  return (
    <motion.div
      className="relative aspect-square w-full rounded-xl overflow-hidden border border-neoCyan/30 shadow-glow-cyan scanline"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      key={memeId}
    >
      <div
        className={`w-full h-full ${animationClass}`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-neoDark/80 rounded text-xs font-mono text-neoCyan/60">
        #{memeId}
      </div>
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-neoDark/80 rounded text-xs font-mono text-neoMagenta/80">
        {token}
      </div>
    </motion.div>
  );
}
