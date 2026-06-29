const STELLAR_ADDRESS_REGEX = /^G[A-Z2-7]{55}$/;
const DID_PKH_STELLAR_TESTNET_REGEX = /^did:pkh:stellar:testnet:G[A-Z2-7]{55}$/;

export function isStellarAddress(value: string): boolean {
  return STELLAR_ADDRESS_REGEX.test(value);
}

export function isDidPkhStellarTestnet(value: string): boolean {
  return DID_PKH_STELLAR_TESTNET_REGEX.test(value);
}
