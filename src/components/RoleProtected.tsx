'use client';

import { ROLES, type UserRole } from '@/lib/auth/authTypes';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type RoleProtectedProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
};

/**
 * Client component that protects routes based on user roles
 * Can be used in dynamic routes or client components where middleware protection might not be enough
 */
export default function RoleProtected({
  children,
  allowedRoles,
  fallbackPath,
}: RoleProtectedProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // If still loading session, wait
    if (status === 'loading') {
      return;
    }

    // If no session (not logged in), redirect to sign-in
    if (!session) {
      router.replace(`/sign-in?callbackUrl=${pathname}`);
      return;
    }

    // Check if user has required role
    const userRole = (session.user as any)?.role?.toLowerCase();
    const hasPermission = allowedRoles.includes(userRole as UserRole);

    if (!hasPermission) {
      // User doesn't have required role
      if (fallbackPath) {
        router.replace(fallbackPath);
      } else {
        // Redirect to appropriate dashboard based on role
        if (userRole === ROLES.ADMIN) {
          router.replace('/dashboard/admin/overview');
        } else if (userRole === ROLES.EMPLOYEE) {
          router.replace('/dashboard/employee/overview');
        } else {
          // Fallback if role is unknown
          router.replace('/sign-in');
        }
      }
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [session, status, router, pathname, allowedRoles, fallbackPath]);

  // Show nothing while checking authorization
  if (!isAuthorized) {
    return null;
  }

  // Render children only when authorized
  return <>{children}</>;
}
