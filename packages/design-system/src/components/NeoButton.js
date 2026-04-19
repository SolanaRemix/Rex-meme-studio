'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { neoColors } from '../theme';
const variantStyles = {
    cyan: {
        border: `1px solid ${neoColors.cyan}88`,
        text: neoColors.cyan,
        bg: `${neoColors.cyan}10`,
        shadow: `0 0 20px ${neoColors.cyan}44`,
    },
    magenta: {
        border: `1px solid ${neoColors.magenta}88`,
        text: neoColors.magenta,
        bg: `${neoColors.magenta}10`,
        shadow: `0 0 20px ${neoColors.magenta}44`,
    },
    purple: {
        border: `1px solid ${neoColors.purple}88`,
        text: neoColors.purple,
        bg: `${neoColors.purple}10`,
        shadow: `0 0 20px ${neoColors.purple}44`,
    },
    lime: {
        border: `1px solid ${neoColors.lime}88`,
        text: neoColors.lime,
        bg: `${neoColors.lime}10`,
        shadow: `0 0 20px ${neoColors.lime}44`,
    },
    amber: {
        border: `1px solid ${neoColors.amber}88`,
        text: neoColors.amber,
        bg: `${neoColors.amber}10`,
        shadow: `0 0 20px ${neoColors.amber}44`,
    },
};
const sizeStyles = {
    sm: { padding: '6px 14px', fontSize: '11px' },
    md: { padding: '10px 20px', fontSize: '13px' },
    lg: { padding: '14px 28px', fontSize: '15px' },
};
export function NeoButton({ variant = 'cyan', size = 'md', glow = false, children, style, disabled, ...props }) {
    const v = variantStyles[variant];
    return (_jsx(motion.button, { whileTap: { scale: disabled ? 1 : 0.95 }, whileHover: { scale: disabled ? 1 : 1.03 }, disabled: disabled, style: {
            border: v.border,
            color: v.text,
            background: v.bg,
            boxShadow: glow ? v.shadow : 'none',
            borderRadius: '8px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'box-shadow 0.2s, border-color 0.2s',
            ...sizeStyles[size],
            ...style,
        }, ...props, children: children }));
}
//# sourceMappingURL=NeoButton.js.map