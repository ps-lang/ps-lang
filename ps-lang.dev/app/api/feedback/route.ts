import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const { role, feedbackType, feedback, rating, emailUpdates, version } = await request.json();

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feedback text is required' },
        { status: 400 }
      );
    }

    // Send email to hello@vummo.com
    await resend.emails.send({
      from: 'PS-LANG Feedback <noreply@ps-lang.dev>',
      to: 'hello@vummo.com',
      subject: `PS-LANG ${version} Feedback: ${feedbackType}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Version:</strong> ${version}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Type:</strong> ${feedbackType}</p>
        <p><strong>Rating:</strong> ${rating}/5</p>
        <p><strong>Wants Email Updates:</strong> ${emailUpdates ? 'Yes' : 'No'}</p>
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
