'use client';

import { Button } from '@/components/ui/button';
import { useIssuerAuthorize } from '../hooks/use-issuer-authorize';

export function AuthorizedIssuersCard() {
  const { walletAddress, state, doAuthorize } = useIssuerAuthorize();

  return (
    <div className="rounded border p-6 md:p-8 space-y-3">
      <div>
        <p className="text-sm">Wallet</p>
        <p className="text-xs font-mono break-all">{walletAddress || 'Not connected'}</p>
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          className="!bg-white text-black hover:text-gray-95  0 hover:bg-gray-200 font-medium w-full"
          onClick={doAuthorize}
          disabled={!walletAddress || state.loading}
          variant="outline"
        >
          Authorize Wallet
        </Button>
      </div>
    </div>
  );
}
