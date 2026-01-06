# ACTA Demo

This demo showcases how to integrate the ACTA SDK with a Next.js application using a Stellar wallet (Freighter). It demonstrates how to issue, store, and manage Verifiable Credentials (VC) via ACTA using the official React SDK.

## What this demo includes

- Wallet-gated UI with simple flows: Vault, Authorized Issuers, DID, and Credential creation.
- Client-signed transactions using `@creit.tech/stellar-wallets-kit`.
- Integration with `@acta-team/acta-sdk` React hooks for all ACTA operations.
- Testnet-only configuration (no mainnet support).

## Prerequisites

- Install Freighter: https://www.freighter.app/
- Node.js 18 or newer
- An ACTA API key for testnet

## Environment Setup

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your ACTA API key:

```env
ACTA_API_KEY_TESTNET=your-testnet-api-key-here
```

### Getting an API Key

Get your API key from:

- https://dapp.acta.build

### Optional Configuration

- `WALLETCONNECT_PROJECT_ID`: Only needed if you want WalletConnect support. Get one from https://cloud.walletconnect.com

The demo automatically fetches RPC URL, network passphrase, and contract IDs from the ACTA API (`GET /config`). No need to set `NEXT_PUBLIC_*` environment variables unless you need to override defaults.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## SDK Integration

The demo uses the `@acta-team/acta-sdk` React hooks for all ACTA operations:

### Vault Operations

```ts
import { useVault } from '@acta-team/acta-sdk';

const { createVault, authorizeIssuer, revokeIssuer } = useVault();

// Create a vault
const { txId } = await createVault({
  owner: walletAddress,
  ownerDid: 'did:pkh:stellar:testnet:...',
  signTransaction,
});

// Authorize an issuer
await authorizeIssuer({
  owner: walletAddress,
  issuer: issuerAddress,
  signTransaction,
});
```

### Credential Operations

```ts
import { useCredential } from '@acta-team/acta-sdk';

const { issue, revoke } = useCredential();

// Issue a credential (stores in vault and marks as valid)
const { txId } = await issue({
  owner: walletAddress,
  vcId: 'vc:example:123',
  vcData: JSON.stringify({ type: 'VerifiableCredential', ... }),
  issuer: walletAddress,
  issuerDid: 'did:pkh:stellar:testnet:...',
  signTransaction,
});
```

### Read Operations

```ts
import { useVaultRead } from '@acta-team/acta-sdk';

const { listVcIds, getVc, verifyVc } = useVaultRead();

// List all VC IDs
const ids = await listVcIds({ owner: walletAddress });

// Get a specific VC
const vc = await getVc({ owner: walletAddress, vcId: 'vc:example:123' });

// Verify a VC
const verification = await verifyVc({ owner: walletAddress, vcId: 'vc:example:123' });
```

All hooks require the `ActaConfig` provider to be set up (see `src/components/ActaConfigServer.tsx`), which automatically configures the SDK with your API key and network settings.

## Project Structure

- `src/components/ActaConfigServer.tsx` - Server component that reads API keys from environment
- `src/components/ActaConfigProvider.tsx` - Client component that configures the SDK
- `src/providers/network.provider.tsx` - Network context (testnet only)
- `src/providers/wallet.provider.tsx` - Wallet connection and signing
- `src/app/demo/` - Demo pages demonstrating SDK usage
  - `vault/` - Vault creation and management
  - `issuers/` - Issuer authorization
  - `credentials/` - Credential issuance
  - `vault/list/` - List stored credentials
  - `vault/get/` - Get a specific credential

## Documentation

- ACTA Documentation: https://docs.acta.build
- React SDK Docs: https://docs.acta.build/react-sdk
- API Reference: https://docs.acta.build/api-reference
- Testnet API: `https://api.testnet.acta.build`

## Notes

- **Testnet Only**: This demo is configured for testnet only. No mainnet support.
- **API Key Required**: You must set `ACTA_API_KEY_TESTNET` or `ACTA_API_KEY` in your `.env.local` file.
- **Network Configuration**: The SDK automatically fetches network settings (RPC URL, passphrase, contract IDs) from the API. No manual configuration needed.
- **Security**: Do not store PII in plaintext on chain; prefer hashes or ciphertext.
- **Wallet**: Make sure Freighter is installed and set to Testnet mode.
