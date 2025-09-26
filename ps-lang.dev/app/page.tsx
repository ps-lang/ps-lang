import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-8 py-24">
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <span className="text-xs tracking-[0.2em] text-stone-500 font-medium uppercase">Privacy-First Language</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-light text-stone-900 mb-8 tracking-tight">PS-LANG</h1>

          <p className="text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Take control of what you say to AI. Revolutionary syntax for granular privacy control
            in human-AI collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/get-started"
              className="border border-stone-900 px-8 py-3 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm tracking-wide"
            >
              GET STARTED
            </Link>
            <Link
              href="/playground"
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm tracking-wide"
            >
              Try Playground →
            </Link>
          </div>
        </div>

        {/* Privacy Zones Example */}
        <div className="border border-stone-200 bg-white p-12 mb-20">
          <div className="mb-8">
            <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Example</span>
          </div>

          <pre className="font-mono text-sm text-stone-700 leading-relaxed overflow-x-auto">
            {`<. Private note - AI agents can't see this >
This is completely invisible to all AI agents

<#. Read-only zone for agents >
AI can read this but cannot modify

<@. Interactive zone >
Full AI interaction allowed here

<~. Agent-managed zone >
AI can autonomously modify this section`}
          </pre>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="text-center">
            <div className="mb-6">
              <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Privacy</span>
            </div>
            <h3 className="text-lg font-light text-stone-900 mb-4">Agent-Blind Zones</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Create genuine blind spots where AI cannot access content. Your secrets stay secret.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Control</span>
            </div>
            <h3 className="text-lg font-light text-stone-900 mb-4">Granular Permissions</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Four distinct privacy zones give you complete control over AI agent interactions.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Meta Tags</span>
            </div>
            <h3 className="text-lg font-light text-stone-900 mb-4">AI Context</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Add semantic AI Meta Tags without compromising privacy. Context-aware automation.
            </p>
          </div>
        </div>

        {/* Commands Section */}
        <div className="border border-stone-200 bg-white p-12 mb-24">
          <div className="mb-8">
            <span className="text-xs tracking-[0.15em] text-stone-400 uppercase">Commands</span>
          </div>

          <pre className="font-mono text-sm text-stone-700 leading-relaxed overflow-x-auto">
            {`.login          # Start your day
.daily          # Review schedule
.journal        # Daily journal entry
.blog           # Generate blog post
.commit         # Git commit with privacy
.logout         # End session

<.journal 09-26-25-ps-lang
  <#. Public: Built PS-LANG specification >
  <. Private: Feeling excited about launch >
  <@. Generate blog post from today's work >
>`}
          </pre>
        </div>

        {/* Use Cases */}
        <div className="text-center mb-24">
          <h2 className="text-2xl font-light text-stone-900 mb-12">Perfect For</h2>
          <div className="flex flex-wrap gap-4 justify-center max-w-2xl mx-auto">
            {[
              "Development Workflows",
              "Daily Journaling",
              "Documentation",
              "CI/CD Pipelines",
              "Email Templates",
              "MCP Integration",
              "Blog Content",
              "Code Reviews"
            ].map((useCase) => (
              <span key={useCase} className="border border-stone-200 px-4 py-2 text-xs tracking-wide text-stone-600">
                {useCase}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="mb-8">
            <span className="text-xs tracking-[0.2em] text-stone-500 font-medium uppercase">Open Source</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-12 tracking-tight">
            Your prompts. Your rules. Your privacy.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="https://github.com/Vummo/ps-lang"
              className="border border-stone-900 px-8 py-3 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm tracking-wide"
            >
              VIEW ON GITHUB
            </Link>
            <Link
              href="/docs"
              className="text-stone-600 hover:text-stone-900 transition-colors text-sm tracking-wide"
            >
              Read Documentation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}