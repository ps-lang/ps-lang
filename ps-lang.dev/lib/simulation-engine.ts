/**
 * PS-LANG Playground Simulation Engine
 * Deterministic simulation for demonstrating PS-LANG impact
 */

// ========== Seeded RNG ==========

export class SeededRNG {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff
    return this.seed / 0x7fffffff
  }

  normal(mean: number = 0, stddev: number = 1): number {
    const u1 = this.next()
    const u2 = this.next()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + z0 * stddev
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  intRange(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1))
  }
}

// ========== Types ==========

export type ModelType = "claude-sonnet-4.5" | "gpt-5-nano" | "gpt-5-thinking"
export type ScenarioType = "rag-qa" | "multi-tool-agent" | "long-context-chat"
export type DisclosureLevel = "public" | "passthrough" | "private_demo"

export interface ScenarioConfig {
  name: string
  tokens: { min: number; max: number }
  latency: { min: number; max: number }
  rounds: { min: number; max: number }
  toolCalls?: { min: number; max: number }
}

export interface ReductionConfig {
  tokens: { min: number; max: number }
  latency: { min: number; max: number }
  rounds: { min: number; max: number }
  toolChatter?: { min: number; max: number }
}

export interface SimulationResult {
  runId: string
  timestamp: string
  seed: number
  model: ModelType
  scenario: ScenarioType
  pslang: boolean
  disclosure: DisclosureLevel
  metrics: {
    tokensIn: number
    tokensOut: number
    latencyMs: number
    rounds: number
    toolCalls: number
    costUsd: number
  }
  deltasVsNoPS: {
    tokens: number
    latency: number
    rounds: number
    cost: number
    tool?: number
  }
  osm: {
    scorePublic: number
    band: string
    formulaPublic: string
    profile: string
    coarseWeights?: { tokens: number; latency: number; rounds: number }
    qMin?: number
    evalSuiteId?: string
    privateMetadata?: {
      fullWeights: {
        tokens: number
        latency: number
        rounds: number
        tool: number
        bleed: number
      }
      lambda: number
      P: number
      Q: number
    }
  }
  attest: {
    digest: string
    bundle: string
    fullDigest?: string
  }
}

// ========== Scenarios ==========

export const SCENARIOS: Record<ScenarioType, ScenarioConfig> = {
  "rag-qa": {
    name: "RAG Q&A",
    tokens: { min: 18000, max: 55000 },
    latency: { min: 2.2, max: 3.6 },
    rounds: { min: 3, max: 4 },
  },
  "multi-tool-agent": {
    name: "Multi-Tool Agent",
    tokens: { min: 10000, max: 25000 },
    latency: { min: 2.8, max: 4.2 },
    rounds: { min: 4, max: 6 },
    toolCalls: { min: 5, max: 12 },
  },
  "long-context-chat": {
    name: "Long-Context Chat",
    tokens: { min: 35000, max: 120000 },
    latency: { min: 2.6, max: 4.0 },
    rounds: { min: 3, max: 5 },
  },
}

export const PS_LANG_REDUCTIONS: Record<ScenarioType, ReductionConfig> = {
  "rag-qa": {
    tokens: { min: 0.18, max: 0.28 },
    latency: { min: 0.1, max: 0.16 },
    rounds: { min: 0.5, max: 0.75 },
  },
  "multi-tool-agent": {
    tokens: { min: 0.12, max: 0.22 },
    latency: { min: 0.12, max: 0.2 },
    rounds: { min: 0.5, max: 0.75 },
    toolChatter: { min: 0.15, max: 0.3 },
  },
  "long-context-chat": {
    tokens: { min: 0.14, max: 0.22 },
    latency: { min: 0.08, max: 0.14 },
    rounds: { min: 0.4, max: 0.6 },
  },
}

export const MODEL_PRICING: Record<ModelType, { input: number; output: number }> = {
  "claude-sonnet-4.5": { input: 3.0, output: 15.0 },
  "gpt-5-nano": { input: 1.5, output: 7.5 },
  "gpt-5-thinking": { input: 5.0, output: 25.0 },
}

// ========== Calculation Functions ==========

function applyNoise(value: number, rng: SeededRNG, sigma: number = 0.02): number {
  const noise = rng.normal(0, sigma)
  return value * (1 + noise)
}

function calculateTokens(
  scenario: ScenarioType,
  rng: SeededRNG,
  usePSLang: boolean
): {
  tokensIn: number
  tokensOut: number
  total: number
} {
  const config = SCENARIOS[scenario]
  const baseTotal = Math.round(rng.range(config.tokens.min, config.tokens.max))

  let total = baseTotal

  if (usePSLang) {
    const reduction = PS_LANG_REDUCTIONS[scenario]
    const reductionPct = rng.range(reduction.tokens.min, reduction.tokens.max)
    total = Math.round(baseTotal * (1 - reductionPct))
  }

  total = Math.round(applyNoise(total, rng))

  const tokensIn = Math.round(total * 0.85)
  const tokensOut = total - tokensIn

  return { tokensIn, tokensOut, total }
}

function calculateLatency(scenario: ScenarioType, rng: SeededRNG, usePSLang: boolean): number {
  const config = SCENARIOS[scenario]
  let latency = rng.range(config.latency.min, config.latency.max)

  if (usePSLang) {
    const reduction = PS_LANG_REDUCTIONS[scenario]
    const reductionPct = rng.range(reduction.latency.min, reduction.latency.max)
    latency *= 1 - reductionPct
  }

  return applyNoise(latency, rng)
}

function calculateRounds(scenario: ScenarioType, rng: SeededRNG, usePSLang: boolean): number {
  const config = SCENARIOS[scenario]
  let rounds = rng.intRange(config.rounds.min, config.rounds.max)

  if (usePSLang) {
    const reduction = PS_LANG_REDUCTIONS[scenario]
    const reductionPct = rng.range(reduction.rounds.min, reduction.rounds.max)
    const reducedRounds = Math.max(1, Math.round(rounds * (1 - reductionPct)))
    rounds = reducedRounds
  }

  return rounds
}

function calculateToolCalls(scenario: ScenarioType, rng: SeededRNG, usePSLang: boolean): number {
  const config = SCENARIOS[scenario]

  if (!config.toolCalls) return 0

  let toolCalls = rng.intRange(config.toolCalls.min, config.toolCalls.max)

  if (usePSLang && PS_LANG_REDUCTIONS[scenario].toolChatter) {
    const reduction = PS_LANG_REDUCTIONS[scenario].toolChatter!
    const reductionPct = rng.range(reduction.min, reduction.max)
    toolCalls = Math.max(1, Math.round(toolCalls * (1 - reductionPct)))
  }

  return toolCalls
}

function calculateCost(model: ModelType, tokensIn: number, tokensOut: number): number {
  const pricing = MODEL_PRICING[model]
  const costIn = (tokensIn / 1_000_000) * pricing.input
  const costOut = (tokensOut / 1_000_000) * pricing.output
  return costIn + costOut
}

function calculateSavings(baseline: number, withPSLang: number): number {
  if (baseline === 0) return 0
  return (baseline - withPSLang) / baseline
}

const OSM_WEIGHTS_COARSE = {
  tokens: 0.35,
  latency: 0.15,
  rounds: 0.15,
}

const OSM_WEIGHTS_FULL = {
  tokens: 0.35,
  latency: 0.15,
  rounds: 0.2,
  tool: 0.1,
  bleed: 0.2,
}

function calculateOSMPublic(deltas: { tokens: number; latency: number; rounds: number }): number {
  const Q = 0.94
  const lambda = 0.08
  const P = 0.22

  const weightedSum =
    OSM_WEIGHTS_COARSE.tokens * deltas.tokens +
    OSM_WEIGHTS_COARSE.latency * deltas.latency +
    OSM_WEIGHTS_COARSE.rounds * deltas.rounds

  return weightedSum * Q - lambda * P
}

function getOSMBand(score: number): string {
  const margin = 0.03
  const lower = (score - margin).toFixed(2)
  const upper = (score + margin).toFixed(2)
  return `${lower}–${upper}`
}

function generateUUID(seed: number): string {
  return `sim-${seed}-${Date.now().toString(36)}`
}

async function sha256(data: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoder = new TextEncoder()
    const buffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Fallback (simple hash for demo)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(64, "0")
}

// ========== Main Simulation ==========

export async function runSimulation(
  seed: number,
  model: ModelType,
  scenario: ScenarioType,
  pslang: boolean,
  disclosure: DisclosureLevel
): Promise<SimulationResult> {
  const rng = new SeededRNG(seed)

  const tokens = calculateTokens(scenario, rng, pslang)
  const latency = calculateLatency(scenario, rng, pslang)
  const rounds = calculateRounds(scenario, rng, pslang)
  const toolCalls = calculateToolCalls(scenario, rng, pslang)
  const cost = calculateCost(model, tokens.tokensIn, tokens.tokensOut)

  let deltas = { tokens: 0, latency: 0, rounds: 0, cost: 0, tool: 0 }

  if (pslang) {
    const baselineRng = new SeededRNG(seed)
    const baselineTokens = calculateTokens(scenario, baselineRng, false)
    const baselineLatency = calculateLatency(scenario, baselineRng, false)
    const baselineRounds = calculateRounds(scenario, baselineRng, false)
    const baselineToolCalls = calculateToolCalls(scenario, baselineRng, false)
    const baselineCost = calculateCost(model, baselineTokens.tokensIn, baselineTokens.tokensOut)

    deltas = {
      tokens: calculateSavings(baselineTokens.total, tokens.total),
      latency: calculateSavings(baselineLatency, latency),
      rounds: calculateSavings(baselineRounds, rounds),
      cost: calculateSavings(baselineCost, cost),
      tool: calculateSavings(baselineToolCalls, toolCalls),
    }
  }

  const osmScore = calculateOSMPublic(deltas)

  const attestData = JSON.stringify({ seed, model, scenario, pslang, metrics: tokens })
  const fullDigest = await sha256(attestData)
  const digest = `${fullDigest.substring(0, 8)}…${fullDigest.substring(fullDigest.length - 3)}`

  const result: SimulationResult = {
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
      costUsd: parseFloat(cost.toFixed(2)),
    },
    deltasVsNoPS: deltas,
    osm: {
      scorePublic: parseFloat(osmScore.toFixed(2)),
      band: getOSMBand(osmScore),
      formulaPublic: "Σ(w_i * Δi) * Q − λP",
      profile: "retriever.v1",
    },
    attest: {
      digest,
      bundle: "private_ref",
    },
  }

  if (disclosure === "passthrough" || disclosure === "private_demo") {
    result.osm.coarseWeights = OSM_WEIGHTS_COARSE
    result.osm.qMin = 0.75
    result.osm.evalSuiteId = "ps-lang-alpha-v1"
  }

  if (disclosure === "private_demo") {
    result.osm.privateMetadata = {
      fullWeights: OSM_WEIGHTS_FULL,
      lambda: 0.08,
      P: 0.22,
      Q: 0.94,
    }
    result.attest.fullDigest = fullDigest
  }

  return result
}
