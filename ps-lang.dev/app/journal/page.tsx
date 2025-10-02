"use client"

import Navigation from "@/components/navigation"
import Link from "next/link"
import { useState } from "react"

export default function JournalingPage() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="paper-card stacked-papers p-8 mb-8">
          <h1 className="font-editorial text-4xl font-bold text-ink mb-4">
            PS-LANG Journaling
          </h1>
          <p className="font-editorial text-xl text-ink-light mb-2">
            Track AI workflows, benchmark improvements, and maintain secure audit trails
          </p>
          <p className="font-typewriter text-sm text-ink-light">
            From local open-source tracking to cloud-powered team analytics
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Open Source */}
          <div className="paper-card p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📓</span>
              <h2 className="font-typewriter font-bold text-ink text-xl">PS-LANG Journal</h2>
            </div>
            <p className="font-typewriter text-sm text-stone-500 mb-2">Open Source • MIT Licensed</p>
            <p className="font-typewriter text-sm text-ink-light mb-6">
              Self-hosted AI workflow tracking with full control over your data and encryption keys.
            </p>

            <h3 className="font-typewriter font-bold text-ink text-sm mb-3 uppercase tracking-wider">Core Features</h3>
            <ul className="space-y-3 font-typewriter text-sm text-ink-light mb-6">
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

          {/* SaaS */}
          <div className="paper-card p-8 border-2 border-[#2D1300]/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📊</span>
              <h2 className="font-typewriter font-bold text-ink text-xl">PS-LANG Journal+</h2>
            </div>
            <p className="font-typewriter text-sm text-stone-500 mb-2">SaaS • Subscription</p>
            <p className="font-typewriter text-sm text-ink-light mb-6">
              Cloud-powered AI workflow analytics with team collaboration and enterprise security.
            </p>

            <h3 className="font-typewriter font-bold text-ink text-sm mb-3 uppercase tracking-wider">Premium Features</h3>
            <ul className="space-y-3 font-typewriter text-sm text-ink-light mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#2D1300] mt-0.5">•</span>
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D1300] mt-0.5">•</span>
                <span>Cloud sync across devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D1300] mt-0.5">•</span>
                <span>Advanced analytics & insights dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D1300] mt-0.5">•</span>
                <span>Team workspaces & collaboration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D1300] mt-0.5">•</span>
                <span>API access & webhooks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D1300] mt-0.5">•</span>
                <span>Priority support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="paper-card p-8 mb-8">
          <h2 className="font-typewriter font-bold text-ink text-2xl mb-6">How PS-LANG Journaling Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#2D1300]/10 flex items-center justify-center mb-4">
                <span className="font-typewriter font-bold text-[#2D1300] text-xl">1</span>
              </div>
              <h3 className="font-typewriter font-bold text-ink mb-2">Write Prompts with Zones</h3>
              <p className="font-typewriter text-sm text-ink-light">
                Use PS-LANG zone syntax (<code className="bg-stone-100 px-1 rounded">&lt;#.</code>, <code className="bg-stone-100 px-1 rounded">&lt;.</code>, <code className="bg-stone-100 px-1 rounded">&lt;$.></code>) to structure your prompts with metadata, benchmarks, and private notes.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-[#2D1300]/10 flex items-center justify-center mb-4">
                <span className="font-typewriter font-bold text-[#2D1300] text-xl">2</span>
              </div>
              <h3 className="font-typewriter font-bold text-ink mb-2">Track Performance</h3>
              <p className="font-typewriter text-sm text-ink-light">
                Automatically capture metrics like tokens used, rounds, latency, and cost. Compare regular prompting vs. PS-LANG enhanced workflows.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-[#2D1300]/10 flex items-center justify-center mb-4">
                <span className="font-typewriter font-bold text-[#2D1300] text-xl">3</span>
              </div>
              <h3 className="font-typewriter font-bold text-ink mb-2">Analyze & Improve</h3>
              <p className="font-typewriter text-sm text-ink-light">
                Review trends, identify patterns, and optimize your AI workflows. Export data for compliance or share insights with your team.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="paper-card p-8">
          <h2 className="font-typewriter font-bold text-ink text-2xl mb-6">Perfect For</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">💻</div>
              <div>
                <h3 className="font-typewriter font-bold text-ink mb-1">Solo Developers</h3>
                <p className="font-typewriter text-sm text-ink-light">
                  Track your AI interactions locally, maintain privacy, and benchmark improvements over time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">👥</div>
              <div>
                <h3 className="font-typewriter font-bold text-ink mb-1">Teams & Agencies</h3>
                <p className="font-typewriter text-sm text-ink-light">
                  Collaborate on prompt engineering, share best practices, and maintain consistent AI workflows.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">🏢</div>
              <div>
                <h3 className="font-typewriter font-bold text-ink mb-1">Enterprises</h3>
                <p className="font-typewriter text-sm text-ink-light">
                  Ensure compliance, audit AI usage, and optimize costs across multiple projects and teams.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 text-2xl">🔬</div>
              <div>
                <h3 className="font-typewriter font-bold text-ink mb-1">Researchers</h3>
                <p className="font-typewriter text-sm text-ink-light">
                  Document AI experiments, track reproducibility, and maintain detailed benchmarks for publications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="paper-card p-8 mt-8 bg-gradient-to-br from-[#2D1300]/5 to-stone-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-typewriter font-bold text-ink text-2xl mb-3">Stay Updated</h2>
            <p className="font-typewriter text-sm text-ink-light mb-6">
              Get the latest updates on PS-LANG features, journaling tools, and best practices for AI workflow optimization.
            </p>
            <button
              onClick={() => setIsNewsletterModalOpen(true)}
              className="px-8 py-3 bg-[#2D1300] text-white font-typewriter text-sm rounded-lg hover:bg-[#2D1300]/90 transition-colors"
            >
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-200 text-stone-600 py-12 sm:py-16 border-t border-stone-300">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Zone-styled branding */}
          <div className="mb-8 sm:mb-10">
            <div className="font-mono text-xs sm:text-sm text-stone-400 mb-3">
              {"<#. 1-Shot Better · Open Source Multi-Agent Context Control #.>"}
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">PS-LANG</h3>
              <button
                type="button"
                onClick={() => {
                  setIsFeedbackModalOpen(true);
                  if (typeof window !== 'undefined' && (window as any).posthog) {
                    (window as any).posthog.capture('version_clicked', {
                      version: 'v0.1.0-alpha.1',
                      location: 'footer'
                    });
                  }
                }}
                className="text-sm text-stone-500 font-mono hover:text-stone-900 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex items-center"
                data-track-section="footer-version"
              >
                v0.1.0-alpha.1
              </button>
            </div>
          </div>

          {/* Grid layout for links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 mb-10 sm:mb-12">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Legal</h4>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/privacy" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-stone-600 hover:text-stone-900 transition-colors">
                  Terms
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Code</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href="https://github.com/vummo/ps-lang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.npmjs.com/package/ps-lang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  npm ↗
                </a>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-2">
              <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Zone Syntax</h4>
              <div className="font-mono text-xs text-stone-500 space-y-1.5 leading-relaxed">
                <div className="hover:text-stone-900 transition-colors cursor-default">{"<.> Current only"}</div>
                <div className="hover:text-stone-900 transition-colors cursor-default">{"<#.> Pass-through"}</div>
                <div className="hover:text-stone-900 transition-colors cursor-default">{"<@.> Active workspace"}</div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <p className="text-center sm:text-left text-stone-500">
                © 2025{" "}
                <a
                  href="https://vummo.com"
                  target="_blank"
                  rel="noopener"
                  className="text-stone-600 hover:text-stone-900 transition-colors underline"
                  title="Vummo Labs - AI-powered development tools and multi-agent systems"
                >
                  Vummo Labs
                </a>
                {" "}·{" "}
                <a
                  href="https://github.com/vummo/ps-lang/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-900 transition-colors underline"
                  title="PS-LANG MIT License - Open source multi-agent context control"
                >
                  MIT License
                </a>
              </p>
              <p className="text-center sm:text-right text-stone-400 italic">
                Privacy-first by design
              </p>
            </div>
          </div>
        </div>
      </footer>

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
