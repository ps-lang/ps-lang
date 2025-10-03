"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FeatureRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeatureRequestModal({ isOpen, onClose }: FeatureRequestModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [featureType, setFeatureType] = useState("New Playground Demo")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Track with PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('feature_request_submitted', {
        feature_type: featureType,
        has_description: description.length > 0,
      })
    }

    try {
      const response = await fetch("/api/feature-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, featureType, title, description }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit request")
      }

      setIsSuccess(true)
      setEmail("")
      setName("")
      setTitle("")
      setDescription("")
      setFeatureType("New Playground Demo")

      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-stone-300 w-full max-w-2xl shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-stone-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-block mb-2">
                      <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Feedback</span>
                    </div>
                    <h2 className="text-2xl font-light text-stone-900 tracking-tight">
                      Request a Feature
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-8">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-light text-stone-900 mb-2">Request Submitted!</h3>
                    <p className="text-sm text-stone-600">Thank you for your feedback. We'll review your suggestion.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Share your ideas for new playground demos, features, or improvements. Your feedback helps us build better tools for the community.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="featureType" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        Request Type
                      </label>
                      <select
                        id="featureType"
                        value={featureType}
                        onChange={(e) => setFeatureType(e.target.value)}
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                      >
                        <option>New Playground Demo</option>
                        <option>Enhancement to Existing Demo</option>
                        <option>Documentation Improvement</option>
                        <option>New Zone Syntax Feature</option>
                        <option>Performance Improvement</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        Feature Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Brief title for your feature request"
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-xs tracking-wide text-stone-600 uppercase mb-2 font-medium">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your feature request in detail. What problem does it solve? How would it work?"
                        rows={6}
                        className="w-full border border-stone-300 px-4 py-3 text-sm text-stone-900 bg-white focus:border-stone-900 focus:outline-none transition-colors resize-none"
                        required
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600">{error}</p>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-4 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-4 text-sm font-light text-stone-600 hover:text-stone-900 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
