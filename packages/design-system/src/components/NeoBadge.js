'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { neoColors } from '../theme';
const variantMap = {
    cyan: neoColors.cyan,
    magenta: neoColors.magenta,
    purple: neoColors.purple,
    lime: neoColors.lime,
    amber: neoColors.amber,
};
export function NeoBadge({ label, variant = 'cyan', icon, size = 'md', }) {
    const color = variantMap[variant];
    const padding = size === 'sm' ? '3px 8px' : '5px 12px';
    const fontSize = size === 'sm' ? '10px' : '12px';
    return (_jsxs("span", { style: {
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
        }, children: [icon && _jsx("span", { children: icon }), label] }));
}
//# sourceMappingURL=NeoBadge.js.map