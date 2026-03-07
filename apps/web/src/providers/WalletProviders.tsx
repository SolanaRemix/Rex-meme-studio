'use client';

import React, { useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter as SolanaCoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
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

const wagmiConfig = getDefaultConfig({
  appName: 'Rex Meme Studio',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? 'rex-meme-studio-default',
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
  const solanaEndpoint =
    process.env.NEXT_PUBLIC_SOLANA_CLUSTER === 'mainnet-beta'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolanaCoinbaseWalletAdapter(),
    ],
    []
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectionProvider endpoint={solanaEndpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
