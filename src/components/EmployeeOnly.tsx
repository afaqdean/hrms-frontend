'use client';

import { ROLES } from '@/lib/auth/authTypes';
import RoleProtected from './RoleProtected';

type EmployeeOnlyProps = {
  children: React.ReactNode;
  fallbackPath?: string;
};

/**
 * Component that only renders its children for employee users
 */
export default function EmployeeOnly({ children, fallbackPath }: EmployeeOnlyProps) {
  return (
    <RoleProtected allowedRoles={[ROLES.EMPLOYEE]} fallbackPath={fallbackPath}>
      {children}
    </RoleProtected>
  );
}
