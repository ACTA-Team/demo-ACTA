'use client';

import { useCallback } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useDid } from '@/hooks/did/use-did';

export function useDidCard() {
  const { walletAddress } = useWalletContext();
  const { ownerDid, computeDid, saveComputedDid } = useDid();

  const onSave = useCallback(() => {
    const did = computeDid();
    if (!did) {
      return;
    }
    saveComputedDid();
  }, [computeDid, saveComputedDid]);

  return {
    walletAddress,
    ownerDid,
    onSave,
  };
}
