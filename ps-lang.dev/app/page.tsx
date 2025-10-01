"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import NewsletterModal from "@/components/newsletter-modal"
import FeedbackModal from "@/components/feedback-modal"
import UseCaseModal from "@/components/use-case-modal"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isUseCaseModalOpen, setIsUseCaseModalOpen] = useState(false)
  const [selectedUseCase, setSelectedUseCase] = useState("")

  const useCases = [
    "Agent Pipelines",
    "Benchmark Testing",
    "Context Pruning",
    "Research → Writing",
    "Analysis → Reporting",
    "Code → Documentation",
    "MCP Agent Chains",
    "Role Separation"
  ]

  const handleNextUseCase = () => {
    const currentIndex = useCases.indexOf(selectedUseCase)
    if (currentIndex < useCases.length - 1) {
      setSelectedUseCase(useCases[currentIndex + 1])
    }
  }

  const handlePrevUseCase = () => {
    const currentIndex = useCases.indexOf(selectedUseCase)
    if (currentIndex > 0) {
      setSelectedUseCase(useCases[currentIndex - 1])
    }
  }

  // Listen for newsletter modal trigger from use case modal
  useEffect(() => {
    const handleOpenNewsletter = () => setIsModalOpen(true)
    window.addEventListener('open-newsletter-modal', handleOpenNewsletter)
    return () => window.removeEventListener('open-newsletter-modal', handleOpenNewsletter)
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} version="v0.1.0-alpha.1" />
      <UseCaseModal
        isOpen={isUseCaseModalOpen}
        onClose={() => setIsUseCaseModalOpen(false)}
        useCase={selectedUseCase}
        onNext={useCases.indexOf(selectedUseCase) < useCases.length - 1 ? handleNextUseCase : undefined}
        onPrev={useCases.indexOf(selectedUseCase) > 0 ? handlePrevUseCase : undefined}
      />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-24">
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-block mb-6 sm:mb-8">
            <span className="text-xs tracking-[0.2em] text-stone-500 font-medium uppercase">Privacy-First Language</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-light text-stone-900 mb-6 sm:mb-8 tracking-tight px-4">
            PS-LANG
          </h1>

          <p className="text-base sm:text-xl text-stone-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4" data-track-section="hero-tagline">
            Zone-based syntax for controlling what AI agents see. Better benchmarks, clean handoffs, backwards compatible.
          </p>

          {/* Install Instructions */}
          <div className="mb-8 sm:mb-12">
            <div className="border border-stone-200 bg-white p-4 sm:p-6 max-w-lg mx-auto">
              <pre className="font-mono text-xs sm:text-sm text-stone-700">
                npx ps-lang@alpha init
              </pre>
            </div>
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link
              href="https://www.npmjs.com/package/ps-lang"
              className="border border-[#2D1300] px-6 sm:px-8 py-3 bg-[#2D1300] text-white hover:bg-[#1a0b00] transition-all duration-300 text-sm tracking-wide text-center"
            >
              VIEW ON NPM
            </Link>
            <Link
              href="https://github.com/vummo/ps-lang"
              className="border border-[#2D1300] px-6 sm:px-8 py-3 text-[#2D1300] hover:bg-[#2D1300] hover:text-white transition-all duration-300 text-sm tracking-wide text-center"
            >
              VIEW ON GITHUB
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="border border-[#2D1300] px-6 sm:px-8 py-3 text-[#2D1300] hover:bg-[#2D1300] hover:text-white transition-all duration-300 text-sm tracking-wide"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>

        {/* Alpha Launch Announcement */}
        <div className="border-l-4 border-[#2D1300] bg-stone-100 p-4 sm:p-6 mb-12 sm:mb-16">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="text-sm font-medium text-stone-900 mb-2">Alpha Released - Now on npm!</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                PS-LANG v0.1.0-alpha.1 is now available. Install with <code className="bg-white px-2 py-1 font-mono">npx ps-lang@alpha init</code> and start controlling agent context today.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Zones Example */}
        <div className="border border-stone-200 bg-white p-3 [@media(min-width:420px)]:p-4 sm:p-8 md:p-12 mb-12 sm:mb-20" data-track-section="zone-example">
          <div className="mb-3 [@media(min-width:420px)]:mb-4 sm:mb-8">
            <span className="text-[10px] [@media(min-width:420px)]:text-xs tracking-[0.15em] text-stone-400 uppercase">Agent Handoff Example</span>
          </div>

          <pre className="font-mono text-[10px] [@media(min-width:420px)]:text-xs sm:text-sm text-stone-700 leading-[1.4] [@media(min-width:420px)]:leading-relaxed overflow-x-auto whitespace-pre-wrap break-words" data-track-section="zone-syntax-example">
            {`<. Current agent only - hidden from next agent .>
Research notes, debug info, internal reasoning

<#. Pass to next agent - clean context only #.>
Processed findings ready for Agent B

<@. Active workspace - current agent can edit @.>
Collaborative zone for current work

<~. AI-managed metadata - auto-generated ~.>
Timestamps, tags, benchmarks

<$. Business context - monetization strategy $.>
Pricing ideas, revenue notes`}
          </pre>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24 px-4">
          <div className="text-center">
            <div className="mb-6">
              <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Clean Handoffs</span>
            </div>
            <h3 className="text-lg font-light text-stone-900 mb-4">Selective Context</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Pass only relevant context between agents. No contamination, no noise, just clean inputs.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Benchmarking</span>
            </div>
            <h3 className="text-lg font-light text-stone-900 mb-4">Accurate Testing</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Test each agent's true performance without upstream hints or reasoning contamination.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Multi-Agent</span>
            </div>
            <h3 className="text-lg font-light text-stone-900 mb-4">Pipeline Control</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Define information flow in agent chains. Research → Analysis → Output, with precision.
            </p>
          </div>
        </div>

        {/* Auto-Tagged Commands Section */}
        <div className="border border-stone-200 bg-white p-4 sm:p-8 md:p-12 mb-16 sm:mb-24">
          <div className="mb-4 sm:mb-8">
            <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Auto-Tagged Commands</span>
          </div>

          <p className="text-sm text-stone-600 mb-6 sm:mb-8 leading-relaxed">
            Commands automatically structure output with PS-LANG context zones. No manual tagging needed.
          </p>

          <pre className="font-mono text-xs sm:text-sm text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
            {`.login          # Start your day
.daily          # Review schedule
.journal        # Auto-tagged daily entry
.blog           # Auto-tagged content generation
.commit         # Auto-tagged git commit
.handoff        # Agent-to-agent handoff
.logout         # End session

# Example: .journal auto-generates zones
<.journal 09-26-25-ps-lang
  <#. Pass to writing agent: Built PS-LANG specification #.>
  <. Hidden from agents: Debug notes, API keys, raw research data .>
  <@. Agent workspace: Generate blog post from today's work @.>
>`}
          </pre>
        </div>

        {/* Use Cases */}
        {/* <#. Analytics: Track use case interest via PostHog click events > */}
        {/* <@. AI Meta Tag: usecase-interest-tracking, conversion-optimization > */}
        <div className="text-center mb-16 sm:mb-24 px-4">
          <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-8 sm:mb-12">Multi-Agent Use Cases</h2>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
            {useCases.map((useCase) => (
              <button
                key={useCase}
                onClick={() => {
                  setSelectedUseCase(useCase);
                  setIsUseCaseModalOpen(true);
                  if (typeof window !== 'undefined' && (window as any).posthog) {
                    (window as any).posthog.capture('use_case_clicked', {
                      use_case: useCase,
                      section: 'homepage_use_cases'
                    });
                  }
                }}
                className="border border-stone-200 px-4 py-2 text-xs tracking-wide text-stone-600 hover:border-stone-400 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {useCase}
              </button>
            ))}
          </div>
        </div>

        {/* What's Next */}
        <div className="border border-stone-200 bg-white p-6 sm:p-8 mb-16 sm:mb-24">
          <div className="mb-6">
            <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">What's Next</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-medium text-stone-900 mb-3">Week 1-2</h4>
              <p className="text-stone-600 text-sm leading-relaxed">Marketing sprint, blog posts, demo playground with use cases</p>
            </div>
            <div>
              <h4 className="font-medium text-stone-900 mb-3">Week 3-4</h4>
              <p className="text-stone-600 text-sm leading-relaxed">Filter MVP, CLI commands, LangChain adapter</p>
            </div>
            <div>
              <h4 className="font-medium text-stone-900 mb-3">Beta</h4>
              <p className="text-stone-600 text-sm leading-relaxed">.psl format, Clerk encryption, secrets management</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-4">
          <div className="mb-6 sm:mb-8">
            <span className="text-xs tracking-[0.2em] text-stone-500 font-medium uppercase">Open Source</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-stone-900 mb-8 sm:mb-12 tracking-tight" data-track-section="cta-headline">
            Build smarter agent workflows.<br /> Control every&nbsp;handoff.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="https://github.com/vummo/ps-lang"
              className="border border-[#2D1300] px-6 sm:px-8 py-3 bg-[#2D1300] text-white hover:bg-[#1a0b00] transition-all duration-300 text-sm tracking-wide text-center"
            >
              VIEW ON GITHUB
            </Link>
            <button
              onClick={() => {
                setIsModalOpen(true);
                if (typeof window !== 'undefined' && (window as any).posthog) {
                  (window as any).posthog.capture('cta_subscribe_clicked', {
                    section: 'bottom_cta'
                  });
                }
              }}
              className="border border-[#2D1300] px-6 sm:px-8 py-3 text-[#2D1300] hover:bg-[#2D1300] hover:text-white transition-all duration-300 text-sm tracking-wide"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

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
    </div>
  )
}