"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-4xl mx-auto px-8 py-24">
        {/* Breadcrumbs */}
        <div className="mb-12">
          <Breadcrumbs items={[{ label: "How It Works", href: "/how-it-works" }]} />
        </div>

        {/* Header */}
        <div className="text-center mb-20">
          <h1
            className="text-5xl font-light text-stone-900 mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            How PS-LANG Journaling Works
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Transform ordinary AI prompts into structured super prompts with zone-based privacy control
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-20">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2
              className="text-3xl font-light text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              The Problem
            </h2>
          </div>

          <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'var(--font-crimson)' }}>
            <p>
              When you chat with AI assistants like ChatGPT or Claude, everything you type—including sensitive technical details,
              API keys, private business logic, and confidential information—gets sent in one unstructured blob.
            </p>
            <p>
              You lose control over what's public vs. private. You can't benchmark improvements. And when you want to share
              your prompts with teammates or reuse them later, they're buried in chat history without context or structure.
            </p>
          </div>

          {/* Example */}
          <div className="mt-8 bg-stone-50 border border-stone-200 p-6">
            <div className="text-xs text-stone-500 uppercase tracking-wider mb-3">Typical Unstructured Prompt</div>
            <div className="font-mono text-sm text-stone-700 mb-4">
              "Help me build authentication. I'm using Next.js 14 with Clerk. My database is Postgres with Prisma.
              The user table has id, email, password_hash, and role fields. I need OAuth for Google and GitHub too.
              Make sure to validate emails and hash passwords with bcrypt. Also add rate limiting."
            </div>
            <div className="text-xs text-stone-500">
              ❌ Everything exposed • No zone control • Hard to reuse • Can't benchmark
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="mb-20">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2
              className="text-3xl font-light text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              The Solution: PS-LANG Zones
            </h2>
          </div>

          <div className="space-y-6 text-stone-700 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-crimson)' }}>
            <p>
              PS-LANG (PostScript Language) introduces <strong>7 privacy zones</strong> that let you control exactly what
              each agent, human, or system can see in your prompts.
            </p>
          </div>

          {/* Same Example with PS-LANG */}
          <div className="bg-white border border-stone-200 p-6">
            <div className="text-xs text-green-600 uppercase tracking-wider mb-3">PS-LANG Super Prompt</div>
            <div className="font-mono text-xs text-stone-700 whitespace-pre-wrap mb-4">
{`<@.
Build a secure authentication system with email/password and OAuth.

Requirements:
- Email verification
- Google and GitHub OAuth
- Password hashing
- Rate limiting
.>

<#.
Tech stack: Next.js 14, Clerk, PostgreSQL, Prisma
Database schema: users(id, email, password_hash, role)
Use bcrypt for password hashing
#>

<.bm
Benchmark against OWASP auth best practices.
Measure login response time (<200ms target).
.bm>`}
            </div>
            <div className="text-xs text-green-600">
              ✓ Public request separated • Private tech details hidden • Benchmarking tracked • Fully reusable
            </div>
          </div>
        </section>

        {/* The 7 Zones */}
        <section className="mb-20">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2
              className="text-3xl font-light text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              The 7 PS-LANG Zones
            </h2>
          </div>

          <div className="space-y-6">
            {/* Public Zone */}
            <div className="border border-green-200 bg-green-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="font-medium text-stone-900">
                  Public Zone <code className="text-sm font-mono ml-2 text-green-700">{'<@. .>'}</code>
                </h3>
              </div>
              <p className="text-sm text-stone-700 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
                Main requirements visible to everyone—AI agents, teammates, documentation.
              </p>
              <div className="text-xs text-green-700 font-mono">
                Example: Feature descriptions, acceptance criteria, user stories
              </div>
            </div>

            {/* Private Zone */}
            <div className="border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h3 className="font-medium text-stone-900">
                  Private Zone <code className="text-sm font-mono ml-2 text-red-700">{'<#. #>'}</code>
                </h3>
              </div>
              <p className="text-sm text-stone-700 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
                Confidential technical context only the AI should see. Never shared publicly.
              </p>
              <div className="text-xs text-red-700 font-mono">
                Example: Database schemas, API endpoints, tech stack details, auth implementation
              </div>
            </div>

            {/* Bookmark Zone */}
            <div className="border border-purple-200 bg-purple-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <h3 className="font-medium text-stone-900">
                  Bookmark Zone <code className="text-sm font-mono ml-2 text-purple-700">{'<.bm .bm>'}</code>
                </h3>
              </div>
              <p className="text-sm text-stone-700 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
                Benchmarking instructions to measure improvements and track performance over time.
              </p>
              <div className="text-xs text-purple-700 font-mono">
                Example: Performance targets, comparison metrics, quality standards
              </div>
            </div>

            {/* Internal Zone */}
            <div className="border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <h3 className="font-medium text-stone-900">
                  Internal Zone <code className="text-sm font-mono ml-2 text-amber-700">{'<. .>'}</code>
                </h3>
              </div>
              <p className="text-sm text-stone-700 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
                Team-visible context. Shared with colleagues but not external agents or public docs.
              </p>
              <div className="text-xs text-amber-700 font-mono">
                Example: Internal conventions, team preferences, workflow notes
              </div>
            </div>

            {/* Log Zone */}
            <div className="border border-blue-200 bg-blue-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="font-medium text-stone-900">
                  Log Zone <code className="text-sm font-mono ml-2 text-blue-700">{'<.log .log>'}</code>
                </h3>
              </div>
              <p className="text-sm text-stone-700 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
                Audit trail instructions. Records decisions, changes, and compliance requirements.
              </p>
              <div className="text-xs text-blue-700 font-mono">
                Example: Security audit notes, compliance checkpoints, change logs
              </div>
            </div>

            {/* System Zone */}
            <div className="border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <h3 className="font-medium text-stone-900">
                  System Zone <code className="text-sm font-mono ml-2 text-gray-700">{'<sys. .sys>'}</code>
                </h3>
              </div>
              <p className="text-sm text-stone-700 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
                System-level metadata and configuration. Infrastructure and deployment details.
              </p>
              <div className="text-xs text-gray-700 font-mono">
                Example: Environment configs, deployment targets, service dependencies
              </div>
            </div>

            {/* Agent Zone */}
            <div className="border border-indigo-200 bg-indigo-50 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <h3 className="font-medium text-stone-900">
                  Agent Zone <code className="text-sm font-mono ml-2 text-indigo-700">{'<.agent .agent>'}</code>
                </h3>
              </div>
              <p className="text-sm text-stone-700 mb-2" style={{ fontFamily: 'var(--font-crimson)' }}>
                Agent-specific instructions. Control what each AI agent in a pipeline can access.
              </p>
              <div className="text-xs text-indigo-700 font-mono">
                Example: Model-specific prompts, agent handoff instructions, role definitions
              </div>
            </div>
          </div>
        </section>

        {/* How Journal Plus Works */}
        <section className="mb-20">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2
              className="text-3xl font-light text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              How Journal Plus Works
            </h2>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                <span className="font-medium text-amber-700">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900 mb-2">Connect Your AI Assistants</h3>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Link your ChatGPT or Claude accounts via OAuth or API key. Journal Plus securely stores your credentials
                  with encryption.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                <span className="font-medium text-amber-700">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900 mb-2">Auto-Sync Conversations</h3>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Your conversations automatically sync to Journal Plus. Each chat is analyzed and transformed into
                  PS-LANG format with proper zone separation.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                <span className="font-medium text-amber-700">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900 mb-2">Intelligent Transformation</h3>
                <p className="text-sm text-stone-700 mb-3" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Our AI analyzes your conversations and automatically:
                </p>
                <ul className="text-sm text-stone-700 space-y-1" style={{ fontFamily: 'var(--font-crimson)' }}>
                  <li>• Extracts main requirements → Public zone</li>
                  <li>• Detects technical context → Private zone</li>
                  <li>• Identifies optimization goals → Bookmark zone</li>
                  <li>• Generates meta-tags (intent, tech_stack, complexity)</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                <span className="font-medium text-amber-700">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900 mb-2">Explore & Interact</h3>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Browse your journal with interactive meta-tags. Click any prompt to see the full PS-LANG version,
                  zone breakdown, and extracted insights. Reuse prompts across projects.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                <span className="font-medium text-amber-700">5</span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900 mb-2">Benchmark & Improve</h3>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Track improvements over time using bookmark zones. Compare prompting strategies, measure efficiency gains,
                  and visualize your evolution as a prompt engineer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="mb-20">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2
              className="text-3xl font-light text-stone-900 tracking-tight"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              Privacy & Security
            </h2>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-green-600 mt-1">✓</div>
              <div>
                <h4 className="font-medium text-stone-900 mb-1">End-to-End Encryption</h4>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  All journal entries are encrypted before storage. Only you have the decryption keys.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-green-600 mt-1">✓</div>
              <div>
                <h4 className="font-medium text-stone-900 mb-1">Local-First Architecture</h4>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Your data lives on your device first. Sync is optional and always encrypted in transit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-green-600 mt-1">✓</div>
              <div>
                <h4 className="font-medium text-stone-900 mb-1">Zone-Based Access Control</h4>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Private zones never leave your account. Public zones can be shared, but you control what's public.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-green-600 mt-1">✓</div>
              <div>
                <h4 className="font-medium text-stone-900 mb-1">No AI Training</h4>
                <p className="text-sm text-stone-700" style={{ fontFamily: 'var(--font-crimson)' }}>
                  Your prompts are never used to train AI models. Your intellectual property remains yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2
            className="text-2xl font-light text-stone-900 mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Ready to Transform Your Prompts?
          </h2>
          <div className="flex gap-4 justify-center">
            <a
              href="/journal-plus"
              className="px-8 py-3 bg-amber-700 text-white font-light text-sm hover:bg-amber-800 transition-colors tracking-wide"
            >
              Try Journal Plus
            </a>
            <a
              href="/playground"
              className="px-8 py-3 border border-stone-300 text-stone-900 font-light text-sm hover:bg-stone-50 transition-colors tracking-wide"
            >
              Explore Playground
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
