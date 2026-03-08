'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { neoColors } from '../theme';

interface NeoToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  /** Accessible label for screen readers when `label` is not provided */
  ariaLabel?: string;
  color?: keyof typeof neoColors;
  disabled?: boolean;
}

export function NeoToggle({
  checked,
  onChange,
  label,
  ariaLabel,
  color = 'cyan',
  disabled = false,
}: NeoToggleProps) {
  const activeColor = neoColors[color];
  const id = useId();

  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
      }}
    >
      {/* Visually hidden native checkbox for accessibility */}
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        aria-label={!label ? ariaLabel : undefined}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      />
      {/* Custom visual toggle track — pointer-events:none so clicks flow through to the checkbox */}
      <div
        aria-hidden="true"
        style={{
          width: '42px',
          height: '22px',
          borderRadius: '11px',
          background: checked ? `${activeColor}33` : '#1a1a2e',
          border: `1px solid ${checked ? activeColor : '#333'}`,
          position: 'relative',
          transition: 'all 0.2s',
          boxShadow: checked ? `0 0 10px ${activeColor}44` : 'none',
          pointerEvents: 'none',
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
