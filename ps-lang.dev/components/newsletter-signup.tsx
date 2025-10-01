"use client"

import { useState } from "react"

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

  const interestOptions = [
    "Multi-Agent Workflows",
    "Agent Benchmarking",
    "Privacy-First Tools"
  ]

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
        setEmail("")
        setFirstName("")
        setLastName("")
        setInterests([])

        // Track successful signup in PostHog
        if (typeof window !== 'undefined' && (window as any).posthog) {
          (window as any).posthog.capture('newsletter_signup', {
            email_domain: email.split('@')[1],
            source: 'homepage_hero',
            interests: interests
          })
        }

        // Call onSuccess callback after 2 seconds
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to subscribe")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
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
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Interests checkboxes */}
        <div className="space-y-3">
          <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Interests (Optional)</p>
          <div className="space-y-2.5">
            {interestOptions.map((interest) => (
              <label
                key={interest}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  disabled={status === "loading"}
                  className="mt-0.5 w-4 h-4 border-2 border-stone-300 rounded bg-white checked:bg-[#2D1300] checked:border-[#2D1300] focus:outline-none focus:ring-2 focus:ring-[#2D1300] focus:ring-offset-2 disabled:opacity-50 cursor-pointer transition-all"
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