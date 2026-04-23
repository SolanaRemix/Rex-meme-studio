import type { RewardRequest, RewardResult, RewardMode } from './types';

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getBaseMode(): RewardMode {
  const mode = process.env.REWARD_MODE_BASE ?? 'demo';
  return mode === 'off' || mode === 'demo' || mode === 'live' ? mode : 'demo';
}

function createMockBaseSignature(): string {
  const hex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${hex}`;
}

export async function claimBaseReward(req: RewardRequest): Promise<RewardResult> {
  const mode = getBaseMode();
  const rewardPerMeme = parsePositiveInt(process.env.REWARD_PER_MEME_BASE, 10);
  const amount = req.amount ?? rewardPerMeme;

  if (mode === 'off') {
    return {
      success: false,
      chain: 'base',
      mode,
      amount,
      message: 'Base rewards are disabled',
      mock: true,
    };
  }

  if (mode === 'demo') {
    const txSignature = createMockBaseSignature();
    return {
      success: true,
      chain: 'base',
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
    chain: 'base',
    mode,
    amount,
    message: 'Live Base rewards are not implemented yet',
    mock: false,
  };
}
