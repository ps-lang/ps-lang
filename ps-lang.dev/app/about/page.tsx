import Navigation from "@/components/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="paper-card stacked-papers p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-editorial text-4xl font-bold text-ink">About ps-lang</h1>
            <span className="ink-stamp text-stamp-red">Mission</span>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="font-editorial text-ink-light text-xl mb-8">
              ps-lang was born from the need to bridge the communication gap between human developers and AI systems. We
              believe the future of programming lies in seamless collaboration between human creativity and machine
              precision.
            </p>

            <div className="rubber-band mb-8"></div>

            <h2 className="font-editorial text-2xl font-bold text-ink mb-4">The Problem</h2>
            <p className="font-editorial text-ink-light mb-6">
              Traditional programming languages are optimized for machines, not for human-AI collaboration. When working
              with AI assistants, developers often struggle to communicate algorithmic concepts clearly, leading to
              misunderstandings and inefficient iterations.
            </p>

            <h2 className="font-editorial text-2xl font-bold text-ink mb-4">Our Solution</h2>
            <p className="font-editorial text-ink-light mb-6">
              ps-lang provides a structured yet natural way to express algorithms that both humans and AI can understand
              perfectly. It's pseudocode that actually runs, documentation that executes, and a common language for
              human-machine collaboration.
            </p>

            <div className="paper-card p-6 mb-8">
              <h3 className="font-typewriter font-bold text-ink mb-4">Design Philosophy</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="ink-stamp text-stamp-blue text-xs flex-shrink-0 mt-1">Clarity</span>
                  <p className="font-editorial text-ink-light">
                    Every program should be immediately understandable by any developer, regardless of their experience
                    level.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="ink-stamp text-stamp-red text-xs flex-shrink-0 mt-1">Collaboration</span>
                  <p className="font-editorial text-ink-light">
                    Designed specifically for human-AI pair programming and knowledge transfer.
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="ink-stamp text-stamp-blue text-xs flex-shrink-0 mt-1">Execution</span>
                  <p className="font-editorial text-ink-light">
                    Pseudocode that actually runs, eliminating the gap between design and implementation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rubber-band mb-8"></div>

            <h2 className="font-editorial text-2xl font-bold text-ink mb-4">The Team</h2>
            <p className="font-editorial text-ink-light mb-6">
              ps-lang is developed by a passionate team of researchers, developers, and AI enthusiasts who believe in
              the power of human-machine collaboration. We're building the tools that will define the next generation of
              software development.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="paper-card p-4">
                <h4 className="font-typewriter font-bold text-ink mb-2">Open Source</h4>
                <p className="font-editorial text-ink-light text-sm">
                  ps-lang is completely open source, built by the community for the community.
                </p>
              </div>
              <div className="paper-card p-4">
                <h4 className="font-typewriter font-bold text-ink mb-2">Research-Backed</h4>
                <p className="font-editorial text-ink-light text-sm">
                  Based on extensive research in human-computer interaction and AI collaboration.
                </p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-editorial text-2xl font-bold text-ink mb-4">Join the Movement</h3>
              <p className="font-editorial text-ink-light mb-6">
                Help us build the future of human-AI collaboration in programming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/community"
                  className="paper-card px-6 py-3 font-typewriter font-bold text-ink hover:text-stamp-red transition-colors"
                >
                  Join Community
                </a>
                <a
                  href="/contribute"
                  className="font-typewriter text-ink-light hover:text-ink transition-colors underline decoration-2 underline-offset-4"
                >
                  Contribute →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
