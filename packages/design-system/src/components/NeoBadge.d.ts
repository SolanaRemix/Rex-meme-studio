type NeoBadgeVariant = 'cyan' | 'magenta' | 'purple' | 'lime' | 'amber';
interface NeoBadgeProps {
    label: string;
    variant?: NeoBadgeVariant;
    icon?: string;
    size?: 'sm' | 'md';
}
export declare function NeoBadge({ label, variant, icon, size, }: NeoBadgeProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NeoBadge.d.ts.map