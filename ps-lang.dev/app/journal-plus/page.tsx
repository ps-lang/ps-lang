"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getUserRole } from "@/lib/roles"
import OnboardingDemo from "@/components/jp-onboarding-demo"
import JournalPage from "@/components/jp-journal-page"
import ConnectorModal from "@/components/connector-modal"
import ConversationHistory from "@/components/conversation-history"
import AgentQueryDemo from "@/components/agent-query-demo"
import LiveChatModal from "@/components/live-chat-modal"

export default function JournalPlusPage() {
  const { isSignedIn, user } = useUser()
  const userRole = getUserRole(user)
  const [isConnectorModalOpen, setIsConnectorModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Check if user is in alpha
  const alphaSignup = useQuery(
    api.alphaSignups.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip"
  )
  const isAlphaTester = !!alphaSignup

  // If not signed in or not in alpha, redirect to regular journal page
  if (!isSignedIn || !isAlphaTester) {
    if (typeof window !== 'undefined') {
      window.location.href = '/postscript-journaling'
    }
    return null
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-stone-50 to-white"
      data-ai-semantic="luxury-stationery-landing"
      data-ai-intent="alpha-product-showcase"
      data-ai-audience="early-adopters"
    >
      {/* Hero Section - Classic Luxury */}
      <div
        className="max-w-5xl mx-auto px-8 py-24"
        data-ai-section="hero"
        data-ai-tone="elegant-minimal"
      >
        {/* Letterpress-style header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <div className="border-t border-b border-stone-300 py-2 px-8">
              <span className="text-[10px] tracking-[0.3em] text-stone-500 font-medium uppercase">
                Early Access Programme
              </span>
            </div>
          </div>

          <h1
            className="text-6xl sm:text-7xl font-light text-stone-900 mb-8 tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-crimson)' }}
            data-ai-element="product-name"
            data-ai-hierarchy="primary"
          >
            Journal Plus
          </h1>

          <p
            className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
            style={{ fontFamily: 'var(--font-crimson)' }}
            data-ai-element="tagline"
            data-ai-purpose="value-proposition"
          >
            Transform ordinary prompts into powerful super prompts. Your journal, enhanced with PS-LANG.
          </p>
        </div>

        {/* Welcome Card - Simple Intro */}
        <div
          className="border border-stone-200 bg-white shadow-sm mb-24"
          data-ai-section="welcome"
          data-ai-interaction="status-display"
        >
          <div className="border-b border-stone-100 bg-gradient-to-b from-stone-50/50 to-white px-12 py-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-stone-900 tracking-wide">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">
                  Alpha Programme Member
                </p>
              </div>
            </div>
          </div>

          <div className="px-12 py-12 text-center">
            <p
              className="text-base text-stone-600 max-w-xl mx-auto mb-10 leading-loose"
              style={{ fontFamily: 'var(--font-crimson)' }}
              data-ai-message="personalized-greeting"
            >
              Welcome, {user?.firstName || 'Colleague'}.
              <br/><br/>
              Journal Plus transforms your prompts into powerful PS-LANG super prompts.
              See the demo below, then explore your journal with interactive meta-tags.
            </p>

            <button
              onClick={() => setIsConnectorModalOpen(true)}
              className="px-8 py-3 bg-amber-700 text-white font-light text-sm hover:bg-amber-800 transition-colors tracking-wide"
              data-ai-action="connect-ai-assistants"
            >
              View Connectors
            </button>
            <p className="text-xs text-stone-500 mt-4">
              Claude & ChatGPT API status
            </p>
          </div>
        </div>
      </div>

      {/* Live Chat - Create new conversations */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div
          className="border border-stone-200 bg-white shadow-sm p-12 text-center"
          data-ai-section="live-chat-cta"
          data-ai-interaction="modal-trigger"
        >
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-2 border-stone-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>

          <h2
            className="text-3xl font-light text-stone-900 mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Chat & Auto-Journal
          </h2>

          <p className="text-base text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-crimson)' }}>
            Chat with Claude or ChatGPT. Every conversation auto-saves to Journal Plus with PS-LANG transformation.
          </p>

          <button
            onClick={() => setIsChatModalOpen(true)}
            className="px-8 py-3 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors tracking-wide"
            data-ai-action="open-live-chat"
          >
            Start New Conversation →
          </button>
        </div>
      </div>

      {/* Onboarding Demo - Show PS-LANG transformation */}
      <OnboardingDemo />

      {/* Journal Page - Demo prompts with meta-tag interaction */}
      <JournalPage />

      {/* Synced Conversations - Agentic History with RLHF */}
      <div className="max-w-5xl mx-auto px-8 py-24">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-light text-stone-900 mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Your Synced Conversations
          </h2>
          <p className="text-sm text-stone-600 max-w-2xl mx-auto">
            Claude conversations transformed into PS-LANG super prompts with AI meta-tag enrichment
          </p>
        </div>

        <ConversationHistory provider="claude" />
      </div>

      {/* Agent Query System Demo */}
      <div className="max-w-5xl mx-auto px-8 py-24">
        <AgentQueryDemo />
      </div>

      {/* Connector Modal */}
      <ConnectorModal
        isOpen={isConnectorModalOpen}
        onClose={() => setIsConnectorModalOpen(false)}
      />

      {/* Live Chat Modal */}
      <LiveChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  )
}
