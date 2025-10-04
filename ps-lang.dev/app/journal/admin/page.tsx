"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { getUserRole } from "@/lib/roles"
import Link from "next/link"
import { useState, useEffect } from "react"
import UserManagement from "@/components/user-management"
import { useMutation } from "convex/react"

// Need to declare this at module level to use in handleLinkUser (legacy support)
let recordAlphaSignupMutation: any

export default function PSLangJournalDashboard() {
  const { user, isLoaded } = useUser()
  const userRole = user ? getUserRole(user) : 'user'
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'users' | 'settings'>(() => {
    // Load saved tab from localStorage or default to 'overview'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ps-lang-journal-tab')
      return (saved as 'overview' | 'data' | 'users' | 'settings') || 'overview'
    }
    return 'overview'
  })

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ps-lang-journal-tab', activeTab)
  }, [activeTab])

  // Queries (only for super_admin and admin)
  // Skip queries if user hasn't loaded yet
  const shouldFetchData = isLoaded && user && (userRole === 'super_admin' || userRole === 'admin')
  const feedback = useQuery(api.feedback.getAllFeedback, shouldFetchData ? {} : "skip")
  const newsletter = useQuery(api.newsletter.getAllSubscribers, shouldFetchData ? {} : "skip")
  const alphaSignups = useQuery(api.alphaSignups.getAllSignups, shouldFetchData ? {} : "skip") // Legacy
  const alphaRequests = useQuery(api.alphaRequests.getAllRequests, shouldFetchData ? {} : "skip") // New system
  const deleteSignup = useMutation(api.alphaSignups.deleteSignup)
  const recordAlphaSignup = useMutation(api.alphaSignups.recordSignup)
  const approveAlphaRequest = useMutation(api.alphaRequests.approveRequest)
  const rejectAlphaRequest = useMutation(api.alphaRequests.rejectRequest)

  // Store mutation in module variable for use in async functions
  recordAlphaSignupMutation = recordAlphaSignup

  const handleApproveRequest = async (clerkUserId: string, email: string) => {
    if (!confirm(`Approve alpha access for ${email}? This will update their role to alpha_tester.`)) {
      return
    }

    try {
      // First approve in Convex
      await approveAlphaRequest({ clerkUserId })

      // Then update Clerk role
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: clerkUserId, role: 'alpha_tester' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update role')
      }

      alert(`${email} has been approved as an Alpha Tester!`)
      window.location.reload()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleRejectRequest = async (clerkUserId: string, email: string) => {
    const reason = prompt(`Reject ${email}'s request?\nOptional reason (will be shown to user):`)

    if (reason === null) return // User cancelled

    try {
      await rejectAlphaRequest({ clerkUserId, reason: reason || undefined })
      alert(`Request from ${email} has been rejected.`)
      window.location.reload()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleDeleteAndRestart = async (email: string) => {
    if (!confirm(`Delete incomplete signup for ${email}? They can sign up again with a fresh form.`)) {
      return
    }

    try {
      await deleteSignup({ email })
      alert(`Deleted ${email}. They can now sign up again.`)
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  const handleLinkUser = async (email: string) => {
    try {
      // Get user from Clerk
      const diagResponse = await fetch(`/api/admin/diagnose-user?email=${email}`)
      const diagnosis = await diagResponse.json()

      if (!diagnosis.clerk.found) {
        alert('User not found in Clerk. They need to complete signup.')
        return
      }

      if (!diagnosis.clerk.userId) {
        alert('No Clerk User ID found.')
        return
      }

      // Update Convex with clerkUserId
      await recordAlphaSignup({
        email,
        persona: 'solo_developer', // Default, will be overwritten if already exists
        githubUrl: undefined,
        interestedIn: [],
        clerkUserId: diagnosis.clerk.userId,
      })

      alert(`Linked ${email} to Clerk user!`)
      window.location.reload()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-sm text-stone-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light text-stone-900 mb-2">PS-LANG Journal Dashboard</h1>
              <p className="text-sm text-stone-600">
                Role: <span className="font-medium capitalize">{userRole.replace('_', ' ')}</span>
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-stone-600 hover:text-stone-900 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Overview
            </button>
            {(userRole === 'super_admin' || userRole === 'admin') && (
              <button
                onClick={() => setActiveTab('data')}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'data'
                    ? 'text-stone-900 border-b-2 border-stone-900'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Data ({(feedback?.length || 0) + (newsletter?.length || 0) + (alphaRequests?.length || 0)})
              </button>
            )}
            {userRole === 'super_admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'text-stone-900 border-b-2 border-stone-900'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Users
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-stone-900 border-b-2 border-stone-900'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="border border-stone-200 bg-white p-8">
              <h2 className="text-xl font-light text-stone-900 mb-4">Welcome to PS-LANG Journal</h2>
              <p className="text-stone-600 mb-6">
                Track your AI workflows, benchmark improvements, and maintain secure audit trails.
              </p>

              {/* Stats Cards - Only show for admin/super_admin */}
              {(userRole === 'super_admin' || userRole === 'admin') && (
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="border border-stone-200 p-6">
                    <div className="text-3xl font-light text-stone-900 mb-2">{feedback?.length || 0}</div>
                    <div className="text-sm text-stone-600">Feedback Submissions</div>
                  </div>
                  <div className="border border-stone-200 p-6">
                    <div className="text-3xl font-light text-stone-900 mb-2">{newsletter?.length || 0}</div>
                    <div className="text-sm text-stone-600">Newsletter Subscribers</div>
                  </div>
                  <div className="border border-stone-200 p-6">
                    <div className="text-3xl font-light text-stone-900 mb-2">{alphaRequests?.length || 0}</div>
                    <div className="text-sm text-stone-600">Alpha Requests</div>
                  </div>
                </div>
              )}

              {/* User-specific features */}
              {(userRole === 'user' || userRole === 'alpha_tester') && (
                <div className="mt-6 p-6 bg-stone-100">
                  <p className="text-sm text-stone-700">
                    Your journal entries and workflow tracking will appear here once you start using PS-LANG Journal.
                  </p>
                </div>
              )}
            </div>

            {/* Role-specific access info */}
            <div className="border border-stone-200 bg-white p-6">
              <h3 className="text-lg font-light text-stone-900 mb-4">Your Access Level</h3>
              <div className="space-y-2 text-sm">
                {userRole === 'super_admin' && (
                  <>
                    <p className="text-stone-600">✓ Full dashboard access</p>
                    <p className="text-stone-600">✓ View all data (feedback, newsletter, alpha signups)</p>
                    <p className="text-stone-600">✓ Manage user roles</p>
                    <p className="text-stone-600">✓ System settings</p>
                  </>
                )}
                {userRole === 'admin' && (
                  <>
                    <p className="text-stone-600">✓ Dashboard access</p>
                    <p className="text-stone-600">✓ View all data</p>
                    <p className="text-stone-600">✓ Journal access</p>
                  </>
                )}
                {userRole === 'reviewer' && (
                  <>
                    <p className="text-stone-600">✓ Journal access</p>
                    <p className="text-stone-600">✓ Playground access</p>
                  </>
                )}
                {userRole === 'alpha_tester' && (
                  <p className="text-stone-600">✓ Playground access</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Data Tab - Only for admin/super_admin */}
        {activeTab === 'data' && (userRole === 'super_admin' || userRole === 'admin') && (
          <div className="space-y-6">
            {/* Alpha Requests Section */}
            <div className="border border-stone-200 bg-white p-6">
              <h3 className="text-lg font-light text-stone-900 mb-4">Alpha Access Requests ({alphaRequests?.length || 0})</h3>
              <div className="space-y-4">
                {alphaRequests?.map((item) => (
                  <div key={item._id} className="border-b border-stone-100 pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-stone-900">{item.email}</p>
                        <p className="text-xs text-stone-500 capitalize">{item.persona.replace('_', ' ')}</p>
                        {item.githubUrl && (
                          <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">
                            {item.githubUrl}
                          </a>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.interestedIn.map((interest) => (
                            <span key={interest} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                              {interest.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {item.status === 'pending' && (
                            <span className="text-xs text-yellow-600">⏳ Pending</span>
                          )}
                          {item.status === 'approved' && (
                            <span className="text-xs text-green-600">✓ Approved</span>
                          )}
                          {item.status === 'rejected' && (
                            <span className="text-xs text-red-600">✗ Rejected</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-stone-500">{new Date(item.requestedAt).toLocaleDateString()}</span>
                        {item.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveRequest(item.clerkUserId, item.email)}
                              className="px-3 py-1 text-xs bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(item.clerkUserId, item.email)}
                              className="px-3 py-1 text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {item.status === 'approved' && item.approvedAt && (
                          <span className="text-xs text-green-600">
                            Approved {new Date(item.approvedAt).toLocaleDateString()}
                          </span>
                        )}
                        {item.status === 'rejected' && item.rejectionReason && (
                          <span className="text-xs text-red-600 italic max-w-xs text-right">
                            "{item.rejectionReason}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {(!alphaRequests || alphaRequests.length === 0) && (
                  <p className="text-sm text-stone-500 italic">No alpha access requests yet.</p>
                )}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="border border-stone-200 bg-white p-6">
              <h3 className="text-lg font-light text-stone-900 mb-4">Newsletter ({newsletter?.length || 0})</h3>
              <div className="space-y-4">
                {newsletter?.slice(0, 5).map((item) => (
                  <div key={item._id} className="border-b border-stone-100 pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-stone-900">{item.email}</p>
                        <p className="text-xs text-stone-500">{item.firstName} {item.lastName}</p>
                      </div>
                      <span className="text-xs text-stone-500">{new Date(item.subscribedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="border border-stone-200 bg-white p-6">
              <h3 className="text-lg font-light text-stone-900 mb-4">Feedback ({feedback?.length || 0})</h3>
              <div className="space-y-4">
                {feedback?.slice(0, 5).map((item) => (
                  <div key={item._id} className="border-b border-stone-100 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs bg-stone-100 px-2 py-1">{item.feedbackType}</span>
                      <span className="text-xs text-stone-500">{new Date(item.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-stone-600">{item.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab - Only for super_admin */}
        {activeTab === 'users' && userRole === 'super_admin' && (
          <UserManagement />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="border border-stone-200 bg-white p-8">
              <h2 className="text-xl font-light text-stone-900 mb-6">Account Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ''}
                    disabled
                    className="w-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Current Role</label>
                  <input
                    type="text"
                    value={userRole.replace('_', ' ').toUpperCase()}
                    disabled
                    className="w-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600"
                  />
                </div>

                {userRole === 'super_admin' && (
                  <div className="pt-6 border-t border-stone-200">
                    <p className="text-sm text-stone-600 mb-3">
                      To manage user roles, go to the <button onClick={() => setActiveTab('users')} className="underline hover:text-stone-900">Users tab</button>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
