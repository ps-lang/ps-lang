/**
 * Cookie Consent Management Utility
 * GDPR, CCPA, PIPEDA compliant with granular controls
 * Supports GPC (Global Privacy Control)
 */

export type ConsentStatus = 'granted' | 'denied' | null

export interface GranularConsent {
  analytics: boolean
  sessionReplay: boolean
  performance: boolean
}

export interface ConsentPreferences {
  status: ConsentStatus
  granular: GranularConsent
  gpcDetected: boolean
  timestamp: string
  expiresAt?: string // Added for consent expiry tracking
  sessionId?: string // Added for audit trail
}

const DEFAULT_CONSENT: GranularConsent = {
  analytics: false,
  sessionReplay: false,
  performance: false,
}

/**
 * Detect Global Privacy Control (GPC) signal
 * https://globalprivacycontrol.org/
 */
export function detectGPC(): boolean {
  if (typeof window === 'undefined') return false

  // Check for GPC signal in navigator
  const nav = navigator as any
  return nav.globalPrivacyControl === true || nav.doNotTrack === '1'
}

/**
 * Get full consent preferences
 */
export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null

  const prefsStr = localStorage.getItem('ps_lang_consent_prefs')
  if (!prefsStr) return null

  try {
    return JSON.parse(prefsStr)
  } catch {
    return null
  }
}

/**
 * Legacy: Get simple consent status
 */
export function getConsent(): ConsentStatus {
  const prefs = getConsentPreferences()
  return prefs?.status ?? null
}

/**
 * Check if any consent has been granted
 */
export function hasConsent(): boolean {
  return getConsent() === 'granted'
}

/**
 * Check if specific consent category is granted
 */
export function hasConsentFor(category: keyof GranularConsent): boolean {
  const prefs = getConsentPreferences()
  if (!prefs || prefs.status !== 'granted') return false
  return prefs.granular[category] === true
}

/**
 * Get consent timestamp
 */
export function getConsentDate(): Date | null {
  const prefs = getConsentPreferences()
  return prefs?.timestamp ? new Date(prefs.timestamp) : null
}

/**
 * Save consent preferences (granular) with Convex audit trail
 */
export function saveConsentPreferences(
  status: ConsentStatus,
  granular: Partial<GranularConsent> = {},
  action: 'granted' | 'denied' | 'updated' | 'revoked' = 'granted'
): void {
  if (typeof window === 'undefined') return

  const gpcDetected = detectGPC()

  // If GPC is detected and user hasn't explicitly consented, deny all
  if (gpcDetected && status !== 'granted') {
    status = 'denied'
  }

  // Generate or retrieve session ID
  const sessionId = getOrCreateSessionId()

  // Calculate expiry (12 months from now)
  const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000
  const expiresAt = new Date(Date.now() + TWELVE_MONTHS_MS).toISOString()

  const prefs: ConsentPreferences = {
    status,
    granular: {
      ...DEFAULT_CONSENT,
      ...granular,
    },
    gpcDetected,
    timestamp: new Date().toISOString(),
    expiresAt,
    sessionId,
  }

  // Save to localStorage
  localStorage.setItem('ps_lang_consent_prefs', JSON.stringify(prefs))

  // Save to cookie for server-side detection
  const cookieValue = status === 'granted' ? 'granted' : 'denied'
  document.cookie = `ps_lang_consent=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`

  // Save to Convex for audit trail (async - don't block user)
  saveConsentToConvex(action, prefs).catch(err => {
    console.warn('Failed to save consent to Convex:', err)
  })

  // Update Google Consent Mode v2
  updateGoogleConsentMode(prefs)

  // Update PostHog opt-in/out
  updatePostHogConsent(prefs)

  // Clear cookies if denied
  if (status === 'denied') {
    clearAnalyticsCookies()
  }
}

/**
 * Grant consent with granular controls
 */
export function grantConsent(granular: Partial<GranularConsent> = {}): void {
  const fullConsent: GranularConsent = {
    analytics: granular.analytics ?? true,
    sessionReplay: granular.sessionReplay ?? true,
    performance: granular.performance ?? true,
  }

  saveConsentPreferences('granted', fullConsent)

  // Initialize analytics dynamically (no reload needed)
  initializeAnalytics(fullConsent)
}

/**
 * Revoke consent
 */
export function revokeConsent(): void {
  saveConsentPreferences('denied', DEFAULT_CONSENT)

  // Disable analytics
  disableAnalytics()
}

/**
 * Update Google Analytics Consent Mode v2
 */
function updateGoogleConsentMode(prefs: ConsentPreferences): void {
  if (typeof window === 'undefined') return

  const w = window as any
  if (!w.gtag) return

  const consentState = prefs.status === 'granted' ? 'granted' : 'denied'

  w.gtag('consent', 'update', {
    'analytics_storage': prefs.granular.analytics ? 'granted' : 'denied',
    'ad_storage': 'denied', // We don't use ads
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'personalization_storage': prefs.granular.sessionReplay ? 'granted' : 'denied',
    'functionality_storage': 'granted', // Always needed for site function
    'security_storage': 'granted', // Always needed
  })
}

/**
 * Update PostHog consent
 */
function updatePostHogConsent(prefs: ConsentPreferences): void {
  if (typeof window === 'undefined') return

  const w = window as any
  if (!w.posthog) return

  if (prefs.status === 'granted' && prefs.granular.analytics) {
    w.posthog.opt_in_capturing()
  } else {
    w.posthog.opt_out_capturing()
  }

  // Session replay control
  if (prefs.granular.sessionReplay) {
    w.posthog.startSessionRecording?.()
  } else {
    w.posthog.stopSessionRecording?.()
  }
}

/**
 * Initialize analytics scripts dynamically (no page reload)
 */
function initializeAnalytics(granular: GranularConsent): void {
  if (typeof window === 'undefined') return

  const w = window as any

  // Initialize Google Analytics if analytics consent is granted
  if (granular.analytics && process.env.NEXT_PUBLIC_GA_ID && !w.gtag) {
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      w.dataLayer = w.dataLayer || []
      function gtag(...args: any[]) { w.dataLayer.push(args) }
      w.gtag = gtag

      gtag('js', new Date())
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        custom_map: {
          'ps_lang_project': `${process.env.NEXT_PUBLIC_PARENT_COMPANY}_property`
        }
      })

      // Set initial consent state - only grant if user explicitly consented
      gtag('consent', 'default', {
        'analytics_storage': granular.analytics ? 'granted' : 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'personalization_storage': granular.sessionReplay ? 'granted' : 'denied',
        'functionality_storage': 'granted',
        'security_storage': 'granted',
      })
    }
  }

  // Initialize PostHog if not already loaded
  if ((granular.analytics || granular.sessionReplay) && process.env.NEXT_PUBLIC_POSTHOG_KEY && !w.posthog) {
    // PostHog initialization (would need full script here, or trigger existing script)
    // For now, assume it's already loaded and we're just opting in
    if (w.posthog) {
      w.posthog.opt_in_capturing()
      if (granular.sessionReplay) {
        w.posthog.startSessionRecording?.()
      }
    }
  }
}

/**
 * Disable all analytics
 */
function disableAnalytics(): void {
  if (typeof window === 'undefined') return

  const w = window as any

  // Disable Google Analytics
  if (w.gtag) {
    w.gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'personalization_storage': 'denied',
    })
  }

  // Disable PostHog
  if (w.posthog) {
    w.posthog.opt_out_capturing()
    w.posthog.stopSessionRecording?.()
  }
}

/**
 * Clear analytics cookies with subdomain support
 */
function clearAnalyticsCookies(): void {
  if (typeof window === 'undefined') return

  const hostname = window.location.hostname
  const domains = [
    hostname,
    `.${hostname}`,
    hostname.split('.').slice(-2).join('.'), // e.g., example.com from www.example.com
    `.${hostname.split('.').slice(-2).join('.')}`,
  ]

  // Clear Google Analytics cookies
  const gaCookies = ['_ga', '_gat', '_gid']
  gaCookies.forEach(cookie => {
    domains.forEach(domain => {
      document.cookie = `${cookie}=; path=/; domain=${domain}; max-age=0; SameSite=Lax`
    })
    // Also clear without domain
    document.cookie = `${cookie}=; path=/; max-age=0; SameSite=Lax`
  })

  // Clear PostHog cookies
  const cookies = document.cookie.split(';')
  cookies.forEach(cookie => {
    const [name] = cookie.split('=')
    if (name.trim().startsWith('ph_')) {
      domains.forEach(domain => {
        document.cookie = `${name.trim()}=; path=/; domain=${domain}; max-age=0; SameSite=Lax`
      })
      document.cookie = `${name.trim()}=; path=/; max-age=0; SameSite=Lax`
    }
  })
}

/**
 * Check if consent was given from a cookie (for server-side rendering)
 */
export function getConsentFromCookie(cookieHeader?: string): boolean {
  if (!cookieHeader) return false

  const cookies = cookieHeader.split(';').map(c => c.trim())
  const consentCookie = cookies.find(c => c.startsWith('ps_lang_consent='))

  return consentCookie?.includes('granted') ?? false
}

/**
 * Track consent event in analytics (after consent is granted)
 */
export function trackConsentEvent(action: 'granted' | 'denied' | 'updated' | 'revoked', granular?: GranularConsent): void {
  if (typeof window === 'undefined') return

  const w = window as any
  const gpcDetected = detectGPC()

  const eventData = {
    action,
    gpc_detected: gpcDetected,
    analytics_enabled: granular?.analytics ?? false,
    session_replay_enabled: granular?.sessionReplay ?? false,
    performance_enabled: granular?.performance ?? false,
    timestamp: new Date().toISOString(),
  }

  // Only track if user has consented to analytics
  if (action === 'granted' && granular?.analytics) {
    // PostHog
    if (w.posthog) {
      w.posthog.capture('consent_action', eventData)
    }

    // Google Analytics
    if (w.gtag) {
      w.gtag('event', 'consent_action', {
        event_category: 'privacy',
        event_label: action,
        ...eventData,
      })
    }
  }
}

/**
 * Generate or retrieve session ID for anonymous tracking
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server'

  let sessionId = localStorage.getItem('ps_lang_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('ps_lang_session_id', sessionId)
  }
  return sessionId
}

/**
 * Save consent to Convex for audit trail
 */
async function saveConsentToConvex(
  action: 'granted' | 'denied' | 'updated' | 'revoked',
  prefs: ConsentPreferences
): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    // Get Clerk user ID if available
    const w = window as any
    const userId = w.Clerk?.user?.id

    // Make API call to save consent
    const response = await fetch('/api/consent/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        sessionId: prefs.sessionId,
        action,
        status: prefs.status,
        granular: prefs.granular,
        gpcDetected: prefs.gpcDetected,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to save consent: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error saving consent to Convex:', error)
    throw error
  }
}

/**
 * Check if consent has expired
 */
export function isConsentExpired(): boolean {
  const prefs = getConsentPreferences()
  if (!prefs || !prefs.expiresAt) return true

  const expiryDate = new Date(prefs.expiresAt)
  return expiryDate < new Date()
}

/**
 * Check if consent needs renewal soon (within 30 days)
 */
export function needsConsentRenewal(): boolean {
  const prefs = getConsentPreferences()
  if (!prefs || !prefs.expiresAt) return true

  const expiryDate = new Date(prefs.expiresAt)
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  return expiryDate < thirtyDaysFromNow
}
