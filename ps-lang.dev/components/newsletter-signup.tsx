"use client"

import { useState } from "react"
import { siteConfig } from "@/config/site"

interface NewsletterSignupProps {
  onSuccess?: () => void
  source?: string
}

export default function NewsletterSignup({ onSuccess, source = 'newsletter_modal' }: NewsletterSignupProps = {}) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  // Contextual interest options based on source
  const getInterestOptions = () => {
    switch (source) {
      case 'journal_page':
        return [
          "PS-LANG Journal Features",
          "AI Workflow Tracking",
          "Benchmark Insights"
        ]
      case 'homepage':
        return [
          "Multi-Agent Workflows",
          "Agent Benchmarking",
          "Privacy-First Tools"
        ]
      default:
        return [
          "Multi-Agent Workflows",
          "Agent Benchmarking",
          "Privacy-First Tools"
        ]
    }
  }

  const interestOptions = getInterestOptions()

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    // Build agentic metadata
    const emailDomain = email.split('@')[1]
    const timestamp = new Date().toISOString()
    const agenticMetadata = {
      // Component identity
      component: 'newsletter-signup',
      component_version: 'v1.0.0',
      interaction_type: 'form_submission',

      // User context
      source: source,
      interests: interests,
      interest_count: interests.length,
      has_name: !!(firstName || lastName),

      // Segmentation
      email_domain: emailDomain,
      user_segment: emailDomain.includes('gmail.com') || emailDomain.includes('yahoo.com') ? 'consumer' : 'business',
      intent_level: interests.length > 0 ? 'high_intent' : 'general_interest',

      // Agentic UX metadata
      ui_variant: 'contextual_interests',
      interest_options_shown: getInterestOptions(),
      timestamp: timestamp,

      // AI workflow tracking
      workflow_stage: 'lead_capture',
      conversion_funnel: 'newsletter_signup',
      data_stream: 'agentic_ux_v1',

      // Platform metadata
      project: 'ps-lang',
      platform_version: siteConfig.version
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, interests, source }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Successfully subscribed!")

        const successMetadata = {
          ...agenticMetadata,
          outcome: 'success',
          response_metadata: data.metadata
        }

        // Track in PostHog with enriched metadata
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('newsletter_signup_success', successMetadata)

          // Set user properties for segmentation
          (window as any).posthog.people?.set({
            newsletter_subscriber: true,
            newsletter_source: source,
            newsletter_interests: interests,
            newsletter_signup_date: timestamp
          })
        }

        // Track in Google Analytics with enriched metadata
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            event_category: 'engagement',
            event_label: source,
            value: interests.length,
            ...successMetadata
          })
        }

        setEmail("")
        setFirstName("")
        setLastName("")
        setInterests([])

        // Call onSuccess callback after 2 seconds
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")

        const errorMetadata = {
          ...agenticMetadata,
          outcome: 'error',
          error_message: data.error
        }

        // Track errors in PostHog
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('newsletter_signup_error', errorMetadata)
        }

        // Track errors in Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_error', {
            event_category: 'error',
            event_label: data.error,
            ...errorMetadata
          })
        }
      }
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")

      const exceptionMetadata = {
        ...agenticMetadata,
        outcome: 'exception',
        error_type: 'network_error'
      }

      // Track exceptions in PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('newsletter_signup_exception', exceptionMetadata)
      }
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      if (status !== "loading") {
        setStatus("idle")
        setMessage("")
      }
    }, 5000)
  }

  return (
    <div
      className="w-full"
      data-component="newsletter-signup"
      data-component-version="v1.0.0"
      data-source={source}
      data-data-stream="agentic_ux_v1"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        data-workflow-stage="lead_capture"
        data-conversion-funnel="newsletter_signup"
      >
        {/* Interests checkboxes */}
        <div
          className="space-y-3"
          data-interaction="interest-selection"
          data-ui-variant="contextual_interests"
        >
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Interests (Optional)</p>
          <div className="space-y-2.5">
            {interestOptions.map((interest) => (
              <label
                key={interest}
                className="flex items-start gap-3 cursor-pointer group"
                data-interest-option={interest}
              >
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  disabled={status === "loading"}
                  className="mt-0.5 w-4 h-4 border-2 border-stone-300 rounded bg-white checked:bg-[#2D1300] checked:border-[#2D1300] focus:outline-none focus:ring-2 focus:ring-[#2D1300] focus:ring-offset-2 disabled:opacity-50 cursor-pointer transition-all"
                  data-tracking="interest-checkbox"
                  data-value={interest}
                />
                <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors leading-snug">
                  {interest}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Name inputs (optional) */}
        <div className="space-y-3 pt-2 border-t border-stone-200">
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Your Details</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              disabled={status === "loading"}
              className="w-full px-4 py-2.5 border border-stone-300 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#2D1300] focus:ring-1 focus:ring-[#2D1300] transition-colors disabled:opacity-50"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name (optional)"
              disabled={status === "loading"}
              className="w-full px-4 py-2.5 border border-stone-300 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#2D1300] focus:ring-1 focus:ring-[#2D1300] transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Email input and button */}
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === "loading"}
            className="w-full px-4 py-3 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#2D1300] focus:ring-1 focus:ring-[#2D1300] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-6 py-3 bg-[#2D1300] text-white text-sm font-medium tracking-wide hover:bg-[#1a0b00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "SUBSCRIBING..." : "GET UPDATES"}
          </button>
        </div>
      </form>

      {/* Status message */}
      {message && (
        <p
          className={`mt-3 text-sm text-center ${
            status === "success" ? "text-green-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      {/* Fine print */}
      <p className="mt-6 text-xs text-stone-500 leading-relaxed text-center">
        No spam, unsubscribe anytime. Delivered by{" "}
        <a
          href="https://vummo.com"
          target="_blank"
          title="Visit Vummo Labs - AI development tools and multi-agent workflow solutions"
          className="underline hover:text-[#2D1300] transition-colors"
        >
          Vummo Labs
        </a>
        .
      </p>
    </div>
  )
}