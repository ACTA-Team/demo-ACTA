'use client';

import { useState, useCallback } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useVaultRead as useSdkVaultRead } from '@acta-team/acta-sdk';
import type { VaultRecord } from '@/@types/vault';

export function useVaultRead() {
  const { walletAddress } = useWalletContext();
  const { listVcIds, getVc, verifyVc } = useSdkVaultRead();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleList = useCallback(async () => {
    if (!walletAddress) return [];
    setLoading(true);
    setError(null);
    try {
      const ids = await listVcIds({ owner: walletAddress });
      return ids;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [walletAddress, listVcIds]);

  const handleGet = useCallback(
    async (vcId: string): Promise<VaultRecord | null> => {
      if (!walletAddress || !vcId) return null;
      setLoading(true);
      setError(null);
      try {
        const vc = await getVc({ owner: walletAddress, vcId });
        if (vc && typeof vc === 'object' && !Array.isArray(vc)) {
          return vc as VaultRecord;
        }
        return null;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, getVc]
  );

  const handleVerify = useCallback(
    async (vcId: string) => {
      if (!walletAddress || !vcId) return null;
      setLoading(true);
      setError(null);
      try {
        const verification = await verifyVc({ owner: walletAddress, vcId });
        return verification;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, verifyVc]
  );

  return {
    loading,
    error,
    handleList,
    handleGet,
    handleVerify,
  };
}
