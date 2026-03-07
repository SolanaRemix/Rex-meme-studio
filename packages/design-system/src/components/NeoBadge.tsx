'use client';

import React from 'react';
import { neoColors } from '../theme';

type NeoBadgeVariant = 'cyan' | 'magenta' | 'purple' | 'lime' | 'amber';

interface NeoBadgeProps {
  label: string;
  variant?: NeoBadgeVariant;
  icon?: string;
  size?: 'sm' | 'md';
}

const variantMap: Record<NeoBadgeVariant, string> = {
  cyan: neoColors.cyan,
  magenta: neoColors.magenta,
  purple: neoColors.purple,
  lime: neoColors.lime,
  amber: neoColors.amber,
};

export function NeoBadge({
  label,
  variant = 'cyan',
  icon,
  size = 'md',
}: NeoBadgeProps) {
  const color = variantMap[variant];
  const padding = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? '10px' : '12px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding,
        borderRadius: '20px',
        border: `1px solid ${color}44`,
        color,
        background: `${color}11`,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
