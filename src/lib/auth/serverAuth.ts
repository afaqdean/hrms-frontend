import type { ExtendedSession, UserRole } from './authTypes';
import { auth } from 'auth';
import { redirect } from 'next/navigation';
import { ROLES } from './authTypes';
import { hasRole, isValidSession } from './roleUtils';

/**
 * Server component function to protect routes based on roles
 * Use this in layout.tsx files of protected routes
 */
export async function protectRoute(allowedRoles: UserRole[]) {
  const session = await auth() as ExtendedSession;

  // Not authenticated
  if (!session) {
    redirect('/sign-in');
  }

  // Check token validity
  if (!isValidSession(session)) {
    redirect('/sign-in');
  }

  // Get user role
  const userRole = (session.user as any)?.role?.toLowerCase() as UserRole;

  // Check role permissions
  if (!hasRole(session, allowedRoles)) {
    // Redirect to appropriate dashboard based on user role
    if (userRole === ROLES.ADMIN) {
      redirect('/dashboard/admin/overview');
    } else if (userRole === ROLES.EMPLOYEE) {
      redirect('/dashboard/employee/overview');
    } else {
      // Fallback if role is unknown
      redirect('/sign-in');
    }
  }

  return session;
}

/**
 * Protect route requiring admin access
 */
export async function protectAdminRoute() {
  return protectRoute([ROLES.ADMIN]);
}

/**
 * Protect route requiring employee access
 */
export async function protectEmployeeRoute() {
  return protectRoute([ROLES.EMPLOYEE]);
}
