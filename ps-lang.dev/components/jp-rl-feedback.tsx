"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface RLFeedbackProps {
  sessionId: string
}

export default function RLFeedback({ sessionId }: RLFeedbackProps) {
  const { user } = useUser()
  const [voted, setVoted] = useState<"up" | "down" | null>(null)
  const submitRLHFSignal = useMutation(api.agenticUX.submitRLHFSignal)
  const createMetaTag = useMutation(api.agenticUX.createMetaTag)

  const handleVote = async (value: "up" | "down") => {
    if (!user) return

    setVoted(value)

    const signal = value === "up" ? 1 : -1

    await submitRLHFSignal({
      sessionId,
      signal,
      reason: "user_feedback",
      modelHint: `User ${value === "up" ? "approved" : "disapproved"} this interaction`,
      userId: user.id,
    })

    await createMetaTag({
      sessionId,
      name: "rl.human.feedback",
      value,
      source: "jp.RLFeedback",
      zone: "public",
      visibility: "public",
      userId: user.id,
    })

    // Track in PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('agentic_rlhf_feedback', {
        vote: value,
        sessionId,
      })
    }

    // Track in GA4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'agentic_rlhf_vote', {
        event_category: 'agentic_ux',
        event_label: value,
        value: signal,
      })
    }
  }

  return (
    <div
      className="border border-stone-200 bg-stone-50 p-6"
      data-ai-section="rl-feedback"
      data-ai-zone="public"
    >
      <h4 className="text-sm uppercase tracking-wider text-stone-700 font-medium mb-4">
        RLHF Feedback
      </h4>

      <div className="flex items-center gap-6">
        <p className="text-sm text-stone-600" style={{ fontFamily: 'var(--font-crimson)' }}>
          Was this agentic stream helpful?
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleVote("up")}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
              voted === "up"
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 text-stone-600 hover:border-stone-900 hover:bg-stone-50'
            }`}
            data-ai-vote="thumbs-up"
            data-ai-state={voted === "up" ? 'active' : 'inactive'}
          >
            👍
          </button>

          <button
            onClick={() => handleVote("down")}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
              voted === "down"
                ? 'border-stone-900 bg-stone-900 text-white'
                : 'border-stone-300 text-stone-600 hover:border-stone-900 hover:bg-stone-50'
            }`}
            data-ai-vote="thumbs-down"
            data-ai-state={voted === "down" ? 'active' : 'inactive'}
          >
            👎
          </button>
        </div>

        {voted && (
          <span className="text-sm text-stone-500">
            Thank you for your feedback!
          </span>
        )}
      </div>

      {voted && (
        <div className="mt-4 p-4 bg-white border border-stone-200 text-xs text-stone-600">
          <span className="font-medium">RLHF Signal:</span> {voted === "up" ? "+1.0" : "-1.0"} •{" "}
          <span className="font-medium">Reason:</span> user_feedback •{" "}
          <span className="font-medium">Zone:</span> public
        </div>
      )}
    </div>
  )
}
