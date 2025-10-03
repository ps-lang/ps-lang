'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

declare global {
  interface Window {
    posthog?: {
      identify: (userId: string, properties?: Record<string, any>) => void
      reset: () => void
    }
  }
}

export default function PostHogIdentifier() {
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    if (!window.posthog) return

    if (isSignedIn && user) {
      // Identify user with Clerk ID and metadata
      window.posthog.identify(user.id, {
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
      window.posthog.reset()
    }
  }, [isSignedIn, user])

  return null // This component doesn't render anything
}
