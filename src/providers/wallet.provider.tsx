'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
  AlbedoModule,
  xBullModule,
} from '@creit.tech/stellar-wallets-kit';
import {
  WalletConnectModule,
  WalletConnectAllowedMethods,
} from '@creit.tech/stellar-wallets-kit/modules/walletconnect.module';

type WalletContextType = {
  walletAddress: string | null;
  walletName: string | null;
  // Internal wallet module id used by StellarWalletsKit
  // Exposed for diagnostics only
  walletId?: string | null;
  authMethod: 'wallet' | null;
  setWalletInfo: (address: string, name: string, id: string) => Promise<void>;
  clearWalletInfo: () => void;
  signTransaction:
    | ((xdr: string, options: { networkPassphrase: string }) => Promise<string>)
    | null;
  walletKit: StellarWalletsKit | null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function mapWalletNameToId(name?: string | null): string | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes('freighter')) return 'freighter';
  if (n.includes('albedo')) return 'albedo';
  if (n.includes('xbull')) return 'xbull';
  if (n.includes('walletconnect')) return 'walletconnect';
  return null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'wallet' | null>(null);

  const clearWalletInfo = React.useCallback(() => {
    setWalletAddress(null);
    setWalletName(null);
    setWalletId(null);
    setAuthMethod(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletName');
      localStorage.removeItem('walletId');
    }
  }, []);

  // Load from localStorage only on client after mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    const storedName = localStorage.getItem('walletName');
    const storedId = localStorage.getItem('walletId');
    if (storedAddress) setWalletAddress(storedAddress);
    if (storedName) setWalletName(storedName);
    if (storedId) setWalletId(storedId);
    if (storedAddress) setAuthMethod('wallet');
  }, []);

  // Always use TESTNET - no network switching
  const walletKit = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWalletId: walletId || undefined,
        modules: [new FreighterModule(), new AlbedoModule(), new xBullModule()],
      });
    } catch {
      return null;
    }
  }, [walletId]);

  const setWalletInfo = async (address: string, name: string, id: string) => {
    setWalletAddress(address);
    setWalletName(name);
    setWalletId(id);
    setAuthMethod('wallet');
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletName', name);
      localStorage.setItem('walletId', id);
    }
  };

  const signTransaction = async (xdr: string, options: { networkPassphrase: string }) => {
    if (!walletKit) throw new Error('WalletKit unavailable');
    const { signedTxXdr } = await walletKit.signTransaction(xdr, {
      address: walletAddress || undefined,
      networkPassphrase: options.networkPassphrase,
    });
    return signedTxXdr;
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletName,
        walletId,
        authMethod,
        setWalletInfo,
        clearWalletInfo,
        signTransaction: walletAddress && walletKit ? signTransaction : null,
        walletKit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used within WalletProvider');
  return ctx;
};
