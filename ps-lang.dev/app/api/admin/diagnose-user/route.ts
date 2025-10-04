import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = request.nextUrl.searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
    }

    // Check Clerk
    const client = await clerkClient()
    const clerkUsers = await client.users.getUserList({
      emailAddress: [email]
    })

    // Check Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    const alphaSignups = await convex.query(api.alphaSignups.getAllSignups)
    const convexSignup = alphaSignups?.find((signup: any) => signup.email === email)

    return NextResponse.json({
      email,
      clerk: {
        found: clerkUsers.data.length > 0,
        userId: clerkUsers.data[0]?.id,
        emailVerified: clerkUsers.data[0]?.emailAddresses[0]?.verification?.status,
        createdAt: clerkUsers.data[0]?.createdAt,
      },
      convex: {
        found: !!convexSignup,
        clerkUserId: convexSignup?.clerkUserId,
        signupDate: convexSignup?.signupDate,
      },
      needsLink: clerkUsers.data.length > 0 && convexSignup && !convexSignup.clerkUserId
    })
  } catch (error: any) {
    console.error('Diagnosis error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
