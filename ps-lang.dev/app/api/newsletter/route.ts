import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, interests, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Extract domain for segmentation
    const emailDomain = email.split('@')[1];
    const timestamp = new Date().toISOString();

    // AI Metadata for analytics and personalization
    const aiMetadata = {
      signup_source: source || 'newsletter_modal',
      interests: interests || [],
      email_domain: emailDomain,
      timestamp: timestamp,
      project: 'ps-lang',
      version: 'v0.1.0-alpha.1',
      user_segment: emailDomain.includes('gmail.com') || emailDomain.includes('yahoo.com') ? 'consumer' : 'business',
      intent: interests?.length > 0 ? 'high_intent' : 'general_interest'
    };

    // Add contact to Resend audience
    const response = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      firstName: firstName || 'PS-LANG',
      lastName: lastName || 'Subscriber',
      unsubscribed: false,
    });

    // Log AI metadata for future use (can be sent to PostHog, stored in DB, etc.)
    console.log('Newsletter signup with AI metadata:', {
      email: email.replace(/(?<=.{2}).(?=.*@)/g, '*'), // Partial redaction for logs
      ...aiMetadata
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to PS-LANG updates!',
        metadata: aiMetadata
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Newsletter signup error:', error);

    // Handle duplicate email - update existing contact
    if (error?.message?.includes('already exists') || error?.message?.includes('Contact already exists')) {
      try {
        // Contact exists - update it with new data
        const updateResponse = await resend.contacts.update({
          email: email,
          audienceId: process.env.RESEND_AUDIENCE_ID!,
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        });

        console.log('Updated existing contact with new data:', {
          email: email.replace(/(?<=.{2}).(?=.*@)/g, '*'),
          updated: true
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Successfully updated your subscription!',
            metadata: aiMetadata
          },
          { status: 200 }
        );
      } catch (updateError) {
        console.error('Failed to update contact:', updateError);
        return NextResponse.json(
          { error: 'This email is already subscribed!' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}