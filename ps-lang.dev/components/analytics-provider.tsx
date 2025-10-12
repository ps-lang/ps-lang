'use client'

import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '@/convex/_generated/api'
import { canRunAnalytics, canRunSessionReplay, getAnonymousTier, getTierPermissions } from '@/lib/tier-enforcement'
import type { DataRetentionTier } from '@/lib/tier-enforcement'

/**
 * Analytics Provider with Tier Enforcement
 *
 * Two-layer gating system:
 * 1. Cookie consent (GDPR/CCPA compliance)
 * 2. Data retention tier (Essential/Standard/Research Contributor)
 *
 * Analytics only initialize if BOTH layers allow it.
 */
export default function AnalyticsProvider() {
  const { user, isSignedIn } = useUser()

  // Fetch user's data retention preferences from Convex
  const userPreferences = useQuery(
    api.dataRetention.getUserPreferences,
    isSignedIn && user ? { userId: user.id } : 'skip'
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Determine user's tier
    let tier: DataRetentionTier | null = null

    if (isSignedIn && userPreferences) {
      // Logged-in user with preferences
      tier = userPreferences.tier as DataRetentionTier
    } else if (!isSignedIn) {
      // Anonymous user gets Standard tier
      tier = getAnonymousTier()
    }

    // Check tier permissions
    const tierAllowsAnalytics = tier ? canRunAnalytics(tier) : false
    const tierAllowsSessionReplay = tier ? canRunSessionReplay(tier) : false

    // Get tier-specific permissions for more granular control
    const permissions = tier ? getTierPermissions(tier) : null

    // Store tier info in window for Script tags to access
    ;(window as any).__ps_lang_tier = tier
    ;(window as any).__ps_lang_tier_allows_analytics = tierAllowsAnalytics
    ;(window as any).__ps_lang_tier_allows_session_replay = tierAllowsSessionReplay
    ;(window as any).__ps_lang_tier_permissions = permissions

    // Enforce tier restrictions on already-loaded analytics
    const w = window as any

    // If tier doesn't allow analytics, opt out even if consent was granted
    if (!tierAllowsAnalytics) {
      if (w.posthog) {
        w.posthog.opt_out_capturing()
      }
      if (w.gtag) {
        w.gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'personalization_storage': 'denied',
        })
      }
    }

    // If tier doesn't allow session replay, stop it
    if (!tierAllowsSessionReplay && w.posthog) {
      w.posthog.stopSessionRecording?.()
    }

    // If tier allows analytics but session replay is disabled, enforce that
    if (tierAllowsAnalytics && !tierAllowsSessionReplay && w.posthog) {
      w.posthog.stopSessionRecording?.()
    }

    // Enforce specific permission restrictions
    if (permissions) {
      // Performance monitoring
      if (!permissions.allowPerformanceMonitoring) {
        // Disable web vitals tracking
        ;(window as any).__disable_web_vitals = true
      }

      // Behavior tracking
      if (!permissions.allowBehaviorTracking) {
        // Disable text selection and zoom tracking
        ;(window as any).__disable_behavior_tracking = true
      }
    }

  }, [isSignedIn, user, userPreferences])

  return null // This component doesn't render anything
}
