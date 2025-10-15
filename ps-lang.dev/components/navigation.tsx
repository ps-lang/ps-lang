"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useUser, SignInButton, useClerk } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { getUserRole, getRoleDisplayName, getRoleBadgeColor, canAccessThemeSettings } from "@/lib/roles"
import AlphaSignupModal from "@/components/alpha-signup-modal"
import { setTheme as setThemeStorage } from "@/lib/theme-storage"
import { cn } from "@/lib/utils"

// Persona icon mapping (minimal icon set)
const PERSONA_ICONS: Record<string, string> = {
  explorer: '→',
  solo_developer: '/',
  researcher: '∆',
  creator: '~',
  analyst: '#',
  generalist: '◆',
  prefer_not_to_say: '○',
}

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isJournalPlusOpen, setIsJournalPlusOpen] = useState(false)
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false)
  const [isAlphaModalOpen, setIsAlphaModalOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const journalPlusRef = useRef<HTMLDivElement>(null)
  const playgroundRef = useRef<HTMLDivElement>(null)
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const userRole = getUserRole(user)

  // Prevent hydration mismatch by only rendering theme after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-sync role from env var to Clerk metadata on mount
  useEffect(() => {
    if (isSignedIn && user?.id) {
      // Call sync endpoint (non-blocking, fire-and-forget)
      fetch('/api/user/sync-role', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.synced) {
            console.log('[ROLE SYNC] Role synced to Clerk metadata:', data.role)
            // Force refresh user data from Clerk to get updated metadata
            window.location.reload()
          }
        })
        .catch(err => console.error('[ROLE SYNC] Failed:', err))
    }
  }, [isSignedIn, user?.id])

  // Convex mutation for saving theme
  const saveThemeToConvex = useMutation(api.userPreferences.setTheme)

  // Get user's persona from metadata
  const userPersona = (user?.unsafeMetadata?.persona as string) || 'explorer'
  const personaIcon = PERSONA_ICONS[userPersona] || '🧭'

  // Toggle theme handler
  const handleThemeChange = () => {
    const newTheme = theme === 'fermi' ? 'default' : 'fermi'
    setTheme(newTheme)
    // Save to cookie/localStorage for immediate SSR support
    setThemeStorage(newTheme)

    // If user is logged in, also save to Convex for cross-device sync (non-blocking)
    if (isSignedIn && user?.id) {
      saveThemeToConvex({
        userId: user.id,
        theme: newTheme,
      }).catch((error) => {
        console.error('Failed to save theme to Convex:', error)
        // Silently fail - cookie/localStorage will still work
      })
    }
  }

  // Determine which logomark to use based on page
  const getLogomark = () => {
    if (pathname?.includes('/ps-journaling') || pathname?.includes('/journal-plus')) {
      return '/ps-lang-journal-logomark.svg'
    }
    if (pathname?.includes('/research-papers')) {
      return '/ps-journal-logomark.svg'
    }
    return '/ps-lang-logomark.svg'
  }

  // Check if user is in alpha test
  const alphaSignup = useQuery(
    api.alphaSignups.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip"
  )
  const isAlphaTester = !!alphaSignup

  // Get user's theme preference from Convex
  const userThemePreference = useQuery(
    api.userPreferences.getTheme,
    isSignedIn && user?.id ? { userId: user.id } : "skip"
  )

  // Sync Convex theme with local theme on mount (for cross-device consistency)
  useEffect(() => {
    if (userThemePreference && theme && userThemePreference !== theme) {
      // Convex has a different theme than what's in cookie/localStorage
      // Update to match Convex (source of truth for logged-in users)
      setTheme(userThemePreference)
      if (userThemePreference === 'default' || userThemePreference === 'fermi') {
        setThemeStorage(userThemePreference)
      }
    }
  }, [userThemePreference, theme, setTheme])

  // Show dashboard for admins only
  const showDashboard = userRole === 'super_admin' || userRole === 'admin'

  // Show papers for super_admin, admin, and reviewer
  const showPapers = userRole === 'super_admin' || userRole === 'admin' || userRole === 'reviewer'

  // Show theme toggle for super_admin, admin, and designer only
  const canToggleTheme = canAccessThemeSettings(userRole)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
      if (journalPlusRef.current && !journalPlusRef.current.contains(event.target as Node)) {
        setIsJournalPlusOpen(false)
      }
      if (playgroundRef.current && !playgroundRef.current.contains(event.target as Node)) {
        setIsPlaygroundOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={cn(
      "sticky top-0 z-40",
      mounted && theme === "fermi" ? "bg-[#FAF8F6]/95" : "bg-[#fafaf9]/95"
    )}>
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src={getLogomark()}
              alt="PS-LANG"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              About
            </Link>
            <div className="relative" ref={playgroundRef}>
              <button
                onClick={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
                className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide"
              >
                <span>Playground</span>
                <span className={`transition-transform duration-200 ${isPlaygroundOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {isPlaygroundOpen && (
                <div className="absolute left-0 mt-3 min-w-[240px] bg-white border border-stone-200">
                  <div className="py-2">
                    <Link
                      href="/playground"
                      onClick={() => setIsPlaygroundOpen(false)}
                      className="block px-6 py-2 text-base text-stone-900 hover:bg-stone-50 transition-colors"
                    >
                      PromptScript Playground
                    </Link>
                    <Link
                      href="/playground/token-comparison"
                      className="flex items-center gap-3 px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      onClick={() => setIsPlaygroundOpen(false)}
                    >
                      <span className="w-px h-4 bg-stone-300"></span>
                      <span>Token Usage Comparison</span>
                    </Link>
                    <Link
                      href="/playground/prompt-editor"
                      className="flex items-center gap-3 px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      onClick={() => setIsPlaygroundOpen(false)}
                    >
                      <span className="w-px h-4 bg-stone-300"></span>
                      <span>1-Shot Prompt Editor</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={journalPlusRef}>
              <button
                onClick={() => setIsJournalPlusOpen(!isJournalPlusOpen)}
                className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide"
              >
                <span>Journal</span>
                <span className={`transition-transform duration-200 ${isJournalPlusOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {isJournalPlusOpen && (
                <div className="absolute left-0 mt-3 min-w-[240px] bg-white border border-stone-200">
                  <div className="py-2">
                    <Link
                      href="/ps-journaling"
                      className="block px-6 py-2 text-base text-stone-900 hover:bg-stone-50 transition-colors"
                      onClick={() => setIsJournalPlusOpen(false)}
                    >
                      PS Journaling
                    </Link>
                    {(isAlphaTester || userRole === 'super_admin' || userRole === 'admin') && (
                      <Link
                        href="/journal-plus"
                        onClick={() => setIsJournalPlusOpen(false)}
                        className="flex items-center gap-3 px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        <span className="w-px h-4 bg-stone-300"></span>
                        <span>Journal Plus</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link href="/research-papers" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Papers
            </Link>
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors font-mono text-xl"
                  aria-label="Account menu"
                  title={`Account (${userPersona.replace('_', ' ')})`}
                >
                  {personaIcon}
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-3 min-w-[200px] bg-white border border-stone-200">
                    <div className="py-2">
                      {/* Admin Section */}
                      {showDashboard && (
                        <Link
                          href="/admin/journal"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'designer') && (
                        <div className="flex items-center justify-between px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors group">
                          <Link
                            href="/admin/journal/themes"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex-1 hover:text-stone-900"
                          >
                            Journal Settings
                          </Link>
                          {canToggleTheme && mounted && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleThemeChange()
                              }}
                              className="p-1 hover:bg-stone-100 rounded transition-colors"
                              title={`Switch to ${theme === 'fermi' ? 'Default' : 'Fermi'} theme`}
                            >
                              {theme === 'fermi' ? (
                                // Fermi theme icon (book/journal)
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              ) : (
                                // Default theme icon (notebook/document)
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Divider - only show if admin section exists */}
                      {(showDashboard || userRole === 'super_admin' || userRole === 'admin' || userRole === 'designer') && (
                        <div className="my-2 border-t border-stone-200"></div>
                      )}

                      {/* User Section */}
                      <Link
                        href="/settings"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        Account Settings
                      </Link>

                      {/* Divider */}
                      <div className="my-2 border-t border-stone-200"></div>

                      {/* Sign Out */}
                      <button
                        onClick={() => signOut()}
                        className="block px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors w-full text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden w-8 h-8 flex flex-col justify-center items-end gap-2 focus:outline-none group"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-[2px] bg-stone-900 transition-all duration-300 ${isOpen ? 'w-8 rotate-45 translate-y-[10px]' : 'w-8'}`} />
            <span className={`block h-[2px] bg-stone-900 transition-all duration-300 ${isOpen ? 'opacity-0 w-6' : 'w-6'}`} />
            <span className={`block h-[2px] bg-stone-900 transition-all duration-300 ${isOpen ? 'w-8 -rotate-45 -translate-y-[10px]' : 'w-4'}`} />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden fixed inset-0 top-[72px] bg-white z-50 overflow-y-auto">
            <div className="px-6 py-8 space-y-1">
              {/* Main Navigation */}
              <Link
                href="/about"
                className="block py-3 text-sm text-stone-900 tracking-wide border-b border-stone-100"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>

              {/* Playground Section */}
              <div className="border-b border-stone-100">
                <Link
                  href="/playground"
                  className="block py-3 text-sm text-stone-900 tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  Playground
                </Link>
                <Link
                  href="/playground/token-comparison"
                  className="block py-3 pl-4 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Token Usage Comparison →
                </Link>
                <Link
                  href="/playground/prompt-editor"
                  className="block py-3 pl-4 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  1-Shot Prompt Editor →
                </Link>
              </div>

              {/* Journal Section */}
              <div className="border-b border-stone-100">
                <Link
                  href="/ps-journaling"
                  className="block py-3 text-sm text-stone-900 tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  PS Journaling
                </Link>
                {(isAlphaTester || userRole === 'super_admin' || userRole === 'admin') && (
                  <Link
                    href="/journal-plus"
                    className="block py-3 pl-4 text-sm text-stone-600 hover:text-stone-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Journal Plus →
                  </Link>
                )}
              </div>

              {/* Papers */}
              <Link
                href="/research-papers"
                className="block py-3 text-sm text-stone-900 tracking-wide border-b border-stone-100"
                onClick={() => setIsOpen(false)}
              >
                Papers
              </Link>

              {/* Account Section */}
              {isSignedIn && (
                <>
                  <Link
                    href="/settings"
                    className="block py-3 text-sm text-stone-900 tracking-wide border-b border-stone-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>

                  {canToggleTheme && mounted && (
                    <button
                      onClick={() => {
                        handleThemeChange()
                        setIsOpen(false)
                      }}
                      className="w-full text-left py-3 pl-4 text-sm text-stone-600 hover:text-stone-900 transition-colors border-b border-stone-100"
                    >
                      Theme: {theme === 'fermi' ? 'Fermi' : 'Default'}
                    </button>
                  )}

                  {/* User Info & Sign Out */}
                  <div className="pt-6 pb-4">
                    <div className="mb-4 pb-4 border-b border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400">Signed in as</p>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider ${getRoleBadgeColor(userRole)}`}>
                          {getRoleDisplayName(userRole)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-900 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full py-3 bg-stone-900 text-white text-sm uppercase tracking-wider hover:bg-stone-800 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <AlphaSignupModal
        isOpen={isAlphaModalOpen}
        onClose={() => setIsAlphaModalOpen(false)}
      />
    </nav>
  )
}
