'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TOKEN_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  BONK: { border: 'border-bonk/50', text: 'text-bonk', bg: 'bg-bonk/10' },
  WIF: { border: 'border-wif/50', text: 'text-wif', bg: 'bg-wif/10' },
  MEW: { border: 'border-mew/50', text: 'text-mew', bg: 'bg-mew/10' },
  JUP: { border: 'border-jup/50', text: 'text-jup', bg: 'bg-jup/10' },
  PENGU: { border: 'border-pengu/50', text: 'text-pengu', bg: 'bg-pengu/10' },
};

const DEFAULT_COLORS = {
  border: 'border-neoCyan/50',
  text: 'text-neoCyan',
  bg: 'bg-neoCyan/10',
};

interface Props {
  tokens: string[];
  selected: string;
  onSelect: (token: string) => void;
}

export function TokenSelector({ tokens, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => {
        const colors = TOKEN_COLORS[token] ?? DEFAULT_COLORS;
        const isSelected = token === selected;
        return (
          <motion.button
            key={token}
            onClick={() => onSelect(token)}
            className={`px-4 py-2 rounded-lg font-mono text-sm font-semibold uppercase tracking-wider border transition-all duration-200 ${
              isSelected
                ? `${colors.border} ${colors.text} ${colors.bg}`
                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            {token}
          </motion.button>
        );
      })}
    </div>
  );
}
