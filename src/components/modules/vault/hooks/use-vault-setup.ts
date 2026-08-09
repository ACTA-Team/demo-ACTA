'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useDid } from '@/hooks/did/use-did';
import { useVault } from '@acta-team/acta-sdk';
import { toast } from 'sonner';
import type { VaultSetupState } from '@/@types/vault';

export function useVaultSetup() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { ownerDid, saveComputedDid } = useDid();
  const { createVault } = useVault();
  const [state, setState] = useState<VaultSetupState>({
    loading: false,
    txId: null,
    copiedWallet: false,
    copiedDID: false,
  });

  const friendlyError = useCallback((e: unknown, fallback: string) => {
    const raw = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
    const msg = raw.trim() || fallback;
    return msg.length > 160 ? msg.slice(0, 157) + '…' : msg;
  }, []);

  const doCreateVault = useCallback(async () => {
    if (!ownerDid || !walletAddress || !signTransaction) {
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await createVault({
        owner: walletAddress,
        ownerDid: ownerDid,
        signTransaction: signTransaction,
      });
      setState((prev) => ({ ...prev, txId: res.txId, loading: false }));
      toast.success('Vault created');
    } catch (e: unknown) {
      setState((prev) => ({ ...prev, loading: false }));
      toast.error('Could not create vault', {
        description: friendlyError(e, 'Something went wrong. Please try again.'),
      });
    }
  }, [ownerDid, walletAddress, signTransaction, createVault, friendlyError]);

  // Auto-compute and save DID on mount to reduce friction
  useEffect(() => {
    if (!ownerDid && walletAddress) {
      try {
        saveComputedDid();
      } catch (e) {
        console.warn('Failed to compute DID', e);
      }
    }
  }, [ownerDid, walletAddress, saveComputedDid]);

  const copyToClipboard = useCallback(async (text: string, type: 'wallet' | 'did') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'wallet') {
        setState((prev) => ({ ...prev, copiedWallet: true }));
        setTimeout(() => setState((prev) => ({ ...prev, copiedWallet: false })), 2000);
      } else {
        setState((prev) => ({ ...prev, copiedDID: true }));
        setTimeout(() => setState((prev) => ({ ...prev, copiedDID: false })), 2000);
      }
    } catch (e) {
      console.warn('Clipboard copy failed', e);
      toast.error('Could not copy');
    }
  }, []);

  return {
    walletAddress,
    ownerDid,
    state,
    doCreateVault,
    copyToClipboard,
  };
}
