"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion } from "framer-motion"

interface DetailPanelProps {
  sessionId: string
  title: string
  onClose: () => void
}

export default function DetailPanel({ sessionId, title, onClose }: DetailPanelProps) {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<"summary" | "meta-tags" | "artifacts">("summary")

  const metaTags = useQuery(api.agenticUX.getSessionMetaTags, { sessionId })
  const streamEvents = useQuery(api.agenticUX.getSessionEvents, { sessionId })
  const artifacts = useQuery(api.agenticUX.getSessionArtifacts, { sessionId })
  const kpis = useQuery(api.agenticUX.getSessionKPIs, { sessionId })

  const createArtifact = useMutation(api.agenticUX.createArtifact)

  const handleExportLLMsTxt = async () => {
    if (!user || !metaTags) return

    // Generate llms.txt content
    const publicTags = metaTags.filter((t) => t.zone === "public")
    const privateTags = metaTags.filter((t) => t.zone === "private")
    const managedTags = metaTags.filter((t) => t.zone === "managed")

    const content = `# PS-LANG Agentic UX Session Export
# Session ID: ${sessionId}
# Generated: ${new Date().toISOString()}

## Public Meta-Tags
${publicTags.map((t) => `${t.name}: ${JSON.stringify(t.value)}`).join('\n')}

## Private Meta-Tags
${privateTags.map((t) => `${t.name}: ${JSON.stringify(t.value)}`).join('\n')}

## Managed Meta-Tags
${managedTags.map((t) => `${t.name}: ${JSON.stringify(t.value)}`).join('\n')}

## Zones
Respect PS-LANG zone semantics: public | private | read-only | managed
`

    const checksum = btoa(content).substring(0, 16)

    await createArtifact({
      sessionId,
      type: "llms.txt",
      content,
      checksum,
      visibility: "public",
      userId: user.id,
    })

    // Download file
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `agentic-session-${sessionId.substring(0, 8)}-llms.txt`
    a.click()
    URL.revokeObjectURL(url)

    // Track in PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('agentic_export_llms_txt', {
        sessionId,
      })
    }
  }

  const handleExportJSONLD = async () => {
    if (!user) return

    const jsonld = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Journal Plus — Agentic UX Session",
      "url": `https://ps-lang.dev/journal-plus#session-${sessionId}`,
      "isPartOf": {
        "@type": "SoftwareApplication",
        "name": "Journal Plus",
        "applicationCategory": "DeveloperTool",
      },
      "potentialAction": [
        {
          "@type": "Action",
          "name": "View Agentic Stream",
          "target": `https://ps-lang.dev/journal-plus#stream-${sessionId}`,
          "actionStatus": "CompletedActionStatus",
        },
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": ["Developers", "Researchers", "Reviewers"],
      },
      "temporalCoverage": new Date().toISOString(),
    }

    const content = JSON.stringify(jsonld, null, 2)
    const checksum = btoa(content).substring(0, 16)

    await createArtifact({
      sessionId,
      type: "webpage.jsonld",
      content,
      checksum,
      visibility: "public",
      userId: user.id,
    })

    // Download file
    const blob = new Blob([content], { type: "application/ld+json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `agentic-session-${sessionId.substring(0, 8)}-jsonld.json`
    a.click()
    URL.revokeObjectURL(url)

    // Track in GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'agentic_export_jsonld', {
        event_category: 'agentic_ux',
        event_label: 'export',
      })
    }
  }

  return (
    <motion.div
      className="border border-stone-200 bg-white"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, ease: "easeInOut" }}
      data-ai-component="detail-panel"
      data-ai-zone="public"
    >
      {/* Header */}
      <div className="border-b border-stone-100 bg-gradient-to-b from-stone-50/50 to-white px-8 py-6 flex items-center justify-between">
        <h3
          className="text-2xl font-light text-stone-900 tracking-tight"
          style={{ fontFamily: 'var(--font-crimson)' }}
          data-ai-heading="panel-title"
        >
          {title}
        </h3>
        <button
          onClick={onClose}
          className="text-stone-500 hover:text-stone-900 transition-colors"
          data-ai-action="close-panel"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 px-8 flex gap-8">
        {["summary", "meta-tags", "artifacts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`py-4 text-sm uppercase tracking-wider font-medium transition-colors ${
              activeTab === tab
                ? 'text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-500 hover:text-stone-700'
            }`}
            data-ai-tab={tab}
            data-ai-state={activeTab === tab ? 'active' : 'inactive'}
          >
            {tab === "meta-tags" ? "Meta-Tags" : tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm uppercase tracking-wider text-stone-700 font-medium mb-4">
                Session Summary
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-stone-200 p-4">
                  <div className="text-xs text-stone-500 mb-1">Total Events</div>
                  <div className="text-2xl font-light text-stone-900">{kpis?.totalEvents || 0}</div>
                </div>
                <div className="border border-stone-200 p-4">
                  <div className="text-xs text-stone-500 mb-1">RLHF Signals</div>
                  <div className="text-2xl font-light text-stone-900">{kpis?.totalRLHFSignals || 0}</div>
                </div>
                <div className="border border-stone-200 p-4">
                  <div className="text-xs text-stone-500 mb-1">Action Complete Rate</div>
                  <div className="text-2xl font-light text-stone-900">
                    {((kpis?.actionCompleteRate || 0) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="border border-stone-200 p-4">
                  <div className="text-xs text-stone-500 mb-1">Avg RLHF Score</div>
                  <div className="text-2xl font-light text-stone-900">
                    {(kpis?.rlhfScoreAvg || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "meta-tags" && (
          <div className="space-y-3">
            {(metaTags || []).map((tag, index) => (
              <div key={index} className="border border-stone-200 p-4 bg-stone-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs text-stone-900 mb-1">{tag.name}</div>
                    <div className="text-xs text-stone-600">
                      Value: {JSON.stringify(tag.value)}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      Zone: {tag.zone} • Visibility: {tag.visibility}
                    </div>
                  </div>
                  <div className="text-xs text-stone-400">
                    {new Date(tag.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "artifacts" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm uppercase tracking-wider text-stone-700 font-medium mb-4">
                Export Artifacts
              </h4>
              <div className="space-y-4">
                <div className="border border-stone-200 p-6 bg-stone-50">
                  <h5 className="font-medium text-stone-900 mb-2">llms.txt</h5>
                  <p className="text-sm text-stone-600 mb-4">
                    Export session meta-tags as llms.txt with PS-LANG zone annotations
                  </p>
                  <button
                    onClick={handleExportLLMsTxt}
                    className="px-6 py-2 bg-stone-900 text-white text-sm hover:bg-stone-800 transition-colors"
                    data-ai-action="export-llms-txt"
                  >
                    Export llms.txt
                  </button>
                </div>

                <div className="border border-stone-200 p-6 bg-stone-50">
                  <h5 className="font-medium text-stone-900 mb-2">JSON-LD</h5>
                  <p className="text-sm text-stone-600 mb-4">
                    Export session as structured data for search engines and AI agents
                  </p>
                  <button
                    onClick={handleExportJSONLD}
                    className="px-6 py-2 bg-stone-900 text-white text-sm hover:bg-stone-800 transition-colors"
                    data-ai-action="export-jsonld"
                  >
                    Export JSON-LD
                  </button>
                </div>
              </div>
            </div>

            {artifacts && artifacts.length > 0 && (
              <div>
                <h4 className="text-sm uppercase tracking-wider text-stone-700 font-medium mb-4">
                  Generated Artifacts
                </h4>
                <div className="space-y-2">
                  {artifacts.map((artifact, index) => (
                    <div key={index} className="border border-stone-200 p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-stone-900">{artifact.type}</div>
                        <div className="text-xs text-stone-500">
                          {new Date(artifact.createdAt).toLocaleString()} • Checksum: {artifact.checksum}
                        </div>
                      </div>
                      <div className="text-xs text-stone-500">✓ Exported</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
