'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCredentialForm } from '../hooks/use-credential-form';

export function CredentialForm() {
  const { state, updateField, handleCreate, fillExample, walletAddress, ownerDid } =
    useCredentialForm();

  return !walletAddress ? (
    <div className="rounded border p-6 md:p-8 min-h-[20vh] flex flex-col items-center justify-center text-center">
      <p className="text-base">Connect your wallet to begin.</p>
    </div>
  ) : (
    <div className="rounded border p-6 md:p-8 space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={fillExample}>
          Fill Example
        </Button>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Issuer DID (your DID)</label>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Issuer DID info"
            onClick={() => updateField('openIssuerDidInfo', true)}
          >
            !
          </Button>
        </div>
        <input className="w-full border rounded p-2" value={ownerDid || ''} readOnly />
        <Dialog
          open={state.openIssuerDidInfo}
          onOpenChange={(open) => updateField('openIssuerDidInfo', open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issuer DID</DialogTitle>
              <DialogDescription>
                Comes from your connected wallet and is read-only.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Issuer name</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Issuer name info"
              onClick={() => updateField('openIssuerNameInfo', true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={state.issuerName}
            onChange={(e) => updateField('issuerName', e.target.value)}
            placeholder="Example University"
          />
          <Dialog
            open={state.openIssuerNameInfo}
            onOpenChange={(open) => updateField('openIssuerNameInfo', open)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Issuer name</DialogTitle>
                <DialogDescription>
                  Name of the issuing organization (e.g., Example University).
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Subject (holder) DID</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Subject DID info"
              onClick={() => updateField('openSubjectDidInfo', true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={state.subjectDid}
            onChange={(e) => updateField('subjectDid', e.target.value)}
            placeholder="did:pkh:stellar:testnet:GAGPI5M5M4CZHQPZSTXOWX4J6UQMUJWFKACPXDRQMZTK43GPOSPW6NVU"
          />
          <Dialog
            open={state.openSubjectDidInfo}
            onOpenChange={(open) => updateField('openSubjectDidInfo', open)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subject (holder) DID</DialogTitle>
                <DialogDescription>The DID of the credential holder (recipient).</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Credential type</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Credential type info"
              onClick={() => updateField('openCredentialTypeInfo', true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={state.degreeType}
            onChange={(e) => updateField('degreeType', e.target.value)}
            placeholder="ExampleBachelorDegree"
          />
          <Dialog
            open={state.openCredentialTypeInfo}
            onOpenChange={(open) => updateField('openCredentialTypeInfo', open)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Credential type</DialogTitle>
                <DialogDescription>
                  A concise type for the credential (e.g., ExampleBachelorDegree).
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Credential name</label>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Credential name info"
              onClick={() => updateField('openCredentialNameInfo', true)}
            >
              !
            </Button>
          </div>
          <input
            className="w-full border rounded p-2"
            value={state.degreeName}
            onChange={(e) => updateField('degreeName', e.target.value)}
            placeholder="Bachelor of Science and Arts"
          />
          <Dialog
            open={state.openCredentialNameInfo}
            onOpenChange={(open) => updateField('openCredentialNameInfo', open)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Credential name</DialogTitle>
                <DialogDescription>
                  Human-readable name of the credential (e.g., Bachelor of Science and Arts).
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="pt-2">
        <Button
          className="!bg-white text-black hover:text-gray-95  0 hover:bg-gray-200 font-medium w-full"
          onClick={handleCreate}
          variant="outline"
          disabled={!walletAddress}
        >
          Create Credential
        </Button>
      </div>
      {state.txId && (
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Transaction submitted successfully.</p>
        </div>
      )}
    </div>
  );
}
