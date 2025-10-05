"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import ConsentAndZones from "./jp-consent-zones"
import MetaFeed from "./jp-meta-feed"
import ActionArea from "./jp-action-area"
import RLFeedback from "./jp-rl-feedback"

interface StreamConsoleProps {
  sessionId: string
  activeCapability: string | null
  onOpenDetailPanel: (title: string) => void
}

export default function StreamConsole({
  sessionId,
  activeCapability,
  onOpenDetailPanel,
}: StreamConsoleProps) {
  const { user } = useUser()
  const [consentGranted, setConsentGranted] = useState(false)
  const [activeZone, setActiveZone] = useState("interactive")
  const [activePersona, setActivePersona] = useState("Builder")

  const createMetaTag = useMutation(api.agenticUX.createMetaTag)

  const handleConsentChange = async (granted: boolean) => {
    setConsentGranted(granted)

    if (granted && user) {
      await createMetaTag({
        sessionId,
        name: "consent.granted",
        value: true,
        source: "jp.ConsentAndZones",
        zone: "read-only",
        visibility: "consented",
        userId: user.id,
      })

      // Track in PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('agentic_consent_granted', {
          sessionId,
        })
      }
    }
  }

  const handleZoneChange = async (zone: string) => {
    setActiveZone(zone)

    if (user) {
      await createMetaTag({
        sessionId,
        name: "zone.active",
        value: zone,
        source: "jp.ConsentAndZones",
        zone: "read-only",
        visibility: "public",
        userId: user.id,
      })
    }
  }

  const handlePersonaChange = async (persona: string) => {
    setActivePersona(persona)

    if (user) {
      await createMetaTag({
        sessionId,
        name: "persona.active",
        value: persona,
        source: "jp.ConsentAndZones",
        zone: "public",
        visibility: "public",
        confidence: 0.8,
        userId: user.id,
      })

      // Track in GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'agentic_persona_switch', {
          event_category: 'agentic_ux',
          event_label: persona,
        })
      }
    }
  }

  return (
    <div
      className="border border-stone-200 bg-white"
      data-ai-component="stream-console"
      data-ai-session={sessionId}
      data-ai-zone="interactive"
    >
      {/* Header */}
      <div className="border-b border-stone-100 bg-gradient-to-b from-stone-50/50 to-white px-8 py-6">
        <h3
          className="text-2xl font-light text-stone-900 tracking-tight"
          style={{ fontFamily: 'var(--font-crimson)' }}
          data-ai-heading="console-title"
        >
          Agentic Stream Console
        </h3>
        <p className="text-sm text-stone-500 mt-2">
          Real-time meta-tag emission with PS-LANG zone awareness
        </p>
      </div>

      {/* Content Sections */}
      <div className="p-8 space-y-8">
        {/* Consent & Zones */}
        <ConsentAndZones
          sessionId={sessionId}
          consentGranted={consentGranted}
          activeZone={activeZone}
          activePersona={activePersona}
          onConsentChange={handleConsentChange}
          onZoneChange={handleZoneChange}
          onPersonaChange={handlePersonaChange}
        />

        {/* Meta Feed - Only show if consent granted */}
        {consentGranted && (
          <>
            <MetaFeed sessionId={sessionId} />

            {/* Action Area */}
            <ActionArea
              sessionId={sessionId}
              activeCapability={activeCapability}
              activeZone={activeZone}
              onOpenDetailPanel={onOpenDetailPanel}
            />

            {/* RLHF Feedback */}
            <RLFeedback sessionId={sessionId} />
          </>
        )}

        {!consentGranted && (
          <div className="text-center py-12 border border-stone-200 bg-stone-50">
            <p className="text-stone-600 font-light">
              Grant consent above to begin streaming
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
