"use client"

interface UseCaseModalProps {
  isOpen: boolean
  onClose: () => void
  useCase: string
  onNext?: () => void
  onPrev?: () => void
}

const useCaseExamples: Record<string, { title: string; description: string; example: string }> = {
  "Agent Pipelines": {
    title: "Agent Pipelines",
    description: "Chain agents together with clean context handoffs. Each agent only sees what it needs.",
    example: `<. Agent A: Research .>
Internal notes, raw data, API responses
Debug info, exploratory thoughts

<#. → Agent B: Analysis #.>
Cleaned findings ready for analysis
Key insights from research

<#. → Agent C: Writing #.>
Structured analysis results
Ready for content generation`
  },
  "Benchmark Testing": {
    title: "Benchmark Testing",
    description: "Test agents without contamination from upstream reasoning or hints.",
    example: `<. Upstream agent reasoning .>
I think the answer is X because...
Let me try approach Y...

<#. Clean test input for Agent B #.>
Task: Solve this problem
Data: [clean inputs only]
Expected output format

<.bm test-results
agent_performance: 94%
contamination: 0%
true_capability: validated
.bm>`
  },
  "Context Pruning": {
    title: "Context Pruning",
    description: "Remove noise and keep only what matters for the next agent in the chain.",
    example: `<. Hidden: Debug logs, failed attempts .>
Tried X - didn't work
API rate limit hit 3 times
Raw JSON response...

<#. Passed: Final results only #.>
Successfully processed 100 records
Output: [clean structured data]
Ready for next stage

<~. Metadata: Performance stats ~.>
tokens_saved: 2400
context_reduced: 73%`
  },
  "Research → Writing": {
    title: "Research → Writing",
    description: "Research agent collects data, writing agent creates content from clean findings.",
    example: `<. Research Agent: Raw findings .>
Found 15 sources on multi-agent patterns
Analyzed existing solutions
Explored LangChain docs, AutoGen examples
Notes on positioning strategy...

<#. → Writing Agent #.>
Key findings:
- Most tools lack context control
- Benchmarking needs clean inputs
- Developers want backwards compatibility

Target audience: AI engineers
Tone: Confident, authentic, purposeful`
  },
  "Analysis → Reporting": {
    title: "Analysis → Reporting",
    description: "Analysis agent processes data, reporting agent creates executive summaries.",
    example: `<. Analysis: Deep dive .>
Tested 3 agent pipeline approaches
Measured token efficiency across setups
Validated zone syntax performance
Statistical confidence: 95%

<#. → Reporting Agent #.>
Key findings:
- Token usage reduced 47% with zones
- Agent accuracy improved 23%
- Clean handoffs = better benchmarks

Recommendation: Ship playground demo to validate real-world usage`
  },
  "Code → Documentation": {
    title: "Code → Documentation",
    description: "Coding agent builds features, documentation agent writes clean docs from results.",
    example: `<. Coding Agent: Implementation .>
// Internal notes: Privacy-first approach
// Tested with PostHog, GA, Resend
// Zone filtering working as expected
// Ready for production

<#. → Documentation Agent #.>
Function: parseZoneSyntax()
Purpose: Extracts PS-LANG zones from text
Returns: ZoneCollection with privacy controls
Example:
  const zones = parseZoneSyntax(content)
  zones.getPassthrough() // Only <#.> content`
  },
  "MCP Agent Chains": {
    title: "MCP Agent Chains",
    description: "Model Context Protocol agents with controlled information flow between stages.",
    example: `<. MCP Agent 1: Context Gathering .>
Scanned codebase for zone patterns
Found 47 PS-LANG files
Extracted metadata tags
Validation: All zones well-formed

<#. → MCP Agent 2: Analysis #.>
Zone usage patterns identified
Most common: <.> and <#.>
Privacy zones properly isolated
Ready for optimization pipeline

<@. Active: Agent workspace @.>
Generating LangChain adapter
Testing with Claude, GPT-4
Integration verified`
  },
  "Role Separation": {
    title: "Role Separation",
    description: "Separate concerns by role - planner, executor, reviewer each see only relevant context.",
    example: `<. Planner: Strategy .>
Build demo playground with live examples
Show token savings in real-time
Interactive zone selector
Week 1-2 target

<#. → Executor: Implementation #.>
Task: Build playground UI
Features: Side-by-side comparison
Show before/after metrics
Tech: Next.js, Tailwind

<#. → Reviewer: Quality Check #.>
Validate example accuracy
Check brand alignment (confident, authentic)
Test mobile responsiveness
Verify analytics tracking`
  }
}

export default function UseCaseModal({ isOpen, onClose, useCase, onNext, onPrev }: UseCaseModalProps) {
  if (!isOpen) return null

  const example = useCaseExamples[useCase]

  if (!example) return null

  return (
    <div
      className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 border border-stone-300 max-w-3xl w-full shadow-2xl max-h-[85vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
        data-track-section="use-case-modal"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-white border-b border-stone-300 px-8 py-8">
          <div className="mb-3">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Use Case</span>
          </div>
          <h2 className="text-3xl font-light text-stone-900 mb-4 tracking-tight">{example.title}</h2>
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            {example.description}
          </p>
        </div>

        {/* Example code */}
        <div className="px-8 py-8">
          <div className="border border-stone-300 bg-white p-6 sm:p-8">
            <div className="mb-4">
              <span className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium">Example</span>
            </div>
            <pre className="font-mono text-xs sm:text-sm text-stone-700 leading-[1.7] overflow-x-auto whitespace-pre-wrap break-words">
              {example.example}
            </pre>
          </div>
        </div>

        {/* Footer navigation */}
        <div className="bg-white border-t border-stone-300 px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-3">
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="px-4 py-2 text-xs tracking-wide text-stone-600 hover:text-stone-900 transition-colors font-medium"
                  title="Previous use case"
                >
                  ← PREV
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-4 py-2 text-xs tracking-wide text-stone-600 hover:text-stone-900 transition-colors font-medium"
                  title="Next use case"
                >
                  NEXT USE CASE →
                </button>
              )}
            </div>

            <a
              href="/playground"
              className="text-sm text-stone-700 hover:text-stone-900 font-medium transition-colors"
            >
              Try it in the Playground →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
