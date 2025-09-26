import Navigation from "@/components/navigation"
import Link from "next/link"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="paper-card stacked-papers p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-editorial text-4xl font-bold text-ink">Get Started</h1>
            <span className="ink-stamp text-stamp-blue">Quick Start</span>
          </div>

          <p className="font-editorial text-ink-light text-xl mb-8">
            Ready to start using ps-lang? Follow these simple steps to get up and running in just a few minutes.
          </p>

          <div className="rubber-band mb-8"></div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="paper-card p-6">
              <div className="flex items-start gap-4">
                <span className="ink-stamp text-stamp-red text-lg flex-shrink-0">01</span>
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-ink mb-3">Try Online First</h2>
                  <p className="font-editorial text-ink-light mb-4">
                    The fastest way to experience ps-lang is through our online playground. No installation
                    required—just start coding!
                  </p>
                  <Link
                    href="/playground"
                    className="paper-card px-4 py-2 font-typewriter font-bold text-ink hover:text-stamp-red transition-colors inline-block"
                  >
                    Open Playground
                  </Link>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="paper-card p-6">
              <div className="flex items-start gap-4">
                <span className="ink-stamp text-stamp-blue text-lg flex-shrink-0">02</span>
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-ink mb-3">Install Locally</h2>
                  <p className="font-editorial text-ink-light mb-4">
                    For serious development, install ps-lang on your local machine:
                  </p>
                  <div className="paper-card p-4 mb-4">
                    <pre className="font-typewriter text-ink text-sm">
                      {`# Install via npm
npm install -g ps-lang

# Or via pip
pip install ps-lang

# Verify installation
ps-lang --version`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="paper-card p-6">
              <div className="flex items-start gap-4">
                <span className="ink-stamp text-stamp-red text-lg flex-shrink-0">03</span>
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-ink mb-3">Write Your First Program</h2>
                  <p className="font-editorial text-ink-light mb-4">
                    Create a file called{" "}
                    <code className="font-typewriter bg-manila-dark px-2 py-1 rounded">hello.ps</code>
                    and add this code:
                  </p>
                  <div className="paper-card p-4 mb-4">
                    <pre className="font-typewriter text-ink text-sm">
                      {`DEFINE welcome_message:
  INPUT: name as string
  
  PROCESS:
    SET greeting = "Welcome to ps-lang, " + name + "!"
    
  OUTPUT: greeting

EXECUTE welcome_message WITH "Developer"`}
                    </pre>
                  </div>
                  <p className="font-editorial text-ink-light mb-4">Run it with:</p>
                  <div className="paper-card p-4 mb-4">
                    <pre className="font-typewriter text-ink text-sm">ps-lang run hello.ps</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="paper-card p-6">
              <div className="flex items-start gap-4">
                <span className="ink-stamp text-stamp-blue text-lg flex-shrink-0">04</span>
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-ink mb-3">Learn the Syntax</h2>
                  <p className="font-editorial text-ink-light mb-4">
                    Master ps-lang fundamentals with our comprehensive documentation:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link href="/docs" className="paper-card p-3 hover:shadow-lg transition-shadow">
                      <h4 className="font-typewriter font-bold text-ink mb-1">Documentation</h4>
                      <p className="font-editorial text-ink-light text-sm">Complete syntax guide</p>
                    </Link>
                    <Link href="/examples" className="paper-card p-3 hover:shadow-lg transition-shadow">
                      <h4 className="font-typewriter font-bold text-ink mb-1">Examples</h4>
                      <p className="font-editorial text-ink-light text-sm">Real-world programs</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="paper-card p-6">
              <div className="flex items-start gap-4">
                <span className="ink-stamp text-stamp-red text-lg flex-shrink-0">05</span>
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-ink mb-3">Join the Community</h2>
                  <p className="font-editorial text-ink-light mb-4">
                    Connect with other ps-lang developers and get help when you need it:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="/community"
                      className="paper-card px-4 py-2 font-typewriter text-ink hover:text-stamp-red transition-colors"
                    >
                      Community Forum
                    </a>
                    <a
                      href="/discord"
                      className="paper-card px-4 py-2 font-typewriter text-ink hover:text-stamp-blue transition-colors"
                    >
                      Discord Server
                    </a>
                    <a
                      href="/github"
                      className="paper-card px-4 py-2 font-typewriter text-ink hover:text-stamp-red transition-colors"
                    >
                      GitHub Repository
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rubber-band my-8"></div>

          <div className="text-center">
            <h3 className="font-editorial text-2xl font-bold text-ink mb-4">Need Help?</h3>
            <p className="font-editorial text-ink-light mb-6">
              Our community is here to support you on your ps-lang journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs"
                className="paper-card px-6 py-3 font-typewriter font-bold text-ink hover:text-stamp-red transition-colors"
              >
                Read Documentation
              </Link>
              <Link
                href="/community"
                className="font-typewriter text-ink-light hover:text-ink transition-colors underline decoration-2 underline-offset-4"
              >
                Ask Questions →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
