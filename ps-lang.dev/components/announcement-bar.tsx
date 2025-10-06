'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import AlphaSignupModal from '@/components/alpha-signup-modal'

export default function AnnouncementBar() {
  const { user } = useUser()
  const [isVisible, setIsVisible] = useState(true)
  const [isAlphaModalOpen, setIsAlphaModalOpen] = useState(false)

  // Check if user has already signed up for alpha
  const alphaSignup = useQuery(
    api.alphaSignups.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip"
  )

  useEffect(() => {
    // Hide if user already signed up for alpha
    if (alphaSignup) {
      setIsVisible(false)
      return
    }

    // Check if announcement was dismissed
    const dismissedAt = localStorage.getItem('announcement-bar-dismissed')
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10)
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
      const now = Date.now()

      // If less than 7 days have passed, keep it hidden
      if (now - dismissedTime < sevenDaysInMs) {
        setIsVisible(false)
      } else {
        // Clear old dismissal
        localStorage.removeItem('announcement-bar-dismissed')
      }
    }
  }, [alphaSignup])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('announcement-bar-dismissed', Date.now().toString())
  }

  if (!isVisible) return null

  return (
    <div className="relative" style={{ backgroundColor: '#C5B9AA' }}>
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white">
          <span className="font-mono">
            <span className="hidden sm:inline">👋 </span>
            <span className="font-semibold">Journal Alpha Testing</span>
            <span className="hidden sm:inline"> — Help shape the future</span>
          </span>
          <button
            onClick={() => setIsAlphaModalOpen(true)}
            className="underline hover:opacity-80 transition-opacity font-medium text-white"
          >
            Join Now →
          </button>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
        aria-label="Close announcement"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <AlphaSignupModal
        isOpen={isAlphaModalOpen}
        onClose={() => setIsAlphaModalOpen(false)}
      />
    </div>
  )
}
