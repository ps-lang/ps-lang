import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Force dynamic rendering (uses auth headers)
export const dynamic = 'force-dynamic'

/**
 * DSAR (Data Subject Access Request) Export Endpoint
 * GDPR Article 15 - Right of Access
 * CCPA/CPRA Section 1798.110 - Right to Know
 * PIPEDA Principle 9 - Individual Access
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to export your data.' },
        { status: 401 }
      )
    }

    // Gather all user data from various sources
    const userData = {
      export_metadata: {
        user_id: userId,
        export_date: new Date().toISOString(),
        format_version: '2.0',
        compliance: ['GDPR Article 15', 'CCPA Section 1798.110', 'PIPEDA Principle 9'],
      },

      // Account Information (from Clerk - not directly accessible via API in this context)
      account: {
        user_id: userId,
        note: 'For full account details including email and profile, please contact privacy@ps-lang.dev',
      },

      // Cookie Consent History
      consent_history: await getConsentHistory(userId),

      // Newsletter Subscriptions
      newsletter_subscriptions: await getNewsletterData(userId),

      // Alpha Access Requests
      alpha_requests: await getAlphaRequests(userId),

      // Feature Requests
      feature_requests: await getFeatureRequests(userId),

      // Feedback Submissions
      feedback: await getFeedbackSubmissions(userId),

      // User Interactions (from Convex)
      interactions: await getUserInteractions(userId),

      // Synced Conversations (ChatGPT, Claude)
      synced_conversations: await getSyncedConversations(userId),

      // Journal Entries
      journal_entries: await getJournalEntries(userId),

      // PSL Files
      psl_files: await getPSLFiles(userId),

      // Privacy Rights
      rights: {
        access: 'You have the right to access your personal data (exercised via this export)',
        rectification: 'You have the right to correct inaccurate data. Contact privacy@ps-lang.dev',
        erasure: 'You have the right to request deletion of your data. Contact privacy@ps-lang.dev',
        portability: 'You have the right to receive your data in a portable format (this JSON export)',
        restriction: 'You have the right to restrict processing. Contact privacy@ps-lang.dev',
        objection: 'You have the right to object to processing. Contact privacy@ps-lang.dev',
        withdraw_consent: 'You can withdraw consent at any time via /cookies preferences page',
      },

      // Contact Information
      data_controller: {
        organization: 'Vummo Labs',
        email: 'privacy@ps-lang.dev',
        website: 'https://vummo.com',
      },
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ps-lang-data-export-${userId}-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('DSAR export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data. Please try again or contact privacy@ps-lang.dev' },
      { status: 500 }
    )
  }
}

/**
 * Get consent history from Convex
 */
async function getConsentHistory(userId: string) {
  try {
    const history = await convex.query(api.cookieConsent.getUserConsentHistory, {
      userId,
    })
    return history || []
  } catch (error) {
    return { error: 'Unable to fetch consent history', details: String(error) }
  }
}

/**
 * Get newsletter subscriptions
 */
async function getNewsletterData(userId: string) {
  try {
    // Newsletter doesn't directly link to userId, so we can't fetch it here
    return { note: 'Newsletter subscriptions are not linked to user accounts. Contact privacy@ps-lang.dev to request newsletter data by email.' }
  } catch (error) {
    return { error: 'Unable to fetch newsletter data', details: String(error) }
  }
}

/**
 * Get alpha access requests
 */
async function getAlphaRequests(userId: string) {
  try {
    const requests = await convex.query(api.alphaRequests.getUserAlphaRequests, {
      clerkUserId: userId,
    })
    return requests || []
  } catch (error) {
    return { error: 'Unable to fetch alpha requests', details: String(error) }
  }
}

/**
 * Get feature requests
 */
async function getFeatureRequests(userId: string) {
  try {
    const requests = await convex.query(api.featureRequests.getUserFeatureRequests, {
      userId,
    })
    return requests || []
  } catch (error) {
    return { error: 'Unable to fetch feature requests', details: String(error) }
  }
}

/**
 * Get feedback submissions
 */
async function getFeedbackSubmissions(userId: string) {
  try {
    const feedback = await convex.query(api.feedback.getUserFeedback, {
      userId,
    })
    return feedback || []
  } catch (error) {
    return { error: 'Unable to fetch feedback', details: String(error) }
  }
}

/**
 * Get user interactions from Convex
 */
async function getUserInteractions(userId: string) {
  try {
    const interactions = await convex.query(api.userInteractions.getUserInteractions, {
      userId,
    })
    return interactions || []
  } catch (error) {
    return { error: 'Unable to fetch interaction data', details: String(error) }
  }
}

/**
 * Get synced conversations
 */
async function getSyncedConversations(userId: string) {
  try {
    const conversations = await convex.query(api.syncedConversations.getUserConversations, {
      userId,
    })
    return conversations || []
  } catch (error) {
    return { error: 'Unable to fetch synced conversations', details: String(error) }
  }
}

/**
 * Get journal entries
 */
async function getJournalEntries(userId: string) {
  try {
    const entries = await convex.query(api.journalEntries.getUserJournalEntries, {
      userId,
    })
    return entries || []
  } catch (error) {
    return { error: 'Unable to fetch journal entries', details: String(error) }
  }
}

/**
 * Get PSL files
 */
async function getPSLFiles(userId: string) {
  try {
    const files = await convex.query(api.pslFiles.getUserPSLFiles, {
      userId,
    })
    return files || []
  } catch (error) {
    return { error: 'Unable to fetch PSL files', details: String(error) }
  }
}

