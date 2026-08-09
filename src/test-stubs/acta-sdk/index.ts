import { createElement, Fragment, type ReactNode } from 'react';

type SignTransaction = (xdr: string, options: { networkPassphrase: string }) => Promise<string>;

export const testNet = 'https://api.testnet.acta.build';
export const mainNet = 'https://api.mainnet.acta.build';

export function ActaConfig({ children }: { children: ReactNode; baseURL: string; apiKey: string }) {
  return createElement(Fragment, null, children);
}

export function useCredential() {
  return {
    issue: async (_params: {
      owner: string;
      vcId: string;
      vcData: string;
      issuer: string;
      issuerDid?: string;
      signTransaction: SignTransaction;
      contractId?: string;
    }) => ({ txId: 'mockTxId' }),
  };
}

export function useVault() {
  return {
    createVault: async (_params: {
      owner: string;
      ownerDid: string;
      signTransaction: SignTransaction;
      contractId?: string;
    }) => ({ txId: 'mockTxId' }),
    authorizeIssuer: async (_params: {
      owner: string;
      issuer: string;
      signTransaction: SignTransaction;
      contractId?: string;
    }) => ({ txId: 'mockTxId' }),
  };
}

export function useVaultRead() {
  return {
    listVcIds: async (_params: { owner: string }): Promise<string[]> => [],
    getVc: async (_params: {
      owner: string;
      vcId: string;
    }): Promise<Record<string, unknown> | null> => null,
    verifyVc: async (_params: { owner: string; vcId: string }) => ({ valid: true }),
  };
}
