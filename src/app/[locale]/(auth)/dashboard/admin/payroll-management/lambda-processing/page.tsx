'use client';

import RoleProtected from '@/components/RoleProtected';
import LambdaPayrollProcessingContainer from '@/containers/admin/payroll-management/lambda-processing/LambdaPayrollProcessingContainer';

export default function LambdaPayrollProcessingPage() {
  return (
    <RoleProtected allowedRoles={['admin']}>
      <LambdaPayrollProcessingContainer />
    </RoleProtected>
  );
}
