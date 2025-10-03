import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserRole } from '@/lib/roles'

export async function POST(request: NextRequest) {
  try {
    // Verify the requester is a super admin
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requesterRole = getUserRole(sessionClaims)
    if (requesterRole !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
    }

    // Parse request body
    const { userId: targetUserId, role } = await request.json()

    if (!targetUserId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 })
    }

    // Prevent users from changing their own role
    if (targetUserId === userId) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }

    // Update user metadata in Clerk
    const client = await clerkClient()
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: role,
      },
    })

    return NextResponse.json({ success: true, role })
  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
