import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCredentialForm } from './use-credential-form';

const validStellarAddress = 'GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU';
const validSubjectDid = `did:pkh:stellar:testnet:${validStellarAddress}`;

const issueMock = vi.fn(async () => ({ txId: 'mockTxId' }));
const signTransactionMock = vi.fn(async () => 'signedTx');

vi.mock('@acta-team/acta-sdk', async () => {
  const actual =
    await vi.importActual<typeof import('@/test-stubs/acta-sdk')>('@/test-stubs/acta-sdk');
  return {
    ...actual,
    useCredential: () => ({
      issue: issueMock,
    }),
  };
});

vi.mock('@/providers/wallet.provider', () => ({
  useWalletContext: () => ({
    walletAddress: validStellarAddress,
    signTransaction: signTransactionMock,
  }),
}));

vi.mock('@/providers/did.provider', () => ({
  useDidContext: () => ({
    ownerDid: validSubjectDid,
  }),
}));

describe('useCredentialForm', () => {
  it('short-circuits when required fields are empty', async () => {
    const { result } = renderHook(() => useCredentialForm());

    await act(async () => {
      await result.current.handleCreate();
    });

    expect(result.current.state.txId).toBeNull();
    expect(issueMock).not.toHaveBeenCalled();
  });

  it('issues a credential when the form is valid', async () => {
    const { result } = renderHook(() => useCredentialForm());

    await act(async () => {
      result.current.updateField('issuerName', 'Example University');
      result.current.updateField('degreeType', 'ExampleBachelorDegree');
      result.current.updateField('degreeName', 'Bachelor of Science and Arts');
    });

    await act(async () => {
      await result.current.handleCreate();
    });

    expect(issueMock).toHaveBeenCalledOnce();
    const issuedPayload = issueMock.mock.calls[0][0];
    expect(issuedPayload).toMatchObject({
      owner: validStellarAddress,
      issuer: validStellarAddress,
      issuerDid: validSubjectDid,
      signTransaction: signTransactionMock,
    });
    expect(result.current.state.txId).toBe('mockTxId');
  });
});
