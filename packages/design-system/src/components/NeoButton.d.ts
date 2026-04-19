import React from 'react';
type NeoButtonVariant = 'cyan' | 'magenta' | 'purple' | 'lime' | 'amber';
interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: NeoButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
    children: React.ReactNode;
}
export declare function NeoButton({ variant, size, glow, children, style, disabled, ...props }: NeoButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NeoButton.d.ts.map