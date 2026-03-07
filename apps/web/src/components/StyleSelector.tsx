'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MemeStyle } from 'meme-engine';

const STYLES: Array<{
  id: MemeStyle;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: 'neoGlow',
    label: 'Neo Glow',
    icon: '✨',
    description: 'Cyberpunk cyan glow',
  },
  {
    id: 'flash',
    label: 'Flash',
    icon: '⚡',
    description: 'High-energy strobe',
  },
  {
    id: 'glitch',
    label: 'Glitch',
    icon: '📡',
    description: 'Corrupted signal',
  },
];

interface Props {
  selected: MemeStyle;
  onSelect: (style: MemeStyle) => void;
}

export function StyleSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {STYLES.map((s) => (
        <motion.button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border font-mono text-xs transition-all duration-200 ${
            selected === s.id
              ? 'border-neoCyan text-neoCyan bg-neoCyan/10 shadow-glow-cyan'
              : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">{s.icon}</span>
          <span className="font-semibold uppercase tracking-wider">
            {s.label}
          </span>
          <span className="text-[10px] opacity-70 text-center leading-tight">
            {s.description}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
