import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserRole } from '@/lib/roles'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user to check their role
    const client = await clerkClient()
    const currentUser = await client.users.getUser(userId)
    const requesterRole = getUserRole(currentUser)

    if (requesterRole !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
    }

    // Get all users from Clerk
    const { data: users } = await client.users.getUserList({
      limit: 100,
      orderBy: '-created_at'
    })

    // Map users to a simpler format with roles
    const usersWithRoles = users.map(user => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      role: getUserRole(user),
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
    }))

    return NextResponse.json({ users: usersWithRoles })
  } catch (error) {
    console.error('Error listing users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
