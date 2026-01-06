'use client';

import { Button } from '@/components/ui/button';
import { useVaultSetup } from '../hooks/use-vault-setup';
import { Copy, Check } from 'lucide-react';

export function VaultSetupCard() {
  const { walletAddress, ownerDid, state, doCreateVault, copyToClipboard } = useVaultSetup();

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Wallet */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Wallet</label>
            <div className="flex items-center gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
              <code className="text-white font-mono text-sm flex-1 break-all">
                {walletAddress || 'Not connected'}
              </code>
              {walletAddress && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 h-8 w-8 p-0 hover:bg-white/10"
                  onClick={() => copyToClipboard(walletAddress, 'wallet')}
                >
                  {state.copiedWallet ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Owner DID */}
          <div>
            <label className="text-sm font-medium text-gray-400 mb-3 block">Owner DID</label>
            <div className="flex items-center gap-3 bg-black/40 rounded-lg p-4 border border-white/5">
              <code className="text-white font-mono text-sm flex-1 break-all">
                {ownerDid || '—'}
              </code>
              {ownerDid && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 h-8 w-8 p-0 hover:bg-white/10"
                  onClick={() => copyToClipboard(ownerDid, 'did')}
                >
                  {state.copiedDID ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="bg-white text-black hover:bg-gray-200 font-medium w-full"
        onClick={doCreateVault}
        disabled={!walletAddress || state.loading}
      >
        Create Vault
      </Button>
    </div>
  );
}
