'use client';

import React, { createContext, useContext, useMemo } from 'react';

type Network = 'testnet';

type NetworkContextType = {
  network: Network;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  // Always use testnet - no network switching
  const network: Network = 'testnet';

  const value = useMemo(() => ({ network }), []);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}

