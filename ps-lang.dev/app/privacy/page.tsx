import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - PS-LANG",
  description: "Privacy policy for PS-LANG website and services",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
          <Link href="/" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-stone-500 mb-12">Last updated: October 1, 2025</p>

        <div className="prose prose-stone max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Introduction</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              PS-LANG ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit ps-lang.dev or use our services.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              PS-LANG is a privacy-first project. We collect minimal data and never sell your information.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Information We Collect</h2>

            <h3 className="text-lg font-light text-stone-900 mb-3 mt-6">1. Information You Provide</h3>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2 mb-6">
              <li><strong>Newsletter Subscription:</strong> Email address, optional interests (AI engineering, multi-agent systems, etc.)</li>
              <li><strong>Email Domain:</strong> We track your email domain (e.g., gmail.com, company.com) to understand our audience</li>
            </ul>

            <h3 className="text-lg font-light text-stone-900 mb-3">2. Automatically Collected Information</h3>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Analytics:</strong> Page views, click events, session duration (via Google Analytics & PostHog)</li>
              <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
              <li><strong>Usage Data:</strong> Which use cases you click, newsletter signup events</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">How We Use Your Information</h2>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Newsletter:</strong> Send you 1-2 updates per month about PS-LANG releases and features</li>
              <li><strong>Analytics:</strong> Understand which features interest our community</li>
              <li><strong>Product Improvement:</strong> Identify popular use cases and pain points</li>
              <li><strong>Communication:</strong> Respond to your inquiries or feedback</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Third-Party Services</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">Google Analytics</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  We use Google Analytics to track page views and user behavior. Google may use cookies to collect this data.
                  <br />
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                    Google Privacy Policy
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">PostHog</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  We use PostHog for event tracking (use case clicks, newsletter signups). Data is stored on PostHog's US servers.
                  <br />
                  <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                    PostHog Privacy Policy
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">Resend</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  We use Resend to manage our email newsletter. Your email is stored securely and never shared.
                  <br />
                  <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                    Resend Privacy Policy
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">Vercel</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Our website is hosted on Vercel. They may collect basic server logs.
                  <br />
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                    Vercel Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Data Retention</h2>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Newsletter Subscribers:</strong> Retained until you unsubscribe</li>
              <li><strong>Analytics Data:</strong> Retained for 26 months (Google Analytics default)</li>
              <li><strong>PostHog Events:</strong> Retained for 7 years (configurable)</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Your Rights</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Correction:</strong> Update your email or preferences</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Unsubscribe:</strong> Opt out of our newsletter anytime (link in every email)</li>
              <li><strong>Opt-out of Analytics:</strong> Use browser tools like Do Not Track or ad blockers</li>
            </ul>
            <p className="text-sm text-stone-600 leading-relaxed mt-4">
              To exercise these rights, email us at{" "}
              <a href="mailto:privacy@vummo.com" className="underline hover:text-stone-900">
                privacy@vummo.com
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Cookies</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              We use cookies for analytics and session management. You can disable cookies in your browser settings, but this may affect site functionality.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-stone-600"><strong>Essential:</strong> Session cookies for functionality</p>
              <p className="text-sm text-stone-600"><strong>Analytics:</strong> Google Analytics (_ga, _gid), PostHog (ph_*)</p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Data Security</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We use industry-standard security measures to protect your data:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2 mt-4">
              <li>HTTPS encryption for all traffic</li>
              <li>Secure API keys stored in environment variables</li>
              <li>Regular security updates and monitoring</li>
              <li>Limited access to user data (admin-only)</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Children's Privacy</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              PS-LANG is not intended for users under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal information, contact us at privacy@vummo.com.
            </p>
          </section>

          {/* International Users */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">International Users</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              PS-LANG is operated from the United States. If you access our site from outside the US, your data may be transferred to and processed in the US. By using our services, you consent to this transfer.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Changes to This Policy</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last updated" date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Contact Us</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              For privacy-related questions or requests:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-stone-600">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@vummo.com" className="underline hover:text-stone-900">
                  privacy@vummo.com
                </a>
              </p>
              <p className="text-sm text-stone-600">
                <strong>GitHub:</strong>{" "}
                <a href="https://github.com/vummo/ps-lang/issues" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                  github.com/vummo/ps-lang/issues
                </a>
              </p>
              <p className="text-sm text-stone-600">
                <strong>Company:</strong> Vummo Labs
              </p>
            </div>
          </section>

          {/* Open Source Commitment */}
          <section className="mb-12 border-t border-stone-200 pt-8">
            <h2 className="text-xl font-light text-stone-900 mb-4">Our Privacy Commitment</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              PS-LANG is a <strong>privacy-first</strong> project. We:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2 mt-4">
              <li>✅ Collect minimal data</li>
              <li>✅ Never sell your information</li>
              <li>✅ Use analytics only to improve the product</li>
              <li>✅ Offer easy unsubscribe and data deletion</li>
              <li>✅ Keep our privacy policy transparent and readable</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
