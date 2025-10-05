"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { motion, AnimatePresence } from "framer-motion"
import CapabilityPicker from "./jp-capability-picker"
import StreamConsole from "./jp-stream-console"
import DetailPanel from "./jp-detail-panel"

export default function AgenticShell() {
  const { user } = useUser()
  const [sessionId, setSessionId] = useState<string>("")
  const [activeCapability, setActiveCapability] = useState<string | null>(null)
  const [showStreamConsole, setShowStreamConsole] = useState(false)
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [detailPanelTitle, setDetailPanelTitle] = useState("")

  const createMetaTag = useMutation(api.agenticUX.createMetaTag)
  const emitStreamEvent = useMutation(api.agenticUX.emitStreamEvent)

  // Generate session ID on mount
  useEffect(() => {
    const sid = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    setSessionId(sid)

    // Emit init meta tag
    if (user) {
      createMetaTag({
        sessionId: sid,
        name: "ux.stream.init",
        value: true,
        source: "jp.AgenticShell",
        zone: "read-only",
        visibility: "public",
        userId: user.id,
      })
    }
  }, [user])

  const handleCapabilitySelect = async (capabilityId: string) => {
    setActiveCapability(capabilityId)
    setShowStreamConsole(true)

    // Create meta tag for capability selection
    if (user && sessionId) {
      await createMetaTag({
        sessionId,
        name: "ux.intent.select_capability",
        value: capabilityId,
        source: "jp.CapabilityPicker",
        zone: "public",
        visibility: "public",
        userId: user.id,
      })

      // Emit stream event
      await emitStreamEvent({
        sessionId,
        componentId: "jp.CapabilityPicker",
        action: "ux.stream.start",
        payload: { capability: capabilityId },
        metaTags: ["ux.intent.select_capability"],
        zone: "public",
        userId: user.id,
      })

      // Track in PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('agentic_capability_selected', {
          capability: capabilityId,
          sessionId,
        })
      }

      // Track in GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'agentic_capability_select', {
          event_category: 'agentic_ux',
          event_label: capabilityId,
        })
      }
    }
  }

  const handleOpenDetailPanel = (title: string) => {
    setDetailPanelTitle(title)
    setShowDetailPanel(true)

    if (user && sessionId) {
      createMetaTag({
        sessionId,
        name: "panel.open",
        value: title,
        source: "jp.DetailPanel",
        zone: "read-only",
        visibility: "public",
        userId: user.id,
      })
    }
  }

  return (
    <div
      className="max-w-6xl mx-auto px-8 py-16"
      data-ai-component="agentic-shell"
      data-ai-session={sessionId}
      data-ai-zone="interactive"
    >
      {/* 12-column grid layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Capability Picker - Full Width */}
        <div className="col-span-12">
          <CapabilityPicker
            onSelect={handleCapabilitySelect}
            activeCapability={activeCapability}
          />
        </div>

        {/* Stream Console - Animated Entry */}
        <AnimatePresence>
          {showStreamConsole && (
            <motion.div
              className="col-span-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
            >
              <StreamConsole
                sessionId={sessionId}
                activeCapability={activeCapability}
                onOpenDetailPanel={handleOpenDetailPanel}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detail Panel - Animated Entry */}
        <AnimatePresence>
          {showDetailPanel && (
            <motion.div
              className="col-span-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
            >
              <DetailPanel
                sessionId={sessionId}
                title={detailPanelTitle}
                onClose={() => setShowDetailPanel(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
