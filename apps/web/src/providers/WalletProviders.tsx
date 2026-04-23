'use client';

import React, { useEffect } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WagmiProvider, http } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@solana/wallet-adapter-react-ui/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

// wagmiConfig is module-level for stability across renders.
// NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID must be set in .env for WalletConnect v2 to work.
// A placeholder is used here to prevent RainbowKit from throwing during SSR/build; the
// missing env var is caught at runtime in the useEffect below.
const wagmiConfig = getDefaultConfig({
  appName: 'Rex Meme Studio',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? 'MISSING_WALLET_CONNECT_PROJECT_ID',
  chains: [base, mainnet],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL ?? 'https://mainnet.base.org'
    ),
    [mainnet.id]: http(),
  },
  ssr: true,
});

export function WalletProviders({ children }: { children: React.ReactNode }) {
  // Fail clearly when the required WalletConnect project ID is missing.
  // useEffect ensures this runs only on the client (not during SSR/static generation).
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) {
      console.error(
        '[WalletProviders] NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set. ' +
          'WalletConnect v2 requires a valid project ID from https://cloud.walletconnect.com. ' +
          'Please set this env var in your .env file before enabling wallet connections.'
      );
    }
  }, []);

  const solanaEndpoint =
    process.env.NEXT_PUBLIC_SOLANA_CLUSTER === 'mainnet-beta'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectionProvider endpoint={solanaEndpoint}>
            <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
