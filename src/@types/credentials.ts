export type VerifiableCredential = {
  '@context': string[];
  id: string;
  type: string[];
  issuer: {
    id: string;
    name?: string;
  };
  validFrom: string;
  credentialSubject: {
    id: string;
    degree?: {
      type: string;
      name: string;
    };
    [key: string]: unknown;
  };
  proof?: {
    type: string;
    created: string;
    verificationMethod: string;
    cryptosuite: string;
    proofPurpose: string;
    proofValue: string;
  };
};

export type CredentialFormData = {
  issuerName: string;
  subjectDid: string;
  degreeType: string;
  degreeName: string;
  validFrom: string;
};

export type CredentialIssueParams = {
  owner: string;
  vcId: string;
  vcData: string;
  issuer: string;
  issuerDid?: string;
  signTransaction: (xdr: string, options: { networkPassphrase: string }) => Promise<string>;
  contractId?: string;
};

export type CredentialFormState = {
  issuerName: string;
  subjectDid: string;
  degreeType: string;
  degreeName: string;
  validFrom: string;
  txId: string | null;
  openIssuerDidInfo: boolean;
  openIssuerNameInfo: boolean;
  openSubjectDidInfo: boolean;
  openCredentialTypeInfo: boolean;
  openCredentialNameInfo: boolean;
};
