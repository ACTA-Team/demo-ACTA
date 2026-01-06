'use client';

import { Button } from '@/components/ui/button';
import { useDidCard } from '../hooks/use-did-card';

export function DidCard() {
  const { walletAddress, ownerDid, onSave } = useDidCard();

  return (
    <div className="rounded border p-6 md:p-8 space-y-3">
      <div>
        <p className="text-sm">Wallet</p>
        <p className="text-xs font-mono break-all">{walletAddress || 'Not connected'}</p>
      </div>
      <div>
        <p className="text-sm">Computed DID</p>
        <p className="text-xs font-mono break-all">{ownerDid || '—'}</p>
      </div>
      <div className="pt-2 flex gap-2">
        <Button onClick={onSave} disabled={!walletAddress} variant="outline">
          Compute & Save DID
        </Button>
      </div>
    </div>
  );
}
