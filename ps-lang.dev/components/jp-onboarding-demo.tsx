"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function OnboardingDemo() {
  const [showTransformation, setShowTransformation] = useState(false)

  const ordinaryPrompt = "Help me build a feature that lets users upload files"

  const pslPrompt = `<@.
Help me build a file upload feature for my web application.

Requirements:
- Support multiple file types (images, PDFs, documents)
- Max file size: 10MB
- Show upload progress
- Validate files before upload
.>

<#.
Tech stack: Next.js 14, TypeScript, Tailwind
Current auth: Clerk
File storage: To be determined (suggest options)
#>

<.bm
Benchmark this implementation against industry standards for upload UX.
Compare performance metrics with similar features.
.bm>`

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <h2
          className="text-3xl font-light text-stone-900 mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-crimson)' }}
        >
          See .PSL in Action
        </h2>
        <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Watch how an ordinary prompt becomes a structured super prompt with PS-LANG zones
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Before - Ordinary Prompt */}
        <div className="border border-stone-200 bg-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm uppercase tracking-wider text-stone-500 font-medium">
              Before
            </h3>
            <span className="text-xs text-stone-400">Ordinary Prompt</span>
          </div>
          <div className="bg-stone-50 p-6 rounded font-mono text-sm text-stone-700 leading-relaxed">
            {ordinaryPrompt}
          </div>
          <div className="mt-4 text-xs text-stone-500">
            • No context separation<br/>
            • Missing technical details<br/>
            • No benchmarking guidance
          </div>
        </div>

        {/* After - PS-LANG Super Prompt */}
        <div className="border border-stone-200 bg-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm uppercase tracking-wider text-stone-700 font-medium">
              After
            </h3>
            <span className="text-xs text-green-600">PS-LANG Super Prompt</span>
          </div>
          <div className="bg-stone-50 p-6 rounded font-mono text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
            {pslPrompt}
          </div>
          <div className="mt-4 text-xs text-stone-600">
            • <span className="text-green-600">Public zone</span> for main request<br/>
            • <span className="text-red-600">Private zone</span> for technical context<br/>
            • <span className="text-purple-600">Bookmark zone</span> for benchmarking
          </div>
        </div>
      </div>

    </div>
  )
}
