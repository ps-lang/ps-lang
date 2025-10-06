import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'About PS-LANG™ | Privacy-First Multi-Agent Context Control',
  description: 'Learn about PS-LANG, the zone-based syntax for controlling what AI agents see in multi-agent workflows. Platform-agnostic, open-source, and designed for privacy-first AI collaboration.',
  openGraph: {
    title: 'About PS-LANG™ | Privacy-First Multi-Agent Context Control',
    description: 'Control what AI agents see in your workflows with zone-based syntax. Works with Claude, GPT, Cursor, Copilot, and custom agents.',
    url: 'https://ps-lang.dev/about',
    siteName: 'PS-LANG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About PS-LANG™ | Privacy-First Multi-Agent Context Control',
    description: 'Control what AI agents see in your workflows with zone-based syntax. Works with Claude, GPT, Cursor, Copilot, and custom agents.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-xs tracking-[0.2em] text-stone-400 font-medium uppercase">About</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light text-stone-900 mb-6 tracking-tight">
            PS-LANG<sup className="text-[10px] ml-0.5 -top-6 relative">™</sup>
          </h1>
          <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed font-light mb-4">
            Privacy-First Scripting Language for Multi-Agent Context Control
          </p>
          <p className="text-base text-stone-500 max-w-2xl mx-auto leading-relaxed font-light">
            Control what AI agents see in your workflows with zone-based syntax.
          </p>
        </div>

        {/* What is PS-LANG */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-white p-12">
            <h2 className="text-2xl font-light text-stone-900 mb-6 tracking-tight">
              What is PS-LANG?
            </h2>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl mb-6">
              PS-LANG is a flexible, platform-agnostic syntax for controlling what AI agents see in multi-agent workflows. Use zones to mark content as private, pass-through, or active workspace.
            </p>
            <div className="space-y-3 text-sm text-stone-600 leading-relaxed max-w-3xl">
              <p className="font-medium text-stone-900">Designed to evolve with you:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Override and extend the syntax for your needs</li>
                <li>Platform/agent/model agnostic approach</li>
                <li>Works with Claude, GPT, Cursor, Copilot, and custom agents</li>
                <li>Community-driven development</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Perfect For Section */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-white p-12">
            <h2 className="text-2xl font-light text-stone-900 mb-8 tracking-tight">
              Perfect For
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-stone-200 p-6">
                <h3 className="text-base font-light text-stone-900 mb-3 tracking-tight">Multi-Agent Pipelines</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Research → Writing → Review workflows with controlled context handoffs between agents.
                </p>
              </div>
              <div className="border border-stone-200 p-6">
                <h3 className="text-base font-light text-stone-900 mb-3 tracking-tight">Context Engineering</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Control exactly what each agent sees in your multi-step workflows.
                </p>
              </div>
              <div className="border border-stone-200 p-6">
                <h3 className="text-base font-light text-stone-900 mb-3 tracking-tight">Benchmarking</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Create clean test environments with isolated context for accurate benchmarks.
                </p>
              </div>
              <div className="border border-stone-200 p-6">
                <h3 className="text-base font-light text-stone-900 mb-3 tracking-tight">Privacy-First AI</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Keep sensitive notes private while collaborating with AI assistants.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use PS-LANG */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-white p-12">
            <h2 className="text-2xl font-light text-stone-900 mb-6 tracking-tight">
              Why Use PS-LANG?
            </h2>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl mb-8">
              You don't even need to install it. As someone who writes prompts daily (Claude Code, Cursor, ChatGPT, etc.), PS-LANG just adds structure.
            </p>

            <div className="bg-stone-50 border border-stone-200 p-6 mb-8 font-mono text-sm">
              <p className="text-stone-500 mb-4">// Before: Unstructured prompt</p>
              <p className="text-stone-600 mb-6">"Hey Claude, build a data pipeline. Don't show the next agent my rough notes about the schema."</p>

              <p className="text-stone-500 mb-4">// After: Structured with PS-LANG</p>
              <p className="text-stone-900">&lt;@. Build ETL pipeline for user analytics .@&gt;</p>
              <p className="text-stone-600">&lt;. Private: still deciding between Convex or Supabase realtime .&gt;</p>
              <p className="text-stone-900">&lt;#. Next agent: uses daily batch processing, 24hr retention .#&gt;</p>
            </div>

            <div className="space-y-4">
              <p className="font-medium text-stone-900">What this gives you:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">Context Control</p>
                    <p className="text-sm text-stone-600">Decide what each agent sees</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">Cleaner Handoffs</p>
                    <p className="text-sm text-stone-600">Next agent gets only what they need</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">Better Logs</p>
                    <p className="text-sm text-stone-600">Your work becomes structured, searchable</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">Future-Proof</p>
                    <p className="text-sm text-stone-600">Syntax works today, unlocks encryption later</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Syntax */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-white p-12">
            <h2 className="text-2xl font-light text-stone-900 mb-6 tracking-tight">
              Zone Syntax
            </h2>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl mb-8">
              PS-LANG zones are patterns, not limits. Start with these 7 recommended zones, then invent your own.
            </p>

            <div className="space-y-4">
              {[
                { zone: "Current Agent Only", syntax: "<. text .>", purpose: "Only current agent sees" },
                { zone: "Pass-Through", syntax: "<#. text .#>", purpose: "Documentation for next agent" },
                { zone: "Active Workspace", syntax: "<@. text .@>", purpose: "Current agent's work area" },
                { zone: "AI-Managed", syntax: "<~. text .~>", purpose: "AI-generated metadata" },
                { zone: "Business/Monetization", syntax: "<$. text .$>", purpose: "Business strategy, pricing" },
                { zone: "Questions", syntax: "<?. text .?>", purpose: "Open questions" },
                { zone: "Benchmark", syntax: "<.bm text .bm>", purpose: "Metrics or references" }
              ].map((item, i) => (
                <div key={i} className="border border-stone-200 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <span className="text-xs tracking-wider text-stone-500 font-medium uppercase">{item.zone}</span>
                    <code className="text-sm font-mono text-stone-900 bg-stone-50 px-2 py-1">{item.syntax}</code>
                  </div>
                  <p className="text-sm text-stone-600">{item.purpose}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-stone-50 border border-stone-200">
              <p className="text-sm text-stone-600 leading-relaxed">
                <span className="font-medium text-stone-900">Infinitely extensible:</span> Create any zone that makes sense for your workflow. The pattern is <code className="font-mono bg-white px-2 py-1">&lt;symbol. content .symbol&gt;</code>
              </p>
            </div>
          </div>
        </div>

        {/* Alpha Status */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-stone-50 p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="px-3 py-1 bg-stone-900 text-white text-xs font-medium tracking-wide uppercase">
                Alpha
              </div>
              <div>
                <h2 className="text-xl font-light text-stone-900 mb-3 tracking-tight">
                  v0.1.0-alpha.1
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
                  PS-LANG is in active alpha testing. We're gathering feedback on zone syntax, CLI tools, and real-world usage patterns.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-stone-600 leading-relaxed max-w-3xl">
              <p className="font-medium text-stone-900">Help us test:</p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Is the zone syntax clear and intuitive?</li>
                <li>Are 7 zones enough, or do you need custom zones?</li>
                <li>Does it solve your multi-agent workflow problems?</li>
                <li>Any performance issues or integration friction?</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-white p-12">
            <h2 className="text-2xl font-light text-stone-900 mb-8 tracking-tight">
              Roadmap
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-stone-900 pl-6">
                <h3 className="text-base font-light text-stone-900 mb-2 tracking-tight">Alpha (Current)</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Basic zone syntax, CLI tools, VS Code themes, and community feedback collection.
                </p>
              </div>
              <div className="border-l-2 border-stone-300 pl-6">
                <h3 className="text-base font-light text-stone-900 mb-2 tracking-tight">Beta</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  .psl file format, secrets management, and enhanced preprocessing tools.
                </p>
              </div>
              <div className="border-l-2 border-stone-300 pl-6">
                <h3 className="text-base font-light text-stone-900 mb-2 tracking-tight">v1.0</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Parser library, multi-agent framework integration, and official ChatGPT support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* .PSL File Format */}
        <div className="mb-16">
          <div className="border border-stone-300 bg-white p-12">
            <h2 className="text-2xl font-light text-stone-900 mb-6 tracking-tight">
              .PSL File Format
            </h2>
            <p className="text-base text-stone-600 leading-relaxed max-w-3xl mb-6">
              <span className="font-mono text-sm">.psl</span> stands for <strong>Prompt Script Language</strong> — a structured file format for organizing multi-agent workflows, context handoffs, and AI collaboration sessions.
            </p>

            <div className="bg-stone-50 border border-stone-200 p-6 mb-6">
              <p className="text-sm text-stone-600 leading-relaxed mb-4">
                Think of .psl files as executable prompts with zones:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-stone-600 pl-4">
                <li>Store multi-step workflows with zone-based context control</li>
                <li>Version control your prompt engineering work</li>
                <li>Share reproducible AI workflows with your team</li>
                <li>Keep sensitive notes private with agent-blind zones</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="font-medium text-stone-900">Coming in Beta:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">File Templates</p>
                    <p className="text-sm text-stone-600">Pre-built .psl templates for common workflows</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">Secrets Management</p>
                    <p className="text-sm text-stone-600">Encrypted zones for API keys and credentials</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">Preprocessing Tools</p>
                    <p className="text-sm text-stone-600">CLI commands to validate and transform .psl files</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-stone-400">•</span>
                  <div>
                    <p className="font-medium text-stone-900 text-sm">IDE Support</p>
                    <p className="text-sm text-stone-600">Syntax highlighting for VS Code and other editors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div>
          <div className="border border-stone-300 bg-gradient-to-br from-stone-50 to-white p-12 sm:p-16 text-center">
            <h3 className="text-2xl sm:text-3xl font-light text-stone-900 mb-6 tracking-tight">
              Get Started
            </h3>
            <p className="text-base text-stone-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Start using PS-LANG in your prompts today, or install the CLI for advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={siteConfig.urls.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
              >
                View on GitHub →
              </a>
              <a
                href={siteConfig.urls.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 border border-stone-300 text-stone-900 font-light text-sm hover:border-stone-400 transition-colors"
              >
                Install CLI
              </a>
            </div>
            <p className="text-xs text-stone-500 mt-8">
              PS-LANG<sup className="text-[8px]">™</sup> is a trademark of Vummo Labs ·{" "}
              <a
                href={siteConfig.urls.license}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-stone-900 transition-colors underline"
              >
                MIT License
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
