import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Track deletion in PostHog before deleting
    // (In production, you'd want to anonymize/delete PostHog data too)

    // Delete user from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return NextResponse.json({ success: true, message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
