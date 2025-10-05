"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useUser, SignInButton, useClerk } from "@clerk/nextjs"
import { getUserRole, getRoleDisplayName, getRoleBadgeColor } from "@/lib/roles"
import AlphaSignupModal from "@/components/alpha-signup-modal"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isJournalOpen, setIsJournalOpen] = useState(false)
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false)
  const [isAlphaModalOpen, setIsAlphaModalOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const journalRef = useRef<HTMLDivElement>(null)
  const playgroundRef = useRef<HTMLDivElement>(null)
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const userRole = getUserRole(user)

  // Show dashboard for admins only
  const showDashboard = userRole === 'super_admin' || userRole === 'admin'

  // Show papers for super_admin, admin, and reviewer
  const showPapers = userRole === 'super_admin' || userRole === 'admin' || userRole === 'reviewer'

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
      if (journalRef.current && !journalRef.current.contains(event.target as Node)) {
        setIsJournalOpen(false)
      }
      if (playgroundRef.current && !playgroundRef.current.contains(event.target as Node)) {
        setIsPlaygroundOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-40 bg-white/95">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-light text-stone-900 tracking-wide hover:text-stone-600 transition-colors">
            PS-LANG
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
                      Playground
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
            <Link href="/postscript-journaling" className="text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
              Journal
            </Link>
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
                  className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide"
                >
                  <span>Account</span>
                  <span className={`transition-transform duration-200 ${isAccountOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-3 min-w-[200px] bg-white border border-stone-200">
                    <div className="py-2">
                      {showDashboard && (
                        <Link
                          href="/journal/admin"
                          onClick={() => setIsAccountOpen(false)}
                          className="block px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/settings"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-6 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors w-full text-left"
                      >
                        <span className="w-px h-4 bg-stone-300"></span>
                        <span>Sign Out</span>
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
          <div className="md:hidden mt-6 space-y-6 pb-6">
            <Link href="/about" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">Playground</div>
              <Link href="/playground/token-comparison" className="block pl-3 text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide" onClick={() => setIsOpen(false)}>
                Token Usage Comparison →
              </Link>
              <Link href="/playground/prompt-editor" className="block pl-3 mt-2 text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide" onClick={() => setIsOpen(false)}>
                1-Shot Prompt Editor →
              </Link>
            </div>
            <Link href="/postscript-journaling" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide" onClick={() => setIsOpen(false)}>
              Journal
            </Link>
            <Link href="/research-papers" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide" onClick={() => setIsOpen(false)}>
              Papers
            </Link>
            {isSignedIn && (
              <>
                <Link href="/settings" className="block text-sm text-stone-600 hover:text-stone-900 transition-colors tracking-wide" onClick={() => setIsOpen(false)}>
                  Settings
                </Link>
                <div className="pt-4 border-t border-stone-200">
                  <div className="mb-3">
                    <p className="font-mono text-xs text-stone-500 mb-1">Signed in as</p>
                    <p className="font-mono text-xs text-stone-900 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full border font-mono text-xs ${getRoleBadgeColor(userRole)}`}>
                      {getRoleDisplayName(userRole)}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="w-full px-4 py-2 bg-stone-900 text-white font-light text-sm hover:bg-stone-800 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}
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
