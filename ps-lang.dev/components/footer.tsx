'use client'

import Link from 'next/link'
import { useUser, SignInButton, SignUpButton, useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import FeedbackModal from './feedback-modal'
import PageContextHeader from './page-context-header'
import { siteConfig } from '@/config/site'

const PERSONA_SLOGANS: Record<string, string> = {
  explorer: 'Discover More · Learn As I Go',
  solo_developer: 'Ship Fast · Build Better · Own Your Stack',
  researcher: 'Think Deep · Test Everything · Question More',
  creator: 'Write More · Create Daily · Share Freely',
  analyst: 'Measure Twice · Cut Once · Data-Driven',
  generalist: 'Learn Everything · Master Anything · Stay Curious',
  prefer_not_to_say: 'Privacy First · Keep It Simple',
}

export default function Footer() {
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const [personaSlogan, setPersonaSlogan] = useState('Discover More · Learn As I Go')
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  useEffect(() => {
    if (user?.unsafeMetadata?.persona) {
      const persona = user.unsafeMetadata.persona as string
      setPersonaSlogan(PERSONA_SLOGANS[persona] || PERSONA_SLOGANS.explorer)
    }
  }, [user])

  return (
    <footer className="bg-stone-200 text-stone-600 py-12 sm:py-16 border-t border-stone-300">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Zone-styled branding */}
        <div className="mb-8 sm:mb-10">
          <div className="font-mono text-xs text-stone-400 tracking-wide mb-3">
            <PageContextHeader zoneOnly />
          </div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-medium text-stone-900 tracking-tight">
              PS-LANG<sup className="text-[10px] ml-0.5 -top-2">™</sup>
            </h1>
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="text-xs text-stone-500 font-mono hover:text-stone-900 transition-colors cursor-pointer"
              title="Click to provide feedback on this version"
            >
              {siteConfig.version} →
            </button>
          </div>
        </div>

        {/* Grid layout for links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 mb-10 sm:mb-12">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Legal</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/privacy" className="text-stone-600 hover:text-stone-900 transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-stone-600 hover:text-stone-900 transition-colors">
                Cookies
              </Link>
              <Link href="/terms" className="text-stone-600 hover:text-stone-900 transition-colors">
                Terms
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Code</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={siteConfig.urls.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href={siteConfig.urls.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                npm ↗
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Playground</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/playground/token-comparison"
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                Token Usage Comparison
              </Link>
              <Link
                href="/playground/prompt-editor"
                className="text-stone-600 hover:text-stone-900 transition-colors"
              >
                1-Shot Prompt Editor
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-3 font-medium">Account</h4>
            <div className="flex flex-col gap-2 text-sm">
              {isSignedIn ? (
                <>
                  <Link href="/settings" className="text-stone-600 hover:text-stone-900 transition-colors">
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-left text-stone-600 hover:text-stone-900 transition-colors">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="text-left text-stone-600 hover:text-stone-900 transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-200 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <p className="text-center sm:text-left text-stone-500">
              © 2025{" "}
              <a
                href={siteConfig.url}
                className="text-stone-600 hover:text-stone-900 transition-colors underline"
                title="PS-LANG - Privacy-first scripting language for multi-agent context control"
              >
                PS-LANG
              </a>
              {" "}·{" "}
              <a
                href={siteConfig.urls.license}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-600 hover:text-stone-900 transition-colors underline"
                title="PS-LANG MIT License - Open source multi-agent context control"
              >
                MIT License
              </a>
            </p>
            <p className="text-center sm:text-right text-stone-400 italic font-light">
              Privacy-first by design
            </p>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        version={siteConfig.version}
      />
    </footer>
  )
}
