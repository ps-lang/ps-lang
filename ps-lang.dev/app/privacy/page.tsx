import Link from "next/link"
import { siteConfig } from "@/config/site"

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
        <p className="text-sm text-stone-500 mb-12">Last updated: October 6, 2025</p>

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
              <li><strong>Account Registration:</strong> Email address, optional display name, persona selection, social profiles (GitHub, Twitter, website)</li>
              <li><strong>Newsletter Subscription:</strong> Email address, optional interests (AI engineering, multi-agent systems, etc.)</li>
              <li><strong>Alpha Access Requests:</strong> GitHub URL, areas of interest</li>
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
                <h3 className="text-lg font-light text-stone-900 mb-2">Clerk</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  We use Clerk for user authentication and account management. Clerk handles secure login, session management, and user profile data.
                  <br />
                  <a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                    Clerk Privacy Policy
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-light text-stone-900 mb-2">Convex</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  We use Convex for real-time database storage of alpha signups, newsletter subscribers, and user preferences. Data is stored securely on Convex's US servers.
                  <br />
                  <a href="https://www.convex.dev/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                    Convex Privacy Policy
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
            <h2 className="text-xl font-light text-stone-900 mb-4">Your Privacy Rights</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              Under GDPR (European Union), CCPA/CPRA (California), and PIPEDA (Canada), you have the following rights:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
              <li><strong>Right to Correction:</strong> Update or correct your email, preferences, or profile information</li>
              <li><strong>Right to Deletion:</strong> Request complete deletion of your data from our systems</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Opt-Out:</strong> Withdraw consent for analytics tracking at any time via our <Link href="/cookies" className="underline hover:text-stone-900">Cookie Preferences</Link> page</li>
              <li><strong>Right to Unsubscribe:</strong> Opt out of our newsletter anytime (link in every email)</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data for specific purposes</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
            </ul>
            <p className="text-sm text-stone-600 leading-relaxed mt-6">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:privacy@vummo.com" className="underline hover:text-stone-900">
                privacy@vummo.com
              </a>
              {" "}with your request. We will respond within 30 days.
            </p>

            <div className="bg-stone-50 border border-stone-200 p-4 mt-6">
              <p className="text-sm text-stone-900 font-medium mb-2">Export Your Data</p>
              <p className="text-sm text-stone-600 mb-3">
                Signed-in users can download a complete export of their personal data in JSON format.
              </p>
              <a
                href="/api/privacy/export-data"
                className="inline-block px-4 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                download
              >
                Download My Data
              </a>
            </div>
          </section>

          {/* Cookies & Consent */}
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-4">Cookies & Your Consent</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              We use cookies and similar technologies to improve your experience and analyze site usage. We respect your privacy and comply with GDPR (Europe), CCPA/CPRA (California), and PIPEDA (Canada) regulations.
            </p>

            <h3 className="text-lg font-light text-stone-900 mb-3 mt-6">Cookie Categories</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-stone-900 font-medium mb-1">Essential Cookies (Always Active)</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Required for site functionality including session management, authentication (Clerk), and security features. These cannot be disabled.
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-900 font-medium mb-1">Analytics & Performance Cookies (Requires Consent)</p>
                <p className="text-sm text-stone-600 leading-relaxed mb-2">
                  Help us understand how you use our site. Only loaded after you grant consent. Includes:
                </p>
                <ul className="text-sm text-stone-600 space-y-1 ml-4">
                  <li>• <strong>Google Analytics</strong> (_ga, _gid, _gat) - Page views, navigation patterns, demographics</li>
                  <li>• <strong>PostHog</strong> (ph_*) - Event tracking, session recording (with sensitive data masked), feature usage</li>
                  <li>• <strong>Performance Monitoring</strong> - Core Web Vitals (LCP, FID, CLS)</li>
                  <li>• <strong>Engagement Tracking</strong> - Text selection, scroll depth, interaction patterns</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-light text-stone-900 mb-3">Managing Your Preferences</h3>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              You control your cookie preferences. You can:
            </p>
            <ul className="text-sm text-stone-600 space-y-2 mb-4">
              <li>• Accept or decline analytics cookies via our consent banner (shown on first visit)</li>
              <li>• Change your preferences anytime on our <Link href="/cookies" className="underline hover:text-stone-900">Cookie Preferences</Link> page</li>
              <li>• Revoke consent at any time (will clear existing cookies and reload the page)</li>
              <li>• Use browser settings to block cookies (may affect site functionality)</li>
            </ul>

            <div className="bg-stone-50 border border-stone-200 p-4 mt-6">
              <p className="text-sm text-stone-900 font-medium mb-2">Your Consent Preference</p>
              <p className="text-sm text-stone-600 mb-3">
                Manage your cookie settings and view detailed information about each cookie type.
              </p>
              <Link
                href="/cookies"
                className="inline-block px-4 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                Manage Cookie Preferences
              </Link>
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
                <a href={`${siteConfig.urls.github}/issues`} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
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
