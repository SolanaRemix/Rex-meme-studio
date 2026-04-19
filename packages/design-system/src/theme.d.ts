export declare const neoColors: {
    readonly cyan: "#00FFFF";
    readonly magenta: "#FF00FF";
    readonly purple: "#8B00FF";
    readonly lime: "#ADFF2F";
    readonly amber: "#FFB300";
    readonly dark: "#0A0A0F";
    readonly card: "#12121A";
};
export type NeoColor = keyof typeof neoColors;
export declare const tokenColors: Record<string, string>;
export declare const neoShadows: {
    readonly cyan: "0 0 20px #00FFFF, 0 0 40px #00FFFF44";
    readonly magenta: "0 0 20px #FF00FF, 0 0 40px #FF00FF44";
    readonly purple: "0 0 20px #8B00FF, 0 0 40px #8B00FF44";
    readonly lime: "0 0 20px #ADFF2F, 0 0 40px #ADFF2F44";
    readonly amber: "0 0 20px #FFB300, 0 0 40px #FFB30044";
};
export declare const neoAnimations: {
    readonly glowPulse: {
        readonly initial: {
            readonly opacity: 1;
            readonly filter: "brightness(1)";
        };
        readonly animate: {
            readonly opacity: readonly [1, 0.7, 1];
            readonly filter: readonly ["brightness(1)", "brightness(1.5)", "brightness(1)"];
            readonly transition: {
                readonly duration: 2;
                readonly repeat: number;
                readonly ease: "easeInOut";
            };
        };
    };
    readonly flashStrobe: {
        readonly animate: {
            readonly opacity: readonly [1, 0, 1];
            readonly transition: {
                readonly duration: 0.3;
                readonly repeat: number;
                readonly ease: "steps(1)";
            };
        };
    };
    readonly float: {
        readonly animate: {
            readonly y: readonly [0, -10, 0];
            readonly transition: {
                readonly duration: 3;
                readonly repeat: number;
                readonly ease: "easeInOut";
            };
        };
    };
};
//# sourceMappingURL=theme.d.ts.map