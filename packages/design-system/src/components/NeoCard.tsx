'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { neoColors } from '../theme';

interface NeoCardProps {
  children: React.ReactNode;
  glow?: boolean;
  glowColor?: keyof typeof neoColors;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  animate?: boolean;
}

export function NeoCard({
  children,
  glow = false,
  glowColor = 'cyan',
  className = '',
  style,
  onClick,
  animate = false,
}: NeoCardProps) {
  const color = neoColors[glowColor];

  const cardStyle: React.CSSProperties = {
    background: neoColors.card,
    border: `1px solid ${color}33`,
    borderRadius: '12px',
    boxShadow: glow ? `0 0 20px ${color}22` : 'none',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  if (animate || onClick) {
    return (
      <motion.div
        className={className}
        style={cardStyle}
        whileHover={
          glow
            ? { boxShadow: `0 0 30px ${color}44`, borderColor: `${color}66` }
            : {}
        }
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={className} style={cardStyle}>
      {children}
    </div>
  );
}
