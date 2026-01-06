export type IssuerAuthorizeState = {
  loading: boolean;
  txId: string | null;
};

export type IssuerAuthorizeParams = {
  owner: string;
  issuer: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
  contractId?: string;
};
