'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAccount } from 'wagmi';

interface Props {
  memeId: string;
  token: string;
}

const REWARD_SOL = parseInt(
  process.env.NEXT_PUBLIC_REWARD_PER_MEME_SOL ?? '10',
  10
);
const REWARD_BASE = parseInt(
  process.env.NEXT_PUBLIC_REWARD_PER_MEME_BASE ?? '10',
  10
);

export function RewardsPanel({ memeId, token }: Props) {
  const { publicKey: solanaKey } = useWallet();
  const { address: evmAddress } = useAccount();
  const [claimedSol, setClaimedSol] = useState(false);
  const [claimedBase, setClaimedBase] = useState(false);
  const [claiming, setClaiming] = useState<'sol' | 'base' | null>(null);

  const handleClaimSolana = async () => {
    if (!solanaKey) return;
    setClaiming('sol');
    // TODO: Integrate SolanaRewardService
    await new Promise((r) => setTimeout(r, 1500));
    setClaimedSol(true);
    setClaiming(null);
  };

  const handleClaimBase = async () => {
    if (!evmAddress) return;
    setClaiming('base');
    // TODO: Integrate BaseRewardService
    await new Promise((r) => setTimeout(r, 1500));
    setClaimedBase(true);
    setClaiming(null);
  };

  return (
    <div className="neo-card p-6 border-neoMagenta/20 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎁</span>
        <div>
          <h3 className="text-sm font-mono font-bold text-neoMagenta uppercase tracking-widest">
            Meme Rewards
          </h3>
          <p className="text-xs text-neoCyan/40 font-mono">
            Claim rewards for generating meme #{memeId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Solana reward */}
        <div className="bg-neoCyan/5 border border-neoCyan/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span>◎</span>
            <span className="text-xs font-mono text-neoCyan font-bold uppercase tracking-wider">
              Solana
            </span>
            <span className="ml-auto text-xs font-mono text-neoCyan/60">
              +{REWARD_SOL} GXQ
            </span>
          </div>
          {solanaKey ? (
            <motion.button
              onClick={handleClaimSolana}
              disabled={claimedSol || claiming === 'sol'}
              className={`w-full py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider border transition-all ${
                claimedSol
                  ? 'border-neoLime/30 text-neoLime/60 bg-neoLime/5 cursor-default'
                  : 'neo-button text-neoCyan border-neoCyan/50 hover:shadow-glow-cyan'
              }`}
              whileTap={!claimedSol ? { scale: 0.95 } : {}}
            >
              {claimedSol
                ? '✓ Claimed'
                : claiming === 'sol'
                  ? 'Claiming...'
                  : 'Claim Reward'}
            </motion.button>
          ) : (
            <p className="text-xs text-neoCyan/30 font-mono text-center">
              Connect Solana wallet
            </p>
          )}
        </div>

        {/* Base reward */}
        <div className="bg-neoMagenta/5 border border-neoMagenta/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span>🔵</span>
            <span className="text-xs font-mono text-neoMagenta font-bold uppercase tracking-wider">
              Base
            </span>
            <span className="ml-auto text-xs font-mono text-neoMagenta/60">
              +{REWARD_BASE} GXQ
            </span>
          </div>
          {evmAddress ? (
            <motion.button
              onClick={handleClaimBase}
              disabled={claimedBase || claiming === 'base'}
              className={`w-full py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider border transition-all ${
                claimedBase
                  ? 'border-neoLime/30 text-neoLime/60 bg-neoLime/5 cursor-default'
                  : 'neo-button-magenta text-neoMagenta border-neoMagenta/50 hover:shadow-glow-magenta'
              }`}
              whileTap={!claimedBase ? { scale: 0.95 } : {}}
            >
              {claimedBase
                ? '✓ Claimed'
                : claiming === 'base'
                  ? 'Claiming...'
                  : 'Claim Reward'}
            </motion.button>
          ) : (
            <p className="text-xs text-neoMagenta/30 font-mono text-center">
              Connect EVM wallet
            </p>
          )}
        </div>
      </div>

      <p className="text-[10px] text-neoCyan/20 font-mono text-center">
        Demo mode · Token: {token} · No real transactions in demo
      </p>
    </div>
  );
}
