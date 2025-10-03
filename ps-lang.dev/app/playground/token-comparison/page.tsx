"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { generateBenchmarkData } from "@/lib/ps-lang-filter"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import AlphaSignupModal from "@/components/alpha-signup-modal"

export default function TokenComparisonPage() {
  const [datasetType, setDatasetType] = useState<'baseline' | 'heavy-zones' | 'benchmark-zones' | 'private-zones' | 'minimal-zones'>('baseline')
  const [showDatasetMenu, setShowDatasetMenu] = useState(false)
  const benchmarkData = useMemo(() => generateBenchmarkData(20, datasetType), [datasetType])
  const [currentIteration, setCurrentIteration] = useState(20) // Start at end to show full data
  const [hoveredIteration, setHoveredIteration] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  // Scroll handler for chart interaction
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = Math.sign(e.deltaY)
    setCurrentIteration(prev => Math.max(1, Math.min(20, prev + delta)))
  }, [])

  const displayIteration = hoveredIteration || currentIteration
  const displayMetrics = benchmarkData[displayIteration - 1]

  // Calculate cumulative totals
  const getCumulativeTotals = (upToIteration: number) => {
    const data = benchmarkData.slice(0, upToIteration)
    const regularTotal = data.reduce((sum, m) => sum + m.regular.tokens, 0)
    const psLangTotal = data.reduce((sum, m) => sum + m.psLang.tokens, 0)
    const tokensSaved = regularTotal - psLangTotal
    const savingsPercentage = ((tokensSaved / regularTotal) * 100).toFixed(1)

    return {
      regularTotal,
      psLangTotal,
      tokensSaved,
      savingsPercentage
    }
  }

  const cumulativeData = getCumulativeTotals(displayIteration)

  // Transform data for Recharts - split into explored (solid) and unexplored (dashed)
  const chartData = benchmarkData.map((m, i) => {
    const isExplored = i < currentIteration
    const isAtBoundary = i === currentIteration - 1 || i === currentIteration

    return {
      iteration: i + 1,
      // Explored (solid lines)
      "Regular Prompting": isExplored ? m.regular.tokens : null,
      "Prompting with PS-LANG": isExplored ? m.psLang.tokens : null,
      // Unexplored (dashed lines) - include boundary point for connection
      "Regular Prompting Future": !isExplored || isAtBoundary ? m.regular.tokens : null,
      "Prompting with PS-LANG Future": !isExplored || isAtBoundary ? m.psLang.tokens : null,
    }
  })

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="text-center">
            <div className="inline-block mb-4 sm:mb-6">
              <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Interactive Demo</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4 sm:mb-6 tracking-tight">
              Token Usage Comparison
            </h1>
            <p className="text-base sm:text-lg text-stone-600 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed font-light">
              Small syntax investment → Compounding efficiency gains
            </p>
            <p className="text-sm text-stone-500 max-w-xl mx-auto font-light">
              Watch how .psl syntax engineering improves metrics over time
            </p>
          </div>
        </div>

        {/* Full-Screen Timeline Graph */}
        <div className="mb-8">
          {/* Single window with tabs */}
          <div className="bg-white border border-stone-300/80 rounded-2xl overflow-hidden shadow-lg">
            {/* Header bar with traffic lights */}
            <div className="bg-gradient-to-b from-stone-200 to-stone-150 border-b border-stone-300/60 relative z-10">
              <div className="px-4 py-3 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28CA42] border border-[#24A53B] shadow-sm"></div>
                </div>

                <div className="text-xs font-mono text-stone-600 font-medium flex-1">
                  Token Usage Comparison
                </div>

                {/* Dataset selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowDatasetMenu(!showDatasetMenu)}
                    className="flex items-center gap-2 text-xs font-mono text-stone-600 hover:text-stone-900 transition-colors px-3 py-1.5 rounded hover:bg-stone-100"
                  >
                    <span>Sample metrics</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDatasetMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDatasetMenu(false)}
                      />
                      {/* Menu */}
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-stone-300 shadow-xl z-20 rounded-lg overflow-hidden">
                        <div className="p-2">
                          <button
                            onClick={() => { setDatasetType('baseline'); setShowDatasetMenu(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${
                              datasetType === 'baseline'
                                ? 'bg-stone-100 text-stone-900'
                                : 'text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="font-semibold mb-1">Baseline Usage</div>
                            <div className="text-[10px] text-stone-500">Moderate zone usage across prompts</div>
                          </button>
                          <button
                            onClick={() => { setDatasetType('heavy-zones'); setShowDatasetMenu(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${
                              datasetType === 'heavy-zones'
                                ? 'bg-stone-100 text-stone-900'
                                : 'text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="font-semibold mb-1">Heavy Context Zones</div>
                            <div className="text-[10px] text-stone-500">Aggressive use of {'<#.>'}, {'<@.>'}, and context control</div>
                          </button>
                          <button
                            onClick={() => { setDatasetType('benchmark-zones'); setShowDatasetMenu(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${
                              datasetType === 'benchmark-zones'
                                ? 'bg-stone-100 text-stone-900'
                                : 'text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="font-semibold mb-1">Benchmark Metadata Zones</div>
                            <div className="text-[10px] text-stone-500">Frequent &lt;.bm&gt; zones for AI metadata tracking</div>
                          </button>
                          <button
                            onClick={() => { setDatasetType('private-zones'); setShowDatasetMenu(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${
                              datasetType === 'private-zones'
                                ? 'bg-stone-100 text-stone-900'
                                : 'text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="font-semibold mb-1">Private Debug Zones</div>
                            <div className="text-[10px] text-stone-500">Heavy &lt;. .&gt; usage to hide internal reasoning</div>
                          </button>
                          <button
                            onClick={() => { setDatasetType('minimal-zones'); setShowDatasetMenu(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-mono rounded transition-colors ${
                              datasetType === 'minimal-zones'
                                ? 'bg-stone-100 text-stone-900'
                                : 'text-stone-600 hover:bg-stone-50'
                            }`}
                          >
                            <div className="font-semibold mb-1">Minimal Zone Usage</div>
                            <div className="text-[10px] text-stone-500">Light syntax, basic pass-through only</div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics - Above chart */}
            {displayMetrics && (
              <div className="bg-white border-b border-stone-200/60 px-8 py-8">
                <motion.div
                  className="grid grid-cols-4 gap-12 max-w-4xl mx-auto"
                  key={displayIteration}
                  initial={isHovering ? { opacity: 0.7 } : false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-typewriter text-center">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Iteration</div>
                    <div className="text-2xl font-semibold text-[#2D1300] tracking-tight">{displayIteration}</div>
                  </div>
                  <div className="font-typewriter text-center">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Token Savings</div>
                    <div className="text-2xl font-semibold text-stamp-green tracking-tight">{displayMetrics.improvement.tokens}%</div>
                  </div>
                  <div className="font-typewriter text-center">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Time Saved</div>
                    <div className="text-2xl font-semibold text-stamp-green tracking-tight">{displayMetrics.improvement.time}%</div>
                  </div>
                  <div className="font-typewriter text-center">
                    <div className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Cost Savings</div>
                    <div className="text-2xl font-semibold text-stamp-green tracking-tight">{displayMetrics.improvement.cost}%</div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Graph Content */}
            <div className="relative h-[500px] bg-gradient-to-br from-white to-stone-50 p-8 overflow-hidden">
              <div
                className="w-full h-full cursor-crosshair relative z-0"
                onWheel={handleWheel}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false)
                  setHoveredIteration(null)
                }}
                onTouchStart={() => setIsHovering(true)}
                onTouchEnd={() => {
                  setIsHovering(false)
                  setHoveredIteration(null)
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 50, right: 40, left: 10, bottom: 50 }}
                    onMouseMove={(e: any) => {
                      if (e && e.activeLabel) {
                        const iteration = parseInt(e.activeLabel)
                        setHoveredIteration(iteration)
                        setCurrentIteration(iteration)
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="0" stroke="#e7e5e4" strokeOpacity={0.4} vertical={false} />
                    <XAxis
                      dataKey="iteration"
                      stroke="none"
                      tick={{ fill: '#a8a29e', fontSize: 13, fontFamily: 'var(--font-typewriter)', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      domain={[1, 20]}
                      ticks={[1, 5, 10, 15, 20]}
                    />
                    <YAxis
                      stroke="none"
                      tick={{ fill: '#a8a29e', fontSize: 13, fontFamily: 'var(--font-typewriter)', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      width={70}
                      domain={[0, 'dataMax + 3000']}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;

                        // Filter out "Future" entries to show only unique values
                        const uniquePayload = payload.filter((entry: any) =>
                          !entry.name.includes('Future')
                        );

                        return (
                          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/50 p-5 min-w-[200px]">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-typewriter font-semibold">
                                Iteration {label}
                              </div>
                              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-typewriter font-semibold">
                                Token Use
                              </div>
                            </div>
                            <div className="space-y-2.5">
                              {uniquePayload.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center justify-between gap-6">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2.5 h-2.5 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs font-typewriter text-stone-600 font-medium">
                                      {entry.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-typewriter font-bold text-[#2D1300] tabular-nums">
                                    {entry.value ? `${(entry.value / 1000).toFixed(1)}k` : '0k'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />
                    {/* Unexplored lines (dashed) - render first so solid lines overlay */}
                    <Line
                      type="monotone"
                      dataKey="Regular Prompting Future"
                      stroke="#DC2626"
                      strokeWidth={2.5}
                      strokeDasharray="8 4"
                      strokeOpacity={0.4}
                      dot={{
                        fill: '#DC2626',
                        r: 4,
                        strokeWidth: 0,
                        fillOpacity: 0.4
                      }}
                      activeDot={false}
                      isAnimationActive={false}
                      animationDuration={0}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="Prompting with PS-LANG Future"
                      stroke="#16A34A"
                      strokeWidth={2.5}
                      strokeDasharray="8 4"
                      strokeOpacity={0.4}
                      dot={{
                        fill: '#16A34A',
                        r: 4,
                        strokeWidth: 0,
                        fillOpacity: 0.4
                      }}
                      activeDot={false}
                      isAnimationActive={false}
                      animationDuration={0}
                      connectNulls
                    />

                    {/* Explored lines (solid) - render on top */}
                    <Line
                      type="monotone"
                      dataKey="Regular Prompting"
                      stroke="#DC2626"
                      strokeWidth={2.5}
                      dot={{
                        fill: '#DC2626',
                        r: 5,
                        strokeWidth: 0
                      }}
                      activeDot={{ r: 7, fill: '#DC2626', stroke: '#fff', strokeWidth: 3 }}
                      isAnimationActive={false}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="Prompting with PS-LANG"
                      stroke="#16A34A"
                      strokeWidth={2.5}
                      dot={{
                        fill: '#16A34A',
                        r: 5,
                        strokeWidth: 0
                      }}
                      activeDot={{ r: 7, fill: '#16A34A', stroke: '#fff', strokeWidth: 3 }}
                      isAnimationActive={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* Footer bar with legend */}
            {displayMetrics && (
              <div className="bg-stone-50/50 border-t border-stone-200 px-8 py-6">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                  {/* Left side - Legend items */}
                  <div className="flex items-center gap-16">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-light text-stone-900">Regular Prompting</span>
                        <span className="text-xs font-mono text-stone-400 tabular-nums">
                          {(cumulativeData.regularTotal / 1000).toFixed(1)}k tokens total
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-light text-stone-900">Prompting with PS-LANG</span>
                        <span className="text-xs font-mono text-stone-400 tabular-nums">
                          {(cumulativeData.psLangTotal / 1000).toFixed(1)}k tokens total
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Tokens saved */}
                  <div className="flex items-baseline gap-3 px-6 py-3 bg-green-50/60 border border-green-200/40">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-green-700/70 font-medium mb-1">
                        Tokens Saved
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-light text-green-700 tabular-nums">
                          {(cumulativeData.tokensSaved / 1000).toFixed(1)}k
                        </span>
                        <span className="text-sm font-mono text-green-600/80">
                          {cumulativeData.savingsPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-16 sm:mt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="border border-stone-300 bg-stone-50 p-8 sm:p-10">
              <h3 className="text-lg font-light text-stone-900 mb-5 tracking-tight">
                About This Demo
              </h3>
              <div className="space-y-4 text-sm text-stone-600 leading-relaxed max-w-3xl">
                <p>
                  This interactive chart uses simulated data to demonstrate how PS-LANG zone syntax can improve token efficiency in multi-agent workflows.
                </p>
                <p>
                  All metrics shown are sample data for visualization purposes. Real-world results depend on your specific use case, prompt structure, and agent pipeline complexity.
                </p>
                <p className="font-medium text-stone-900">
                  Real benchmarking results are coming soon!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-8 mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="mb-8 text-center">
              <div className="inline-block mb-4">
                <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">FAQ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">
                Understanding Token Metrics
              </h2>
            </div>

            <div className="border border-stone-300 bg-white p-8 sm:p-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-light text-stone-900 mb-3">What are these metrics showing?</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    This chart shows simulated token usage across 20 iterations, comparing regular prompting vs. prompting with PS-LANG syntax. The metrics demonstrate potential efficiency gains from structured context control.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-light text-stone-900 mb-3">How does PS-LANG reduce token usage?</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    PS-LANG uses zone-based syntax to control what context gets passed between agents. By filtering out unnecessary information and preventing context contamination, you pass only relevant data to each agent in your pipeline.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-light text-stone-900 mb-3">Are these real benchmarks?</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    These are sample metrics for demonstration purposes. Actual savings depend on your specific use case, prompt structure, and agent pipeline complexity. Real-world results will vary.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-light text-stone-900 mb-3">How do I get started with PS-LANG?</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Install with <code className="bg-stone-100 px-2 py-1 font-mono text-xs">npx ps-lang@alpha init</code> and start adding zone syntax to your prompts. Check the <a href="https://github.com/vummo/ps-lang" className="text-stone-900 underline hover:text-stone-600 transition-colors">GitHub repo</a> for documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alpha Testing CTA */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-16 sm:mt-20 mb-16">
          <div className="border border-stone-300 bg-gradient-to-br from-stone-50 to-white p-8 sm:p-12 text-center">
            <div className="inline-block mb-4">
              <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Alpha Testing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 tracking-tight">
              Help Shape PS-LANG
            </h2>
            <p className="text-base text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our alpha testing program to get early access, influence development priorities, and work directly with the team to build better multi-agent workflows.
            </p>
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="inline-block px-8 py-4 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
            >
              Join Alpha Program →
            </button>
          </div>
        </div>
      </div>

      <AlphaSignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </div>
  )
}
