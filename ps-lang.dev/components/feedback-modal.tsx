"use client"

import { useState } from "react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  version: string
}

export default function FeedbackModal({ isOpen, onClose, version }: FeedbackModalProps) {
  const [role, setRole] = useState("Developer")
  const [feedbackType, setFeedbackType] = useState("General Feedback")
  const [rating, setRating] = useState(5)
  const [feedback, setFeedback] = useState("")
  const [emailUpdates, setEmailUpdates] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send to backend API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          feedbackType,
          feedback,
          rating,
          emailUpdates,
          version
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      // Track with PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('feedback_submitted', {
          version: version,
          role: role,
          feedback_type: feedbackType,
          rating: rating,
          has_text_feedback: feedback.length > 0,
          email_updates_opted_in: emailUpdates
        })
      }

      // Track with Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'feedback_submission', {
          event_category: 'engagement',
          event_label: version,
          value: rating
        })
      }

      // Reset form
      setFeedback("")
      setRating(5)
      setEmailUpdates(false)
      setIsSubmitting(false)

      // Show success message and close
      alert(`Thank you for your feedback on ${version}!`)
      onClose()
    } catch (error) {
      console.error('Feedback submission error:', error)
      alert('Failed to submit feedback. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-stone-200 p-6 sm:p-8 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
        data-track-section="feedback-modal"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-light text-stone-900 mb-2">Feedback for {version}</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Help us improve the experience! Your feedback shapes our development.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              I am a...
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400"
            >
              <option>Developer</option>
              <option>Designer</option>
              <option>Startup Founder</option>
              <option>Marketer</option>
              <option>Student</option>
              <option>Researcher</option>
              <option>Consultant</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </div>

          {/* Feedback Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Feedback Type
            </label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400"
            >
              <option>General Feedback</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>Documentation</option>
              <option>Performance Issue</option>
              <option>UX/Design</option>
              <option>Other</option>
            </select>
          </div>

          {/* Rating Slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Rating (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 appearance-none cursor-pointer accent-stone-600"
              style={{
                background: `linear-gradient(to right, #57534e 0%, #57534e ${(rating - 1) * 11.11}%, #e7e5e4 ${(rating - 1) * 11.11}%, #e7e5e4 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-stone-500 mt-1">
              <span>1 (Poor)</span>
              <span className="font-medium text-stone-900">{rating}</span>
              <span>10 (Excellent)</span>
            </div>
          </div>

          {/* Feedback Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Your Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think about this version..."
              rows={4}
              className="w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 resize-none"
            />
          </div>

          {/* Email Updates Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                className="mt-1 w-4 h-4 border-stone-300 text-stone-600 focus:ring-stone-400"
              />
              <span className="text-sm text-stone-600">
                Get occasional updates on user feedback insights
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2D1300] text-white px-6 py-3 text-sm tracking-wide hover:bg-[#1a0b00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
