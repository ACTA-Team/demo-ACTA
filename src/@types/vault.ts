export type VaultRecord = {
  id: string;
  issuer_did?: string;
  issuance_contract?: string;
  data?: string | Record<string, unknown>;
};

export type VaultCreateParams = {
  owner: string;
  ownerDid: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
  contractId?: string;
};

export type VaultAuthorizeParams = {
  owner: string;
  issuer: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
  contractId?: string;
};

export type VaultSetupState = {
  loading: boolean;
  txId: string | null;
  copiedWallet: boolean;
  copiedDID: boolean;
};
