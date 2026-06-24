const STELLAR_ADDRESS_REGEX = /^G[A-Z2-7]{55}$/;
const STELLAR_TESTNET_DID_REGEX = /^did:pkh:stellar:testnet:G[A-Z2-7]{55}$/;

export function isStellarAddress(addr: string): boolean {
  return STELLAR_ADDRESS_REGEX.test(addr);
}

export function isStellarTestnetDid(did: string): boolean {
  return STELLAR_TESTNET_DID_REGEX.test(did);
}
