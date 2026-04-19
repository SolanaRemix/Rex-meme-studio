'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { neoColors } from '../theme';
export function NeoCard({ children, glow = false, glowColor = 'cyan', className = '', style, onClick, animate = false, }) {
    const color = neoColors[glowColor];
    const cardStyle = {
        background: neoColors.card,
        border: `1px solid ${color}33`,
        borderRadius: '12px',
        boxShadow: glow ? `0 0 20px ${color}22` : 'none',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
    };
    if (animate || onClick) {
        return (_jsx(motion.div, { className: className, style: cardStyle, whileHover: glow
                ? { boxShadow: `0 0 30px ${color}44`, borderColor: `${color}66` }
                : {}, onClick: onClick, children: children }));
    }
    return (_jsx("div", { className: className, style: cardStyle, children: children }));
}
//# sourceMappingURL=NeoCard.js.map