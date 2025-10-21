import type { Metadata } from 'next'
import Link from "next/link"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Privacy Policy | PS-LANG Privacy-First AI Framework",
  description: "PS-LANG privacy policy. Learn how we handle data in our privacy-first framework. Self-hosted options, encryption, and data ownership explained.",
  keywords: "privacy policy, data privacy, self-hosted AI, privacy-first framework",
  alternates: {
    canonical: 'https://ps-lang.dev/privacy',
  },
}

export default function PrivacyPage() {
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
        <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-stone-500 mb-12">Last updated: October 12, 2025</p>

        <div className="prose prose-stone max-w-none">
          {/* Introduction */}
          <section className="mb-12" data-section="introduction">
            <h2 className="text-xl font-light text-stone-900 mb-4">Introduction</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              PS-LANG ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit ps-lang.dev or use our services.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              PS-LANG is a privacy-first project. We collect minimal data and never sell your information.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12" data-section="information-we-collect">
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
          <section className="mb-12" data-section="how-we-use-information">
            <h2 className="text-xl font-light text-stone-900 mb-4">How We Use Your Information</h2>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Newsletter:</strong> Send you 1-2 updates per month about PS-LANG releases and features</li>
              <li><strong>Analytics:</strong> Understand which features interest our community</li>
              <li><strong>Product Improvement:</strong> Identify popular use cases and pain points</li>
              <li><strong>Communication:</strong> Respond to your inquiries or feedback</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12" data-section="third-party-services">
            <h2 className="text-xl font-light text-stone-900 mb-4">Third-Party Services</h2>
            <div className="space-y-5">
              <div data-name="service-item">
                <div className="flex items-start gap-3 mb-3">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-stone-900 mt-0 mb-2">Google Analytics</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      We use Google Analytics to track page views and user behavior. Google may use cookies to collect this data.
                      <br />
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                        Google Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div data-name="service-item">
                <div className="flex items-start gap-3 mb-3">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-stone-900 mt-0 mb-2">PostHog</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      We use PostHog for event tracking (use case clicks, newsletter signups). Data is stored on PostHog's US servers.
                      <br />
                      <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                        PostHog Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div data-name="service-item">
                <div className="flex items-start gap-3 mb-3">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-stone-900 mt-0 mb-2">Resend</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      We use Resend to manage our email newsletter. Your email is stored securely and never shared.
                      <br />
                      <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                        Resend Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div data-name="service-item">
                <div className="flex items-start gap-3 mb-3">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-stone-900 mt-0 mb-2">Clerk</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      We use Clerk for user authentication and account management. Clerk handles secure login, session management, and user profile data.
                      <br />
                      <a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                        Clerk Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div data-name="service-item">
                <div className="flex items-start gap-3 mb-3">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-stone-900 mt-0 mb-2">Convex</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      We use Convex for real-time database storage of alpha signups, newsletter subscribers, and user preferences. Data is stored securely on Convex's US servers.
                      <br />
                      <a href="https://www.convex.dev/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                        Convex Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div data-name="service-item">
                <div className="flex items-start gap-3 mb-3">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-stone-900 mt-0 mb-2">Vercel</h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Our website is hosted on Vercel. They may collect basic server logs.
                      <br />
                      <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                        Vercel Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12" data-section="privacy-rights">
            <h2 className="text-xl font-light text-stone-900 mb-4">Your Privacy Rights</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              Under GDPR (European Union), CCPA/CPRA (California), and PIPEDA (Canada), you have the following rights:
            </p>
            <ul className="text-sm text-stone-600 leading-relaxed space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
              <li><strong>Right to Correction:</strong> Update or correct your email, preferences, or profile information</li>
              <li><strong>Right to Deletion:</strong> Request complete deletion of your data from our systems</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Data Retention Control:</strong> Choose how long we keep your data (30 days to 5 years) in <Link href="/settings" className="underline hover:text-stone-900">Account Settings</Link></li>
              <li><strong>Right to Opt-Out:</strong> Withdraw consent for analytics tracking at any time via our <Link href="/settings#cookies" className="underline hover:text-stone-900">Cookie Preferences</Link> page</li>
              <li><strong>Right to Unsubscribe:</strong> Opt out of our newsletter anytime (link in every email)</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data for specific purposes</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
            </ul>
            <p className="text-sm text-stone-600 leading-relaxed mt-6">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:privacy@ps-lang.dev" className="underline hover:text-stone-900">
                privacy@ps-lang.dev
              </a>
              {" "}with your request. We will respond within 30 days.
            </p>

            <div className="bg-stone-50 border border-stone-200 p-4 mt-6" data-name="action-card">
              <p className="text-sm text-stone-900 font-medium mb-2">Export Your Data</p>
              <p className="text-sm text-stone-600 mb-3">
                Signed-in users can download a complete export of their personal data in JSON format.
              </p>
              <a
                href="/api/privacy/export-data"
                className="inline-block px-4 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                download
                data-name="primary-action"
              >
                Download My Data
              </a>
            </div>
          </section>

          {/* Cookies & Consent */}
          <section className="mb-12" data-section="cookies-consent">
            <h2 className="text-xl font-light text-stone-900 mb-4">Cookies & Your Consent</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              We use cookies and similar technologies to improve your experience and analyze site usage. We respect your privacy and comply with GDPR (Europe), CCPA/CPRA (California), and PIPEDA (Canada) regulations.
            </p>

            <h3 className="text-lg font-light text-stone-900 mb-3 mt-6">Cookie Categories</h3>
            <div className="space-y-4 mb-6">
              <div data-name="info-block">
                <p className="text-sm text-stone-900 font-medium mb-1">Essential Cookies (Always Active)</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Required for site functionality including session management, authentication (Clerk), and security features. These cannot be disabled.
                </p>
              </div>

              <div data-name="info-block">
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
              <li>• Change your preferences anytime on our <Link href="/settings#cookies" className="underline hover:text-stone-900">Cookie Preferences</Link> page</li>
              <li>• Revoke consent at any time (will clear existing cookies and reload the page)</li>
              <li>• Use browser settings to block cookies (may affect site functionality)</li>
            </ul>

            <div className="bg-stone-50 border border-stone-200 p-4 mt-6" data-name="action-card">
              <p className="text-sm text-stone-900 font-medium mb-2">Your Consent Preference</p>
              <p className="text-sm text-stone-600 mb-3">
                Manage your cookie settings and view detailed information about each cookie type.
              </p>
              <Link
                href="/settings#cookies"
                className="inline-block px-4 py-2 bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
                data-name="primary-action"
              >
                Manage Cookie Preferences
              </Link>
            </div>
          </section>

          {/* Data Retention & AI Research */}
          <section className="mb-12" id="data-retention" data-section="data-retention">
            <h2 className="text-xl font-light text-stone-900 mb-4">Data Retention & AI Research</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              You control how long we keep your data and whether it's used for AI research. We offer three tiers:
            </p>

            <div className="space-y-4">
              <div className="border border-stone-200 p-6" data-name="tier-option">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-base font-medium text-stone-900 mt-0 mb-0">Essential</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-stone-600 space-y-2 ml-8">
                  <li><strong>Retention:</strong> 90 days (anonymized after 30 days)</li>
                  <li><strong>AI Training:</strong> Never used</li>
                  <li><strong>Analytics:</strong> Minimal, debugging only</li>
                </ul>
              </div>

              <div className="border border-stone-200 p-6" data-name="tier-option">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <h3 className="text-base font-medium text-stone-900 mt-0 mb-0">Standard (Default · Recommended)</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-stone-600 space-y-2 ml-8">
                  <li><strong>Retention:</strong> 2 years (anonymized after 90 days)</li>
                  <li><strong>AI Training:</strong> Aggregated insights only</li>
                  <li><strong>Analytics:</strong> UX analytics, interaction patterns</li>
                </ul>
              </div>

              <div className="border border-stone-200 p-6" data-name="tier-option">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-base font-medium text-stone-900 mt-0 mb-0">Research Contributor</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-stone-600 space-y-2 ml-8">
                  <li><strong>Retention:</strong> 5 years (anonymized after 90 days)</li>
                  <li><strong>AI Training:</strong> Yes, for multi-agent models</li>
                  <li><strong>Benefits:</strong> Early access, research credits, exclusive badge</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed mt-4">
              Change your tier anytime in <Link href="/settings" className="underline hover:text-stone-900">Account Settings</Link>.
              Changes take effect immediately.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12" data-section="data-security">
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
          <section className="mb-12" data-section="childrens-privacy">
            <h2 className="text-xl font-light text-stone-900 mb-4">Children's Privacy</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              PS-LANG is not intended for users under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal information, contact us at privacy@ps-lang.dev.
            </p>
          </section>

          {/* International Users */}
          <section className="mb-12" data-section="international-users">
            <h2 className="text-xl font-light text-stone-900 mb-4">International Users</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              PS-LANG is operated from the United States. If you access our site from outside the US, your data may be transferred to and processed in the US. By using our services, you consent to this transfer.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-12" data-section="policy-changes">
            <h2 className="text-xl font-light text-stone-900 mb-4">Changes to This Policy</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last updated" date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-12" data-section="contact">
            <h2 className="text-xl font-light text-stone-900 mb-4">Contact Us</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              For privacy-related questions or requests:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-stone-600">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@ps-lang.dev" className="underline hover:text-stone-900">
                  privacy@ps-lang.dev
                </a>
              </p>
              <p className="text-sm text-stone-600">
                <strong>GitHub:</strong>{" "}
                <a href={`${siteConfig.urls.github}/issues`} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">
                  github.com/ps-lang/ps-lang/issues
                </a>
              </p>
              <p className="text-sm text-stone-600">
                <strong>Company:</strong> PS-LANG
              </p>
            </div>
          </section>

          {/* Open Source Commitment */}
          <section className="mb-12 border-t border-stone-200 pt-8" data-section="privacy-commitment">
            <h2 className="text-xl font-light text-stone-900 mb-4">Our Privacy Commitment</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-6 mt-0">
              PS-LANG is a <strong>privacy-first</strong> project. We:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Collect minimal data</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Never sell your information</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Use analytics only to improve the product</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Offer easy unsubscribe and data deletion</p>
              </div>
              <div className="flex items-start gap-3" data-name="list-item-icon">
                <svg className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-stone-600 flex-1 my-0">Keep our privacy policy transparent and readable</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
