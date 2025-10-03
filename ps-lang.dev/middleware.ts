import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { canAccessRoute, getUserRole } from './lib/roles'

// Define which routes are public (don't require authentication)
const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/newsletter(.*)',
  '/api/feedback(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/playground(.*)',
  '/journal(.*)',
])

// Routes that require role-based access
const isJournalRoute = createRouteMatcher(['/journal(.*)'])
const isPlaygroundRoute = createRouteMatcher(['/playground(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth()
  const pathname = request.nextUrl.pathname

  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Require authentication for all protected routes
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Only check role-based access for admin routes
  // Journal and Playground are now public (in alpha)
  if (isAdminRoute(request)) {
    const userWithEmail = {
      ...sessionClaims,
      email: (sessionClaims as any)?.email || (sessionClaims as any)?.email_addresses?.[0]?.email_address,
      publicMetadata: (sessionClaims as any)?.publicMetadata
    }
    const userRole = getUserRole(userWithEmail)

    if (!canAccessRoute(userRole, pathname)) {
      // Redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
