"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function FeatureRequestLeaderboard() {
  const { user } = useUser()
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [filter, setFilter] = useState<string | undefined>(undefined)

  // Fetch feature requests
  const features = useQuery(api.featureRequests.list, {
    status: filter,
  })

  const submitFeature = useMutation(api.featureRequests.submit)
  const voteOnFeature = useMutation(api.featureRequests.vote)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "workflow",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await submitFeature({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        submittedBy: user.id,
        submitterEmail: user.primaryEmailAddress?.emailAddress || "",
      })

      // Track in PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('feature_request_submitted', {
          category: formData.category,
          title: formData.title,
        })
      }

      // Track in GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'feature_request_submit', {
          event_category: 'engagement',
          event_label: formData.category,
        })
      }

      setFormData({ title: "", description: "", category: "workflow" })
      setIsSubmitModalOpen(false)
    } catch (error) {
      console.error("Error submitting feature:", error)
    }
  }

  const handleVote = async (featureId: any, voteType: "upvote" | "downvote") => {
    if (!user) return

    try {
      const result = await voteOnFeature({
        featureRequestId: featureId,
        userId: user.id,
        voteType,
      })

      // Track in PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('feature_request_voted', {
          action: result.action,
          vote_type: voteType,
          feature_id: featureId,
        })
      }

      // Track in GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'feature_vote', {
          event_category: 'engagement',
          event_label: voteType,
          value: voteType === 'upvote' ? 1 : -1,
        })
      }
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  return (
    <div
      className="mb-24"
      data-ai-zone="feature-requests"
      data-ai-component="leaderboard"
      data-ai-purpose="collect-alpha-feedback"
      data-ai-privacy="ux-insights"
    >
      {/* Header - Catalogue Style */}
      <div
        className="text-center mb-12"
        data-ai-section="header"
        data-ai-tone="formal-invitation"
      >
        <div className="inline-block border-b border-stone-300 pb-2 mb-2">
          <h2
            className="text-3xl font-light text-stone-900 tracking-tight"
            style={{ fontFamily: 'var(--font-crimson)' }}
            data-ai-heading="leaderboard-title"
          >
            Feature Requests
          </h2>
        </div>
        <p
          className="text-sm text-stone-500 tracking-wide mb-6"
          data-ai-subheading="participatory-development"
        >
          Help Shape the Future
        </p>
        <p
          className="text-base text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8"
          style={{ fontFamily: 'var(--font-crimson)' }}
          data-ai-description="user-guidance"
        >
          Your input guides our development. Propose new capabilities or vote on those suggested by fellow craftspeople.
        </p>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-8 py-3 border border-stone-300 text-stone-900 font-light text-sm hover:bg-stone-50 transition-colors tracking-wide"
          data-ai-action="initiate-request"
          data-ai-interaction="modal-trigger"
        >
          Propose a Feature
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center justify-center gap-6 mb-12 border-b border-stone-200 pb-4"
        data-ai-element="filter-controls"
        data-ai-ux="progressive-disclosure"
      >
        {[
          { value: undefined, label: 'All' },
          { value: 'proposed', label: 'Proposed' },
          { value: 'planned', label: 'Planned' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setFilter(tab.value)}
            className={`text-sm tracking-wide transition-colors ${
              filter === tab.value
                ? 'text-stone-900 border-b-2 border-stone-900 pb-1'
                : 'text-stone-500 hover:text-stone-700'
            }`}
            data-ai-filter={tab.value || 'all'}
            data-ai-state={filter === tab.value ? 'active' : 'inactive'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feature List */}
      <div
        className="space-y-4"
        data-ai-list="feature-requests"
        data-ai-sort="net-score-desc"
      >
        {features === undefined ? (
          <div className="text-center py-12 text-stone-500">Loading...</div>
        ) : features.length === 0 ? (
          <div
            className="text-center py-16 border border-stone-200 bg-white"
            data-ai-state="empty"
          >
            <p className="text-stone-600 font-light">No requests yet. Be the first to propose a feature.</p>
          </div>
        ) : (
          features.map((feature, index) => {
            const userVote = user
              ? useQuery(api.featureRequests.getUserVote, {
                  featureRequestId: feature._id,
                  userId: user.id,
                })
              : null

            return (
              <div
                key={feature._id}
                className="border border-stone-200 bg-white p-8 hover:shadow-sm transition-shadow"
                data-ai-item="feature-request"
                data-ai-rank={index + 1}
                data-ai-category={feature.category}
                data-ai-status={feature.status}
                data-ai-engagement-score={feature.netScore}
              >
                <div className="flex gap-6">
                  {/* Voting Column */}
                  <div
                    className="flex flex-col items-center gap-2 min-w-[60px]"
                    data-ai-zone="voting-ui"
                    data-ai-interaction="vote-buttons"
                    data-ai-privacy="public-anonymous"
                  >
                    <button
                      onClick={() => handleVote(feature._id, "upvote")}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                        userVote?.voteType === "upvote"
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-300 text-stone-600 hover:border-stone-900 hover:bg-stone-50'
                      }`}
                      data-ai-vote="upvote"
                      data-ai-state={userVote?.voteType === "upvote" ? 'active' : 'inactive'}
                    >
                      ▲
                    </button>
                    <div
                      className="text-lg font-medium text-stone-900"
                      data-ai-metric="net-score"
                      data-ai-value={feature.netScore}
                    >
                      {feature.netScore}
                    </div>
                    <button
                      onClick={() => handleVote(feature._id, "downvote")}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                        userVote?.voteType === "downvote"
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-300 text-stone-600 hover:border-stone-900 hover:bg-stone-50'
                      }`}
                      data-ai-vote="downvote"
                      data-ai-state={userVote?.voteType === "downvote" ? 'active' : 'inactive'}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Content Column */}
                  <div
                    className="flex-1"
                    data-ai-zone="feature-content"
                    data-ai-privacy="public"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3
                          className="text-lg font-medium text-stone-900 mb-2 tracking-wide"
                          data-ai-element="feature-title"
                        >
                          {feature.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-wider">
                          <span
                            className="text-stone-500"
                            data-ai-metadata="category"
                          >
                            {feature.category}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              feature.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : feature.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : feature.status === 'planned'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                            data-ai-status={feature.status}
                          >
                            {feature.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-sm text-stone-600 leading-relaxed"
                      style={{ fontFamily: 'var(--font-crimson)' }}
                      data-ai-element="feature-description"
                    >
                      {feature.description}
                    </p>
                    <div
                      className="mt-4 text-xs text-stone-400"
                      data-ai-metadata="submission-info"
                    >
                      Proposed {new Date(feature.submittedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 px-4"
          onClick={() => setIsSubmitModalOpen(false)}
          data-ai-component="submission-modal"
          data-ai-interaction="form"
        >
          <div
            className="bg-white border border-stone-300 max-w-2xl w-full p-12 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            data-ai-zone="feature-submission-form"
            data-ai-privacy="user-content"
          >
            <div className="mb-8">
              <h3
                className="text-2xl font-light text-stone-900 mb-2 tracking-tight"
                style={{ fontFamily: 'var(--font-crimson)' }}
              >
                Propose a Feature
              </h3>
              <p className="text-sm text-stone-500">Describe what you'd like to see in Journal Plus</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wide text-stone-700 mb-2 font-medium">
                  Feature Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                  placeholder="Brief, descriptive title"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-stone-700 mb-2 font-medium">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                >
                  <option value="ai-logging">AI Logging</option>
                  <option value="benchmarking">Benchmarking</option>
                  <option value="privacy">Privacy & Security</option>
                  <option value="audit">Audit Trail</option>
                  <option value="workflow">Workflow</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-stone-700 mb-2 font-medium">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors h-32"
                  placeholder="Explain the feature and why it would be valuable"
                  required
                  style={{ fontFamily: 'var(--font-crimson)' }}
                />
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-6 py-3 text-stone-600 font-light text-sm hover:text-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors tracking-wide"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
