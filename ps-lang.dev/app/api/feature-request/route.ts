import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(request: Request) {
  const { email, name, featureType, title, description } = await request.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'Valid email is required' },
      { status: 400 }
    )
  }

  if (!title || !description) {
    return NextResponse.json(
      { error: 'Title and description are required' },
      { status: 400 }
    )
  }

  const timestamp = new Date().toISOString()

  // Send notification email to admin
  try {
    await resend.emails.send({
      from: 'PS-LANG <noreply@ps-lang.dev>',
      to: process.env.ADMIN_EMAIL || 'hello@vummo.com',
      subject: `Feature Request: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #292524;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                border-bottom: 1px solid #e7e5e4;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .label {
                font-size: 10px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #a8a29e;
                margin-bottom: 10px;
              }
              .title {
                font-size: 24px;
                font-weight: 300;
                margin: 0;
              }
              .field {
                margin: 20px 0;
              }
              .field-label {
                font-size: 12px;
                font-weight: 600;
                color: #78716c;
                margin-bottom: 5px;
              }
              .field-value {
                color: #292524;
              }
              .description {
                background: #f5f5f4;
                padding: 15px;
                border-left: 3px solid #292524;
                margin: 20px 0;
              }
              .footer {
                border-top: 1px solid #e7e5e4;
                padding-top: 20px;
                margin-top: 40px;
                font-size: 12px;
                color: #78716c;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="label">Feature Request</div>
              <h1 class="title">${title}</h1>
            </div>

            <div class="field">
              <div class="field-label">From:</div>
              <div class="field-value">${name} (${email})</div>
            </div>

            <div class="field">
              <div class="field-label">Request Type:</div>
              <div class="field-value">${featureType}</div>
            </div>

            <div class="field">
              <div class="field-label">Submitted:</div>
              <div class="field-value">${new Date(timestamp).toLocaleString()}</div>
            </div>

            <div class="description">
              <div class="field-label">Description:</div>
              <div class="field-value">${description.replace(/\n/g, '<br>')}</div>
            </div>

            <div class="footer">
              <p>PS-LANG Feature Request System<br>
              This email was sent from the PS-LANG playground.</p>
            </div>
          </body>
        </html>
      `,
    })

    // Log to console for tracking
    console.log('Feature request submitted:', {
      email: email.replace(/(?<=.{2}).(?=.*@)/g, '*'),
      name,
      featureType,
      title,
      timestamp
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Feature request submitted successfully!',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Feature request error:', error)

    return NextResponse.json(
      { error: 'Failed to submit feature request. Please try again.' },
      { status: 500 }
    )
  }
}
