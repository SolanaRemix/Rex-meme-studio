import type { RewardConfig, RewardRequest, RewardResult } from './types';

/**
 * Base (EVM) reward service.
 * TODO: Implement live mode using viem/wagmi for ERC-20 token transfers on Base mainnet.
 * In live mode, transfer GXQ tokens from treasury to recipient address.
 */
export class BaseRewardService {
  private config: RewardConfig;

  constructor(config: RewardConfig) {
    this.config = config;
  }

  async sendReward(request: RewardRequest): Promise<RewardResult> {
    const { walletAddress, memeId, amount } = request;

    if (this.config.mode === 'off') {
      return {
        success: false,
        message: 'Base rewards are disabled',
        mock: true,
      };
    }

    if (this.config.mode === 'demo') {
      // Demo mode: simulate a successful transaction
      const mockTxHash = `0xDEMO_BASE_${Date.now().toString(16)}_${memeId.slice(0, 8)}`;
      console.log(
        `[BaseRewardService] DEMO: Would send ${amount} GXQ to ${walletAddress} for meme ${memeId}`
      );
      console.log(`[BaseRewardService] Mock tx: ${mockTxHash}`);

      return {
        success: true,
        txHash: mockTxHash,
        message: `Demo: ${amount} GXQ reward simulated on Base for Meme #${memeId}`,
        mock: true,
      };
    }

    // TODO: Live mode implementation
    // const publicClient = createPublicClient({ chain: base, transport: http(this.config.rpcUrl) });
    // const walletClient = createWalletClient({ ... });
    // const hash = await walletClient.writeContract({
    //   address: this.config.tokenMint as `0x${string}`,
    //   abi: erc20Abi,
    //   functionName: 'transfer',
    //   args: [walletAddress as `0x${string}`, BigInt(amount) * 10n ** 18n],
    // });
    throw new Error('Live Base rewards not yet implemented');
  }

  getConfig(): Readonly<RewardConfig> {
    return this.config;
  }
}

export function createBaseRewardService(): BaseRewardService {
  return new BaseRewardService({
    chain: 'base',
    mode: (process.env.REWARD_MODE_BASE ?? 'demo') as RewardConfig['mode'],
    tokenMint: process.env.NEXT_PUBLIC_GXQ_TOKEN_BASE ?? '',
    rewardPerMeme: parseInt(process.env.REWARD_PER_MEME_BASE ?? '10', 10),
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL ?? 'https://mainnet.base.org',
  });
}
