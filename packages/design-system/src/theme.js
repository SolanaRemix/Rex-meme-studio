export const neoColors = {
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    purple: '#8B00FF',
    lime: '#ADFF2F',
    amber: '#FFB300',
    dark: '#0A0A0F',
    card: '#12121A',
};
export const tokenColors = {
    BONK: '#FF6B00',
    WIF: '#9B59B6',
    MEW: '#1ABC9C',
    JUP: '#3498DB',
    PENGU: '#E74C3C',
    GXQ: '#00FFFF',
};
export const neoShadows = {
    cyan: '0 0 20px #00FFFF, 0 0 40px #00FFFF44',
    magenta: '0 0 20px #FF00FF, 0 0 40px #FF00FF44',
    purple: '0 0 20px #8B00FF, 0 0 40px #8B00FF44',
    lime: '0 0 20px #ADFF2F, 0 0 40px #ADFF2F44',
    amber: '0 0 20px #FFB300, 0 0 40px #FFB30044',
};
export const neoAnimations = {
    glowPulse: {
        initial: { opacity: 1, filter: 'brightness(1)' },
        animate: {
            opacity: [1, 0.7, 1],
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        },
    },
    flashStrobe: {
        animate: {
            opacity: [1, 0, 1],
            transition: { duration: 0.3, repeat: Infinity, ease: 'steps(1)' },
        },
    },
    float: {
        animate: {
            y: [0, -10, 0],
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        },
    },
};
//# sourceMappingURL=theme.js.map