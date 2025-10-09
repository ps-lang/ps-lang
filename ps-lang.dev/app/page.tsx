"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import NewsletterModal from "@/components/newsletter-modal"
import FeedbackModal from "@/components/feedback-modal"
import UseCaseModal from "@/components/use-case-modal"
import { siteConfig } from "@/config/site"

const PERSONA_SLOGANS: Record<string, string> = {
  explorer: 'Discover More · Learn As I Go',
  solo_developer: 'Ship Fast · Build Better · Own Your Stack',
  researcher: 'Think Deep · Test Everything · Question More',
  creator: 'Write More · Create Daily · Share Freely',
  analyst: 'Measure Twice · Cut Once · Data-Driven',
  generalist: 'Learn Everything · Master Anything · Stay Curious',
  prefer_not_to_say: 'Privacy First · Keep It Simple',
}

export default function HomePage() {
  const { user, isSignedIn } = useUser()
  const [personaSlogan, setPersonaSlogan] = useState('Discover More · Learn As I Go')

  useEffect(() => {
    if (user?.unsafeMetadata?.persona) {
      const persona = user.unsafeMetadata.persona as string
      setPersonaSlogan(PERSONA_SLOGANS[persona] || PERSONA_SLOGANS.explorer)
    }
  }, [user])
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
      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="homepage" />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} version={siteConfig.version} />
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
            <span className="text-xs tracking-[0.2em] text-stone-500 font-medium uppercase">Privacy-First Script Language<sup className="text-[8px] ml-0.5">™</sup></span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-stone-900 mb-6 sm:mb-8 tracking-tight px-4 leading-tight">
            PS-LANG
          </h1>

          <p className="text-base sm:text-lg text-stone-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4" data-track-section="hero-tagline">
            The framework for controlling what AI agents see. Build PS Journals—your instance for tracking AI collaborations. PS-LANG is the pen, PS Journaling is your digital&nbsp;journal.
          </p>

          {/* Install Instructions */}
          <div className="mb-8 sm:mb-12">
            <div className="border border-stone-300 bg-stone-50/50 p-4 sm:p-6 max-w-lg mx-auto">
              <pre className="font-mono text-xs sm:text-sm text-stone-800">
                npx ps-lang@alpha init
              </pre>
            </div>
          </div>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link
              href={siteConfig.urls.npm}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white hover:bg-stone-800 transition-colors text-xs sm:text-sm font-medium uppercase tracking-[0.15em] text-center"
            >
              View on NPM
            </Link>
            <Link
              href={siteConfig.urls.github}
              className="px-6 sm:px-8 py-3 sm:py-4 border border-stone-300 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-900 transition-all text-xs sm:text-sm font-medium uppercase tracking-[0.15em] text-center"
            >
              View on GitHub
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 sm:px-8 py-3 sm:py-4 border border-stone-300 bg-white hover:bg-stone-50 hover:border-stone-400 text-stone-900 transition-all text-xs sm:text-sm font-medium uppercase tracking-[0.15em]"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Alpha Launch Announcement */}
        <div className="border-l-4 border-stone-900 bg-stone-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="text-sm font-medium text-stone-900 mb-2">PS-Lang Alpha Released</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                PS-LANG {siteConfig.version} is now available. Install with <code className="bg-white px-2 py-1 font-mono">npx ps-lang@alpha init</code> and start controlling agent context today.
              </p>
            </div>
          </div>
        </div>

        {/* Journal Alpha Test Announcement */}
        <div className="border-l-4 border-[#C5B9AA] bg-stone-100 p-4 sm:p-6 mb-12 sm:mb-16" data-ps-lang-benchmark="homepage-alpha-cta-v1">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">📓</span>
            <div>
              <h3 className="text-sm font-medium text-stone-900 mb-2">PS-LANG Journaling<sup className="text-[0.5em] top-[-0.5em]">™</sup> Alpha — Help shape the future</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Join the waitlist for PS-LANG Journal. Track AI workflows, benchmark improvements, and maintain secure audit trails. <Link href="/postscript-journaling" className="underline hover:text-stone-900">Learn more →</Link>
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

<#. Pass to next agent - clean context only .#>
Processed findings ready for Agent B

<@. Active workspace - current agent can edit .@>
Collaborative zone for current work

<.bm AI-managed metadata - auto-generated .bm>
Timestamps, tags, benchmarks

<$. Business context - monetization strategy .$>
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
  <#. Pass to writing agent: Built PS-LANG specification .#>
  <. Hidden from agents: Debug notes, API keys, raw research data .>
  <@. Agent workspace: Generate blog post from today's work .@>
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
              href={siteConfig.urls.github}
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
    </div>
  )
}