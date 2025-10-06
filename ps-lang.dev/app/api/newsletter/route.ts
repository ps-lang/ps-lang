import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  // Parse request body outside try block so variables are in scope for catch
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

  // Agentic AI Metadata for analytics, personalization, and data streams
  const agenticMetadata = {
    // Component identity
    component: 'newsletter-signup',
    component_version: 'v1.0.0',
    interaction_type: 'form_submission',

    // User context
    signup_source: source || 'newsletter_modal',
    interests: interests || [],
    interest_count: interests?.length || 0,
    has_name: !!(firstName || lastName),

    // Segmentation
    email_domain: emailDomain,
    user_segment: emailDomain.includes('gmail.com') || emailDomain.includes('yahoo.com') ? 'consumer' : 'business',
    intent_level: interests?.length > 0 ? 'high_intent' : 'general_interest',

    // Agentic UX metadata
    ui_variant: 'contextual_interests',
    timestamp: timestamp,

    // AI workflow tracking
    workflow_stage: 'lead_capture',
    conversion_funnel: 'newsletter_signup',
    data_stream: 'agentic_ux_v1',

    // Platform metadata
    project: 'ps-lang',
    platform_version: 'v0.1.0-alpha.1',

    // Server-side tracking
    server_timestamp: new Date().toISOString(),
    api_endpoint: '/api/newsletter'
  };

  try {
    // Save to Convex database (upsert logic built-in)
    await convex.mutation(api.newsletter.subscribe, {
      email,
      firstName,
      lastName,
      interests: interests || [],
      source: source || 'newsletter_modal',
    });

    // Add contact to Resend audience
    const response = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      firstName: firstName || 'PS-LANG',
      lastName: lastName || 'Subscriber',
      unsubscribed: false,
    });

    // Log agentic metadata for data stream analysis
    console.log('Newsletter signup with agentic metadata:', {
      email: email.replace(/(?<=.{2}).(?=.*@)/g, '*'), // Partial redaction for logs
      ...agenticMetadata
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to PS-LANG updates!',
        metadata: agenticMetadata
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
            metadata: agenticMetadata
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