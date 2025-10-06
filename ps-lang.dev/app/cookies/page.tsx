import type { Metadata } from 'next'
import CookiePreferences from '@/components/cookie-preferences'

export const metadata: Metadata = {
  title: 'Cookie Preferences - PS-LANG',
  description: 'Manage your cookie preferences and data privacy settings for PS-LANG.',
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
