import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

/**
 * Right to be Forgotten - Delete User Data
 * GDPR Article 17 - Right to Erasure
 * CCPA Section 1798.105 - Right to Deletion
 * PIPEDA Principle 4.5 - Limiting Use, Disclosure, and Retention
 *
 * POST /api/privacy/delete-data
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to delete your data.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { confirmEmail, deleteType = 'all' } = body

    // Validate confirmation (require user to enter their email)
    if (!confirmEmail) {
      return NextResponse.json(
        { error: 'Email confirmation required for data deletion' },
        { status: 400 }
      )
    }

    // Log deletion request
    console.log(`🗑️ Data deletion request received for user ${userId}`, {
      deleteType,
      timestamp: new Date().toISOString(),
    })

    const deletionResults = {
      userId,
      timestamp: new Date().toISOString(),
      deleteType,
      deleted: [] as string[],
      errors: [] as { table: string; error: string }[],
    }

    try {
      // Delete cookie consent history
      const consentResult = await convex.mutation(api.cookieConsent.deleteUserConsentData, {
        userId,
      })
      deletionResults.deleted.push(`Cookie Consent History (${consentResult.deletedRecords} records)`)
    } catch (error) {
      deletionResults.errors.push({ table: 'cookieConsentHistory', error: String(error) })
    }

    if (deleteType === 'all' || deleteType === 'feedback') {
      try {
        // Delete feedback submissions
        const feedbackResult = await convex.mutation(api.feedback.deleteUserFeedback, {
          userId,
        })
        deletionResults.deleted.push(`Feedback Submissions (${feedbackResult.deletedRecords} records)`)
      } catch (error) {
        deletionResults.errors.push({ table: 'feedback', error: String(error) })
      }
    }

    if (deleteType === 'all' || deleteType === 'interactions') {
      try {
        // Delete user interactions
        const interactionsResult = await convex.mutation(api.userInteractions.deleteUserInteractions, {
          userId,
        })
        deletionResults.deleted.push(`User Interactions (${interactionsResult.deletedRecords} records)`)
      } catch (error) {
        deletionResults.errors.push({ table: 'userInteractions', error: String(error) })
      }
    }

    if (deleteType === 'all' || deleteType === 'journal') {
      try {
        // Delete journal entries
        const journalResult = await convex.mutation(api.journalEntries.deleteUserJournalEntries, {
          userId,
        })
        deletionResults.deleted.push(`Journal Entries (${journalResult.deletedRecords} records)`)
      } catch (error) {
        deletionResults.errors.push({ table: 'journalEntries', error: String(error) })
      }

      try {
        // Delete PSL files
        const pslResult = await convex.mutation(api.pslFiles.deleteUserPSLFiles, {
          userId,
        })
        deletionResults.deleted.push(`PSL Files (${pslResult.deletedRecords} records)`)
      } catch (error) {
        deletionResults.errors.push({ table: 'pslFiles', error: String(error) })
      }
    }

    if (deleteType === 'all' || deleteType === 'conversations') {
      try {
        // Delete synced conversations
        const conversationsResult = await convex.mutation(api.syncedConversations.deleteUserConversations, {
          userId,
        })
        deletionResults.deleted.push(`Synced Conversations (${conversationsResult.deletedRecords} records)`)
      } catch (error) {
        deletionResults.errors.push({ table: 'syncedConversations', error: String(error) })
      }
    }

    if (deleteType === 'all' || deleteType === 'requests') {
      try {
        // Delete alpha access requests
        const alphaResult = await convex.mutation(api.alphaRequests.deleteUserAlphaRequests, {
          userId,
        })
        deletionResults.deleted.push(`Alpha Access Requests (${alphaResult.deletedRecords} records)`)
      } catch (error) {
        deletionResults.errors.push({ table: 'alphaRequests', error: String(error) })
      }

      try {
        // Delete feature requests
        const featureResult = await convex.mutation(api.featureRequests.deleteUserFeatureRequests, {
          userId,
        })
        deletionResults.deleted.push(`Feature Requests (${featureResult.deletedRecords} records)`)
      } catch (error) {
        deletionResults.errors.push({ table: 'featureRequests', error: String(error) })
      }
    }

    // Clear localStorage (client-side will handle this)
    // Clear cookies (client-side will handle this)

    // Return summary
    return NextResponse.json({
      success: true,
      message: `Successfully deleted user data for ${userId}`,
      details: deletionResults,
      next_steps: deleteType === 'all' ? [
        'Your data has been deleted from our systems.',
        'If you wish to delete your account entirely, please email privacy@ps-lang.dev',
        'Note: Some anonymized analytics data may be retained for legal/compliance purposes.',
      ] : [
        'Selected data categories have been deleted.',
        'To delete all data, choose "Delete All Data" option.',
      ],
    })
  } catch (error) {
    console.error('Data deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete data. Please contact privacy@ps-lang.dev', details: String(error) },
      { status: 500 }
    )
  }
}
