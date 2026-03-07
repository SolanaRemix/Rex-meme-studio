import type { MemeStyle } from './types';

interface CaptionOptions {
  prompt: string;
  token: string;
  style: MemeStyle;
}

/**
 * Generate a meme caption based on prompt, token, and style.
 * TODO: Replace with real AI integration (OpenAI / Anthropic)
 * using process.env.AI_PROVIDER_KEY
 */
export function generateCaption({ prompt, token, style }: CaptionOptions): string {
  const templates: Record<MemeStyle, string[]> = {
    neoGlow: [
      `When ${token} hits ${prompt} — TO THE MOON 🚀`,
      `${token} holders watching ${prompt} 👀✨`,
      `Me after ${prompt} with ${token} in my wallet 💎`,
      `${token} community when ${prompt} 🌊`,
    ],
    flash: [
      `⚡ ${token} FLASH ALERT: ${prompt} ⚡`,
      `🔥 ${token} IS ON FIRE: ${prompt} 🔥`,
      `💥 BREAKING: ${token} just ${prompt} 💥`,
      `⚡ ${token} BREAKING NEWS: ${prompt} ⚡`,
    ],
    glitch: [
      `${token} g̷l̷i̷t̷c̷h̷e̷d̷ when ${prompt}`,
      `[SYSTEM ERROR] ${token} ${prompt} [/SYSTEM ERROR]`,
      `<ERR_0x1> ${token}: ${prompt} </>`,
      `/// ${token}.${prompt} — SIGNAL_LOST ///`,
    ],
  };

  const options = templates[style] ?? templates.neoGlow;
  return options[Math.floor(Math.random() * options.length)];
}
