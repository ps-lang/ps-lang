import Navigation from "@/components/navigation"
import ScrollTimeline from "@/components/scroll-timeline"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <ScrollTimeline />
      <Navigation />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="paper-card p-6 sticky top-24">
              <h3 className="font-typewriter font-bold text-ink mb-4">Documentation</h3>
              <nav className="space-y-2">
                <Link href="/docs" className="block text-sm text-stone-900 font-medium">
                  Getting Started
                </Link>
                <Link
                  href="/docs/syntax"
                  className="block font-typewriter text-ink-light hover:text-ink transition-colors"
                >
                  Syntax Guide
                </Link>
                <Link
                  href="/docs/functions"
                  className="block font-typewriter text-ink-light hover:text-ink transition-colors"
                >
                  Functions
                </Link>
                <Link
                  href="/docs/control-flow"
                  className="block font-typewriter text-ink-light hover:text-ink transition-colors"
                >
                  Control Flow
                </Link>
                <Link
                  href="/docs/data-types"
                  className="block font-typewriter text-ink-light hover:text-ink transition-colors"
                >
                  Data Types
                </Link>
                <Link
                  href="/docs/ai-collaboration"
                  className="block font-typewriter text-ink-light hover:text-ink transition-colors"
                >
                  AI Collaboration
                </Link>
                <Link
                  href="/docs/examples"
                  className="block font-typewriter text-ink-light hover:text-ink transition-colors"
                >
                  Examples
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="paper-card stacked-papers p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-editorial text-4xl font-bold text-ink">Getting Started</h1>
                <span className="border border-stone-300 px-3 py-1 text-xs tracking-[0.1em] text-stone-500 font-light">V0.1</span>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="font-editorial text-ink-light text-xl mb-6">
                  Welcome to ps-lang! This guide will help you understand the fundamentals of writing pseudocode that
                  both humans and AI can understand and execute.
                </p>

                <div className="rubber-band my-8"></div>

                <h2 className="font-editorial text-2xl font-bold text-ink mb-4">What is ps-lang?</h2>
                <p className="font-editorial text-ink-light mb-6">
                  ps-lang is a pseudocode-style programming language designed specifically for human-AI collaboration.
                  It bridges the gap between natural language descriptions and executable code, making it easier for
                  both humans and AI systems to understand, modify, and execute algorithms.
                </p>

                <h2 className="font-editorial text-2xl font-bold text-ink mb-4">Core Principles</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="paper-card p-4">
                    <h3 className="font-typewriter font-bold text-ink mb-2">Readability First</h3>
                    <p className="font-editorial text-ink-light text-sm">
                      Every ps-lang program should read like a clear, step-by-step explanation of what the code does.
                    </p>
                  </div>
                  <div className="paper-card p-4">
                    <h3 className="font-typewriter font-bold text-ink mb-2">AI-Friendly</h3>
                    <p className="font-editorial text-ink-light text-sm">
                      Structured syntax that AI models can easily parse, understand, and generate.
                    </p>
                  </div>
                  <div className="paper-card p-4">
                    <h3 className="font-typewriter font-bold text-ink mb-2">Executable</h3>
                    <p className="font-editorial text-ink-light text-sm">
                      Not just documentation—ps-lang programs can be compiled and run directly.
                    </p>
                  </div>
                  <div className="paper-card p-4">
                    <h3 className="font-typewriter font-bold text-ink mb-2">Collaborative</h3>
                    <p className="font-editorial text-ink-light text-sm">
                      Designed for seamless handoffs between human developers and AI assistants.
                    </p>
                  </div>
                </div>

                <h2 className="font-editorial text-2xl font-bold text-ink mb-4">Your First Program</h2>
                <p className="font-editorial text-ink-light mb-4">
                  Let's start with a simple example that demonstrates the basic structure of a ps-lang program:
                </p>

                <div className="paper-card p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-stone-600 font-mono">calculator.ps</span>
                    <span className="border border-stone-300 px-2 py-1 text-xs tracking-[0.1em] text-stone-500 font-light">EXAMPLE</span>
                  </div>
                  <pre className="font-typewriter text-ink overflow-x-auto">
                    {`DEFINE simple_calculator:
  INPUT: 
    first_number as number
    operation as string
    second_number as number
  
  PROCESS:
    IF operation equals "add":
      SET result = first_number + second_number
    ELSE IF operation equals "subtract":
      SET result = first_number - second_number
    ELSE IF operation equals "multiply":
      SET result = first_number * second_number
    ELSE IF operation equals "divide":
      IF second_number equals 0:
        OUTPUT: "Error: Division by zero"
        RETURN
      ELSE:
        SET result = first_number / second_number
    ELSE:
      OUTPUT: "Error: Unknown operation"
      RETURN
    
  OUTPUT: result

EXECUTE simple_calculator WITH 10, "add", 5`}
                  </pre>
                </div>

                <h3 className="font-editorial text-xl font-bold text-ink mb-3">Breaking it Down</h3>
                <div className="space-y-6 mb-8">
                  <div className="flex gap-6">
                    <span className="border border-stone-300 px-3 py-1 text-xs tracking-[0.1em] text-stone-500 font-light flex-shrink-0">DEFINE</span>
                    <p className="text-stone-600 leading-relaxed">
                      Declares a new function or procedure. Every ps-lang program starts with defining what it does.
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <span className="border border-stone-300 px-3 py-1 text-xs tracking-[0.1em] text-stone-500 font-light flex-shrink-0">INPUT</span>
                    <p className="text-stone-600 leading-relaxed">
                      Specifies what data the function needs to work with, including parameter names and types.
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <span className="border border-stone-300 px-3 py-1 text-xs tracking-[0.1em] text-stone-500 font-light flex-shrink-0">PROCESS</span>
                    <p className="text-stone-600 leading-relaxed">
                      Contains the main logic of your program. This is where the actual work happens.
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <span className="border border-stone-300 px-3 py-1 text-xs tracking-[0.1em] text-stone-500 font-light flex-shrink-0">OUTPUT</span>
                    <p className="text-stone-600 leading-relaxed">
                      Defines what the function returns or displays as its result.
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <span className="border border-stone-300 px-3 py-1 text-xs tracking-[0.1em] text-stone-500 font-light flex-shrink-0">EXECUTE</span>
                    <p className="text-stone-600 leading-relaxed">
                      Runs the function with specific values. This is how you actually use your defined functions.
                    </p>
                  </div>
                </div>

                <div className="rubber-band my-8"></div>

                <h2 className="font-editorial text-2xl font-bold text-ink mb-4">Next Steps</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/docs/syntax" className="paper-card p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-typewriter font-bold text-ink mb-2">Syntax Guide →</h3>
                    <p className="font-editorial text-ink-light text-sm">
                      Learn the complete syntax and structure of ps-lang programs.
                    </p>
                  </Link>
                  <Link href="/docs/examples" className="paper-card p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-typewriter font-bold text-ink mb-2">More Examples →</h3>
                    <p className="font-editorial text-ink-light text-sm">
                      Explore real-world examples and common patterns.
                    </p>
                  </Link>
                  <Link href="/playground" className="paper-card p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-typewriter font-bold text-ink mb-2">Try Online →</h3>
                    <p className="font-editorial text-ink-light text-sm">Experiment with ps-lang in your browser.</p>
                  </Link>
                  <Link href="/docs/ai-collaboration" className="paper-card p-4 hover:shadow-lg transition-shadow">
                    <h3 className="font-typewriter font-bold text-ink mb-2">AI Collaboration →</h3>
                    <p className="font-editorial text-ink-light text-sm">Learn how to work with AI using ps-lang.</p>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
