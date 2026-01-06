'use client';

import { ActaConfig, testNet } from '@acta-team/acta-sdk';
import { ReactNode } from 'react';

interface ActaConfigProviderProps {
  children: ReactNode;
  testnetApiKey: string;
}

/**
 * Client component that receives API key from server and configures SDK for testnet only.
 */
export function ActaConfigProvider({ children, testnetApiKey }: ActaConfigProviderProps) {
  // Always use testnet
  const baseURL = testNet;
  const apiKey = testnetApiKey;

  // API key is required - validate before rendering
  if (!apiKey || apiKey.trim() === '') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            API Key Required
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            API key is required for testnet. Please set it in your{' '}
            <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">.env</code> file:
          </p>
          <pre className="bg-red-100 dark:bg-red-900 p-3 rounded text-xs overflow-auto">
            {`ACTA_API_KEY_TESTNET=your-testnet-api-key

# Or use a single key:
# ACTA_API_KEY=your-api-key`}
          </pre>
          <p className="text-xs text-red-600 dark:text-red-400 mt-4">
            Get your API key from{' '}
            <a
              href="https://dapp.acta.build"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://dapp.acta.build
            </a>{' '}
            or create one via:
            <br />- POST /testnet/public/api-keys (for testnet)
          </p>
        </div>
      </div>
    );
  }

  return (
    <ActaConfig baseURL={baseURL} apiKey={apiKey}>
      {children}
    </ActaConfig>
  );
}
