/**
 * Role-based Access Control (RBAC) Configuration
 *
 * Hierarchy (highest to lowest):
 * - super_admin: Full access, can assign roles
 * - admin: Access to journal + playground
 * - designer: Access to theme customization + journal + playground
 * - reviewer: Access to journal + playground (read-focused)
 * - alpha_tester: Access to playground only
 * - user: Public access only
 */

export type UserRole = 'super_admin' | 'admin' | 'designer' | 'reviewer' | 'alpha_tester' | 'user'

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DESIGNER: 'designer',
  REVIEWER: 'reviewer',
  ALPHA_TESTER: 'alpha_tester',
  USER: 'user',
} as const

// Role hierarchy levels (higher number = more permissions)
export const ROLE_LEVELS: Record<UserRole, number> = {
  super_admin: 100,
  admin: 80,
  designer: 70,
  reviewer: 60,
  alpha_tester: 40,
  user: 0,
}

// Route permissions
export const ROUTE_PERMISSIONS = {
  '/journal/admin': ['super_admin', 'admin'],
  '/ps-journaling': ['super_admin', 'admin', 'designer', 'reviewer'],
  '/playground': ['super_admin', 'admin', 'designer', 'reviewer', 'alpha_tester'],
  '/admin/roles': ['super_admin'],
  '/admin/data': ['super_admin', 'admin'],
  '/admin': ['super_admin', 'admin'],
} as const

/**
 * Check if user has required role level
 */
export function hasRequiredRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole]
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(userRole: UserRole | undefined, route: string): boolean {
  if (!userRole) return false

  // Find matching route permission (check most specific routes first)
  // Sort by length descending to match longest/most specific path first
  const routeKeys = Object.keys(ROUTE_PERMISSIONS).sort((a, b) => b.length - a.length)
  const routeKey = routeKeys.find(key => route.startsWith(key))

  if (!routeKey) return true // No restriction on route

  const allowedRoles = ROUTE_PERMISSIONS[routeKey as keyof typeof ROUTE_PERMISSIONS]
  return (allowedRoles as readonly UserRole[]).includes(userRole)
}

/**
 * Hardcoded super admin emails (fallback if Clerk metadata not set)
 */
const SUPER_ADMIN_EMAILS = [
  'antonkorzhuk@gmail.com'
]

/**
 * Get user role from Clerk metadata
 */
export function getUserRole(user: any): UserRole {
  // Check hardcoded super admin list first
  // Handle both user object (from useUser) and sessionClaims (from middleware)
  const userEmail = user?.primaryEmailAddress?.emailAddress || user?.email
  if (userEmail && SUPER_ADMIN_EMAILS.includes(userEmail)) {
    return 'super_admin'
  }

  // Otherwise use Clerk metadata
  return (user?.publicMetadata?.role as UserRole) || 'user'
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    designer: 'Designer',
    reviewer: 'Reviewer',
    alpha_tester: 'Alpha Tester',
    user: 'User',
  }
  return names[role]
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-purple-100 text-purple-800 border-purple-300',
    admin: 'bg-blue-100 text-blue-800 border-blue-300',
    designer: 'bg-pink-100 text-pink-800 border-pink-300',
    reviewer: 'bg-green-100 text-green-800 border-green-300',
    alpha_tester: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    user: 'bg-stone-100 text-stone-800 border-stone-300',
  }
  return colors[role]
}

/**
 * Check if user can access theme settings
 * Allows: super_admin, admin, designer, and alpha_tester
 */
export function canAccessThemeSettings(userRole: UserRole | undefined): boolean {
  if (!userRole) return false
  return ['super_admin', 'admin', 'designer', 'alpha_tester'].includes(userRole)
}
