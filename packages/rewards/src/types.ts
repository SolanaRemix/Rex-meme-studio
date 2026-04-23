export type RewardChain = 'solana' | 'base';
export type RewardMode = 'off' | 'demo' | 'live';

export interface RewardConfig {
  chain: RewardChain;
  mode: RewardMode;
  tokenMint: string;
  rewardPerMeme: number;
  rpcUrl?: string;
}

export interface RewardResult {
  success: boolean;
  chain?: RewardChain;
  mode?: RewardMode;
  amount?: number;
  txSignature?: string;
  txHash?: string;
  message: string;
  mock: boolean;
}

export interface RewardRequest {
  walletAddress: string;
  memeId: string;
  token?: string;
  amount?: number;
}
