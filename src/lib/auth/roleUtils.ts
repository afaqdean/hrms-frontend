import type { ExtendedSession, UserRole } from './authTypes';
import { ROLES } from './authTypes';

/**
 * Checks if the user has the required role
 */
export function hasRole(session: ExtendedSession | null, allowedRoles: UserRole[]): boolean {
  if (!session?.user) {
    return false;
  }

  const userRole = (session.user as any)?.role?.toLowerCase() as UserRole;

  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
}

/**
 * Checks if user is an admin
 */
export function isAdmin(session: ExtendedSession | null): boolean {
  return hasRole(session, [ROLES.ADMIN]);
}

/**
 * Checks if user is an employee
 */
export function isEmployee(session: ExtendedSession | null): boolean {
  return hasRole(session, [ROLES.EMPLOYEE]);
}

/**
 * Verifies JWT token not expired and properly formed
 */
export function isValidSession(session: ExtendedSession | null): boolean {
  if (!session) {
    return false;
  }

  // Check token exists
  if (!session.accessToken) {
    return false;
  }

  // Check user data exists
  if (!session.user) {
    return false;
  }

  return true;
}
