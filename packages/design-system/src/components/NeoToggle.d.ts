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
export declare function NeoToggle({ checked, onChange, label, ariaLabel, color, disabled, }: NeoToggleProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=NeoToggle.d.ts.map