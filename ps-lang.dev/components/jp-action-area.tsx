"use client"

import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface ActionAreaProps {
  sessionId: string
  activeCapability: string | null
  activeZone: string
  onOpenDetailPanel: (title: string) => void
}

export default function ActionArea({
  sessionId,
  activeCapability,
  activeZone,
  onOpenDetailPanel,
}: ActionAreaProps) {
  const { user } = useUser()
  const createMetaTag = useMutation(api.agenticUX.createMetaTag)
  const emitStreamEvent = useMutation(api.agenticUX.emitStreamEvent)
  const submitRLHFSignal = useMutation(api.agenticUX.submitRLHFSignal)

  const handleLoggingAction = async () => {
    if (!user) return

    // Create meta tag
    await createMetaTag({
      sessionId,
      name: "action.logging.simulate",
      value: true,
      source: "jp.ActionArea",
      zone: "private",
      visibility: "private",
      userId: user.id,
    })

    // Emit stream event
    await emitStreamEvent({
      sessionId,
      componentId: "jp.ActionArea",
      action: "logging.import.simulated",
      payload: { items: 5, source: "demo" },
      metaTags: ["action.logging.simulate"],
      zone: "private",
      userId: user.id,
    })

    // RLHF hint
    await submitRLHFSignal({
      sessionId,
      signal: 0.2,
      reason: "completed_action",
      userId: user.id,
    })

    // Track in PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('agentic_action_logging', {
        sessionId,
      })
    }

    onOpenDetailPanel("Logging · Preview")
  }

  const handleBenchmarkAction = async () => {
    if (!user) return

    await createMetaTag({
      sessionId,
      name: "action.benchmark.run",
      value: true,
      source: "jp.ActionArea",
      zone: "public",
      visibility: "public",
      userId: user.id,
    })

    await emitStreamEvent({
      sessionId,
      componentId: "jp.ActionArea",
      action: "bench.run",
      payload: { duration_ms: 800, delta_tokens: -12 },
      metaTags: ["action.benchmark.run"],
      zone: "public",
      userId: user.id,
    })

    await submitRLHFSignal({
      sessionId,
      signal: 0.2,
      reason: "completed_action",
      userId: user.id,
    })

    // Track in GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'agentic_action_benchmark', {
        event_category: 'agentic_ux',
        event_label: 'run_benchmark',
      })
    }

    onOpenDetailPanel("Benchmark · Results")
  }

  const handleAuditAction = async () => {
    if (!user) return

    await createMetaTag({
      sessionId,
      name: "action.audit.preview",
      value: true,
      source: "jp.ActionArea",
      zone: "managed",
      visibility: "consented",
      userId: user.id,
    })

    await emitStreamEvent({
      sessionId,
      componentId: "jp.ActionArea",
      action: "audit.preview",
      payload: { entries: 12 },
      metaTags: ["action.audit.preview"],
      zone: "managed",
      userId: user.id,
    })

    await submitRLHFSignal({
      sessionId,
      signal: 0.2,
      reason: "completed_action",
      userId: user.id,
    })

    onOpenDetailPanel("Audit · Trace")
  }

  const actions = [
    {
      id: "cap.logging",
      label: "Simulate Log Import",
      description: "Preview 5 sample AI conversation logs",
      handler: handleLoggingAction,
      zone: "private",
    },
    {
      id: "cap.bench",
      label: "Run Micro-Benchmark",
      description: "Measure token efficiency improvements",
      handler: handleBenchmarkAction,
      zone: "public",
    },
    {
      id: "cap.audit",
      label: "Preview Audit Trail",
      description: "View comprehensive compliance logs",
      handler: handleAuditAction,
      zone: "managed",
    },
  ]

  const activeAction = actions.find((a) => a.id === activeCapability)

  if (!activeAction) {
    return null
  }

  return (
    <div
      className="border border-stone-200 bg-white p-6"
      data-ai-section="action-area"
      data-ai-capability={activeCapability}
      data-ai-zone={activeZone}
    >
      <h4 className="text-sm uppercase tracking-wider text-stone-700 font-medium mb-4">
        Capability Actions
      </h4>

      <div className="space-y-4">
        <div>
          <h5 className="text-lg font-medium text-stone-900 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
            {activeAction.label}
          </h5>
          <p className="text-sm text-stone-600 mb-4">{activeAction.description}</p>

          <button
            onClick={activeAction.handler}
            className="px-8 py-3 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors tracking-wide"
            data-ai-action="execute-capability"
            data-ai-zone={activeAction.zone}
          >
            {activeAction.label}
          </button>
        </div>

        <div className="text-xs text-stone-500 border-t border-stone-200 pt-4">
          <span className="font-medium">Zone:</span> {activeAction.zone} |{" "}
          <span className="font-medium">Active Zone:</span> {activeZone}
        </div>
      </div>
    </div>
  )
}
