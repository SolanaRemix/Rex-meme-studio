export type RewardChain = 'solana' | 'base';

export interface RewardConfig {
  chain: RewardChain;
  mode: 'off' | 'demo' | 'live';
  tokenMint: string;
  rewardPerMeme: number;
  rpcUrl?: string;
}

export interface RewardResult {
  success: boolean;
  txHash?: string;
  message: string;
  mock: boolean;
}

export interface RewardRequest {
  walletAddress: string;
  memeId: string;
  token: string;
  amount: number;
}
