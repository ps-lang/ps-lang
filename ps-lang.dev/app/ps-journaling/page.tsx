"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { getUserRole, getRoleDisplayName, getRoleBadgeColor } from "@/lib/roles"
import NewsletterModal from "@/components/newsletter-modal"
import AlphaSignupModal from "@/components/alpha-signup-modal"
import FAQSection from "@/components/faq-section"
import HeroSection from "@/components/hero-section"
import HeroCardIllustration from "@/components/hero-card-illustration"
import ReferenceDotsFermi from "@/components/reference-dots-fermi"
import SpheresIllustration from "@/components/spheres-illustration"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

/**
 * Theme variants for PS Journaling page sections
 * Based on the hero-section.tsx pattern with font-serif for fermi theme
 */

// H2 Section Headings
const sectionHeadingVariants = cva(
  "", // No base class - font changes per theme
  {
    variants: {
      siteTheme: {
        default: "text-2xl sm:text-3xl font-light tracking-tight text-stone-900",
        fermi: "font-serif text-[28px] sm:text-[36px] md:text-[42px] leading-[1.2] tracking-[-0.01em] text-[#2C1F1F]",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

// H3 Subsection Headings
const subsectionHeadingVariants = cva(
  "", // No base class - font changes per theme
  {
    variants: {
      siteTheme: {
        default: "text-base font-medium text-stone-900",
        fermi: "font-serif text-[18px] sm:text-[20px] leading-[1.3] tracking-[-0.005em] text-[#2C1F1F] font-normal",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

// Eyebrow Text (small labels above headings)
const eyebrowVariants = cva(
  "uppercase font-medium",
  {
    variants: {
      siteTheme: {
        default: "text-[9px] tracking-[0.3em] text-stone-400",
        fermi: "text-[10px] tracking-[0.35em] text-[#2C1F1F]/60",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

// Body/Description Text
const descriptionVariants = cva(
  "font-sans",
  {
    variants: {
      siteTheme: {
        default: "text-sm text-stone-600 leading-relaxed",
        fermi: "text-[15px] leading-[1.65] text-[#2C1F1F]/80",
      },
    },
    defaultVariants: {
      siteTheme: "default",
    },
  }
)

export default function JournalingPage() {
  const { isSignedIn, user } = useUser()
  const userRole = getUserRole(user)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)
  const [isAlphaModalOpen, setIsAlphaModalOpen] = useState(false)

  // Avoid hydration mismatch by rendering fermi initially (matches server/inline script)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use fermi as default for SSR, then actual theme after mount
  const effectiveTheme = mounted ? (theme || 'fermi') : 'fermi'

  // Map to CVA theme variant type
  const themeVariant = (effectiveTheme === "fermi" || effectiveTheme === "default")
    ? effectiveTheme as "default" | "fermi"
    : "default" as const

  // Get the heading font for current theme (hardcoded defaults for OSS version)
  const headingFont = effectiveTheme === 'fermi'
    ? 'Crimson Pro'
    : 'Crimson Text'

  // Check if user has already signed up for alpha
  const alphaSignup = useQuery(
    api.alphaSignups.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip"
  )
  const hasJoinedAlpha = !!alphaSignup

  // Load custom heading font from Google Fonts
  useEffect(() => {
    if (headingFont && mounted) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${headingFont.replace(' ', '+')}:wght@300;400;600;700&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [headingFont, mounted])

  return (
    <>
      <div
        className={cn(
          "min-h-screen transition-colors duration-150",
          effectiveTheme === "fermi" ? "bg-[#F8F5F2]" : "bg-[#fafaf9]"
        )}
        data-page="postscript-journaling"
        data-ps-lang-version="v0.1.0-alpha.1"
        data-agentic-signature="agentic_ux_v1:ps-journaling"
        data-journal-tier="ps-lang-journal"
        data-access-level={isSignedIn ? 'authenticated' : 'public'}
        data-data-stream="agentic_ux_v1"
        suppressHydrationWarning
      >
      {/* Hero Section */}
      <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 150ms ease-in' }}>
        <HeroSection
          eyebrow="AGENTIC WORKFLOW COLLABORATION"
          headline={effectiveTheme === 'fermi' ? (
            <>Master Your AI{'\u00A0'}Workflows</>
          ) : (
            <>PS Journaling<sup className="text-[11px] font-light ml-[2px] -top-[12px]">™</sup></>
          )}
          description="Collaborate, benchmark, and improve your AI workflows for better results"
          primaryCTA={effectiveTheme === 'fermi' ? {
            text: "Request Early Access",
            onClick: () => setIsAlphaModalOpen(true),
          } : undefined}
          secondaryCTA={effectiveTheme === 'fermi' && !isSignedIn ? {
            text: "Create Account",
            onClick: () => {
              // Trigger Clerk signup modal
              const signupButton = document.querySelector('[data-clerk-signup]') as HTMLButtonElement
              signupButton?.click()
            },
            variant: "outline",
          } : undefined}
          illustration={effectiveTheme === 'fermi' ? <ReferenceDotsFermi /> : undefined}
          theme="warm"
          layout={effectiveTheme === 'fermi' ? "split" : "centered"}
          forcedTheme={effectiveTheme as "default" | "fermi"}
          dataAttributes={{
            "data-headline-variant": "option-4-active",
            "data-test-group": "hero-tagline-v1",
            "data-ps-lang-component": "hero-tagline",
            "data-current-theme": effectiveTheme,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Alpha Signup CTA */}
        {!isSignedIn ? (
          <div className="mb-16" data-section="alpha-signup-cta" data-section-name="Alpha Signup CTA (Unauthenticated)">
            <div className="relative overflow-hidden border border-stone-200/50 bg-gradient-to-br from-stone-100 via-white to-stone-50 p-12 sm:p-16 text-center shadow-sm" data-ps-lang-benchmark="journaling-page-alpha-cta-v1">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

              <div className="relative z-10">
                <div className="inline-block mb-4">
                  <span className={eyebrowVariants({ siteTheme: themeVariant })}>PS Journals™ Alpha</span>
                </div>
                <h2 className={cn(sectionHeadingVariants({ siteTheme: themeVariant }), "mb-3")} style={{ fontFamily: headingFont }}>
                  Help shape the future
                </h2>
                <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-10 max-w-md mx-auto")}>
                  Join our testing program to get early access to PS-LANG Journal features.
                </p>
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center gap-2 bg-white px-10 py-5 shadow-sm border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all duration-300 font-light text-sm tracking-[0.03em] text-stone-700 hover:text-stone-900">
                    Create Account →
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        ) : userRole === 'user' && (
          <div className="mb-16" data-section="alpha-waitlist-cta" data-section-name="Alpha Waitlist CTA (Authenticated Users)">
            <div className="relative overflow-hidden border border-stone-200/50 bg-gradient-to-br from-stone-100 via-white to-stone-50 p-12 sm:p-16 text-center shadow-sm">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

              <div className="relative z-10">
                <div className="inline-block mb-4">
                  <span className={eyebrowVariants({ siteTheme: themeVariant })}>PS Journals™ Alpha</span>
                </div>
                <h2 className={cn(sectionHeadingVariants({ siteTheme: themeVariant }), "mb-3")} style={{ fontFamily: headingFont }}>
                  Help shape the future
                </h2>
                <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-10 max-w-md mx-auto")}>
                  Join our testing program to get early access to PS-LANG Journal features.
                </p>
                {hasJoinedAlpha ? (
                  <div className="inline-flex items-center gap-3 bg-white px-8 py-4 shadow-sm border border-stone-200/60">
                    <svg className="w-5 h-5 text-stone-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-light text-sm tracking-[0.03em] text-stone-900">
                      You're on the waitlist
                    </span>
                  </div>
                ) : (
                  <label className="inline-flex items-center gap-4 cursor-pointer group bg-white px-10 py-5 shadow-sm border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all duration-300">
                    <input
                      type="checkbox"
                      checked={isAlphaModalOpen}
                      onChange={(e) => setIsAlphaModalOpen(e.target.checked)}
                      className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-400 focus:ring-2 focus:ring-offset-2 cursor-pointer transition-all"
                    />
                    <span className="font-light text-sm tracking-[0.03em] text-stone-700 group-hover:text-stone-900 transition-colors">
                      Join the PS-LANG Journal waitlist
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feature Overview */}
        <div
          className="mb-16"
          data-section="feature-overview"
          data-ps-lang-component="journal-features"
          data-journal-signature="OSS_v1.0.0_public-access"
        >
          <div className="border border-stone-300 bg-white p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📓</span>
              <h2 className={sectionHeadingVariants({ siteTheme: themeVariant })} style={{ fontFamily: headingFont }}>
                PS-LANG Journal
              </h2>
            </div>
            <p className="text-sm text-stone-500 mb-2">Open Source • MIT Licensed</p>
            <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-8 max-w-2xl")}>
              Self-hosted AI workflow collaboration with full control over your data and encryption keys.
            </p>

            <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-4 uppercase tracking-wider")} style={{ fontFamily: headingFont }}>Core Features</h3>
            <ul className="grid md:grid-cols-2 gap-4 text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your secrets stay with you (self-hosted encryption)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Zone parsing & benchmark collaboration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>ChatGPT & Claude.ai integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Agentic UX with RLHF datastreams</span>
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
        <div className="border border-stone-300 bg-white p-12 mb-16" data-section="how-it-works" data-section-name="How PS-LANG Journaling Works">
          <h2 className={cn(sectionHeadingVariants({ siteTheme: themeVariant }), "mb-8")} style={{ fontFamily: headingFont }}>
            How PS-LANG Journaling Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <span className="font-medium text-stone-900 text-xl">1</span>
              </div>
              <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Write Prompts with Zones</h3>
              <p className={descriptionVariants({ siteTheme: themeVariant })}>
                Use PS-LANG zone syntax (<code className="bg-stone-100 px-1 rounded font-mono text-xs">&lt;#.</code>, <code className="bg-stone-100 px-1 rounded font-mono text-xs">&lt;.</code>, <code className="bg-stone-100 px-1 rounded font-mono text-xs">&lt;$.&gt;</code>) to structure your prompts with metadata, benchmarks, and private notes.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <span className="font-medium text-stone-900 text-xl">2</span>
              </div>
              <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Collaborate & Learn</h3>
              <p className={descriptionVariants({ siteTheme: themeVariant })}>
                Collaborate with AI through agentic UX. Capture RLHF datastreams, benchmark improvements, and compare regular prompting vs. PS-LANG enhanced workflows.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <span className="font-medium text-stone-900 text-xl">3</span>
              </div>
              <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Analyze & Improve</h3>
              <p className={descriptionVariants({ siteTheme: themeVariant })}>
                Review trends, identify patterns, and optimize your AI workflows. Export data for compliance or share insights with your team.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="border border-stone-300 bg-white p-12 mb-16" data-section="use-cases" data-section-name="Perfect For (Use Cases)">
          <h2 className={cn(sectionHeadingVariants({ siteTheme: themeVariant }), "mb-8")} style={{ fontFamily: headingFont }}>Perfect For</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Solo Developers</h3>
                <p className={descriptionVariants({ siteTheme: themeVariant })}>
                  Collaborate with AI locally, maintain privacy, and benchmark improvements over time through agentic UX.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Teams & Agencies</h3>
                <p className={descriptionVariants({ siteTheme: themeVariant })}>
                  Collaborate on prompt engineering, share best practices, and maintain consistent AI workflows.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Enterprises</h3>
                <p className={descriptionVariants({ siteTheme: themeVariant })}>
                  Ensure compliance, audit AI usage, and optimize costs across multiple projects and teams.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <svg className="w-6 h-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Researchers</h3>
                <p className={descriptionVariants({ siteTheme: themeVariant })}>
                  Document AI experiments, track reproducibility, and maintain detailed benchmarks for publications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Journals (Demo) - Easter Egg: Hidden until launch */}
        <div
          className="hidden border border-stone-300 bg-white p-12 mb-20"
          data-easter-egg="upcoming-journals"
          data-agentic-component="example-journals-preview"
          data-agentic-version="v1.0.0"
          data-agentic-signature="rlhf:claude:sonnet-4.5+human:anton:example-journals"
          data-privacy-label="public"
          data-access-level="public"
          data-feature-status="coming-soon"
          data-visibility="hidden-until-launch"
          data-rlhf-user="human:anton"
          data-rlhf-ai="claude:sonnet-4.5"
          data-workflow-stage="roadmap-preview"
          data-conversion-funnel="feature-discovery"
          data-interaction-type="content-preview"
          data-timestamp={new Date().toISOString()}
        >
          <h2 className={cn(sectionHeadingVariants({ siteTheme: themeVariant }), "mb-4")} style={{ fontFamily: headingFont }}>Example Journals</h2>
          <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-8 max-w-2xl")}>
            See PS-LANG Journal in action. These demo journals showcase different use cases and workflows.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="border border-stone-200 p-6 hover:border-stone-300 transition-colors"
              data-journal-template="developer-workflows"
              data-persona="solo-developer"
              data-template-status="coming-soon"
            >
              <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Developer Workflows</h3>
              <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-3")}>
                Tracking AI-assisted coding sessions, debugging patterns, and productivity benchmarks.
              </p>
              <span className="text-xs text-stone-400 uppercase tracking-wider">Coming Soon</span>
            </div>

            <div
              className="border border-stone-200 p-6 hover:border-stone-300 transition-colors"
              data-journal-template="content-creation"
              data-persona="creator"
              data-template-status="coming-soon"
            >
              <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Content Creation</h3>
              <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-3")}>
                Collaborating with AI on blog posts, marketing copy, and SEO optimization.
              </p>
              <span className="text-xs text-stone-400 uppercase tracking-wider">Coming Soon</span>
            </div>

            <div
              className="border border-stone-200 p-6 hover:border-stone-300 transition-colors"
              data-journal-template="research-experiments"
              data-persona="researcher"
              data-template-status="coming-soon"
            >
              <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Research Lab Experiments</h3>
              <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-3")}>
                Document AI model testing, track prompt variations, and maintain reproducible experiment logs.
              </p>
              <span className="text-xs text-stone-400 uppercase tracking-wider">Coming Soon</span>
            </div>

            <div
              className="border border-stone-200 p-6 hover:border-stone-300 transition-colors"
              data-journal-template="agency-client-work"
              data-persona="team-agency"
              data-template-status="coming-soon"
            >
              <h3 className={cn(subsectionHeadingVariants({ siteTheme: themeVariant }), "mb-2")} style={{ fontFamily: headingFont }}>Agency Client Work</h3>
              <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-3")}>
                Share prompt libraries across team members, audit AI costs per project, and ensure brand consistency.
              </p>
              <span className="text-xs text-stone-400 uppercase tracking-wider">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="FAQ"
          page="ps-journaling"
          component="journal-faq"
          faqs={[
            {
              question: "What's the difference between PS-LANG and PS Journaling?",
              answer: "PS-LANG is the open source framework with zone syntax and agentic UX. PS Journaling is what you create with it—your own journal instance for tracking AI collaborations. Think of PS-LANG as the tool, and PS Journaling as what you build."
            },
            {
              question: "Is this free to use?",
              answer: "Yes. PS-LANG Journal is MIT licensed and free forever. You self-host it, own your data, and control your encryption keys. We also offer PS-LANG Journal Plus with enhanced analytics and team features."
            },
            {
              question: "When can I start using PS-LANG Journal?",
              answer: "We're currently in alpha testing. Join the waitlist to get early access and help shape the product. Publishing your own journal instances will be available after we complete alpha testing and stabilize the core features."
            }
          ]}
        />

        {/* Newsletter CTA */}
        <div className="border border-stone-300 bg-gradient-to-br from-stone-50 to-white p-12 sm:p-16 text-center" data-section="newsletter-cta" data-section-name="Newsletter Signup CTA">
          <div className="inline-block mb-4">
            <span className={eyebrowVariants({ siteTheme: themeVariant })}>Stay Updated</span>
          </div>
          <h2 className={cn(sectionHeadingVariants({ siteTheme: themeVariant }), "mb-6")} style={{ fontFamily: headingFont }}>
            Get PS-LANG Updates
          </h2>
          <p className={cn(descriptionVariants({ siteTheme: themeVariant }), "mb-10 max-w-xl mx-auto")}>
            Get the latest updates on PS-LANG features, journaling tools, and best practices for AI workflow collaboration.
          </p>
          <button
            onClick={() => setIsNewsletterModalOpen(true)}
            className="px-8 py-4 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
          >
            Subscribe to Newsletter →
          </button>
        </div>
      </div>

      {/* Hidden Clerk SignUp Button (triggered by hero CTA) */}
      <SignUpButton mode="modal">
        <button data-clerk-signup className="hidden" aria-hidden="true" />
      </SignUpButton>

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
        source="journal_page"
      />

      {/* Alpha Signup Modal */}
      <AlphaSignupModal
        isOpen={isAlphaModalOpen}
        onClose={() => setIsAlphaModalOpen(false)}
      />
      </div>
    </>
  )
}
