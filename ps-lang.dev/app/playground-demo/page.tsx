"use client"

import { useState, useEffect } from "react"
import { runSimulation, SCENARIOS, type ModelType, type ScenarioType, type DisclosureLevel, type SimulationResult } from "@/lib/simulation-engine"

export default function PlaygroundDemoPage() {
  // State
  const [model, setModel] = useState<ModelType>("claude-sonnet-4.5")
  const [scenario, setScenario] = useState<ScenarioType>("multi-tool-agent")
  const [pslang, setPslang] = useState(false)
  const [disclosure, setDisclosure] = useState<DisclosureLevel>("public")
  const [seed, setSeed] = useState(42)
  const [metricView, setMetricView] = useState<"tokens" | "latency" | "cost" | "rounds" | "osm" | "savings">("tokens")
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [runHistory, setRunHistory] = useState<SimulationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const [methodologyTab, setMethodologyTab] = useState<"assumptions" | "formulas" | "disclosure">("assumptions")

  // Run simulation
  const run = async () => {
    setIsLoading(true)
    try {
      const simResult = await runSimulation(seed, model, scenario, pslang, disclosure)
      setResult(simResult)
      setRunHistory(prev => [simResult, ...prev].slice(0, 5))
    } catch (error) {
      console.error("Simulation error:", error)
    }
    setIsLoading(false)
  }

  // Auto-run on mount and changes
  useEffect(() => {
    run()
  }, [model, scenario, pslang, disclosure, seed])

  // Re-roll seed
  const rerollSeed = () => setSeed(Math.floor(Math.random() * 999999) + 1)

  // Export functions
  const exportCSV = () => {
    if (!result) return
    const csv = `run_id,ts,seed,model,scenario,pslang,tokens_in,tokens_out,latency_ms,rounds,tool_calls,cost_usd,delta_tokens,delta_latency,delta_rounds,delta_cost,osm_score,osm_band,attest_digest\n${result.runId},${result.timestamp},${result.seed},${result.model},${result.scenario},${result.pslang},${result.metrics.tokensIn},${result.metrics.tokensOut},${result.metrics.latencyMs},${result.metrics.rounds},${result.metrics.toolCalls},${result.metrics.costUsd},${result.deltasVsNoPS.tokens},${result.deltasVsNoPS.latency},${result.deltasVsNoPS.rounds},${result.deltasVsNoPS.cost},${result.osm.scorePublic},${result.osm.band},${result.attest.digest}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ps-lang-sim-${result.runId}.csv`
    a.click()
  }

  const exportJSON = () => {
    if (!result) return
    navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    alert("JSON copied to clipboard!")
  }

  // Get metric values
  const getMetricValue = (r: SimulationResult | null, metric: string) => {
    if (!r) return 0
    switch (metric) {
      case "tokens": return r.metrics.tokensIn + r.metrics.tokensOut
      case "latency": return r.metrics.latencyMs / 1000
      case "cost": return r.metrics.costUsd
      case "rounds": return r.metrics.rounds
      case "osm": return r.osm.scorePublic
      case "savings": return -r.deltasVsNoPS.tokens
      default: return 0
    }
  }

  const formatMetric = (value: number, metric: string) => {
    switch (metric) {
      case "tokens": return `${Math.round(value).toLocaleString()}`
      case "latency": return `${value.toFixed(2)}s`
      case "cost": return `$${value.toFixed(2)}`
      case "rounds": return `${value}`
      case "osm": return value.toFixed(2)
      case "savings": return `${(value * 100).toFixed(0)}%`
      default: return value.toString()
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="paper-card stacked-papers p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-editorial text-4xl font-bold text-ink">PS-LANG Playground</h1>
            <span className="ink-stamp text-stamp-blue">Simulation</span>
          </div>
          <p className="font-editorial text-ink-light text-xl mb-4">
            One Shot, Not Five. PS-LANG trims context, kills re-asks, and locks clean handoffs.
          </p>
          <p className="font-typewriter text-sm text-ink-light">
            Toggle PS-LANG to see real pipeline hygiene effects (simulated, seeded).
          </p>
        </div>

        {/* Control Bar */}
        <div className="paper-card stacked-papers p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            {/* Model */}
            <div className="lg:col-span-1">
              <label className="block font-typewriter text-xs text-ink-light mb-2">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as ModelType)}
                className="w-full paper-card px-3 py-2 font-typewriter text-sm text-ink border-none focus:outline-none focus:ring-2 focus:ring-stamp-blue"
              >
                <option value="claude-sonnet-4.5">Claude Sonnet 4.5</option>
                <option value="gpt-5-nano">GPT-5 Nano</option>
                <option value="gpt-5-thinking">GPT-5 Thinking</option>
              </select>
            </div>

            {/* Scenario */}
            <div className="lg:col-span-2">
              <label className="block font-typewriter text-xs text-ink-light mb-2">Scenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioType)}
                className="w-full paper-card px-3 py-2 font-typewriter text-sm text-ink border-none focus:outline-none focus:ring-2 focus:ring-stamp-blue"
              >
                <option value="rag-qa">RAG Q&A</option>
                <option value="multi-tool-agent">Multi-Tool Agent</option>
                <option value="long-context-chat">Long-Context Chat</option>
              </select>
            </div>

            {/* PS-LANG Toggle */}
            <div className="lg:col-span-1">
              <label className="block font-typewriter text-xs text-ink-light mb-2">PS-LANG</label>
              <button
                onClick={() => setPslang(!pslang)}
                className={`w-full px-4 py-2 font-typewriter font-bold text-sm tracking-wide transition-all duration-300 border ${
                  pslang
                    ? "bg-[#2D1300] text-white border-[#2D1300] hover:bg-[#1a0b00]"
                    : "bg-white text-[#2D1300] border-[#2D1300] hover:bg-[#2D1300] hover:text-white"
                }`}
              >
                {pslang ? "ON" : "OFF"}
              </button>
            </div>

            {/* Disclosure */}
            <div className="lg:col-span-1">
              <label className="block font-typewriter text-xs text-ink-light mb-2">Disclosure</label>
              <select
                value={disclosure}
                onChange={(e) => setDisclosure(e.target.value as DisclosureLevel)}
                className="w-full paper-card px-3 py-2 font-typewriter text-sm text-ink border-none focus:outline-none focus:ring-2 focus:ring-stamp-blue"
              >
                <option value="public">🔓 Public</option>
                <option value="passthrough">🔗 Pass-through</option>
                <option value="private_demo">⚠️ Private (Demo)</option>
              </select>
            </div>

            {/* Seed */}
            <div className="lg:col-span-1">
              <label className="block font-typewriter text-xs text-ink-light mb-2">Seed</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 1)}
                  className="w-16 paper-card px-2 py-2 font-typewriter text-sm text-ink border border-ink/20 focus:outline-none focus:ring-1 focus:ring-[#2D1300] focus:border-[#2D1300]"
                />
                <button
                  onClick={rerollSeed}
                  className="px-2 py-2 border border-[#2D1300] text-[#2D1300] hover:bg-[#2D1300] hover:text-white transition-colors"
                  title="Re-roll seed"
                >
                  🎲
                </button>
              </div>
            </div>
          </div>

          {/* Metric Tabs */}
          <div className="flex gap-1 border-b border-ink/20 pb-0">
            {(["tokens", "latency", "cost", "rounds", "osm", "savings"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetricView(m)}
                className={`px-4 py-2 font-typewriter text-xs tracking-wide transition-all ${
                  metricView === m
                    ? "bg-paper-texture border-b-2 border-[#2D1300] text-[#2D1300] font-bold"
                    : "text-ink-light hover:text-ink hover:bg-paper-texture/50"
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization & Results */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 paper-card p-6">
            <h3 className="font-typewriter font-bold text-ink mb-6">
              {metricView.charAt(0).toUpperCase() + metricView.slice(1)} Comparison
            </h3>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="font-typewriter text-ink-light">Loading...</div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Simple Bar Viz */}
                <div className="space-y-4">
                  {/* Always show baseline */}
                  <div className="space-y-2">
                    <span className="font-typewriter text-xs font-bold text-ink uppercase tracking-wide">
                      {pslang ? "Baseline (No PS-LANG)" : "Current Result"}
                    </span>
                    <div className="h-16 bg-stone-100 border border-ink/10 relative overflow-hidden shadow-sm">
                      <div
                        className="h-full bg-[#2D1300] transition-all duration-300 ease-in-out flex items-center justify-end px-4"
                        style={{
                          width: "100%"
                        }}
                      >
                        <span className="font-typewriter text-sm text-white font-bold">
                          {pslang
                            ? formatMetric(getMetricValue(result, metricView) / (1 + result.deltasVsNoPS[metricView === "tokens" ? "tokens" : metricView === "latency" ? "latency" : metricView === "cost" ? "cost" : metricView === "rounds" ? "rounds" : "tokens"]), metricView)
                            : formatMetric(getMetricValue(result, metricView), metricView)
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Show PS-LANG result when enabled */}
                  {pslang && (
                    <div className="space-y-2">
                      <span className="font-typewriter text-xs font-bold text-stamp-green uppercase tracking-wide">With PS-LANG ✓</span>
                      <div className="h-16 bg-stone-100 border border-ink/10 relative overflow-hidden shadow-sm">
                        <div
                          className="h-full bg-stamp-green transition-all duration-300 ease-in-out flex items-center justify-end px-4"
                          style={{
                            width: `${Math.abs((1 + result.deltasVsNoPS[metricView === "tokens" ? "tokens" : metricView === "latency" ? "latency" : metricView === "cost" ? "cost" : metricView === "rounds" ? "rounds" : "tokens"])) * 100}%`
                          }}
                        >
                          <span className="font-typewriter text-sm text-white font-bold">
                            {formatMetric(getMetricValue(result, metricView), metricView)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delta Pills */}
                {pslang && (
                  <div className="pt-4 border-t border-ink/10">
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1.5 bg-paper-texture border border-stamp-green/40 shadow-sm">
                        <span className="font-typewriter text-xs text-stamp-green">
                          Tokens {(result.deltasVsNoPS.tokens * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-paper-texture border border-stamp-green/40 shadow-sm">
                        <span className="font-typewriter text-xs text-stamp-green">
                          Latency {(result.deltasVsNoPS.latency * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-paper-texture border border-stamp-green/40 shadow-sm">
                        <span className="font-typewriter text-xs text-stamp-green">
                          Rounds {(result.deltasVsNoPS.rounds * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-paper-texture border border-stamp-green/40 shadow-sm">
                        <span className="font-typewriter text-xs text-stamp-green">
                          Cost {(result.deltasVsNoPS.cost * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-paper-texture border border-stamp-blue/40 shadow-sm">
                        <span className="font-typewriter text-xs text-stamp-blue">
                          OSM {result.osm.scorePublic}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Run Log */}
          <div className="paper-card p-6">
            <h3 className="font-typewriter font-bold text-ink mb-4">Run Log</h3>
            <div className="space-y-2">
              {runHistory.length === 0 ? (
                <p className="font-typewriter text-xs text-ink-light text-center py-8">No runs yet</p>
              ) : (
                runHistory.map((r) => (
                  <div key={r.runId} className="p-3 bg-paper-texture border border-ink/10 hover:border-ink/20 transition-all shadow-sm">
                    <div className="font-typewriter text-xs text-ink mb-1.5">
                      {r.model.split("-")[0].toUpperCase()} · {SCENARIOS[r.scenario].name}
                    </div>
                    <div className="font-typewriter text-xs text-ink-light">
                      PS-LANG {r.pslang ? "ON" : "OFF"} · Seed {r.seed}
                    </div>
                    {r.pslang && (
                      <div className="font-typewriter text-xs text-stamp-green mt-1.5">
                        {(r.deltasVsNoPS.tokens * 100).toFixed(0)}% savings
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Details & Export */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Details */}
          <div className="paper-card p-6">
            <h3 className="font-typewriter font-bold text-ink mb-6">Details</h3>
            {result && (
              <div className="space-y-4 font-typewriter text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-ink/5">
                    <span className="text-ink-light">Tokens In:</span>
                    <span className="text-ink font-bold">{result.metrics.tokensIn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-ink/5">
                    <span className="text-ink-light">Tokens Out:</span>
                    <span className="text-ink font-bold">{result.metrics.tokensOut.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-ink/5">
                    <span className="text-ink-light">Latency:</span>
                    <span className="text-ink font-bold">{result.metrics.latencyMs}ms</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-ink/5">
                    <span className="text-ink-light">Rounds:</span>
                    <span className="text-ink font-bold">{result.metrics.rounds}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-ink/5">
                    <span className="text-ink-light">Tool Calls:</span>
                    <span className="text-ink font-bold">{result.metrics.toolCalls}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-ink/5">
                    <span className="text-ink-light">Cost:</span>
                    <span className="text-ink font-bold">${result.metrics.costUsd}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t-2 border-ink/10 space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-ink-light">OSM Score:</span>
                    <span className="text-stamp-blue font-bold text-base">{result.osm.scorePublic}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-ink-light">OSM Band:</span>
                    <span className="text-ink font-bold">{result.osm.band}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-ink-light">Profile:</span>
                    <span className="text-ink font-bold">{result.osm.profile}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t-2 border-ink/10">
                  <div className="flex justify-between items-center">
                    <span className="text-ink-light text-xs">Attestation:</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(result.attest.fullDigest || result.attest.digest)}
                      className="text-ink font-mono text-xs hover:text-stamp-blue hover:bg-stamp-blue/10 px-2 py-1 rounded transition-colors"
                      title="Copy digest"
                    >
                      {result.attest.digest} 🔍
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <div className="paper-card p-6">
            <h3 className="font-typewriter font-bold text-ink mb-6">Export</h3>
            <div className="space-y-3">
              <button
                onClick={exportCSV}
                disabled={!result}
                className="w-full border border-[#2D1300] px-6 py-3 bg-[#2D1300] text-white hover:bg-[#1a0b00] transition-all duration-300 text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#2D1300]"
              >
                DOWNLOAD CSV
              </button>
              <button
                onClick={exportJSON}
                disabled={!result}
                className="w-full border border-[#2D1300] px-6 py-3 text-[#2D1300] hover:bg-[#2D1300] hover:text-white transition-all duration-300 text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#2D1300]"
              >
                COPY JSON
              </button>
              <button
                onClick={() => setShowMethodology(true)}
                className="w-full border border-[#2D1300] px-6 py-3 text-[#2D1300] hover:bg-[#2D1300] hover:text-white transition-all duration-300 text-sm tracking-wide"
              >
                VIEW METHODOLOGY
              </button>
            </div>

            <div className="mt-6 p-4 bg-paper border border-ink/20 shadow-sm">
              <p className="font-typewriter text-xs text-ink-light leading-relaxed">
                <span className="text-stamp-red">※</span> Simulated data for demonstration. Use same seed to reproduce results.
              </p>
            </div>
          </div>
        </div>

        {/* Methodology Modal */}
        {showMethodology && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="paper-card max-w-2xl w-full max-h-[80vh] overflow-auto p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-editorial text-2xl font-bold text-ink">Methodology</h2>
                <button
                  onClick={() => setShowMethodology(false)}
                  className="text-ink-light hover:text-ink text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex gap-2 border-b border-ink/10 mb-4">
                {(["assumptions", "formulas", "disclosure"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMethodologyTab(tab)}
                    className={`px-4 py-2 font-typewriter text-sm ${
                      methodologyTab === tab
                        ? "border-b-2 border-stamp-blue text-stamp-blue font-bold"
                        : "text-ink-light hover:text-ink"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="font-typewriter text-sm text-ink space-y-4">
                {methodologyTab === "assumptions" && (
                  <>
                    <h3 className="font-bold">What "Simulated" Means</h3>
                    <ul className="list-disc list-inside space-y-2 text-ink-light">
                      <li>No actual models are invoked</li>
                      <li>Uses seeded RNG (reproducible with same seed)</li>
                      <li>Based on conservative estimates from internal benchmarks</li>
                      <li>Includes ±2% noise to simulate real-world variance</li>
                    </ul>
                    <h3 className="font-bold mt-4">Scenarios</h3>
                    <p className="text-ink-light">RAG Q&A: 3-4 rounds baseline, 18-28% token reduction</p>
                    <p className="text-ink-light">Multi-Tool: 4-6 rounds baseline, 12-22% token reduction</p>
                    <p className="text-ink-light">Long-Context: 3-5 rounds baseline, 14-22% token reduction</p>
                  </>
                )}

                {methodologyTab === "formulas" && (
                  <>
                    <h3 className="font-bold">OSM Formula (Public)</h3>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                      OSM = Σ(w_i × Δi) × Q − λP
                    </p>
                    <p className="text-ink-light">
                      w_i = weights (public: tokens, latency, rounds only)<br />
                      Δi = deltas (% reduction)<br />
                      Q = quality gate (0.94)<br />
                      λ = penalty coefficient (0.08)<br />
                      P = penalty value (0.22)
                    </p>
                    <h3 className="font-bold mt-4">Cost Formula</h3>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                      Cost = (tokens_in / 1M × rate_in) + (tokens_out / 1M × rate_out)
                    </p>
                  </>
                )}

                {methodologyTab === "disclosure" && (
                  <>
                    <h3 className="font-bold">Disclosure Levels</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-bold text-gray-600">🔓 Public</p>
                        <p className="text-ink-light text-xs">OSM score, band, deltas, profile name. Safe for sharing.</p>
                      </div>
                      <div>
                        <p className="font-bold text-blue-600">🔗 Pass-through</p>
                        <p className="text-ink-light text-xs">+ Coarse weights, quality min, eval suite. For partners.</p>
                      </div>
                      <div>
                        <p className="font-bold text-amber-600">⚠️ Private (Demo)</p>
                        <p className="text-ink-light text-xs">+ Full weights, penalty details. Not exported publicly.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
