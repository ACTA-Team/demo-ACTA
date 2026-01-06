'use client';

import { useState, useCallback } from 'react';
import { useWalletContext } from '@/providers/wallet.provider';
import { useDidContext } from '@/providers/did.provider';
import { useCredential } from '@acta-team/acta-sdk';
import { toast } from 'sonner';
import type { CredentialFormState, VerifiableCredential } from '@/@types/credentials';

export function useCredentialForm() {
  const { walletAddress, signTransaction } = useWalletContext();
  const { ownerDid } = useDidContext();
  const { issue } = useCredential();
  const [state, setState] = useState<CredentialFormState>({
    issuerName: '',
    subjectDid: 'did:pkh:stellar:testnet:GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU',
    degreeType: '',
    degreeName: '',
    validFrom: new Date().toISOString(),
    txId: null,
    openIssuerDidInfo: false,
    openIssuerNameInfo: false,
    openSubjectDidInfo: false,
    openCredentialTypeInfo: false,
    openCredentialNameInfo: false,
  });

  const friendlyError = useCallback((e: unknown, fallback: string) => {
    const raw = e instanceof Error ? e.message : typeof e === 'string' ? e : '';
    const msg = raw.trim() || fallback;
    return msg.length > 160 ? msg.slice(0, 157) + '…' : msg;
  }, []);

  const randomId = useCallback(() => `cred_${crypto.randomUUID().replace(/-/g, '')}`, []);

  const handleCreate = useCallback(async () => {
    if (!walletAddress) {
      toast.error('Connect your wallet first');
      return;
    }
    if (!ownerDid) {
      toast.error('Signer unavailable');
      return;
    }
    if (!state.issuerName || !state.subjectDid || !state.degreeType || !state.degreeName) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!signTransaction) {
      toast.error('Signer unavailable');
      return;
    }

    setState((prev) => ({ ...prev, txId: null }));
    try {
      const generatedVcId = randomId();
      const vc: VerifiableCredential = {
        '@context': [
          'https://www.w3.org/ns/credentials/v2',
          'https://www.w3.org/ns/credentials/examples/v2',
        ],
        id: generatedVcId,
        type: ['VerifiableCredential', 'ExampleDegreeCredential'],
        issuer: { id: ownerDid, name: state.issuerName },
        validFrom: state.validFrom,
        credentialSubject: {
          id: state.subjectDid,
          degree: { type: state.degreeType, name: state.degreeName },
        },
        proof: {
          type: 'DataIntegrityProof',
          created: new Date().toISOString(),
          verificationMethod: 'did:key:zDnaebSRtPnW6YCpxAhR5JPxJqt9UunCsBPhLEtUokUvp87nQ',
          cryptosuite: 'ecdsa-rdfc-2019',
          proofPurpose: 'assertionMethod',
          proofValue:
            'z35CwmxThsUQ4t79JfacmMcw4y1kCqtD4rKqUooKM2NyKwdF5jmXMRo9oGnzHerf8hfQiWkEReycSXC2NtRrdMZN4',
        },
      };

      const vcData = JSON.stringify(vc);

      const result = await issue({
        owner: walletAddress,
        vcId: generatedVcId,
        vcData: vcData,
        issuer: walletAddress,
        issuerDid: ownerDid || undefined,
        signTransaction: signTransaction,
      });
      setState((prev) => ({ ...prev, txId: result.txId }));
      // Always use testnet explorer for this demo
      const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${result.txId}`;
      toast.success('Credential created', {
        action: {
          label: 'View on Stellar Expert',
          onClick: () => {
            try {
              window.open(explorerUrl, '_blank', 'noopener,noreferrer');
            } catch {
              window.location.href = explorerUrl;
            }
          },
        },
      });
    } catch (e: unknown) {
      toast.error('Could not create credential', {
        description: friendlyError(e, 'Something went wrong. Please try again.'),
      });
    }
  }, [walletAddress, ownerDid, signTransaction, state, issue, randomId, friendlyError]);

  const fillExample = useCallback(() => {
    setState((prev) => ({
      ...prev,
      issuerName: 'Example University',
      subjectDid:
        'did:pkh:stellar:testnet:GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU',
      degreeType: 'ExampleBachelorDegree',
      degreeName: 'Bachelor of Science and Arts',
      validFrom: '2010-01-01T19:23:24Z',
    }));
  }, []);

  const updateField = useCallback(
    <K extends keyof CredentialFormState>(field: K, value: CredentialFormState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    state,
    updateField,
    handleCreate,
    fillExample,
    walletAddress,
    ownerDid,
  };
}
