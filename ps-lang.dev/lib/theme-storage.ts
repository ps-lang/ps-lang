/**
 * Theme Storage Strategy
 *
 * Priority order:
 * 1. Account settings (if signed in) - future
 * 2. Cookie (for SSR, prevents flash)
 * 3. LocalStorage (privacy-conscious fallback)
 */

const THEME_COOKIE_NAME = 'ps-lang-theme'
const THEME_STORAGE_KEY = 'theme'
const PRIVACY_STORAGE_KEY = 'ps_lang_cookie_consent'

export type Theme = 'default' | 'fermi'

/**
 * Check if user has consented to cookies
 */
export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false
  const consent = localStorage.getItem(PRIVACY_STORAGE_KEY)
  return consent === 'granted'
}

/**
 * Get theme from storage (cookie or localStorage based on consent)
 */
export function getTheme(): Theme | null {
  if (typeof window === 'undefined') return null

  // Check cookie first (works for SSR)
  const cookieTheme = getCookie(THEME_COOKIE_NAME)
  if (cookieTheme && (cookieTheme === 'default' || cookieTheme === 'fermi')) {
    return cookieTheme as Theme
  }

  // Fallback to localStorage
  const localTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (localTheme && (localTheme === 'default' || localTheme === 'fermi')) {
    return localTheme as Theme
  }

  return null
}

/**
 * Set theme in storage (cookie or localStorage based on consent)
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return

  const useCookies = hasCookieConsent()

  if (useCookies) {
    // Set cookie (30 days expiry, accessible server-side)
    setCookie(THEME_COOKIE_NAME, theme, 30)
  }

  // Always set localStorage as backup
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * Get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }

  return null
}

/**
 * Set cookie value
 */
function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return

  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `expires=${date.toUTCString()}`

  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
}

/**
 * Remove theme from all storage
 */
export function clearTheme(): void {
  if (typeof window === 'undefined') return

  // Remove cookie
  document.cookie = `${THEME_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`

  // Remove localStorage
  localStorage.removeItem(THEME_STORAGE_KEY)
}
