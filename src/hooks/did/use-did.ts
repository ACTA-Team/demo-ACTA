'use client';

import { useCallback } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useDidContext, makeDidForAddress } from '@/providers/did.provider';

export function useDid() {
  const { walletAddress } = useWalletContext();
  const { ownerDid, setOwnerDid } = useDidContext();

  const computeDid = useCallback(() => {
    if (!walletAddress) return null;
    // Always use testnet for this demo
    return makeDidForAddress(walletAddress);
  }, [walletAddress]);

  const saveComputedDid = useCallback(() => {
    const did = computeDid();
    if (did) setOwnerDid(did);
    return did;
  }, [computeDid, setOwnerDid]);

  return {
    ownerDid,
    computeDid,
    saveComputedDid,
  };
}
