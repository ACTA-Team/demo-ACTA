'use client';

import { useState, useCallback } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useVault } from '@acta-team/acta-sdk';
import { toast } from 'sonner';
import type { IssuerAuthorizeState } from '@/@types/issuer';

export function useIssuerAuthorize() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { authorizeIssuer } = useVault();
  const [state, setState] = useState<IssuerAuthorizeState>({
    loading: false,
    txId: null,
  });

  const friendlyError = useCallback((e: unknown, fallback: string) => {
    const raw = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
    const msg = raw.trim() || fallback;
    return msg.length > 160 ? msg.slice(0, 157) + '…' : msg;
  }, []);

  const doAuthorize = useCallback(async () => {
    if (!walletAddress || !signTransaction) {
      toast.error('Connect your wallet first');
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await authorizeIssuer({
        owner: walletAddress,
        issuer: walletAddress,
        signTransaction: signTransaction,
      });
      setState((prev) => ({ ...prev, txId: res.txId, loading: false }));
      toast.success('Wallet authorized');
    } catch (e: unknown) {
      setState((prev) => ({ ...prev, loading: false }));
      toast.error('Could not authorize wallet', {
        description: friendlyError(e, 'Something went wrong. Please try again.'),
      });
    }
  }, [walletAddress, signTransaction, authorizeIssuer, friendlyError]);

  return {
    walletAddress,
    state,
    doAuthorize,
  };
}
