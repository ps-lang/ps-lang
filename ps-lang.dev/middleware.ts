import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { canAccessRoute, getUserRole } from './lib/roles'
import { getConsentFromCookie } from './lib/consent'

// Define which routes are public (don't require authentication)
const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/newsletter(.*)',
  '/api/feedback(.*)',
  '/api/seed-papers(.*)',
  '/api/update-paper-date(.*)',
  '/api/refresh-paper(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/playground(.*)',
  '/ps-journaling(.*)',
  '/journal-plus(.*)',
  '/research-papers(.*)',
  '/blog(.*)',
  '/docs(.*)',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-48x48.png',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/og-image.png',
  '/ps-lang-logomark.png',
  '/ps-lang-logomark-black.png',
])

// Routes that require role-based access
const isJournalAdminRoute = createRouteMatcher(['/journal/admin(.*)'])
const isJournalRoute = createRouteMatcher(['/ps-journaling(.*)'])
const isPlaygroundRoute = createRouteMatcher(['/playground(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth()
  const pathname = request.nextUrl.pathname

  // Check cookie consent status (server-side)
  const cookieHeader = request.headers.get('cookie')
  const hasConsent = getConsentFromCookie(cookieHeader || '')

  // Read theme from cookie (if consent granted)
  let theme = 'default'
  if (hasConsent && cookieHeader) {
    const themeCookie = cookieHeader.split('; ').find(c => c.startsWith('ps-lang-theme='))
    if (themeCookie) {
      const themeValue = themeCookie.split('=')[1]
      if (themeValue === 'fermi' || themeValue === 'default') {
        theme = themeValue
      }
    }
  }

  // Default to fermi for ps-journaling page (only if no saved theme)
  if (pathname.startsWith('/ps-journaling') && theme === 'default' && !cookieHeader?.includes('ps-lang-theme=')) {
    theme = 'fermi'
  }

  // Add headers for downstream use
  const response = NextResponse.next()
  response.headers.set('x-consent-status', hasConsent ? 'granted' : 'denied')
  response.headers.set('x-theme', theme)

  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return response
  }

  // Require authentication for all protected routes
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', pathname)
    const redirectResponse = NextResponse.redirect(signInUrl)
    redirectResponse.headers.set('x-consent-status', hasConsent ? 'granted' : 'denied')
    return redirectResponse
  }

  // Only check role-based access for admin routes
  // Journal and Playground are now public (in alpha)
  if (isAdminRoute(request)) {
    // Extract email from sessionClaims
    const email = (sessionClaims as any)?.email ||
                  (sessionClaims as any)?.primaryEmailAddress?.emailAddress ||
                  (sessionClaims as any)?.email_addresses?.[0]?.email_address

    const userWithEmail = {
      primaryEmailAddress: {
        emailAddress: email
      },
      publicMetadata: (sessionClaims as any)?.publicMetadata || {}
    }
    const userRole = getUserRole(userWithEmail)

    console.log('🔍 Admin Route Access Check:', {
      pathname,
      userRole,
      email: userWithEmail.primaryEmailAddress?.emailAddress,
      sessionEmail: email,
      canAccess: canAccessRoute(userRole, pathname)
    })

    if (!canAccessRoute(userRole, pathname)) {
      // Redirect to unauthorized page
      const unauthorizedResponse = NextResponse.redirect(new URL('/unauthorized', request.url))
      unauthorizedResponse.headers.set('x-consent-status', hasConsent ? 'granted' : 'denied')
      return unauthorizedResponse
    }
  }

  response.headers.set('x-consent-status', hasConsent ? 'granted' : 'denied')
  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
