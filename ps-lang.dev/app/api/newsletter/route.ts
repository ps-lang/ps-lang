import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { email, interests } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Add contact to Resend audience with interests
    const response = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      firstName: interests?.join(', ') || 'PS-LANG Subscriber', // Store interests in firstName field temporarily
    });

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to PS-LANG updates!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Newsletter signup error:', error);

    // Handle duplicate email gracefully
    if (error?.message?.includes('already exists')) {
      return NextResponse.json(
        { error: 'This email is already subscribed!' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}