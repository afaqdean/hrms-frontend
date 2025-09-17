'use client';

import { ROLES } from '@/lib/auth/authTypes';
import RoleProtected from './RoleProtected';

type AdminOnlyProps = {
  children: React.ReactNode;
  fallbackPath?: string;
};

/**
 * Component that only renders its children for admin users
 */
export default function AdminOnly({ children, fallbackPath }: AdminOnlyProps) {
  return (
    <RoleProtected allowedRoles={[ROLES.ADMIN]} fallbackPath={fallbackPath}>
      {children}
    </RoleProtected>
  );
}
