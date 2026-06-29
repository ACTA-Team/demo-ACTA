export function useCredential() {
  return {
    issue: async () => ({ txId: 'mockTxId' }),
  };
}
