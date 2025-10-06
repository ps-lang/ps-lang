"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DemoPrompt {
  id: string
  title: string
  persona: string
  timestamp: string
  snippet: string
  fullPrompt: string
  metaTags: Array<{ name: string; value: string; zone: string }>
}

const demoPrompts: DemoPrompt[] = [
  {
    id: "demo-1",
    title: "Build authentication flow",
    persona: "Builder",
    timestamp: "2 hours ago",
    snippet: "Help me implement a secure authentication system...",
    fullPrompt: `<@.
Implement a secure authentication system with email/password and OAuth providers.

Requirements:
- Email/password with verification
- Google and GitHub OAuth
- Session management
- Protected routes
.>

<#.
Using Next.js 14 App Router, Clerk for auth
Need integration with existing user database
#>`,
    metaTags: [
      { name: "intent", value: "feature_implementation", zone: "public" },
      { name: "tech_stack", value: "Next.js 14, Clerk", zone: "private" },
      { name: "complexity", value: "medium", zone: "read-only" },
    ],
  },
  {
    id: "demo-2",
    title: "Optimize database queries",
    persona: "Researcher",
    timestamp: "5 hours ago",
    snippet: "Analyze these slow queries and suggest optimizations...",
    fullPrompt: `<@.
Analyze database performance and suggest optimizations for user dashboard.

Current issues:
- Slow load times (3-5s)
- N+1 query problems
- Missing indexes
.>

<#.
PostgreSQL 15, Prisma ORM
~50k users, growing fast
Dashboard shows user stats, recent activity, analytics
#>

<.bm
Compare query performance before/after optimization.
Target: <500ms dashboard load time.
.bm>`,
    metaTags: [
      { name: "intent", value: "performance_optimization", zone: "public" },
      { name: "database", value: "PostgreSQL 15", zone: "private" },
      { name: "benchmark_target", value: "<500ms", zone: "managed" },
    ],
  },
  {
    id: "demo-3",
    title: "Review API architecture",
    persona: "Reviewer",
    timestamp: "1 day ago",
    snippet: "Review this REST API design for security issues...",
    fullPrompt: `<@.
Review REST API architecture for security vulnerabilities and best practices.

Focus areas:
- Authentication/authorization
- Rate limiting
- Input validation
- Error handling
.>

<#.
Node.js/Express API
JWT auth, Redis for rate limiting
Serving ~1M requests/day
#>

<.log
Document all security findings and remediation steps for audit trail.
.log>`,
    metaTags: [
      { name: "intent", value: "security_review", zone: "public" },
      { name: "scale", value: "1M req/day", zone: "private" },
      { name: "audit_required", value: "true", zone: "managed" },
    ],
  },
]

export default function JournalPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<DemoPrompt | null>(null)
  const [showMetaTags, setShowMetaTags] = useState(false)
  const [copied, setCopied] = useState(false)

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "public":
        return "bg-green-100 text-green-800"
      case "private":
        return "bg-red-100 text-red-800"
      case "managed":
        return "bg-purple-100 text-purple-800"
      case "read-only":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-stone-100 text-stone-600"
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 bg-white">
      <div className="mb-12">
        <h2
          className="text-3xl font-light text-stone-900 mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-crimson)' }}
        >
          Your Journal
        </h2>
        <p className="text-sm text-stone-600">
          Demo prompts showing PS-LANG in action. Click any prompt to explore meta-tags.
        </p>
      </div>

      {/* Prompt List */}
      <div className="space-y-4 mb-12">
        {demoPrompts.map((prompt) => (
          <motion.button
            key={prompt.id}
            onClick={() => {
              setSelectedPrompt(prompt)
              setShowMetaTags(false)
            }}
            className={`w-full border bg-white p-6 text-left transition-all ${
              selectedPrompt?.id === prompt.id
                ? 'border-stone-900 shadow-md'
                : 'border-stone-200 hover:border-stone-400'
            }`}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-medium text-stone-900 mb-1">{prompt.title}</h3>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>Persona: {prompt.persona}</span>
                  <span>•</span>
                  <span>{prompt.timestamp}</span>
                </div>
              </div>
              {selectedPrompt?.id === prompt.id && (
                <span className="text-xs text-stone-500">● Selected</span>
              )}
            </div>
            <p className="text-sm text-stone-600" style={{ fontFamily: 'var(--font-crimson)' }}>
              {prompt.snippet}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Selected Prompt Detail */}
      <AnimatePresence>
        {selectedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="border border-stone-200 bg-stone-50 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light text-stone-900" style={{ fontFamily: 'var(--font-crimson)' }}>
                {selectedPrompt.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedPrompt.fullPrompt)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="px-4 py-2 border border-stone-300 text-sm text-stone-700 hover:border-stone-900 hover:bg-white transition-all"
                >
                  {copied ? "✓ Copied!" : "Copy .PSL"}
                </button>
                <button
                  onClick={() => setShowMetaTags(!showMetaTags)}
                  className="px-4 py-2 border border-stone-300 text-sm text-stone-700 hover:border-stone-900 hover:bg-white transition-all"
                >
                  {showMetaTags ? "Hide Meta-Tags" : "Show Meta-Tags"}
                </button>
              </div>
            </div>

            {/* Full Prompt */}
            <div className="bg-white border border-stone-200 p-6 mb-6">
              <div className="text-xs text-stone-500 uppercase tracking-wider mb-4">
                PS-LANG Prompt
              </div>
              <pre className="font-mono text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                {selectedPrompt.fullPrompt}
              </pre>
            </div>

            {/* Meta-Tags */}
            {showMetaTags && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: "easeInOut" }}
                className="bg-white border border-stone-200 p-6"
              >
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-4">
                  Agentic Meta-Tags
                </div>
                <div className="space-y-3">
                  {selectedPrompt.metaTags.map((tag, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`text-xs uppercase tracking-wider px-2 py-1 rounded ${getZoneColor(
                          tag.zone
                        )}`}
                      >
                        {tag.zone}
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-xs text-stone-900">{tag.name}</div>
                        <div className="text-xs text-stone-600 mt-1">{tag.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-stone-200 text-xs text-stone-500">
                  These meta-tags help AI agents understand context, zones, and intent.
                  Click any tag to explore how PS-LANG structures your prompts for better results.
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
