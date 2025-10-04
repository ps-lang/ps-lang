import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { role, feedbackType, feedback, rating, emailUpdates, version } = await request.json();

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feedback text is required' },
        { status: 400 }
      );
    }

    // Get user info from Clerk if authenticated
    const { userId } = await auth();

    // Save to Convex database
    await convex.mutation(api.feedback.submitFeedback, {
      userId: userId || undefined,
      email: emailUpdates ? undefined : undefined, // Email not collected in this form
      role,
      feedbackType,
      feedback,
      rating,
      emailUpdates,
      version,
    });

    // Send email to hello@vummo.com (keep existing email notification)
    await resend.emails.send({
      from: 'PS-LANG Feedback <noreply@ps-lang.dev>',
      to: 'hello@vummo.com',
      subject: `PS-LANG ${version} Feedback: ${feedbackType}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Version:</strong> ${version}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Type:</strong> ${feedbackType}</p>
        <p><strong>Rating:</strong> ${rating}/10</p>
        <p><strong>Wants Email Updates:</strong> ${emailUpdates ? 'Yes' : 'No'}</p>
        ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ''}
        <h3>Feedback:</h3>
        <p>${feedback.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Submitted: ${new Date().toISOString()}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Feedback submitted successfully!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    );
  }
}
