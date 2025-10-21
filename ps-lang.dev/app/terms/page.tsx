import type { Metadata } from 'next'
import Link from "next/link"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Terms of Service | PS-LANG Open Source Framework",
  description: "Terms of service for PS-LANG framework and PS-LANG Journal. MIT licensed open source software. Understand usage terms and limitations.",
  keywords: "terms of service, MIT license, open source terms, software license",
  alternates: {
    canonical: 'https://ps-lang.dev/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white" data-name="page-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
          <Link href="/" className="text-sm text-stone-600 hover:text-stone-900 transition-colors" data-name="link-back-home">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16" data-name="page-content">
        <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">Terms of Use</h1>
        <p className="text-sm text-stone-500 mb-12">Last updated: October 12, 2025</p>

        <div className="prose prose-stone max-w-none">
          {/* Acceptance */}
          <section className="mb-12" data-section="acceptance">
            <h2 className="text-xl font-light text-stone-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              By accessing or using PS-LANG (the "Service"), including the website at ps-lang.dev, npm package, CLI tools, and documentation, you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the Service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-12" data-section="service-description">
            <h2 className="text-xl font-light text-stone-900 mb-4">2. Description of Service</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              PS-LANG is a privacy-first scripting language for multi-agent context control. The Service includes:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li>Open-source zone syntax and CLI tools</li>
              <li>Documentation and examples</li>
              <li>Website and newsletter</li>
              <li>Community support via GitHub</li>
            </ul>
          </section>

          {/* License */}
          <section className="mb-12" data-section="license">
            <h2 className="text-xl font-light text-stone-900 mb-4">3. Open Source License</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              PS-LANG is released under the MIT License. You are free to:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2 mb-4">
              <li>Use the software for any purpose (commercial or personal)</li>
              <li>Modify and distribute the software</li>
              <li>Sublicense and sell copies of the software</li>
            </ul>
            <p className="text-sm text-stone-600 leading-relaxed">
              <strong>Requirements:</strong> You must include the original copyright notice and MIT License text in any copies or substantial portions of the software.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed mt-4">
              View the full license:{" "}
              <a href={siteConfig.urls.license} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                {siteConfig.urls.license}
              </a>
            </p>
          </section>

          {/* Alpha Software */}
          <section className="mb-12" data-section="alpha-disclaimer">
            <h2 className="text-xl font-light text-stone-900 mb-4">4. Alpha Software Disclaimer</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              PS-LANG is currently in <strong>alpha testing phase ({siteConfig.version})</strong>. By using the Service, you acknowledge:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li>The software may contain bugs, errors, or incomplete features</li>
              <li>Breaking changes may occur between versions</li>
              <li>Features may be added, modified, or removed without notice</li>
              <li>Documentation may be incomplete or outdated</li>
              <li>The software is provided "as is" without warranty</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12" data-section="user-responsibilities">
            <h2 className="text-xl font-light text-stone-900 mb-4">5. User Responsibilities</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">When using PS-LANG, you agree to:</p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Lawful Use:</strong> Use the Service in compliance with all applicable laws</li>
              <li><strong>Security:</strong> Not attempt to hack, disrupt, or compromise the Service</li>
              <li><strong>Respect:</strong> Not harass, abuse, or harm other users</li>
              <li><strong>Attribution:</strong> Provide proper attribution when required by the MIT License</li>
              <li><strong>No Misrepresentation:</strong> Not claim official affiliation without permission</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12" data-section="intellectual-property">
            <h2 className="text-xl font-light text-stone-900 mb-4">6. Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">Trademarks</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  "PS-LANG" and the PS-LANG logo are trademarks of Vummo Labs. You may use the name to refer to the software but not in a way that suggests endorsement without permission.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">Copyright</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  © 2025 Anton Korzhuk / PS-LANG. The PS-LANG software is MIT licensed. Website content, documentation, and branding are © PS-LANG.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">User Content</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Content you create using PS-LANG (e.g., .psl files, zone syntax) belongs to you. We claim no ownership over your work.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12" data-section="privacy">
            <h2 className="text-xl font-light text-stone-900 mb-4">7. Privacy</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="underline hover:text-stone-900">
                Privacy Policy
              </Link>
              . We collect minimal data and never sell your information.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12" data-section="third-party-services">
            <h2 className="text-xl font-light text-stone-900 mb-4">8. Third-Party Services</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              PS-LANG may integrate with third-party services (e.g., LangChain, AutoGen, MCP). Your use of these services is subject to their own terms and conditions. We are not responsible for third-party services.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-12" data-section="warranties-disclaimer">
            <h2 className="text-xl font-light text-stone-900 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12" data-section="liability-limitation">
            <h2 className="text-xl font-light text-stone-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, VUMMO LABS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from use or inability to use the Service</li>
              <li>Damages from errors, bugs, or security vulnerabilities</li>
            </ul>
            <p className="text-sm text-stone-600 leading-relaxed mt-4">
              Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12" data-section="indemnification">
            <h2 className="text-xl font-light text-stone-900 mb-4">11. Indemnification</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              You agree to indemnify and hold harmless Vummo Labs, its contributors, and affiliates from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2 mt-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="mb-12" data-section="termination">
            <h2 className="text-xl font-light text-stone-900 mb-4">12. Termination</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We reserve the right to suspend or terminate your access to the Service at any time for any reason, including violation of these Terms. You may stop using the Service at any time.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12" data-section="terms-changes">
            <h2 className="text-xl font-light text-stone-900 mb-4">13. Changes to Terms</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We may update these Terms periodically. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12" data-section="governing-law">
            <h2 className="text-xl font-light text-stone-900 mb-4">14. Governing Law</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              These Terms are governed by the laws of the United States and the State of [Your State]. Any disputes shall be resolved in the courts of [Your State].
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12" data-section="contact">
            <h2 className="text-xl font-light text-stone-900 mb-4">15. Contact</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              For questions about these Terms, contact us at:
            </p>
            <div className="space-y-2">
              <p className="text-sm text-stone-600">
                <strong>Email:</strong>{" "}
                <a href="mailto:hello@ps-lang.dev" className="underline hover:text-stone-900">
                  hello@ps-lang.dev
                </a>
              </p>
              <p className="text-sm text-stone-600">
                <strong>GitHub:</strong>{" "}
                <a href={siteConfig.urls.github} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                  github.com/vummo/ps-lang
                </a>
              </p>
            </div>
          </section>

          {/* Open Source */}
          <section className="mb-12 border-t border-stone-200 pt-8" data-section="open-source-commitment">
            <h2 className="text-xl font-light text-stone-900 mb-4">Open Source Commitment</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-6 mt-0">
              PS-LANG is committed to being a <strong>free and open-source</strong> project. We believe in:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Transparent development on GitHub</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Community-driven feature requests</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Permissive MIT License (commercial use allowed)</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">No vendor lock-in or proprietary restrictions</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Privacy-first principles in all decisions</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
