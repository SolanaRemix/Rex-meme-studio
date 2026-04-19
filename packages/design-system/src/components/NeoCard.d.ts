import React from 'react';
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
export declare function NeoCard({ children, glow, glowColor, className, style, onClick, animate, }: NeoCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NeoCard.d.ts.map