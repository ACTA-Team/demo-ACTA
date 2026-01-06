'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';

type DidContextValue = {
  ownerDid: string | null;
  setOwnerDid: (did: string | null) => void;
};

const DidContext = createContext<DidContextValue | undefined>(undefined);

export function makeDidForAddress(address: string): string {
  // Always use testnet for this demo
  return `did:pkh:stellar:testnet:${address}`;
}

export function DidProvider({ children }: { children: React.ReactNode }) {
  const { walletAddress } = useWalletContext();
  const [ownerDid, setOwnerDidState] = useState<string | null>(null);

  const setOwnerDid = (did: string | null) => {
    setOwnerDidState(did);
    try {
      if (did) {
        localStorage.setItem('acta_owner_did', did);
      } else {
        localStorage.removeItem('acta_owner_did');
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  // Initialize DID from wallet or from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('acta_owner_did') : null;
    if (stored) {
      setOwnerDidState(stored);
      return;
    }
    if (walletAddress) {
      const did = makeDidForAddress(walletAddress);
      setOwnerDidState(did);
    } else {
      setOwnerDidState(null);
    }
  }, [walletAddress]);

  const value = useMemo<DidContextValue>(() => ({ ownerDid, setOwnerDid }), [ownerDid]);
  return <DidContext.Provider value={value}>{children}</DidContext.Provider>;
}

export function useDidContext(): DidContextValue {
  const ctx = useContext(DidContext);
  if (!ctx) throw new Error('useDidContext must be used within DidProvider');
  return ctx;
}
