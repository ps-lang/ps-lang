/**
 * PS-LANG Filter Engine
 * Processes zone syntax and filters content for agents
 */

export type ZoneType = "pass-through" | "private" | "public" | "action" | "question" | "benchmark"

export interface Zone {
  type: ZoneType
  content: string
  start: number
  end: number
  raw: string
}

export interface FilterResult {
  original: string
  filtered: string
  zones: Zone[]
  stats: {
    totalZones: number
    passThrough: number
    filtered: number
    tokensRemoved: number
  }
}

// Zone patterns based on PS-LANG spec
const ZONE_PATTERNS = {
  passThrough: /<#\.(.*?)#\.>/gs,      // <#. ... #.>
  private: /<\.(.*?)\.>/gs,             // <. ... .>
  public: /<\$\.(.*?)\$\.>/gs,          // <$. ... $.>
  action: /<@\.(.*?)@\.>/gs,            // <@. ... @.>
  question: /<\?\.(.*?)\?\.>/gs,        // <?. ... ?.>
  benchmark: /<\.bm(.*?)\.bm>/gs,       // <.bm ... .bm>
}

/**
 * Parse PS-LANG content and extract all zones
 */
export function parseZones(content: string): Zone[] {
  const zones: Zone[] = []

  // Check each zone type
  Object.entries(ZONE_PATTERNS).forEach(([type, pattern]) => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      zones.push({
        type: type as ZoneType,
        content: match[1].trim(),
        start: match.index,
        end: match.index + match[0].length,
        raw: match[0]
      })
    }
  })

  // Sort by position
  return zones.sort((a, b) => a.start - b.start)
}

/**
 * Filter content for a specific agent role
 * @param content - Original .md.psl content
 * @param agentRole - Agent receiving the content (e.g., "agent-b", "user")
 * @param options - Filter options
 */
export function filterForAgent(
  content: string,
  agentRole: string = "default",
  options: {
    keepPassThrough?: boolean
    keepPublic?: boolean
    keepAction?: boolean
  } = {}
): FilterResult {
  const {
    keepPassThrough = true,
    keepPublic = true,
    keepAction = true
  } = options

  const zones = parseZones(content)
  let filtered = content
  let tokensRemoved = 0
  let filteredCount = 0

  // Process zones in reverse order to maintain string positions
  const sortedZones = [...zones].sort((a, b) => b.start - a.start)

  sortedZones.forEach(zone => {
    let shouldKeep = false

    switch (zone.type) {
      case "pass-through":
        shouldKeep = keepPassThrough
        break
      case "public":
        shouldKeep = keepPublic
        break
      case "action":
        shouldKeep = keepAction
        break
      case "private":
      case "benchmark":
      case "question":
        shouldKeep = false // Always filter these
        break
    }

    if (shouldKeep) {
      // Replace zone syntax with just the content
      filtered = filtered.substring(0, zone.start) + zone.content + filtered.substring(zone.end)
    } else {
      // Remove entire zone
      filtered = filtered.substring(0, zone.start) + filtered.substring(zone.end)
      tokensRemoved += Math.ceil(zone.raw.length / 4) // Rough token estimate
      filteredCount++
    }
  })

  return {
    original: content,
    filtered: filtered.trim(),
    zones,
    stats: {
      totalZones: zones.length,
      passThrough: zones.filter(z => z.type === "pass-through").length,
      filtered: filteredCount,
      tokensRemoved
    }
  }
}

/**
 * Generate benchmark metrics for PS-LANG vs regular prompting
 */
export interface BenchmarkMetrics {
  iteration: number
  regular: {
    rounds: number
    tokens: number
    cost: number
    timeMs: number
  }
  psLang: {
    rounds: number
    tokens: number
    cost: number
    timeMs: number
  }
  improvement: {
    rounds: number // percentage
    tokens: number
    cost: number
    time: number
  }
}

// Simple seeded RNG for consistent data generation
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function generateBenchmarkData(iterations: number = 20): BenchmarkMetrics[] {
  const data: BenchmarkMetrics[] = []

  for (let i = 1; i <= iterations; i++) {
    // Regular prompting: starts bad, gets slightly better but stays volatile
    const regularRounds = Math.max(1, Math.round(4 - (i * 0.1) + (seededRandom(i * 2) * 1.5 - 0.75)))
    const regularTokens = Math.round(25000 - (i * 150) + (seededRandom(i * 3) * 3000 - 1500))
    const regularCost = regularTokens * 0.00003
    const regularTime = regularRounds * 2000 + seededRandom(i * 4) * 1000

    // PS-LANG: starts better, improves consistently, stabilizes
    const learningCurve = 1 - Math.log(i + 1) / Math.log(iterations + 1)
    const psLangRounds = Math.max(1, Math.round(2 - (i * 0.05)))
    const psLangTokens = Math.round(18000 - (i * 200) + (seededRandom(i * 5) * 500 - 250))
    const psLangCost = psLangTokens * 0.00003
    const psLangTime = psLangRounds * 1500 + seededRandom(i * 6) * 500

    data.push({
      iteration: i,
      regular: {
        rounds: regularRounds,
        tokens: regularTokens,
        cost: parseFloat(regularCost.toFixed(4)),
        timeMs: Math.round(regularTime)
      },
      psLang: {
        rounds: psLangRounds,
        tokens: psLangTokens,
        cost: parseFloat(psLangCost.toFixed(4)),
        timeMs: Math.round(psLangTime)
      },
      improvement: {
        rounds: parseFloat((((regularRounds - psLangRounds) / regularRounds) * 100).toFixed(1)),
        tokens: parseFloat((((regularTokens - psLangTokens) / regularTokens) * 100).toFixed(1)),
        cost: parseFloat((((regularCost - psLangCost) / regularCost) * 100).toFixed(1)),
        time: parseFloat((((regularTime - psLangTime) / regularTime) * 100).toFixed(1))
      }
    })
  }

  return data
}

/**
 * Example prompts for demo
 */
export const EXAMPLE_PROMPTS = {
  // Single-line chat prompt (how users actually write)
  original: `Analyze Q4 2024 sales data and create a comprehensive report with revenue, customer acquisition, and product performance metrics. Highlight key trends and provide actionable recommendations.`,

  // Formatted .md.psl with zones and AI metadata
  enriched: `# Q4 2024 Sales Analysis

<#. task: quarterly_sales_analysis #.>

## Objective
Analyze the sales data from Q4 2024 and create a comprehensive report.

## Required Metrics
<$. metrics_required:
  - revenue
  - customer_acquisition
  - product_performance
$.>

## Analysis Steps

<. debug_notes:
  - Data validation: PASSED
  - Date range: Q4 2024 (Oct-Dec)
  - Cross-reference: Q3 baseline established
.>

Make sure to highlight key trends and provide actionable recommendations.

<@. output_format:
  type: structured_report
  sections: [executive_summary, revenue_analysis, customer_metrics, product_performance, trends, recommendations]
  charts: true
@.>

---

<.bm ai_metadata:
  analysis_type: sales_quarterly
  model: claude-sonnet-4.5
  expected_tokens: 18000
  priority: high
  domain: business_analytics
.bm>`,

  // Legacy PS-LANG example
  psLang: `<#. task: Q4 2024 sales analysis #.>

<$. required_metrics: revenue, customer_acquisition, product_performance $.>

<. debug: data_validation_passed .>
<. debug: date_range_q4_2024 .>
<. debug: cross_ref_q3_complete .>

<@. output_format: structured_report
  sections: [revenue, customers, products, trends, recommendations]
@.>

<.bm analysis_type: sales_quarterly
  model: claude-sonnet-4.5
  expected_tokens: 18000
.bm>`
}
