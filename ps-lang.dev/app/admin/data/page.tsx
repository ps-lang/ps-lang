"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { getUserRole } from "@/lib/roles"
import Link from "next/link"
import { useState } from "react"

export default function AdminDataPage() {
  const { user } = useUser()
  const userRole = getUserRole(user)
  const [activeTab, setActiveTab] = useState<'feedback' | 'newsletter' | 'alpha'>('feedback')

  // Queries
  const feedback = useQuery(api.feedback.getAllFeedback)
  const newsletter = useQuery(api.newsletter.getAllSubscribers)
  const alphaSignups = useQuery(api.alphaSignups.getAllSignups)

  // Only super_admin and admin can access
  if (userRole !== 'super_admin' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-stone-900 mb-4">Access Denied</h1>
          <p className="text-stone-600 mb-6">You don't have permission to view this page.</p>
          <Link href="/" className="text-stone-900 underline hover:text-stone-600">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-light text-stone-900 mb-2">Admin Data Dashboard</h1>
              <p className="text-sm text-stone-600">View all Convex database records</p>
            </div>
            <Link
              href="/admin/roles"
              className="text-sm text-stone-600 hover:text-stone-900 underline"
            >
              Manage Roles
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'feedback'
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Feedback ({feedback?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'newsletter'
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Newsletter ({newsletter?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('alpha')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'alpha'
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Alpha Signups ({alphaSignups?.length || 0})
            </button>
          </div>
        </div>

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {feedback?.length === 0 && (
              <p className="text-stone-500 text-center py-8">No feedback submissions yet.</p>
            )}
            {feedback?.map((item) => (
              <div key={item._id} className="border border-stone-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium uppercase tracking-wider">
                      {item.feedbackType}
                    </span>
                    <span className="ml-2 text-xs text-stone-500">
                      {item.version}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-stone-900">
                      Rating: {item.rating}/10
                    </div>
                    <div className="text-xs text-stone-500">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-stone-600">{item.feedback}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  <span>Role: {item.role}</span>
                  {item.userId && <span>User ID: {item.userId.slice(0, 8)}...</span>}
                  {item.emailUpdates && <span className="text-green-600">✓ Wants updates</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="space-y-4">
            {newsletter?.length === 0 && (
              <p className="text-stone-500 text-center py-8">No newsletter subscribers yet.</p>
            )}
            {newsletter?.map((item) => (
              <div key={item._id} className="border border-stone-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="font-medium text-stone-900">
                        {item.firstName} {item.lastName}
                      </span>
                      <span className="ml-3 text-sm text-stone-600">{item.email}</span>
                    </div>
                    {item.interests.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {item.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-1 bg-stone-100 text-stone-700 text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-stone-500">
                      Source: {item.source} • Domain: {item.emailDomain}
                    </div>
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    {new Date(item.subscribedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alpha Signups Tab */}
        {activeTab === 'alpha' && (
          <div className="space-y-4">
            {alphaSignups?.length === 0 && (
              <p className="text-stone-500 text-center py-8">No alpha signups yet.</p>
            )}
            {alphaSignups?.map((item) => (
              <div key={item._id} className="border border-stone-200 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="mb-2">
                      <span className="font-medium text-stone-900">{item.email}</span>
                    </div>
                    <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium uppercase tracking-wider">
                      {item.persona.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    {new Date(item.signupDate).toLocaleDateString()}
                  </div>
                </div>
                {item.interestedIn.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-stone-500 mb-2">Interested In:</p>
                    <div className="flex gap-2">
                      {item.interestedIn.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-stone-100 text-stone-700 text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-stone-500">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-stone-900"
                    >
                      GitHub Profile
                    </a>
                  )}
                  {item.clerkUserId && <span>Clerk ID: {item.clerkUserId.slice(0, 8)}...</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
