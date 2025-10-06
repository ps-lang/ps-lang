/**
 * Hero Tagline A/B Test Variants
 * PostScript Journaling Page
 *
 * Agentic RLHF Stack: Public & Private References
 * @version v1.0.0
 * @date 2025-10-06
 */

export type TaglineVariant = {
  id: string
  text: string
  variant: string
  testGroup: string

  // Public metadata (shareable via public_secrets_key)
  publicMetadata: {
    category: 'hero-tagline'
    page: 'postscript-journaling'
    activeStatus: 'active' | 'testing' | 'archived'
    createdAt: string
  }

  // Private metadata (user-controlled, Clerk-based)
  privateMetadata: {
    performanceScore?: number
    conversionRate?: number
    engagementMetrics?: {
      avgTimeOnPage: number
      scrollDepth: number
      ctaClicks: number
    }
    userFeedback?: {
      clarity: number  // 1-5 scale
      relevance: number  // 1-5 scale
      appeal: number  // 1-5 scale
    }
    rlhfDatastream?: {
      positiveSignals: number
      negativeSignals: number
      neutralSignals: number
    }
  }
}

/**
 * Testable Headline Variants
 * Active variant: option-4
 */
export const heroTaglineVariants: TaglineVariant[] = [
  {
    id: 'option-1',
    text: 'Collaborate, benchmark, and improve your AI workflows with complete control',
    variant: 'option-1',
    testGroup: 'hero-tagline-v1',
    publicMetadata: {
      category: 'hero-tagline',
      page: 'postscript-journaling',
      activeStatus: 'testing',
      createdAt: '2025-10-06T00:00:00Z'
    },
    privateMetadata: {
      // RLHF datastreams will populate here as users interact
    }
  },
  {
    id: 'option-2',
    text: 'Collaborate with AI agents, benchmark results, and improve your workflows',
    variant: 'option-2',
    testGroup: 'hero-tagline-v1',
    publicMetadata: {
      category: 'hero-tagline',
      page: 'postscript-journaling',
      activeStatus: 'testing',
      createdAt: '2025-10-06T00:00:00Z'
    },
    privateMetadata: {
      // RLHF datastreams will populate here as users interact
    }
  },
  {
    id: 'option-3',
    text: 'Collaborate, benchmark, and improve your AI workflows on your own terms',
    variant: 'option-3',
    testGroup: 'hero-tagline-v1',
    publicMetadata: {
      category: 'hero-tagline',
      page: 'postscript-journaling',
      activeStatus: 'testing',
      createdAt: '2025-10-06T00:00:00Z'
    },
    privateMetadata: {
      // RLHF datastreams will populate here as users interact
    }
  },
  {
    id: 'option-4',
    text: 'Collaborate, benchmark, and improve your AI workflows for better results',
    variant: 'option-4-active',
    testGroup: 'hero-tagline-v1',
    publicMetadata: {
      category: 'hero-tagline',
      page: 'postscript-journaling',
      activeStatus: 'active',
      createdAt: '2025-10-06T00:00:00Z'
    },
    privateMetadata: {
      // RLHF datastreams will populate here as users interact
    }
  },
  {
    id: 'option-5',
    text: 'Collaborate, benchmark, and improve your AI workflows. Your private lab notebook for agentic UX.',
    variant: 'option-5',
    testGroup: 'hero-tagline-v1',
    publicMetadata: {
      category: 'hero-tagline',
      page: 'postscript-journaling',
      activeStatus: 'testing',
      createdAt: '2025-10-06T00:00:00Z'
    },
    privateMetadata: {
      // RLHF datastreams will populate here as users interact
    }
  }
]

/**
 * RLHF Datastream Metadata Structure
 *
 * Public Fields (shared when user enables public_secrets_key):
 * - category, page, activeStatus, createdAt
 * - Aggregated performance scores (no PII)
 *
 * Private Fields (Clerk-based, never shared without explicit consent):
 * - Individual performance metrics
 * - User feedback scores
 * - Detailed RLHF signals
 * - Conversion and engagement data
 *
 * Usage:
 * 1. User views page with variant
 * 2. Interactions captured in privateMetadata
 * 3. User can choose to share aggregated scores via settings
 * 4. Public metadata available via public_secrets_key API
 */

/**
 * Example: Tracking headline performance
 */
export function trackHeadlineInteraction(
  variantId: string,
  interactionType: 'view' | 'scroll' | 'cta_click' | 'feedback',
  value?: number
) {
  const metadata = {
    // Public metadata
    variantId,
    interactionType,
    timestamp: new Date().toISOString(),

    // Private metadata (user session)
    sessionData: {
      userSegment: 'authenticated', // or 'public'
      deviceType: 'desktop', // or 'mobile'
      value
    },

    // Agentic metadata
    agenticData: {
      component: 'hero-tagline',
      dataStream: 'agentic_ux_v1',
      rlhfSignal: value ? (value > 3 ? 'positive' : 'negative') : 'neutral',
      privacyLabel: 'private' // defaults to private
    }
  }

  // Send to analytics (PostHog, GA, Convex)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture('headline_interaction', metadata)
  }

  return metadata
}

/**
 * Example: Getting active variant
 */
export function getActiveVariant(): TaglineVariant | undefined {
  return heroTaglineVariants.find(v => v.publicMetadata.activeStatus === 'active')
}

/**
 * Example: A/B test variant selector
 */
export function selectVariantForUser(userId?: string): TaglineVariant {
  // If user has a preference, use it
  // Otherwise, randomly select from testing variants
  const testingVariants = heroTaglineVariants.filter(
    v => v.publicMetadata.activeStatus === 'testing' || v.publicMetadata.activeStatus === 'active'
  )

  if (!userId) {
    // Random for anonymous users
    const randomIndex = Math.floor(Math.random() * testingVariants.length)
    return testingVariants[randomIndex]
  }

  // Consistent variant based on user ID hash
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % testingVariants.length
  return testingVariants[index]
}
