'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { getUserRole, getRoleDisplayName } from '@/lib/roles'

export default function UnauthorizedPage() {
  const { user } = useUser()
  const userRole = getUserRole(user)

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center border-2 border-stone-900 bg-stone-50">
            <svg className="w-10 h-10 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4 tracking-tight">
            Access Denied
          </h1>
          <div className="space-y-2 text-sm text-stone-600">
            <p>
              Your current role: <span className="font-medium text-stone-900">{getRoleDisplayName(userRole)}</span>
            </p>
            <p className="text-stone-500">
              You don't have permission to access this page.
            </p>
          </div>
        </div>

        {/* Access Levels Card */}
        <div className="border border-stone-200 bg-white p-6 mb-6">
          <h2 className="text-xs tracking-[0.15em] text-stone-400 uppercase font-medium mb-4">
            Access Levels
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-stone-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-stone-900">Alpha Tester</span>
                <span className="text-stone-600"> · Playground access</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-stone-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-stone-900">Reviewer</span>
                <span className="text-stone-600"> · Journal + Playground</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-stone-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-stone-900">Admin</span>
                <span className="text-stone-600"> · Full access</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-stone-400 mt-0.5">→</span>
              <div>
                <span className="font-medium text-stone-900">Designer</span>
                <span className="text-stone-600"> · Theme customization</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-stone-900 text-white text-sm text-center tracking-wide hover:bg-stone-800 transition-colors"
          >
            Return Home
          </Link>

          <p className="text-xs text-stone-500 text-center">
            Need access? Contact the project admin.
          </p>
        </div>
      </div>
    </div>
  )
}
