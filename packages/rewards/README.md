# Rewards Package

Multi-chain reward services for Rex Meme Studio. Supports Solana and Base (EVM).

## Usage

```typescript
import { createSolanaRewardService, createBaseRewardService } from 'rewards';

const solanaService = createSolanaRewardService();
const result = await solanaService.sendReward({
  walletAddress: 'YourSolanaWalletAddress',
  memeId: 'abc123',
  token: 'BONK',
  amount: 10,
});
```

## Modes

| Mode   | Description                              |
|--------|------------------------------------------|
| `off`  | Rewards disabled                         |
| `demo` | Simulated rewards, no real transactions  |
| `live` | Real on-chain token transfers (TODO)     |

## Environment Variables

```env
REWARD_MODE_SOL=demo
REWARD_MODE_BASE=demo
REWARD_PER_MEME_SOL=10
REWARD_PER_MEME_BASE=10
NEXT_PUBLIC_GXQ_MINT_SOL=D4JvG7eGEvyGY9jx2SF4HCBztLxdYihRzGqu3jNTpkin
NEXT_PUBLIC_GXQ_TOKEN_BASE=0x1f15b86d37025081609901ecb7f2ca20e2dce58f
```
