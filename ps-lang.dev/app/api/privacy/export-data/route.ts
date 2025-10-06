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
        format_version: '1.0',
        compliance: ['GDPR', 'CCPA', 'PIPEDA'],
      },

      // Account Information (from Clerk - not directly accessible via API in this context)
      account: {
        user_id: userId,
        note: 'For full account details including email and profile, please contact privacy@vummo.com',
      },

      // Consent Records
      consent_history: await getConsentHistory(userId),

      // User Interactions (from Convex)
      interactions: await getUserInteractions(userId),

      // Note: Other data sources can be added as queries become available
      data_sources: {
        note: 'Additional data may be available. Contact privacy@vummo.com for complete records.',
        available_on_request: [
          'Newsletter subscriptions',
          'Alpha access requests',
          'Feature requests',
          'Feedback submissions',
        ],
      },

      // Privacy Rights
      rights: {
        access: 'You have the right to access your personal data (exercised via this export)',
        rectification: 'You have the right to correct inaccurate data. Contact privacy@vummo.com',
        erasure: 'You have the right to request deletion of your data. Contact privacy@vummo.com',
        portability: 'You have the right to receive your data in a portable format (this JSON export)',
        restriction: 'You have the right to restrict processing. Contact privacy@vummo.com',
        objection: 'You have the right to object to processing. Contact privacy@vummo.com',
        withdraw_consent: 'You can withdraw consent at any time via /cookies preferences page',
      },

      // Contact Information
      data_controller: {
        organization: 'Vummo Labs',
        email: 'privacy@vummo.com',
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
      { error: 'Failed to export data. Please try again or contact privacy@vummo.com' },
      { status: 500 }
    )
  }
}

/**
 * Get consent history from Convex
 */
async function getConsentHistory(userId: string) {
  try {
    // Query Convex for consent records
    // Note: You'll need to create a Convex query for this
    // For now, return placeholder
    return {
      note: 'Consent preferences are stored in your browser localStorage',
      current_preference_check: 'Visit /cookies to view current consent status',
    }
  } catch (error) {
    return { error: 'Unable to fetch consent history' }
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

