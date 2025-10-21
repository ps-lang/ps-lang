import type { Metadata } from 'next'
import CookiePreferences from '@/components/cookie-preferences'

export const metadata: Metadata = {
  title: 'Cookie Policy | PS-LANG Minimal Cookie Usage',
  description: 'PS-LANG cookie policy. We use minimal cookies for essential functionality and theme preferences. No tracking or third-party cookies.',
  keywords: 'cookie policy, privacy cookies, minimal cookies',
  alternates: {
    canonical: 'https://ps-lang.dev/cookies',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <CookiePreferences />
    </div>
  )
}
