"use client"

import Link from "next/link"
import { useState } from "react"
import { useUser, SignInButton, UserButton } from "@clerk/nextjs"
import { getUserRole, getRoleDisplayName, getRoleBadgeColor } from "@/lib/roles"

export default function JournalingPage() {
  const { isSignedIn, user } = useUser()
  const userRole = getUserRole(user)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">AI Workflow Tracking</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-stone-900 mb-6 tracking-tight">
            Solo Dev Journaling<sup className="text-[11px] ml-1 -top-3 relative">™</sup>
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Track AI workflows, benchmark improvements, and maintain secure audit trails
          </p>
        </div>

        {/* Feature Overview */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-white p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📓</span>
              <h2 className="text-2xl font-light text-stone-900 tracking-tight">
                PS-LANG Journal<sup className="text-[9px] ml-0.5 -top-2.5 relative">™</sup>
              </h2>
            </div>
            <p className="text-sm text-stone-500 mb-2">Open Source • MIT Licensed</p>
            <p className="text-base text-stone-600 leading-relaxed mb-8 max-w-2xl">
              Self-hosted AI workflow tracking with full control over your data and encryption keys.
            </p>

            <h3 className="text-sm font-medium text-stone-900 mb-4 uppercase tracking-wider">Core Features</h3>
            <ul className="grid md:grid-cols-2 gap-4 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your secrets stay with you (self-hosted encryption)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Zone parsing & benchmark tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>ChatGPT & Claude.ai integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Local storage & export (JSON/CSV)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>MIT licensed - free forever</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="border border-stone-300 bg-white p-12 mb-16">
          <h2 className="text-2xl font-light text-stone-900 mb-8 tracking-tight">
            How PS-LANG Journaling Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <span className="font-medium text-stone-900 text-xl">1</span>
              </div>
              <h3 className="text-base font-medium text-stone-900 mb-2">Write Prompts with Zones</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Use PS-LANG zone syntax (<code className="bg-stone-100 px-1 rounded font-mono text-xs">&lt;#.</code>, <code className="bg-stone-100 px-1 rounded font-mono text-xs">&lt;.</code>, <code className="bg-stone-100 px-1 rounded font-mono text-xs">&lt;$.&gt;</code>) to structure your prompts with metadata, benchmarks, and private notes.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <span className="font-medium text-stone-900 text-xl">2</span>
              </div>
              <h3 className="text-base font-medium text-stone-900 mb-2">Track Performance</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Automatically capture metrics like tokens used, rounds, latency, and cost. Compare regular prompting vs. PS-LANG enhanced workflows.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <span className="font-medium text-stone-900 text-xl">3</span>
              </div>
              <h3 className="text-base font-medium text-stone-900 mb-2">Analyze & Improve</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Review trends, identify patterns, and optimize your AI workflows. Export data for compliance or share insights with your team.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="border border-stone-300 bg-white p-12 mb-16">
          <h2 className="text-2xl font-light text-stone-900 mb-8 tracking-tight">Perfect For</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">💻</div>
              <div>
                <h3 className="text-base font-medium text-stone-900 mb-2">Solo Developers</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Track your AI interactions locally, maintain privacy, and benchmark improvements over time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">👥</div>
              <div>
                <h3 className="text-base font-medium text-stone-900 mb-2">Teams & Agencies</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Collaborate on prompt engineering, share best practices, and maintain consistent AI workflows.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">🏢</div>
              <div>
                <h3 className="text-base font-medium text-stone-900 mb-2">Enterprises</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Ensure compliance, audit AI usage, and optimize costs across multiple projects and teams.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">🔬</div>
              <div>
                <h3 className="text-base font-medium text-stone-900 mb-2">Researchers</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Document AI experiments, track reproducibility, and maintain detailed benchmarks for publications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="border border-stone-300 bg-gradient-to-br from-stone-50 to-white p-12 sm:p-16 text-center">
          <div className="inline-block mb-4">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Stay Updated</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-6 tracking-tight">
            Get PS-LANG Updates
          </h2>
          <p className="text-base text-stone-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Get the latest updates on PS-LANG features, journaling tools, and best practices for AI workflow optimization.
          </p>
          <button
            onClick={() => setIsNewsletterModalOpen(true)}
            className="px-8 py-4 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
          >
            Subscribe to Newsletter →
          </button>
        </div>
      </div>

      {/* Newsletter Modal */}
      {isNewsletterModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setIsNewsletterModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="font-typewriter font-bold text-ink text-2xl mb-2">Subscribe to Updates</h2>
            <p className="font-typewriter text-sm text-ink-light mb-6">
              Get the latest PS-LANG features, journaling tools, and AI workflow tips.
            </p>

            <form className="space-y-4">
              <div>
                <label className="block font-typewriter text-sm text-ink mb-1.5">Email *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 font-typewriter text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#2D1300] focus:ring-1 focus:ring-[#2D1300] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-typewriter text-sm text-ink mb-1.5">Name (optional)</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 font-typewriter text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#2D1300] focus:ring-1 focus:ring-[#2D1300] transition-colors"
                />
              </div>

              <div>
                <label className="block font-typewriter text-sm text-ink mb-2">Interested in:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-stone-300 text-[#2D1300] focus:ring-[#2D1300]" />
                    <span className="font-typewriter text-sm text-ink-light">Product updates & features</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-stone-300 text-[#2D1300] focus:ring-[#2D1300]" />
                    <span className="font-typewriter text-sm text-ink-light">AI workflow tips & best practices</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-stone-300 text-[#2D1300] focus:ring-[#2D1300]" />
                    <span className="font-typewriter text-sm text-ink-light">Community insights & case studies</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#2D1300] text-white font-typewriter text-sm rounded-lg hover:bg-[#2D1300]/90 transition-colors"
              >
                Subscribe
              </button>

              <p className="font-typewriter text-xs text-stone-500 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
