'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { getUserRole, getRoleDisplayName } from '@/lib/roles'

export default function UnauthorizedPage() {
  const { user } = useUser()
  const userRole = getUserRole(user)

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="paper-card p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="font-editorial text-3xl font-bold text-ink mb-4">
            Access Denied
          </h1>
          <p className="font-typewriter text-ink-light mb-2">
            Your current role: <span className="font-bold">{getRoleDisplayName(userRole)}</span>
          </p>
          <p className="font-typewriter text-sm text-ink-light mb-6">
            You don't have permission to access this page.
          </p>

          <div className="space-y-4">
            <div className="bg-stone-100 border border-stone-200 rounded-lg p-4 text-left">
              <h2 className="font-typewriter font-bold text-ink text-sm mb-2">Access Levels:</h2>
              <ul className="font-typewriter text-xs text-ink-light space-y-1">
                <li>• <span className="font-semibold">Alpha Tester</span> → Playground access</li>
                <li>• <span className="font-semibold">Reviewer</span> → Journal + Playground</li>
                <li>• <span className="font-semibold">Admin</span> → Full access</li>
              </ul>
            </div>

            <Link
              href="/"
              className="block w-full px-6 py-3 bg-stone-900 text-white font-typewriter text-sm rounded-lg hover:bg-stone-800 transition-colors"
            >
              Return Home
            </Link>

            <p className="font-typewriter text-xs text-ink-light">
              Need access? Contact the project admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
