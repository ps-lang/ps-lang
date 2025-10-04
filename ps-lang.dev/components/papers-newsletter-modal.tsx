"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

type PapersNewsletterModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function PapersNewsletterModal({ isOpen, onClose }: PapersNewsletterModalProps) {
  const [email, setEmail] = useState("")
  const [frequency, setFrequency] = useState<"weekly" | "biweekly">("biweekly")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const subscribeToPapers = useMutation(api.papersNewsletter.subscribe)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await subscribeToPapers({
        email,
        frequency,
      })

      setSubmitted(true)
      setEmail("")

      // Track with PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('papers_newsletter_subscribed', {
          frequency,
          source: 'papers_modal'
        })
      }

      setTimeout(() => {
        onClose()
        setSubmitted(false)
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Failed to subscribe. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm" />

      <div
        className="relative bg-white border border-stone-300 max-w-md w-full p-8 sm:p-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <span className="text-[10px] tracking-[0.25em] text-stone-400/80 uppercase font-medium block mb-3">
                Research Papers
              </span>
              <h2 className="text-2xl font-light text-stone-900 mb-3 tracking-tight">
                Subscribe to Papers
              </h2>
              <p className="text-[14px] text-stone-600 leading-relaxed tracking-[0.01em]">
                Receive new PS-LANG research papers directly in your inbox. Choose weekly or bi-weekly delivery.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="text-[11px] tracking-[0.15em] text-stone-600 uppercase block mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Frequency Selection */}
              <div>
                <label className="text-[11px] tracking-[0.15em] text-stone-600 uppercase block mb-3 font-medium">
                  Delivery Frequency
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="frequency"
                      value="weekly"
                      checked={frequency === "weekly"}
                      onChange={(e) => setFrequency(e.target.value as "weekly")}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-[14px] text-stone-900 font-medium tracking-[0.01em]">Weekly</div>
                      <div className="text-[13px] text-stone-500 tracking-[0.01em]">New papers every week</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="frequency"
                      value="biweekly"
                      checked={frequency === "biweekly"}
                      onChange={(e) => setFrequency(e.target.value as "biweekly")}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-[14px] text-stone-900 font-medium tracking-[0.01em]">Bi-weekly</div>
                      <div className="text-[13px] text-stone-500 tracking-[0.01em]">New papers every 2 weeks</div>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-[11px] tracking-[0.2em] uppercase font-medium text-white bg-stone-900 hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>

              <p className="text-[12px] text-stone-500 text-center tracking-[0.01em]">
                Unsubscribe anytime. Privacy-first, no spam.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-light text-stone-900 mb-2 tracking-tight">
              Subscribed!
            </h3>
            <p className="text-[14px] text-stone-600 tracking-[0.01em]">
              You'll receive research papers {frequency === "weekly" ? "weekly" : "bi-weekly"}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
