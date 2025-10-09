import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

/**
 * Save cookie consent to Convex audit trail
 * POST /api/consent/save
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      userId,
      sessionId,
      action,
      status,
      granular,
      gpcDetected,
      userAgent,
      referrer,
    } = body

    // Validate required fields
    if (!sessionId || !action || !status || !granular) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get IP address from request (for audit trail)
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'

    // Save to Convex
    const result = await convex.mutation(api.cookieConsent.saveConsentHistory, {
      userId,
      sessionId,
      action,
      status,
      granular,
      gpcDetected: gpcDetected ?? false,
      ipAddress,
      userAgent,
      referrer,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error saving consent:', error)
    return NextResponse.json(
      { error: 'Failed to save consent', details: String(error) },
      { status: 500 }
    )
  }
}
