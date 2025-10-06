"use client"

import { useEffect, useState } from 'react'
import {
  getConsentPreferences,
  grantConsent,
  revokeConsent,
  detectGPC,
  trackConsentEvent,
  type GranularConsent,
  type ConsentPreferences
} from '@/lib/consent'
import { X } from 'lucide-react'

interface CookiePreferencesProps {
  onClose?: () => void
}

export default function CookiePreferences({ onClose }: CookiePreferencesProps) {
  const [prefs, setPrefs] = useState<ConsentPreferences | null>(null)
  const [gpcDetected, setGpcDetected] = useState(false)
  const [granularPrefs, setGranularPrefs] = useState<GranularConsent>({
    analytics: false,
    sessionReplay: false,
    performance: false,
  })

  useEffect(() => {
    const currentPrefs = getConsentPreferences()
    setPrefs(currentPrefs)
    setGpcDetected(detectGPC())

    if (currentPrefs) {
      setGranularPrefs(currentPrefs.granular)
    }
  }, [])

  const handleGrantAll = () => {
    const fullConsent: GranularConsent = {
      analytics: true,
      sessionReplay: true,
      performance: true,
    }

    grantConsent(fullConsent)
    trackConsentEvent('granted', fullConsent)

    // Update state
    const updatedPrefs = getConsentPreferences()
    setPrefs(updatedPrefs)
    setGranularPrefs(fullConsent)
  }

  const handleRevokeAll = () => {
    revokeConsent()
    trackConsentEvent('revoked')

    // Update state
    const updatedPrefs = getConsentPreferences()
    setPrefs(updatedPrefs)
    setGranularPrefs({
      analytics: false,
      sessionReplay: false,
      performance: false,
    })
  }

  const handleSaveGranular = () => {
    const hasAnyConsent = granularPrefs.analytics || granularPrefs.sessionReplay || granularPrefs.performance

    if (hasAnyConsent) {
      grantConsent(granularPrefs)
      trackConsentEvent('updated', granularPrefs)
    } else {
      revokeConsent()
      trackConsentEvent('revoked')
    }

    // Update state
    const updatedPrefs = getConsentPreferences()
    setPrefs(updatedPrefs)
  }

  const consentDate = prefs?.timestamp ? new Date(prefs.timestamp) : null

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white border border-stone-200 shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-stone-900">Cookie Preferences</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-6 py-8 space-y-8">
          {/* Current Status */}
          <div className="bg-stone-50 border border-stone-200 p-6">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Current Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-600">Cookie Consent:</span>
                <span className={`font-medium ${prefs?.status === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
                  {prefs?.status === 'granted' ? 'Granted' : prefs?.status === 'denied' ? 'Denied' : 'Not Set'}
                </span>
              </div>
              {consentDate && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Last Updated:</span>
                  <span className="text-stone-900">
                    {consentDate.toLocaleDateString()} at {consentDate.toLocaleTimeString()}
                  </span>
                </div>
              )}
              {gpcDetected && (
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className="text-stone-600">Global Privacy Control (GPC):</span>
                  <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Detected
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Essential Cookies (Always Active) */}
          <div className="border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Essential Cookies</h3>
                <p className="text-xs text-stone-500 mt-1">Required for site functionality</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-stone-900 text-white">
                Always Active
              </span>
            </div>
            <p className="text-sm text-stone-600">
              These cookies are necessary for the website to function and cannot be disabled. They include session management,
              authentication, and security features.
            </p>
          </div>

          {/* Granular Cookie Controls */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-stone-900">Optional Cookies</h3>

            {/* Analytics */}
            <label className="flex items-start gap-4 p-6 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={granularPrefs.analytics}
                onChange={(e) => setGranularPrefs({ ...granularPrefs, analytics: e.target.checked })}
                className="mt-1 w-5 h-5 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-stone-900">Analytics Cookies</span>
                    <p className="text-xs text-stone-500 mt-0.5">Help us improve your experience</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${
                    granularPrefs.analytics ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {granularPrefs.analytics ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-stone-600 mb-3">
                  Help us understand how you interact with our website by collecting and reporting information anonymously.
                  We use Google Analytics for:
                </p>
                <ul className="text-sm text-stone-600 space-y-1 list-disc list-inside ml-2">
                  <li>Page view tracking and navigation patterns</li>
                  <li>User engagement metrics</li>
                  <li>Traffic source analysis</li>
                </ul>
              </div>
            </label>

            {/* Session Replay */}
            <label className="flex items-start gap-4 p-6 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={granularPrefs.sessionReplay}
                onChange={(e) => setGranularPrefs({ ...granularPrefs, sessionReplay: e.target.checked })}
                className="mt-1 w-5 h-5 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-stone-900">Session Recording</span>
                    <p className="text-xs text-stone-500 mt-0.5">Anonymized session replay</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${
                    granularPrefs.sessionReplay ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {granularPrefs.sessionReplay ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-stone-600 mb-3">
                  Record anonymized sessions to improve UX and identify issues. We use PostHog with:
                </p>
                <ul className="text-sm text-stone-600 space-y-1 list-disc list-inside ml-2">
                  <li>All sensitive data masked automatically</li>
                  <li>No PII captured in recordings</li>
                  <li>Used only for UX improvements</li>
                </ul>
              </div>
            </label>

            {/* Performance */}
            <label className="flex items-start gap-4 p-6 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={granularPrefs.performance}
                onChange={(e) => setGranularPrefs({ ...granularPrefs, performance: e.target.checked })}
                className="mt-1 w-5 h-5 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-stone-900">Performance Monitoring</span>
                    <p className="text-xs text-stone-500 mt-0.5">Core Web Vitals tracking</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${
                    granularPrefs.performance ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {granularPrefs.performance ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-stone-600 mb-3">
                  Track page load times, interaction delays, and layout stability to ensure optimal performance:
                </p>
                <ul className="text-sm text-stone-600 space-y-1 list-disc list-inside ml-2">
                  <li>Largest Contentful Paint (LCP)</li>
                  <li>First Input Delay (FID)</li>
                  <li>Cumulative Layout Shift (CLS)</li>
                </ul>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200">
            <button
              onClick={handleSaveGranular}
              className="flex-1 px-6 py-3 bg-stone-900 text-white text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={handleGrantAll}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-900 text-sm font-medium tracking-wide hover:border-stone-900 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={handleRevokeAll}
              className="flex-1 px-6 py-3 border border-stone-300 text-stone-900 text-sm font-medium tracking-wide hover:border-stone-900 transition-colors"
            >
              Decline All
            </button>
          </div>

          {/* Data Privacy Info */}
          <div className="pt-6 border-t border-stone-200">
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Your Privacy Rights</h3>
            <div className="text-sm text-stone-600 space-y-2">
              <p>
                Under GDPR (Europe), CCPA/CPRA (California), and PIPEDA (Canada), you have the right to:
              </p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Opt-out of data collection at any time</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="pt-2">
                <a href="/privacy" className="underline hover:text-stone-900 transition-colors">
                  Read our full Privacy Policy
                </a>
                {' '}for more information about how we handle your data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
