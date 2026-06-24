import { describe, expect, it } from 'vitest';
import { makeDidForAddress } from './did.provider';

const validStellarAddress = 'GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU';
const invalidStellarAddress = 'G123';

describe('makeDidForAddress', () => {
  it('returns a testnet DID for a valid Stellar address', () => {
    expect(makeDidForAddress(validStellarAddress)).toBe(
      `did:pkh:stellar:testnet:${validStellarAddress}`
    );
  });

  it('throws for an invalid Stellar address', () => {
    expect(() => makeDidForAddress(invalidStellarAddress)).toThrow('Invalid Stellar address');
  });
});
