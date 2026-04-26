import { describe, expect, it } from 'vitest';
import { claimBaseReward } from '../baseRewards';
import { claimSolanaReward } from '../solanaRewards';

describe('demo reward claims', () => {
  it('returns a valid Solana demo reward result', async () => {
    process.env.REWARD_MODE_SOL = 'demo';
    process.env.REWARD_PER_MEME_SOL = '10';

    const result = await claimSolanaReward({
      walletAddress: 'DemoWallet111111111111111111111111111111111',
      memeId: 'meme-1',
    });

    expect(result.success).toBe(true);
    expect(result.mock).toBe(true);
    expect(result.mode).toBe('demo');
    expect(result.amount).toBe(10);
    expect(result.txSignature).toBeTruthy();
  });

  it('returns a valid Base demo reward result', async () => {
    process.env.REWARD_MODE_BASE = 'demo';
    process.env.REWARD_PER_MEME_BASE = '12';

    const result = await claimBaseReward({
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      memeId: 'meme-2',
    });

    expect(result.success).toBe(true);
    expect(result.mock).toBe(true);
    expect(result.mode).toBe('demo');
    expect(result.amount).toBe(12);
    expect(result.txSignature?.startsWith('0x')).toBe(true);
  });
});
