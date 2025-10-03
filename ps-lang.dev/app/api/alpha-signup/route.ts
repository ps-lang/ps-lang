import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(request: Request) {
  const { email, name } = await request.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'Valid email is required' },
      { status: 400 }
    )
  }

  // Extract domain for segmentation
  const emailDomain = email.split('@')[1]
  const timestamp = new Date().toISOString()

  // AI Metadata for alpha testers
  const aiMetadata = {
    signup_source: 'alpha_waitlist',
    email_domain: emailDomain,
    timestamp: timestamp,
    project: 'ps-lang',
    version: 'v0.1.0-alpha.1',
    user_segment: emailDomain.includes('gmail.com') || emailDomain.includes('yahoo.com') ? 'consumer' : 'business',
    intent: 'alpha_tester'
  }

  try {
    // Add contact to Resend audience
    await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      firstName: name || 'Alpha',
      lastName: 'Tester',
      unsubscribed: false,
    })

    // Log AI metadata
    console.log('Alpha signup with AI metadata:', {
      email: email.replace(/(?<=.{2}).(?=.*@)/g, '*'),
      ...aiMetadata
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined alpha waitlist!',
        metadata: aiMetadata
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Alpha signup error:', error)

    // Handle duplicate email
    if (error?.message?.includes('already exists') || error?.message?.includes('Contact already exists')) {
      try {
        await resend.contacts.update({
          email: email,
          audienceId: process.env.RESEND_AUDIENCE_ID!,
          firstName: name || undefined,
        })

        return NextResponse.json(
          {
            success: true,
            message: 'You\'re already on the waitlist!',
            metadata: aiMetadata
          },
          { status: 200 }
        )
      } catch (updateError) {
        return NextResponse.json(
          { error: 'This email is already on the waitlist!' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    )
  }
}
