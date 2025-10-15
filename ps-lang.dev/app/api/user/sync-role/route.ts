import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Sync role from environment variable to Clerk metadata
 * This endpoint is called automatically when a user loads a page
 * to ensure their Clerk metadata is in sync with SUPER_ADMIN_EMAILS
 */
export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from Clerk
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress

    if (!userEmail) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    // Check if user is in SUPER_ADMIN_EMAILS env var
    const SUPER_ADMIN_EMAILS = process.env.SUPER_ADMIN_EMAILS
      ? process.env.SUPER_ADMIN_EMAILS.split(',').map(email => email.trim())
      : []

    const isSuperAdminByEnv = SUPER_ADMIN_EMAILS.includes(userEmail)
    const currentRole = (user.publicMetadata?.role as string) || 'user'

    // If user is super admin by env var but metadata doesn't reflect it, sync it
    if (isSuperAdminByEnv && currentRole !== 'super_admin') {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          role: 'super_admin',
        },
      })

      return NextResponse.json({
        synced: true,
        role: 'super_admin',
        message: 'Role synced from environment variable to Clerk metadata'
      })
    }

    // If user was removed from env var but still has super_admin in metadata, keep it
    // (we don't automatically downgrade - admin must do this manually via Clerk dashboard)

    return NextResponse.json({
      synced: false,
      role: currentRole,
      message: 'No sync needed'
    })
  } catch (error) {
    console.error('Error syncing role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
