'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
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
  }, [])

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
            <span className="font-semibold">Alpha Testing Open</span>
            <span className="hidden sm:inline"> — Help shape PS-LANG's future</span>
          </span>
          <Link
            href="/journal"
            className="underline hover:opacity-80 transition-opacity font-medium text-white"
          >
            Join Now →
          </Link>
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
    </div>
  )
}
