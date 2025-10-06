"use client"

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  getConsentPreferences,
  grantConsent,
  saveConsentPreferences,
  detectGPC,
  trackConsentEvent,
  type GranularConsent
} from '@/lib/consent'

interface CookieConsentProps {
  onConsentChange?: (granted: boolean) => void
}

export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showGranular, setShowGranular] = useState(false)
  const [gpcDetected, setGpcDetected] = useState(false)
  const [granularPrefs, setGranularPrefs] = useState<GranularConsent>({
    analytics: true,
    sessionReplay: true,
    performance: true,
  })

  useEffect(() => {
    // Check for GPC signal
    const gpc = detectGPC()
    setGpcDetected(gpc)

    // Check if user has already made a choice
    const prefs = getConsentPreferences()
    if (!prefs) {
      // Delay to avoid layout shift
      setTimeout(() => {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 50)
      }, 1000)
    } else {
      // Notify parent of existing consent
      onConsentChange?.(prefs.status === 'granted')
    }
  }, [onConsentChange])

  const handleAcceptAll = () => {
    const fullConsent: GranularConsent = {
      analytics: true,
      sessionReplay: true,
      performance: true,
    }

    grantConsent(fullConsent)
    trackConsentEvent('granted', fullConsent)
    onConsentChange?.(true)
    closeBanner()
  }

  const handleDeclineAll = () => {
    const noConsent: GranularConsent = {
      analytics: false,
      sessionReplay: false,
      performance: false,
    }

    saveConsentPreferences('denied', noConsent)
    trackConsentEvent('denied', noConsent)
    onConsentChange?.(false)
    closeBanner()
  }

  const handleSavePreferences = () => {
    const hasAnyConsent = granularPrefs.analytics || granularPrefs.sessionReplay || granularPrefs.performance

    if (hasAnyConsent) {
      grantConsent(granularPrefs)
      trackConsentEvent('granted', granularPrefs)
      onConsentChange?.(true)
    } else {
      saveConsentPreferences('denied', granularPrefs)
      trackConsentEvent('denied', granularPrefs)
      onConsentChange?.(false)
    }

    closeBanner()
  }

  const closeBanner = () => {
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  if (!showBanner) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent banner"
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-[2px] pointer-events-none" />

      <div className="relative bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          {/* Main Banner Content */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <h3 className="text-base font-medium text-stone-900 mb-2 tracking-tight">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                We use cookies and similar technologies to improve your experience, analyze site traffic, and personalize content.{' '}
                {gpcDetected && (
                  <span className="inline-flex items-center gap-1 text-blue-700 font-normal">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    GPC Detected: Privacy controls enabled
                  </span>
                )}
                {' '}
                <a
                  href="/privacy"
                  className="text-stone-900 underline decoration-stone-300 hover:decoration-stone-900 transition-colors font-normal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 w-full md:w-auto shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeclineAll}
                  className="flex-1 md:flex-initial px-6 py-3 border border-stone-300 bg-white text-stone-700 text-sm font-medium tracking-wide hover:border-stone-400 hover:bg-stone-50 transition-all"
                  aria-label="Decline all cookies"
                >
                  Decline All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 md:flex-initial px-6 py-3 bg-stone-900 text-white text-sm font-medium tracking-wide hover:bg-stone-800 transition-all shadow-sm"
                  aria-label="Accept all cookies"
                >
                  Accept All
                </button>
              </div>
              <button
                onClick={() => setShowGranular(!showGranular)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                aria-expanded={showGranular}
                aria-label="Toggle granular cookie preferences"
              >
                <span>Manage Preferences</span>
                {showGranular ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Granular Controls */}
          {showGranular && (
            <div className="mt-6 pt-6 border-t border-stone-200">
              <h4 className="text-sm font-medium text-stone-900 mb-4">Cookie Categories</h4>
              <div className="grid gap-4">
                {/* Analytics */}
                <label className="flex items-start gap-3 p-4 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={granularPrefs.analytics}
                    onChange={(e) => setGranularPrefs({ ...granularPrefs, analytics: e.target.checked })}
                    className="mt-1 w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-stone-900">Analytics Cookies</span>
                      <span className="text-xs text-stone-500">Google Analytics</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                  </div>
                </label>

                {/* Session Replay */}
                <label className="flex items-start gap-3 p-4 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={granularPrefs.sessionReplay}
                    onChange={(e) => setGranularPrefs({ ...granularPrefs, sessionReplay: e.target.checked })}
                    className="mt-1 w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-stone-900">Session Recording</span>
                      <span className="text-xs text-stone-500">PostHog</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Record anonymized sessions to improve UX and identify issues. All sensitive data is masked.
                    </p>
                  </div>
                </label>

                {/* Performance */}
                <label className="flex items-start gap-3 p-4 border border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={granularPrefs.performance}
                    onChange={(e) => setGranularPrefs({ ...granularPrefs, performance: e.target.checked })}
                    className="mt-1 w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-stone-900">Performance Monitoring</span>
                      <span className="text-xs text-stone-500">Core Web Vitals</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Track page load times, interaction delays, and layout stability to ensure optimal performance.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  className="px-8 py-3 bg-stone-900 text-white text-sm font-medium tracking-wide hover:bg-stone-800 transition-all shadow-sm"
                  aria-label="Save cookie preferences"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
