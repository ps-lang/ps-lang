# Attestation & Verification Specification

<~.
meta-tags: {
  "doc_type": "technical-spec",
  "component": "attestation",
  "version": "0.1",
  "date": "2025-10-01",
  "scope": "hash-verification-stub"
}
~.>

---

## Purpose

Provide cryptographic proof that a simulation run used specific parameters, enabling reproducibility verification.

---

## Alpha Implementation (Stub)

**Status:** Display-only (no backend storage or verification yet)

**Goal:** Show UI/UX for attestation system that will be fully implemented in Beta

---

## Attestation Flow

### 1. Run Generation

```typescript
interface AttestationInput {
  seed: number;
  model: string;
  scenario: string;
  pslang: boolean;
  metrics: {
    tokensIn: number;
    tokensOut: number;
    latencyMs: number;
    rounds: number;
    toolCalls: number;
    costUsd: number;
  };
}

function generateAttestation(input: AttestationInput): {
  digest: string;
  fullDigest: string;
  bundle: string;
} {
  // Serialize input deterministically
  const canonical = JSON.stringify(input, Object.keys(input).sort());

  // Generate SHA-256 hash
  const fullDigest = await sha256(canonical);

  // Truncate for display
  const digest = `${fullDigest.substring(0, 8)}…${fullDigest.substring(61, 64)}`;

  // Bundle reference (stub - would be UUID or storage key)
  const bundle = "private_ref";

  return { digest, fullDigest, bundle };
}
```

### 2. Display in UI

**Attestation Pill:**

```
┌──────────────────────────┐
│ Digest e7b1ca42…9ac · 🔍 │  ← Click to verify
└──────────────────────────┘
```

**Tooltip:**
> "Cryptographic proof of simulation parameters. Click to verify reproducibility."

### 3. Verification Modal (Stub)

**Trigger:** User clicks "🔍 Verify" button

**Modal Content:**

```
┌─────────────────────────────────────────┐
│ Attestation Verification                │
├─────────────────────────────────────────┤
│                                         │
│ Full Digest:                            │
│ e7b1ca42f8d3e5a6c9b2d8f1a4e7c3b9...    │
│ ...e2d5f8a1c4b7e0d3f6a9c2e5b8d1f4a79ac │
│                                         │
│ Parameters:                             │
│  • Seed: 42                             │
│  • Model: claude-sonnet-4.5             │
│  • Scenario: multi-tool-agent           │
│  • PS-LANG: Enabled                     │
│                                         │
│ Metrics Snapshot:                       │
│  • Tokens: 14,600 (12,450 in / 2,150 out)│
│  • Latency: 3,280ms                     │
│  • Rounds: 1                            │
│  • Tool Calls: 7                        │
│  • Cost: $0.83                          │
│                                         │
│ ⚠️ Alpha: Verification not yet          │
│    implemented. Use same seed + params  │
│    to reproduce results manually.       │
│                                         │
│ [Copy Full Digest] [Close]              │
└─────────────────────────────────────────┘
```

---

## Beta Implementation (Planned)

### Storage

**Backend:** Convex or similar
**Storage:** Bundle documents containing:

```typescript
interface AttestationBundle {
  id: string; // UUID
  created: string; // ISO 8601
  digest: string; // Full SHA-256
  input: AttestationInput; // Full parameters
  disclosure: 'public' | 'passthrough' | 'private_demo';
  owner?: string; // User ID (if authenticated)
}
```

### Verification API

```typescript
async function verifyAttestation(
  digest: string
): Promise<{
  valid: boolean;
  bundle?: AttestationBundle;
  error?: string;
}> {
  // Fetch bundle by digest
  const bundle = await db.bundles.find({ digest });

  if (!bundle) {
    return { valid: false, error: "Digest not found" };
  }

  // Recompute hash from stored input
  const recomputed = await sha256(
    JSON.stringify(bundle.input, Object.keys(bundle.input).sort())
  );

  // Compare
  if (recomputed !== digest) {
    return { valid: false, error: "Hash mismatch" };
  }

  return { valid: true, bundle };
}
```

### Verification Flow

```
1. User clicks "Verify" on digest
2. Frontend calls /api/verify?digest=e7b1ca42...
3. Backend looks up bundle in DB
4. Backend recomputes hash from stored params
5. Backend compares recomputed vs provided digest
6. Return { valid: true/false, bundle }
7. Frontend displays verification result
```

**Success:**
```
✅ Verified
This attestation is valid. Parameters match the stored bundle.
```

**Failure:**
```
❌ Invalid
Hash mismatch. Parameters may have been tampered with.
```

**Not Found:**
```
⚠️ Not Found
This digest is not in our database. It may be from a different instance or expired.
```

---

## SHA-256 Implementation

### Browser (Web Crypto API)

```typescript
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
```

### Node.js (crypto module)

```typescript
import { createHash } from 'crypto';

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}
```

---

## Canonical Serialization

**Important:** Must be deterministic for reproducible hashes

```typescript
function canonicalize(obj: any): string {
  // Sort keys alphabetically
  const sorted = Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as any);

  // Stringify without whitespace
  return JSON.stringify(sorted);
}
```

**Example:**

```typescript
const input = {
  seed: 42,
  model: "claude-sonnet-4.5",
  scenario: "multi-tool-agent",
  pslang: true,
  metrics: { tokensIn: 12450, tokensOut: 2150, ... }
};

const canonical = canonicalize(input);
// {"metrics":{...},"model":"claude-sonnet-4.5","pslang":true,"scenario":"multi-tool-agent","seed":42}

const digest = await sha256(canonical);
// e7b1ca42f8d3e5a6c9b2d8f1a4e7c3b9e2d5f8a1c4b7e0d3f6a9c2e5b8d1f4a79ac
```

---

## Digest Truncation

### Public Display

**Format:** `{first8}…{last3}`

**Example:**
- Full: `e7b1ca42f8d3e5a6c9b2d8f1a4e7c3b9e2d5f8a1c4b7e0d3f6a9c2e5b8d1f4a79ac`
- Truncated: `e7b1ca42…9ac`

**Rationale:**
- Readable (doesn't overwhelm UI)
- Still unique enough for lookup
- Full digest available on click

### Private Display

**Format:** Full 64-character hex

**When:** Private disclosure level or verification modal

---

## Export Integration

### CSV Export

```csv
run_id,seed,model,scenario,pslang,tokens_in,...,attest_digest
sim-42-l8k9m2n,42,claude-sonnet-4.5,multi-tool-agent,true,12450,...,e7b1ca42…9ac
```

### JSON Export

```json
{
  "run_id": "sim-42-l8k9m2n",
  ...
  "attest": {
    "digest": "e7b1ca42…9ac",
    "bundle": "private_ref"
  }
}
```

**Private disclosure adds:**

```json
{
  "attest": {
    "digest": "e7b1ca42…9ac",
    "bundle": "private_ref",
    "full_digest": "e7b1ca42f8d3e5a6c9b2d8f1a4e7c3b9e2d5f8a1c4b7e0d3f6a9c2e5b8d1f4a79ac"
  }
}
```

---

## UI Components

### Attestation Pill

```tsx
interface AttestationPillProps {
  digest: string;
  onClick: () => void;
}

function AttestationPill({ digest, onClick }: AttestationPillProps) {
  return (
    <button
      onClick={onClick}
      className="attestation-pill"
      aria-label="View attestation details"
    >
      <span>Digest {digest}</span>
      <span aria-hidden="true">🔍</span>
    </button>
  );
}
```

**Styles:**
```css
.attestation-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  cursor: pointer;
  transition: background 200ms ease;
}

.attestation-pill:hover {
  background: #eee;
}
```

### Verification Modal (Stub)

```tsx
function VerificationModal({
  digest,
  fullDigest,
  params,
  metrics,
  onClose
}: VerificationModalProps) {
  return (
    <Modal open={true} onClose={onClose}>
      <h2>Attestation Verification</h2>

      <section>
        <h3>Full Digest</h3>
        <code className="digest-display">{fullDigest}</code>
      </section>

      <section>
        <h3>Parameters</h3>
        <ul>
          <li>Seed: {params.seed}</li>
          <li>Model: {params.model}</li>
          <li>Scenario: {params.scenario}</li>
          <li>PS-LANG: {params.pslang ? 'Enabled' : 'Disabled'}</li>
        </ul>
      </section>

      <section>
        <h3>Metrics Snapshot</h3>
        <ul>
          <li>Tokens: {metrics.tokensIn + metrics.tokensOut} ({metrics.tokensIn} in / {metrics.tokensOut} out)</li>
          <li>Latency: {metrics.latencyMs}ms</li>
          <li>Rounds: {metrics.rounds}</li>
          <li>Tool Calls: {metrics.toolCalls}</li>
          <li>Cost: ${metrics.costUsd}</li>
        </ul>
      </section>

      <Alert severity="warning">
        Alpha: Verification not yet implemented. Use same seed + params to reproduce results manually.
      </Alert>

      <footer>
        <Button onClick={() => navigator.clipboard.writeText(fullDigest)}>
          Copy Full Digest
        </Button>
        <Button onClick={onClose} variant="secondary">Close</Button>
      </footer>
    </Modal>
  );
}
```

---

## Security Considerations

### What Attestation Proves

✅ **Proves:**
- Parameters used for simulation
- Results are reproducible with same seed
- Data integrity (no tampering after generation)

❌ **Does NOT prove:**
- Simulation logic correctness
- Formula accuracy
- Real-world API behavior

### Collision Resistance

**SHA-256:** 2^256 possible hashes
**Collision probability:** ~2^-128 (negligible)

**Truncated display:** Still 2^44 possibilities (first 8 hex + last 3 hex)
- Sufficient for lookup in reasonably-sized database
- Full digest used for verification

### Threat Model

**Alpha (stub):**
- No server storage → no verification possible
- Digest is cosmetic (demonstrates future UX)

**Beta (planned):**
- Server stores bundles → lookup verification
- Client recomputes hash → detects tampering
- No cryptographic signing (trust in server storage)

**v1.0 (aspirational):**
- Digital signatures (private key signing)
- Timestamping service integration
- Distributed verification (IPFS or similar)

---

## Copy & Messaging

### Attestation Pill Tooltip

> "Cryptographic proof of simulation parameters. Click to verify reproducibility."

### Verification Modal (Alpha)

**Header:**
> "Attestation Verification"

**Warning:**
> "⚠️ Alpha: Verification not yet implemented. Use same seed + params to reproduce results manually."

**Success (Beta):**
> "✅ Verified. This attestation is valid. Parameters match the stored bundle."

**Failure (Beta):**
> "❌ Invalid. Hash mismatch. Parameters may have been tampered with."

**Not Found (Beta):**
> "⚠️ Not Found. This digest is not in our database. It may be from a different instance or expired."

---

## Acceptance Criteria

<@. Validation checklist @.>

### Alpha (Stub)

- [ ] Digest generated for every run
- [ ] Truncated digest displays in pill
- [ ] Pill is clickable (shows verification modal)
- [ ] Verification modal shows full digest + params
- [ ] Warning indicates verification not implemented
- [ ] Copy button copies full digest to clipboard
- [ ] Digest included in CSV/JSON exports

### Beta (Planned)

- [ ] Backend stores attestation bundles
- [ ] API endpoint accepts digest, returns bundle
- [ ] Recomputes hash from stored params
- [ ] Compares recomputed vs provided digest
- [ ] Returns verification result (valid/invalid/not-found)
- [ ] UI displays verification status with icon
- [ ] Invalid attestations trigger warning

### v1.0 (Future)

- [ ] Digital signatures with private key
- [ ] Public key verification
- [ ] Timestamping service integration
- [ ] Distributed storage (IPFS)
- [ ] Batch verification API

---

<.bm attestation-spec
alpha_status: stub-only
hash_algorithm: SHA-256
truncation: first8-last3
beta_backend: planned
v1_signing: aspirational
.bm>
