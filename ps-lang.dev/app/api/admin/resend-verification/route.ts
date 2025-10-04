import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserRole } from '@/lib/roles'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify super admin
    const client = await clerkClient()
    const currentUser = await client.users.getUser(userId)
    const requesterRole = getUserRole(currentUser)

    if (requesterRole !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
    }

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Check if user exists in Clerk
    const clerkUsers = await client.users.getUserList({
      emailAddress: [email]
    })

    if (clerkUsers.data.length === 0) {
      return NextResponse.json({
        error: 'User not found in Clerk. They need to complete the signup form again.',
        action: 'restart_signup'
      }, { status: 404 })
    }

    const user = clerkUsers.data[0]

    // Check if already verified
    const emailAddress = user.emailAddresses.find(e => e.emailAddress === email)
    if (emailAddress?.verification?.status === 'verified') {
      return NextResponse.json({
        message: 'Email already verified',
        userId: user.id,
        verified: true
      })
    }

    return NextResponse.json({
      message: 'User exists but not verified. They should check their email for the original verification code.',
      userId: user.id,
      verified: false
    })

  } catch (error: any) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
