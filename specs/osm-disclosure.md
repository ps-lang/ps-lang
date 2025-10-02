# OSM Disclosure Policy

<~.
meta-tags: {
  "doc_type": "policy-spec",
  "component": "osm-disclosure",
  "version": "0.1",
  "date": "2025-10-01",
  "scope": "disclosure-levels-matrix"
}
~.>

---

## Purpose

Defines what OSM (One-Shot Metric) components are disclosed at each level: **Public**, **Pass-through**, and **Private Demo**.

---

## Disclosure Philosophy

<$. Core principle $.>

**Public** = Community-safe, protects IP, enables basic benchmarking

**Pass-through** = Collaborator-friendly, useful for integration partners

**Private** = Full transparency for audits, negotiations, internal use

---

## Disclosure Matrix

### Public Level

**Who:** Anyone using the playground or viewing exported data

**What's Disclosed:**

| Component | Disclosed | Example |
|-----------|-----------|---------|
| OSM Score (public) | ✅ Yes | `0.68` |
| Confidence Band | ✅ Yes | `0.65–0.71` |
| Δ Tokens | ✅ Yes | `-0.21` (21% reduction) |
| Δ Latency | ✅ Yes | `-0.18` (18% reduction) |
| Δ Rounds | ✅ Yes | `-0.75` (75% reduction) |
| Δ Cost | ✅ Yes | `-0.24` (24% reduction) |
| Formula Skeleton | ✅ Yes | `Σ(w_i * Δi) * Q − λP` |
| Profile Name | ✅ Yes | `retriever.v1` |
| Attestation Digest | ✅ Yes | `e7b1ca42…9ac` (truncated) |
| Weights (w_i) | ❌ No | Hidden |
| Quality Gate (Q) | ❌ No | Hidden |
| Penalty (λ, P) | ❌ No | Hidden |
| Δ Tool-chatter | ❌ No | Hidden |
| Δ Bleed | ❌ No | Hidden |
| Full Digest | ❌ No | Truncated only |

**UI Display:**

```
┌──────────────────────────────┐
│ OSM Score: 0.68              │
│ Band: 0.65–0.71              │
│ Profile: retriever.v1        │
│                              │
│ Formula: Σ(w_i * Δi) * Q − λP│
│                              │
│ Deltas:                      │
│  • Tokens: -21%              │
│  • Latency: -18%             │
│  • Rounds: -75%              │
│  • Cost: -24%                │
│                              │
│ Attestation: e7b1ca42…9ac    │
└──────────────────────────────┘
```

**Export Format (JSON):**

```json
{
  "osm": {
    "score_public": 0.68,
    "band": "0.65–0.71",
    "formula_public": "Σ(w_i * Δi) * Q − λP",
    "profile": "retriever.v1"
  },
  "deltas_vs_no_ps": {
    "tokens": -0.21,
    "latency": -0.18,
    "rounds": -0.75,
    "cost": -0.24
  },
  "attest": {
    "digest": "e7b1ca42…9ac",
    "bundle": "private_ref"
  }
}
```

---

### Pass-through Level

**Who:** Collaborators, integration partners, researchers with access

**What's Disclosed (Adds to Public):**

| Component | Disclosed | Example |
|-----------|-----------|---------|
| **All Public fields** | ✅ Yes | (see above) |
| Coarse Weights | ✅ Yes | `{tokens: 0.35, latency: 0.15, rounds: 0.15}` |
| Quality Min (q_min) | ✅ Yes | `0.75` |
| Eval Suite ID | ✅ Yes | `ps-lang-alpha-v1` |
| Δ Tool-chatter | ✅ Yes | `-0.18` (18% reduction) |
| Full Weights | ❌ No | Still hidden |
| Penalty Details (λ, P) | ❌ No | Still hidden |
| Δ Bleed | ❌ No | Still hidden |
| Full Digest | ❌ No | Truncated only |

**UI Display (Additional Fields):**

```
┌──────────────────────────────────┐
│ OSM Score: 0.68                  │
│ Band: 0.65–0.71                  │
│ Profile: retriever.v1            │
│                                  │
│ Formula: Σ(w_i * Δi) * Q − λP    │
│                                  │
│ Coarse Weights:                  │
│  • w_tokens: 0.35                │
│  • w_latency: 0.15               │
│  • w_rounds: 0.15                │
│                                  │
│ Quality Min: 0.75                │
│ Eval Suite: ps-lang-alpha-v1     │
│                                  │
│ Deltas:                          │
│  • Tokens: -21%                  │
│  • Latency: -18%                 │
│  • Rounds: -75%                  │
│  • Cost: -24%                    │
│  • Tool-chatter: -18%            │
│                                  │
│ Attestation: e7b1ca42…9ac        │
└──────────────────────────────────┘
```

**Export Format (JSON):**

```json
{
  "osm": {
    "score_public": 0.68,
    "band": "0.65–0.71",
    "formula_public": "Σ(w_i * Δi) * Q − λP",
    "profile": "retriever.v1",
    "coarse_weights": {
      "tokens": 0.35,
      "latency": 0.15,
      "rounds": 0.15
    },
    "q_min": 0.75,
    "eval_suite_id": "ps-lang-alpha-v1"
  },
  "deltas_vs_no_ps": {
    "tokens": -0.21,
    "latency": -0.18,
    "rounds": -0.75,
    "cost": -0.24,
    "tool": -0.18
  },
  "attest": {
    "digest": "e7b1ca42…9ac",
    "bundle": "private_ref"
  }
}
```

---

### Private Demo Level

**Who:** Internal use only, audits, potential investors/partners (NDA)

**What's Disclosed (Adds to Pass-through):**

| Component | Disclosed | Example |
|-----------|-----------|---------|
| **All Pass-through fields** | ✅ Yes | (see above) |
| Full Weights | ✅ Yes | `{tokens: 0.35, latency: 0.15, rounds: 0.20, tool: 0.10, bleed: 0.20}` |
| Quality Gate (Q) | ✅ Yes | `0.94` |
| Penalty Coefficient (λ) | ✅ Yes | `0.08` |
| Penalty Value (P) | ✅ Yes | `0.22` |
| Δ Bleed | ✅ Yes | `+0.35` (35% improvement in context isolation) |
| Full Digest | ✅ Yes | `e7b1ca42f8d3e5a6c9b2d8f1a4e7c3b9e2d5f8a1c4b7e0d3f6a9c2e5b8d1f4a79ac` |
| Raw Eval Signals | ✅ Yes | Internal metrics not shown in demo |

**UI Display (Additional Fields):**

```
┌────────────────────────────────────────┐
│ ⚠️ PRIVATE DEMO - FULL PRECISION       │
├────────────────────────────────────────┤
│ OSM Score: 0.68                        │
│ Band: 0.65–0.71                        │
│ Profile: retriever.v1                  │
│                                        │
│ Formula: Σ(w_i * Δi) * Q − λP          │
│                                        │
│ Full Weights (Σ = 1.0):                │
│  • w_tokens: 0.35                      │
│  • w_latency: 0.15                     │
│  • w_rounds: 0.20                      │
│  • w_tool: 0.10                        │
│  • w_bleed: 0.20                       │
│                                        │
│ Quality Gate: Q = 0.94                 │
│ Penalty: λ = 0.08, P = 0.22            │
│ Quality Min: 0.75                      │
│ Eval Suite: ps-lang-alpha-v1           │
│                                        │
│ Deltas (All):                          │
│  • Tokens: -21%                        │
│  • Latency: -18%                       │
│  • Rounds: -75%                        │
│  • Cost: -24%                          │
│  • Tool-chatter: -18%                  │
│  • Bleed (isolation): +35%             │
│                                        │
│ Full Attestation:                      │
│  e7b1ca42f8d3e5a6...d1f4a79ac          │
└────────────────────────────────────────┘
```

**Export Format (JSON):**

```json
{
  "osm": {
    "score_public": 0.68,
    "band": "0.65–0.71",
    "formula_public": "Σ(w_i * Δi) * Q − λP",
    "profile": "retriever.v1",
    "coarse_weights": {
      "tokens": 0.35,
      "latency": 0.15,
      "rounds": 0.15
    },
    "q_min": 0.75,
    "eval_suite_id": "ps-lang-alpha-v1",
    "private_metadata": {
      "full_weights": {
        "tokens": 0.35,
        "latency": 0.15,
        "rounds": 0.20,
        "tool": 0.10,
        "bleed": 0.20
      },
      "lambda": 0.08,
      "P": 0.22,
      "Q": 0.94
    }
  },
  "deltas_vs_no_ps": {
    "tokens": -0.21,
    "latency": -0.18,
    "rounds": -0.75,
    "cost": -0.24,
    "tool": -0.18,
    "bleed": 0.35
  },
  "attest": {
    "digest": "e7b1ca42…9ac",
    "bundle": "private_ref",
    "full_digest": "e7b1ca42f8d3e5a6c9b2d8f1a4e7c3b9e2d5f8a1c4b7e0d3f6a9c2e5b8d1f4a79ac"
  }
}
```

**⚠️ Important:** Private metadata is **NEVER exported publicly**. Demo shows it in UI only for transparency illustration.

---

## Disclosure Level Chips

### Visual Design

```
┌─────────────────────┐
│ 🔓 Public           │  ← Neutral gray
└─────────────────────┘

┌─────────────────────┐
│ 🔗 Pass-through     │  ← Blue info
└─────────────────────┘

┌─────────────────────┐
│ ⚠️ Private (Demo)   │  ← Amber warning
└─────────────────────┘
```

### Tooltips

**Public:**
> "Basic OSM score and deltas. Safe for public sharing and benchmarking."

**Pass-through:**
> "Includes coarse weights and eval suite. Useful for collaborators integrating PS-LANG."

**Private (Demo):**
> "Full precision weights and penalty details. For demonstration only—not exported publicly."

---

## Implementation Rules

### Frontend Visibility

```typescript
type DisclosureLevel = 'public' | 'passthrough' | 'private_demo';

function getVisibleFields(level: DisclosureLevel): string[] {
  const fields = {
    public: [
      'osm.score_public',
      'osm.band',
      'osm.formula_public',
      'osm.profile',
      'deltas_vs_no_ps.tokens',
      'deltas_vs_no_ps.latency',
      'deltas_vs_no_ps.rounds',
      'deltas_vs_no_ps.cost',
      'attest.digest'
    ],
    passthrough: [
      ...fields.public,
      'osm.coarse_weights',
      'osm.q_min',
      'osm.eval_suite_id',
      'deltas_vs_no_ps.tool'
    ],
    private_demo: [
      ...fields.passthrough,
      'osm.private_metadata.full_weights',
      'osm.private_metadata.lambda',
      'osm.private_metadata.P',
      'osm.private_metadata.Q',
      'deltas_vs_no_ps.bleed',
      'attest.full_digest'
    ]
  };

  return fields[level];
}
```

### Export Filtering

```typescript
function filterExportByDisclosure(
  data: SimulationRun,
  level: DisclosureLevel
): Partial<SimulationRun> {
  const exported = { ...data };

  if (level === 'public') {
    delete exported.osm.coarse_weights;
    delete exported.osm.q_min;
    delete exported.osm.eval_suite_id;
    delete exported.osm.private_metadata;
    delete exported.deltas_vs_no_ps.tool;
    delete exported.deltas_vs_no_ps.bleed;
    delete exported.attest.full_digest;
  } else if (level === 'passthrough') {
    delete exported.osm.private_metadata;
    delete exported.deltas_vs_no_ps.bleed;
    delete exported.attest.full_digest;
  }
  // private_demo: export everything (but warn it's for demo only)

  return exported;
}
```

---

## Profile Registry

### Profile Naming Convention

**Format:** `<use-case>.<version>`

**Examples:**
- `retriever.v1` - RAG/retrieval-focused workflows
- `multi-tool.v1` - Complex tool-calling agents
- `long-context.v1` - Large context window scenarios
- `generic.v1` - Balanced, general-purpose

### Profile Metadata (Private)

```json
{
  "retriever.v1": {
    "weights": {
      "tokens": 0.35,
      "latency": 0.15,
      "rounds": 0.20,
      "tool": 0.10,
      "bleed": 0.20
    },
    "q_min": 0.75,
    "lambda": 0.08,
    "P": 0.22,
    "Q": 0.94,
    "description": "Optimized for RAG workflows with high round-reduction emphasis",
    "eval_suite": "ps-lang-alpha-v1",
    "created": "2025-10-01"
  }
}
```

**Public profile registry (published):**
```
retriever.v1 - RAG/retrieval workflows
multi-tool.v1 - Complex tool-calling agents
long-context.v1 - Large context scenarios
generic.v1 - Balanced general-purpose
```

---

## Compliance & Safety

<@. Export rules @.>

### Public Export Rules

- ✅ **DO** include OSM score, band, deltas
- ✅ **DO** include profile name (e.g., `retriever.v1`)
- ✅ **DO** include truncated digest
- ❌ **DON'T** include full weights
- ❌ **DON'T** include penalty coefficients
- ❌ **DON'T** include bleed metrics
- ❌ **DON'T** include full SHA-256 digest

### Pass-through Export Rules

- ✅ **DO** include coarse weights (3 disclosed terms only)
- ✅ **DO** include quality minimum
- ✅ **DO** include eval suite ID
- ✅ **DO** include tool-chatter delta
- ❌ **DON'T** include full weights (all 5 terms)
- ❌ **DON'T** include penalty details
- ❌ **DON'T** include bleed delta

### Private Demo Rules

- ✅ **DO** show all fields in UI for demonstration
- ⚠️ **WARN** that private data is not exported publicly
- ✅ **DO** allow download for internal use (NDA contexts)
- ❌ **DON'T** allow public sharing of private exports

---

## User-Facing Copy

### Disclosure Selector Label

```
Disclosure Level: [ Public ▼ ]
```

### Help Text

```
Choose how much OSM detail to show:

• Public - Basic score & deltas (safe for sharing)
• Pass-through - + Coarse weights (for partners)
• Private - Full precision (demo only, not exported publicly)
```

---

## Acceptance Criteria

<@. Validation checklist @.>

- [ ] Public export excludes all weights, penalties, bleed
- [ ] Pass-through export includes only 3 coarse weights
- [ ] Private demo shows all fields in UI but warns on export
- [ ] Disclosure chip color matches level (gray/blue/amber)
- [ ] Profile names are human-readable and versioned
- [ ] Attestation digest is truncated in public view
- [ ] CSV export respects disclosure level filtering
- [ ] JSON export respects disclosure level filtering
- [ ] Methodology export explains disclosure policy

---

<.bm osm-disclosure-spec
disclosure_levels: 3
fields_public: 9
fields_passthrough: 13
fields_private: 18
profiles: 4
.bm>
