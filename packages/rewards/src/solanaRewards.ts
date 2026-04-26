import type { RewardRequest, RewardResult, RewardMode } from './types';

const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const SOLANA_SIGNATURE_LENGTH = 88;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getSolanaMode(): RewardMode {
  const mode = process.env.REWARD_MODE_SOL ?? 'demo';
  return mode === 'off' || mode === 'demo' || mode === 'live' ? mode : 'demo';
}

function createMockSolanaSignature(): string {
  return Array.from(
    { length: SOLANA_SIGNATURE_LENGTH },
    () => BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)]
  ).join('');
}

export async function claimSolanaReward(req: RewardRequest): Promise<RewardResult> {
  const mode = getSolanaMode();
  const rewardPerMeme = parsePositiveInt(process.env.REWARD_PER_MEME_SOL, 10);
  const amount = req.amount ?? rewardPerMeme;

  if (mode === 'off') {
    return {
      success: false,
      chain: 'solana',
      mode,
      amount,
      message: 'Solana rewards are disabled',
      mock: true,
    };
  }

  if (mode === 'demo') {
    const txSignature = createMockSolanaSignature();
    return {
      success: true,
      chain: 'solana',
      mode,
      amount,
      txSignature,
      txHash: txSignature,
      message: `Demo reward queued for ${req.walletAddress}`,
      mock: true,
    };
  }

  return {
    success: false,
    chain: 'solana',
    mode,
    amount,
    message: 'Live Solana rewards are not implemented yet',
    mock: false,
  };
}
