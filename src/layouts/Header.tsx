'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { useWalletKit } from '@/hooks/stellar/use-wallet-kit';

export function SiteHeader() {
  const { walletAddress, clearWalletInfo } = useWalletContext();
  const { connectWithWalletKit, disconnectWalletKit } = useWalletKit();

  const handleConnect = async () => {
    try {
      await connectWithWalletKit();
    } catch {
      // Swallow errors silently to avoid extra alerts
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWalletKit();
    } catch {}
    clearWalletInfo();
  };

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/white.png"
            alt="ACTA"
            width={60}
            height={32}
            className="hidden dark:block"
            priority
          />
          <Image
            src="/black.png"
            alt="ACTA"
            width={60}
            height={32}
            className="block dark:hidden"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 justify-end">
          <div className="hidden sm:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
              <a href="https://docs.acta.build/" target="_blank" rel="noopener noreferrer">
                Docs
              </a>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
              <a href="https://links.acta.build/" target="_blank" rel="noopener noreferrer">
                Links
              </a>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
              <a href="https://dapp.acta.build/" target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </Button>
          </div>
          {walletAddress ? (
            <div className="flex items-center gap-2 ml-4">
              <Button
                className="!bg-white text-black hover:bg-foreground hover:text-background"
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="ml-4">
              <Button
                className="!bg-white text-black hover:bg-foreground hover:text-background"
                variant="outline"
                size="sm"
                onClick={handleConnect}
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
