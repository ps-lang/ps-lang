'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function PostHogIdentifier() {
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).posthog) return

    if (isSignedIn && user) {
      // Identify user with Clerk ID and metadata
      (window as any).posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        username: user.username,
        created_at: user.createdAt,
        // Add PS-Lang specific metadata
        ps_lang_user: true,
        auth_provider: 'clerk',
      })
    } else {
      // Reset PostHog when user signs out
      (window as any).posthog.reset()
    }
  }, [isSignedIn, user])

  return null // This component doesn't render anything
}
