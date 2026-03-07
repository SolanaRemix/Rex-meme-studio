'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { neoColors } from '../theme';

interface NeoToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: keyof typeof neoColors;
  disabled?: boolean;
}

export function NeoToggle({
  checked,
  onChange,
  label,
  color = 'cyan',
  disabled = false,
}: NeoToggleProps) {
  const activeColor = neoColors[color];

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
      }}
    >
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '42px',
          height: '22px',
          borderRadius: '11px',
          background: checked ? `${activeColor}33` : '#1a1a2e',
          border: `1px solid ${checked ? activeColor : '#333'}`,
          position: 'relative',
          transition: 'all 0.2s',
          boxShadow: checked ? `0 0 10px ${activeColor}44` : 'none',
        }}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'absolute',
            top: '3px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: checked ? activeColor : '#555',
            boxShadow: checked ? `0 0 6px ${activeColor}` : 'none',
          }}
        />
      </div>
      {label && (
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            color: checked ? activeColor : '#888',
            transition: 'color 0.2s',
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
