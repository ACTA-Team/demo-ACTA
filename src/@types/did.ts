export type DidContextValue = {
  ownerDid: string | null;
  setOwnerDid: (did: string | null) => void;
};

export type DidState = {
  ownerDid: string | null;
  computeDid: () => string | null;
  saveComputedDid: () => string | null;
};
