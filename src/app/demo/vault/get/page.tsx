'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWalletContext } from '@/providers/wallet.provider';
import { useVaultRead } from '@/components/modules/vault/hooks/use-vault-read';
import { VcCard } from '@/components/modules/vault/ui/VcCard';
import { Hero } from '@/layouts/Hero';
import { GlowingCard } from '@/components/ui/glowing-card';
import { AnimatedSection } from '@/components/ui/animated-section';
import type { VaultRecord } from '@/@types/vault';

export default function VaultGetPage() {
  const { walletAddress } = useWalletContext();
  const { loading, error, handleGet } = useVaultRead();
  const [vcId, setVcId] = useState('');
  const [vc, setVc] = useState<VaultRecord | null>(null);

  const onGet = async () => {
    if (!walletAddress) return;
    if (!vcId) {
      return;
    }
    const result = await handleGet(vcId);
    if (result) {
      setVc(result);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
      <Hero
        title="Get credential (VC)"
        description="Fetch a credential from your Vault by ID (no signature required)."
        backHref="/demo"
      />

      <div className="mt-8 space-y-6">
        {/* Left: Get action or restricted */}
        <AnimatedSection>
          {walletAddress ? (
            <GlowingCard className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 rounded border px-2 py-2 text-sm"
                  placeholder="vc:example:acta"
                  value={vcId}
                  onChange={(e) => setVcId(e.target.value)}
                />
                <Button onClick={onGet} disabled={loading} variant="outline">
                  {loading ? 'Fetching…' : 'Get VC'}
                </Button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {vc && <VcCard record={vc} />}
            </GlowingCard>
          ) : (
            <GlowingCard>
              <div className="min-h-[20vh] flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-sm">Connect your wallet to access.</p>
                <Button variant="outline" disabled>
                  Restricted access
                </Button>
              </div>
            </GlowingCard>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
