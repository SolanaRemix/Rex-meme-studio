import type { Metadata } from 'next';
import './globals.css';
import { WalletProviders } from '@/providers/WalletProviders';

export const metadata: Metadata = {
  title: 'Rex Meme Studio',
  description:
    'AI-powered meme generator with NEO GLOW aesthetics. Create, export, and share memes featuring BONK, WIF, MEW, JUP, PENGU and more. Earn rewards on Solana & Base.',
  keywords: ['meme', 'AI', 'Solana', 'Base', 'BONK', 'WIF', 'crypto', 'NFT'],
  openGraph: {
    title: 'Rex Meme Studio',
    description: 'AI-powered meme generator for the crypto community',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mono antialiased bg-neoDark text-white min-h-screen">
        <WalletProviders>{children}</WalletProviders>
      </body>
    </html>
  );
}
