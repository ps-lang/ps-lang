'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { getUserRole, getRoleDisplayName, getRoleBadgeColor, ROLES } from '@/lib/roles'
import type { UserRole } from '@/lib/roles'

export default function RoleManagementPage() {
  const { user } = useUser()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const currentUserRole = getUserRole(user)

  useEffect(() => {
    // In production, fetch users from Clerk API
    // For now, show current user as example
    if (user) {
      setUsers([
        {
          id: user.id,
          name: user.fullName || 'You',
          email: user.primaryEmailAddress?.emailAddress,
          role: currentUserRole,
        }
      ])
      setLoading(false)
    }
  }, [user, currentUserRole])

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // Call API to update user role in Clerk metadata
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        alert(`Role updated to ${getRoleDisplayName(newRole)}`)
      } else {
        alert('Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Error updating role')
    }
  }

  if (currentUserRole !== 'super_admin') {
    return (
      <div className="min-h-screen bg-paper">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="paper-card p-8 text-center">
            <h1 className="font-editorial text-2xl font-bold text-ink mb-4">
              Super Admin Access Required
            </h1>
            <p className="font-typewriter text-ink-light">
              Only super admins can manage user roles.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="paper-card stacked-papers p-8 mb-8">
          <h1 className="font-editorial text-3xl font-bold text-ink mb-2">
            Role Management
          </h1>
          <p className="font-typewriter text-ink-light">
            Assign roles to control access to Journal and Playground features
          </p>
        </div>

        {/* Role Legend */}
        <div className="paper-card p-6 mb-6">
          <h2 className="font-typewriter font-bold text-ink mb-4">Access Levels</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <h3 className="font-typewriter font-bold text-sm text-ink mb-2">
                🎯 Alpha Tester
              </h3>
              <p className="font-typewriter text-xs text-ink-light">
                • Access to Playground only
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <h3 className="font-typewriter font-bold text-sm text-ink mb-2">
                👁️ Reviewer
              </h3>
              <p className="font-typewriter text-xs text-ink-light">
                • Access to Journal + Playground
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <h3 className="font-typewriter font-bold text-sm text-ink mb-2">
                ⚙️ Admin
              </h3>
              <p className="font-typewriter text-xs text-ink-light">
                • Full access to all features
              </p>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
              <h3 className="font-typewriter font-bold text-sm text-ink mb-2">
                👑 Super Admin
              </h3>
              <p className="font-typewriter text-xs text-ink-light">
                • Full access + role management
              </p>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="paper-card p-6">
          <h2 className="font-typewriter font-bold text-ink mb-4">Users</h2>

          {loading ? (
            <p className="font-typewriter text-sm text-ink-light">Loading users...</p>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-typewriter font-bold text-ink text-sm">
                      {u.name}
                    </p>
                    <p className="font-typewriter text-xs text-ink-light">
                      {u.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full border font-typewriter text-xs ${getRoleBadgeColor(u.role)}`}>
                      {getRoleDisplayName(u.role)}
                    </span>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-3 py-1 bg-white border border-stone-300 rounded-lg font-typewriter text-sm"
                      disabled={u.id === user?.id} // Can't change own role
                    >
                      <option value={ROLES.USER}>User</option>
                      <option value={ROLES.ALPHA_TESTER}>Alpha Tester</option>
                      <option value={ROLES.REVIEWER}>Reviewer</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                      <option value={ROLES.SUPER_ADMIN}>Super Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-typewriter font-bold text-sm text-blue-900 mb-2">
              📝 How to assign roles manually (Clerk Dashboard):
            </h3>
            <ol className="font-typewriter text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Go to Clerk Dashboard → Users</li>
              <li>Click on a user</li>
              <li>Scroll to "Public metadata"</li>
              <li>Add: <code className="bg-blue-100 px-1 py-0.5 rounded">{"{ \"role\": \"alpha_tester\" }"}</code></li>
              <li>Save changes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
