"use client"

import { useState } from "react"
import Link from "next/link"
import FeatureRequestModal from "@/components/feature-request-modal"

export default function PlaygroundLandingPage() {
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-wide">
          <Link href="/" className="text-stone-400 hover:text-stone-900 transition-colors uppercase">Home</Link>
          <span className="text-stone-300">→</span>
          <span className="text-stone-900 font-semibold uppercase">Playground</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Interactive Demos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-stone-900 mb-6 tracking-tight">
            PS-LANG Playground
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Explore how zone-based syntax improves context control and token efficiency
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Token Comparison Card */}
          <Link href="/playground/token-comparison">
            <div className="border border-stone-300 bg-white p-12 hover:border-stone-400 transition-colors group">
              <div className="mb-6">
                <div className="w-16 h-16 border-2 border-stone-300 flex items-center justify-center group-hover:border-stone-400 transition-colors">
                  <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-light text-stone-900 mb-4 tracking-tight">
                Token Usage Comparison
              </h2>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                Interactive chart showing token efficiency gains with PS-LANG zones across multiple iterations
              </p>
              <div className="flex items-center gap-2 text-sm text-stone-600 group-hover:text-stone-900 transition-colors">
                <span>Explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* 1-Shot Prompt Editor Card */}
          <Link href="/playground/prompt-editor">
            <div className="border border-stone-300 bg-white p-12 hover:border-stone-400 transition-colors group">
              <div className="mb-6">
                <div className="w-16 h-16 border-2 border-stone-300 flex items-center justify-center group-hover:border-stone-400 transition-colors">
                  <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-light text-stone-900 mb-4 tracking-tight">
                1-Shot Prompt Editor
              </h2>
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                See how PS-LANG zones transform your prompts in real-time with side-by-side comparison
              </p>
              <div className="flex items-center gap-2 text-sm text-stone-600 group-hover:text-stone-900 transition-colors">
                <span>Explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Interactive Training Card - Coming Soon */}
          <div className="border border-stone-300 bg-white p-12 relative opacity-75">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-stone-200 text-stone-600 text-xs font-medium tracking-wide uppercase">
                Coming Soon
              </span>
            </div>
            <div className="mb-6">
              <div className="w-16 h-16 border-2 border-stone-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-light text-stone-900 mb-4 tracking-tight">
              Interactive Training
            </h2>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Train your context engineering through agentic training based on your prompts, enriched with PS-LANG context and AI metadata.
            </p>
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <span>Coming Soon</span>
            </div>
          </div>

          {/* Multi-Agent Simulator Card - Coming Soon */}
          <div className="border border-stone-300 bg-white p-12 relative opacity-75">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-stone-200 text-stone-600 text-xs font-medium tracking-wide uppercase">
                Coming Soon
              </span>
            </div>
            <div className="mb-6">
              <div className="w-16 h-16 border-2 border-stone-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-light text-stone-900 mb-4 tracking-tight">
              Multi-Agent Simulator
            </h2>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Visualize how context flows between agents in complex workflows with interactive diagrams and debugging
            </p>
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <span>Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Request Feature Section */}
        <div>
          <div className="border border-stone-300 bg-gradient-to-br from-stone-50 to-white p-12 sm:p-16 text-center">
            <div className="inline-block mb-4">
              <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">Feedback</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-stone-900 mb-6 tracking-tight">
              Request a Feature
            </h3>
            <p className="text-base text-stone-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Have an idea for a new playground demo or feature? We'd love to hear from you.
            </p>
            <button
              onClick={() => setIsFeatureModalOpen(true)}
              className="inline-block px-8 py-4 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
            >
              Submit Feature Request →
            </button>
          </div>
        </div>
      </div>

      <FeatureRequestModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
      />
    </div>
  )
}
