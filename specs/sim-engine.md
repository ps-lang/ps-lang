# PS-LANG Playground Simulation Engine Specification

<~.
meta-tags: {
  "doc_type": "technical-spec",
  "component": "simulation-engine",
  "version": "0.1",
  "date": "2025-10-01",
  "scope": "rng-scenarios-formulas"
}
~.>

---

## Purpose

Deterministic simulation engine for PS-LANG playground that generates reproducible metrics across scenarios with controlled noise, demonstrating PS-LANG effectiveness deltas.

---

## Seeded RNG

### Implementation

```typescript
class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear Congruential Generator (LCG)
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  // Box-Muller transform for normal distribution
  normal(mean: number = 0, stddev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z0 * stddev;
  }

  // Uniform range
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Integer range
  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}
```

---

## Scenarios Configuration

### Base Metrics (without PS-LANG)

```typescript
type ScenarioConfig = {
  name: string;
  tokens: { min: number; max: number }; // total tokens (in + out)
  latency: { min: number; max: number }; // seconds
  rounds: { min: number; max: number }; // agent handoffs
  toolCalls?: { min: number; max: number }; // for multi-tool scenario
};

const SCENARIOS: Record<string, ScenarioConfig> = {
  'rag-qa': {
    name: 'RAG Q&A',
    tokens: { min: 18000, max: 55000 },
    latency: { min: 2.2, max: 3.6 },
    rounds: { min: 3, max: 4 }
  },
  'multi-tool-agent': {
    name: 'Multi-Tool Agent',
    tokens: { min: 10000, max: 25000 },
    latency: { min: 2.8, max: 4.2 },
    rounds: { min: 4, max: 6 },
    toolCalls: { min: 5, max: 12 }
  },
  'long-context-chat': {
    name: 'Long-Context Chat',
    tokens: { min: 35000, max: 120000 },
    latency: { min: 2.6, max: 4.0 },
    rounds: { min: 3, max: 5 }
  }
};
```

### PS-LANG Reduction Ranges

```typescript
type ReductionConfig = {
  tokens: { min: number; max: number }; // % reduction
  latency: { min: number; max: number }; // % reduction
  rounds: { min: number; max: number }; // % reduction
  toolChatter?: { min: number; max: number }; // % reduction in redundant calls
};

const PS_LANG_REDUCTIONS: Record<string, ReductionConfig> = {
  'rag-qa': {
    tokens: { min: 0.18, max: 0.28 },
    latency: { min: 0.10, max: 0.16 },
    rounds: { min: 0.50, max: 0.75 }
  },
  'multi-tool-agent': {
    tokens: { min: 0.12, max: 0.22 },
    latency: { min: 0.12, max: 0.20 },
    rounds: { min: 0.50, max: 0.75 },
    toolChatter: { min: 0.15, max: 0.30 }
  },
  'long-context-chat': {
    tokens: { min: 0.14, max: 0.22 },
    latency: { min: 0.08, max: 0.14 },
    rounds: { min: 0.40, max: 0.60 }
  }
};
```

---

## Noise Model

**Specification:** ε ~ N(0, 0.02)

Small Gaussian noise (σ = 2%) applied to base metrics to simulate real-world variance while maintaining deterministic behavior with same seed.

```typescript
function applyNoise(value: number, rng: SeededRNG, sigma: number = 0.02): number {
  const noise = rng.normal(0, sigma);
  return value * (1 + noise);
}
```

---

## Metric Formulas

### Total Tokens

```typescript
function calculateTokens(scenario: string, rng: SeededRNG, usePSLang: boolean): {
  tokensIn: number;
  tokensOut: number;
  total: number;
} {
  const config = SCENARIOS[scenario];
  const baseTotal = Math.round(rng.range(config.tokens.min, config.tokens.max));

  let total = baseTotal;

  if (usePSLang) {
    const reduction = PS_LANG_REDUCTIONS[scenario];
    const reductionPct = rng.range(reduction.tokens.min, reduction.tokens.max);
    total = Math.round(baseTotal * (1 - reductionPct));
  }

  total = Math.round(applyNoise(total, rng));

  // Split 85/15 input/output ratio (typical for agent workflows)
  const tokensIn = Math.round(total * 0.85);
  const tokensOut = total - tokensIn;

  return { tokensIn, tokensOut, total };
}
```

### Latency

```typescript
function calculateLatency(scenario: string, rng: SeededRNG, usePSLang: boolean): number {
  const config = SCENARIOS[scenario];
  let latency = rng.range(config.latency.min, config.latency.max);

  if (usePSLang) {
    const reduction = PS_LANG_REDUCTIONS[scenario];
    const reductionPct = rng.range(reduction.latency.min, reduction.latency.max);
    latency *= (1 - reductionPct);
  }

  return applyNoise(latency, rng);
}
```

### Rounds

```typescript
function calculateRounds(scenario: string, rng: SeededRNG, usePSLang: boolean): number {
  const config = SCENARIOS[scenario];
  let rounds = rng.intRange(config.rounds.min, config.rounds.max);

  if (usePSLang) {
    const reduction = PS_LANG_REDUCTIONS[scenario];
    const reductionPct = rng.range(reduction.rounds.min, reduction.rounds.max);
    const reducedRounds = Math.max(1, Math.round(rounds * (1 - reductionPct)));
    rounds = reducedRounds;
  }

  return rounds;
}
```

### Tool Calls

```typescript
function calculateToolCalls(scenario: string, rng: SeededRNG, usePSLang: boolean): number {
  const config = SCENARIOS[scenario];

  if (!config.toolCalls) return 0;

  let toolCalls = rng.intRange(config.toolCalls.min, config.toolCalls.max);

  if (usePSLang && PS_LANG_REDUCTIONS[scenario].toolChatter) {
    const reduction = PS_LANG_REDUCTIONS[scenario].toolChatter!;
    const reductionPct = rng.range(reduction.min, reduction.max);
    toolCalls = Math.max(1, Math.round(toolCalls * (1 - reductionPct)));
  }

  return toolCalls;
}
```

### Cost

```typescript
// Model pricing per 1M tokens
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4.5': { input: 3.00, output: 15.00 },
  'gpt-5-nano': { input: 1.50, output: 7.50 },
  'gpt-5-thinking': { input: 5.00, output: 25.00 }
};

function calculateCost(model: string, tokensIn: number, tokensOut: number): number {
  const pricing = MODEL_PRICING[model];
  const costIn = (tokensIn / 1_000_000) * pricing.input;
  const costOut = (tokensOut / 1_000_000) * pricing.output;
  return costIn + costOut;
}
```

### Savings

```typescript
function calculateSavings(baseline: number, withPSLang: number): number {
  if (baseline === 0) return 0;
  return (baseline - withPSLang) / baseline;
}
```

---

## OSM Calculation

### Public Formula

```typescript
type OSMWeights = {
  tokens: number;
  latency: number;
  rounds: number;
  tool?: number;
  bleed?: number;
};

const OSM_WEIGHTS_COARSE: OSMWeights = {
  tokens: 0.35,
  latency: 0.15,
  rounds: 0.15
};

function calculateOSMPublic(deltas: {
  tokens: number;
  latency: number;
  rounds: number;
}): number {
  const Q = 0.94; // Quality gate (demo: always high)
  const lambda = 0.08;
  const P = 0.22; // Penalty (simulation uncertainty)

  const weightedSum =
    OSM_WEIGHTS_COARSE.tokens * deltas.tokens +
    OSM_WEIGHTS_COARSE.latency * deltas.latency +
    OSM_WEIGHTS_COARSE.rounds * deltas.rounds;

  return weightedSum * Q - lambda * P;
}
```

### Private (Full Precision)

```typescript
const OSM_WEIGHTS_FULL: OSMWeights = {
  tokens: 0.35,
  latency: 0.15,
  rounds: 0.20,
  tool: 0.10,
  bleed: 0.20
};

function calculateOSMPrivate(deltas: {
  tokens: number;
  latency: number;
  rounds: number;
  tool: number;
  bleed: number;
}): number {
  const Q = 0.94;
  const lambda = 0.08;
  const P = 0.22;

  const weightedSum =
    OSM_WEIGHTS_FULL.tokens * deltas.tokens +
    OSM_WEIGHTS_FULL.latency * deltas.latency +
    OSM_WEIGHTS_FULL.rounds * deltas.rounds +
    OSM_WEIGHTS_FULL.tool * deltas.tool +
    OSM_WEIGHTS_FULL.bleed * deltas.bleed;

  return weightedSum * Q - lambda * P;
}
```

### OSM Band Calculation

```typescript
function getOSMBand(score: number): string {
  const margin = 0.03; // ±3% band
  const lower = (score - margin).toFixed(2);
  const upper = (score + margin).toFixed(2);
  return `${lower}–${upper}`;
}
```

---

## Complete Simulation Run

```typescript
interface SimulationResult {
  runId: string;
  timestamp: string;
  seed: number;
  model: string;
  scenario: string;
  pslang: boolean;
  disclosure: 'public' | 'passthrough' | 'private_demo';
  metrics: {
    tokensIn: number;
    tokensOut: number;
    latencyMs: number;
    rounds: number;
    toolCalls: number;
    costUsd: number;
  };
  deltasVsNoPS: {
    tokens: number;
    latency: number;
    rounds: number;
    cost: number;
    tool?: number;
  };
  osm: {
    scorePublic: number;
    band: string;
    formulaPublic: string;
    profile: string;
  };
  attest: {
    digest: string;
    bundle: string;
  };
}

function runSimulation(
  seed: number,
  model: string,
  scenario: string,
  pslang: boolean,
  disclosure: 'public' | 'passthrough' | 'private_demo'
): SimulationResult {
  const rng = new SeededRNG(seed);

  // Generate metrics
  const tokens = calculateTokens(scenario, rng, pslang);
  const latency = calculateLatency(scenario, rng, pslang);
  const rounds = calculateRounds(scenario, rng, pslang);
  const toolCalls = calculateToolCalls(scenario, rng, pslang);
  const cost = calculateCost(model, tokens.tokensIn, tokens.tokensOut);

  // Calculate deltas (if PS-LANG enabled, compare with baseline)
  let deltas = { tokens: 0, latency: 0, rounds: 0, cost: 0, tool: 0 };

  if (pslang) {
    // Re-run without PS-LANG for baseline
    const baselineRng = new SeededRNG(seed);
    const baselineTokens = calculateTokens(scenario, baselineRng, false);
    const baselineLatency = calculateLatency(scenario, baselineRng, false);
    const baselineRounds = calculateRounds(scenario, baselineRng, false);
    const baselineToolCalls = calculateToolCalls(scenario, baselineRng, false);
    const baselineCost = calculateCost(model, baselineTokens.tokensIn, baselineTokens.tokensOut);

    deltas = {
      tokens: calculateSavings(baselineTokens.total, tokens.total),
      latency: calculateSavings(baselineLatency, latency),
      rounds: calculateSavings(baselineRounds, rounds),
      cost: calculateSavings(baselineCost, cost),
      tool: calculateSavings(baselineToolCalls, toolCalls)
    };
  }

  // Calculate OSM
  const osmScore = calculateOSMPublic(deltas);

  // Generate attestation digest (SHA-256 of metrics + seed)
  const attestData = JSON.stringify({ seed, model, scenario, pslang, metrics: tokens });
  const digest = generateDigest(attestData);

  return {
    runId: generateUUID(seed),
    timestamp: new Date().toISOString(),
    seed,
    model,
    scenario,
    pslang,
    disclosure,
    metrics: {
      tokensIn: tokens.tokensIn,
      tokensOut: tokens.tokensOut,
      latencyMs: Math.round(latency * 1000),
      rounds,
      toolCalls,
      costUsd: parseFloat(cost.toFixed(2))
    },
    deltasVsNoPS: deltas,
    osm: {
      scorePublic: parseFloat(osmScore.toFixed(2)),
      band: getOSMBand(osmScore),
      formulaPublic: "Σ(w_i * Δi) * Q − λP",
      profile: "retriever.v1"
    },
    attest: {
      digest: digest.substring(0, 8) + '…' + digest.substring(digest.length - 3),
      bundle: "private_ref"
    }
  };
}

// Helpers
function generateUUID(seed: number): string {
  return `sim-${seed}-${Date.now().toString(36)}`;
}

function generateDigest(data: string): string {
  // Simplified - in real implementation use crypto.subtle.digest
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}
```

---

## Acceptance Criteria

<@. Validation requirements @.>

- [ ] Same seed produces identical results across runs
- [ ] PS-LANG toggle changes all metrics deterministically
- [ ] Noise stays within ±5% of expected values
- [ ] OSM scores stay within calculated bands
- [ ] All formulas match specifications exactly
- [ ] Reduction percentages stay within defined ranges

---

<.bm sim-engine-spec
complexity: moderate
formulas: 8
randomness: seeded-deterministic
coverage: complete
.bm>
