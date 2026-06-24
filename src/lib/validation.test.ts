import { describe, expect, it } from 'vitest';
import { isStellarAddress, isDidPkhStellarTestnet } from './validation';

const validStellarAddress = 'GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU';
const invalidStellarAddress = 'G123';

const validDid = `did:pkh:stellar:testnet:${validStellarAddress}`;
const invalidDid = 'did:pkh:stellar:mainnet:GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU';

describe('validation utilities', () => {
  it('validates Stellar public key addresses', () => {
    expect(isStellarAddress(validStellarAddress)).toBe(true);
    expect(isStellarAddress(invalidStellarAddress)).toBe(false);
    expect(isStellarAddress('')).toBe(false);
    expect(isStellarAddress('GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NV')).toBe(false);
  });

  it('validates did:pkh:stellar:testnet identifiers', () => {
    expect(isDidPkhStellarTestnet(validDid)).toBe(true);
    expect(isDidPkhStellarTestnet(invalidDid)).toBe(false);
    expect(isDidPkhStellarTestnet('did:pkh:stellar:testnet:G123')).toBe(false);
  });
});
