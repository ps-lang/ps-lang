/**
 * Data Retention Tier Enforcement
 *
 * Controls what data collection and analytics are allowed based on user's tier
 */

export type DataRetentionTier = 'privacy_essential' | 'standard' | 'research_contributor'

export interface TierPermissions {
  // Analytics
  allowGoogleAnalytics: boolean
  allowPostHogBasic: boolean
  allowPostHogSessionReplay: boolean
  allowPerformanceMonitoring: boolean

  // Data collection
  allowBehaviorTracking: boolean
  allowFeatureUsageTracking: boolean
  allowErrorLogging: boolean

  // AI Training
  allowAITraining: boolean
  allowPromptResponseCollection: boolean

  // Retention
  retentionDays: number
  anonymizationDays: number
  aggregationDays: number | null
}

/**
 * Get permissions for a given tier
 */
export function getTierPermissions(tier: DataRetentionTier): TierPermissions {
  switch (tier) {
    case 'privacy_essential':
      return {
        // Analytics - Essential only
        allowGoogleAnalytics: false,
        allowPostHogBasic: false,
        allowPostHogSessionReplay: false,
        allowPerformanceMonitoring: false,

        // Data collection - Minimal
        allowBehaviorTracking: false,
        allowFeatureUsageTracking: false,
        allowErrorLogging: true, // Anonymized immediately

        // AI Training - Never
        allowAITraining: false,
        allowPromptResponseCollection: false,

        // Retention
        retentionDays: 90,
        anonymizationDays: 30,
        aggregationDays: null,
      }

    case 'standard':
      return {
        // Analytics - If consented via cookies
        allowGoogleAnalytics: true, // Gated by cookie consent
        allowPostHogBasic: true, // Gated by cookie consent
        allowPostHogSessionReplay: false, // Must explicitly opt-in
        allowPerformanceMonitoring: true, // Gated by cookie consent

        // Data collection - UX insights
        allowBehaviorTracking: true,
        allowFeatureUsageTracking: true,
        allowErrorLogging: true,

        // AI Training - Aggregated only
        allowAITraining: false,
        allowPromptResponseCollection: false,

        // Retention
        retentionDays: 730, // 2 years
        anonymizationDays: 90,
        aggregationDays: null,
      }

    case 'research_contributor':
      return {
        // Analytics - Full
        allowGoogleAnalytics: true, // Gated by cookie consent
        allowPostHogBasic: true, // Gated by cookie consent
        allowPostHogSessionReplay: true, // Gated by cookie consent
        allowPerformanceMonitoring: true, // Gated by cookie consent

        // Data collection - Everything
        allowBehaviorTracking: true,
        allowFeatureUsageTracking: true,
        allowErrorLogging: true,

        // AI Training - Yes
        allowAITraining: true,
        allowPromptResponseCollection: true,

        // Retention
        retentionDays: 1825, // 5 years
        anonymizationDays: 90,
        aggregationDays: 730, // Aggregate after 2 years
      }
  }
}

/**
 * Check if analytics are allowed for a given tier
 * This should be checked before initializing GA/PostHog
 */
export function canRunAnalytics(tier: DataRetentionTier | null): boolean {
  if (!tier) return false // Anonymous users = no analytics until they set tier

  const permissions = getTierPermissions(tier)
  return permissions.allowGoogleAnalytics || permissions.allowPostHogBasic
}

/**
 * Check if session replay is allowed
 */
export function canRunSessionReplay(tier: DataRetentionTier | null): boolean {
  if (!tier) return false

  const permissions = getTierPermissions(tier)
  return permissions.allowPostHogSessionReplay
}

/**
 * Check if AI training data collection is allowed
 */
export function canCollectTrainingData(tier: DataRetentionTier | null): boolean {
  if (!tier) return false

  const permissions = getTierPermissions(tier)
  return permissions.allowAITraining
}

/**
 * Get default tier for new users
 */
export function getDefaultTier(): DataRetentionTier {
  return 'standard'
}

/**
 * Get tier for anonymous (non-logged-in) users
 */
export function getAnonymousTier(): DataRetentionTier {
  return 'standard' // Treat anonymous users as Standard tier
}
