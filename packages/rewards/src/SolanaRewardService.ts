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
 * Reads REWARD_MODE_SOL and REWARD_PER_MEME_SOL from the server environment
 * (not NEXT_PUBLIC_ prefixed — these must NOT be called from client components).
 * Instantiate this only from API routes or server-side code.
 */
export function createSolanaRewardService(): SolanaRewardService {
  return new SolanaRewardService({
    chain: 'solana',
    mode: (process.env.REWARD_MODE_SOL ?? 'demo') as RewardConfig['mode'],
    tokenMint: process.env.NEXT_PUBLIC_GXQ_MINT_SOL ?? '',
    rewardPerMeme: parseInt(process.env.REWARD_PER_MEME_SOL ?? '10', 10),
    rpcUrl: `https://api.${process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? 'mainnet-beta'}.solana.com`,
  });
}
