import type { RewardConfig, RewardRequest, RewardResult } from './types';

/**
 * Solana reward service.
 * TODO: Implement live mode using @solana/web3.js token transfers.
 * In live mode, transfer GXQ tokens from treasury to recipient wallet.
 */
export class SolanaRewardService {
  private config: RewardConfig;

  constructor(config: RewardConfig) {
    this.config = config;
  }

  async sendReward(request: RewardRequest): Promise<RewardResult> {
    const { walletAddress, memeId, amount } = request;

    if (this.config.mode === 'off') {
      return {
        success: false,
        message: 'Solana rewards are disabled',
        mock: true,
      };
    }

    if (this.config.mode === 'demo') {
      // Demo mode: simulate a successful transaction with a plausible base58 signature
      const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      const mockTxHash = Array.from({ length: 88 }, () =>
        base58Chars[Math.floor(Math.random() * base58Chars.length)]
      ).join('');
      console.log(
        `[SolanaRewardService] DEMO: Would send ${amount} GXQ to ${walletAddress} for meme ${memeId}`
      );
      console.log(`[SolanaRewardService] Mock tx: ${mockTxHash}`);

      return {
        success: true,
        txHash: mockTxHash,
        message: `Demo: ${amount} GXQ reward simulated on Solana for Meme #${memeId}`,
        mock: true,
      };
    }

    // TODO: Live mode implementation
    // const connection = new Connection(this.config.rpcUrl ?? clusterApiUrl('mainnet-beta'));
    // const mint = new PublicKey(this.config.tokenMint);
    // ... token transfer logic ...
    throw new Error('Live Solana rewards not yet implemented');
  }

  getConfig(): Readonly<RewardConfig> {
    return this.config;
  }
}

/**
 * Factory function for server-side use only.
 * Reads configuration from the environment:
 * - REWARD_MODE_SOL, REWARD_PER_MEME_SOL — server-only (not NEXT_PUBLIC_); controls reward behavior
 * - NEXT_PUBLIC_GXQ_MINT_SOL — intentionally public (token mint address is not a secret)
 * - NEXT_PUBLIC_SOLANA_CLUSTER — intentionally public (cluster endpoint is not a secret)
 * Do NOT call this factory from client components; use only from API routes or server-side code.
 */
const VALID_MODES = new Set<RewardConfig['mode']>(['off', 'demo', 'live']);

export function createSolanaRewardService(): SolanaRewardService {
  const rawMode = process.env.REWARD_MODE_SOL ?? 'demo';
  const mode: RewardConfig['mode'] = VALID_MODES.has(rawMode as RewardConfig['mode'])
    ? (rawMode as RewardConfig['mode'])
    : 'demo';

  const parsedRewardPerMeme = parseInt(process.env.REWARD_PER_MEME_SOL ?? '', 10);
  const rewardPerMeme = Number.isFinite(parsedRewardPerMeme) ? parsedRewardPerMeme : 10;

  return new SolanaRewardService({
    chain: 'solana',
    mode,
    tokenMint: process.env.NEXT_PUBLIC_GXQ_MINT_SOL ?? '',
    rewardPerMeme,
    rpcUrl: `https://api.${process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? 'mainnet-beta'}.solana.com`,
  });
}
