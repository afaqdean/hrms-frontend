'use client';

import SalaryHistory from '@/components/admin/payroll/SalaryHistory';
import BackArrow from '@/components/ui/back-arrow';
import LoadingState from '@/components/ui/LoadingState';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useParams, useRouter } from 'next/navigation';

export default function SalaryChangeLogPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId as string;

  // Get employee data using the ID from URL
  const { data: employee, isLoading: employeeLoading } = useSpecificEmployeeData(employeeId);

  // Show loading while fetching employee data
  if (employeeLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <LoadingState
          type="loading"
          message="Loading Employee Data..."
          showSpinner
          className="w-full max-w-xl rounded-2xl bg-white p-8 shadow"
        />
      </div>
    );
  }

  // Show error if employee not found
  if (!employee) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <LoadingState
          type="error"
          message="Employee Not Found"
          contextText="The employee you're looking for doesn't exist or you don't have permission to view them."
          actionText="Go Back"
          onAction={() => router.back()}
          showSpinner={false}
          className="w-full max-w-xl rounded-2xl bg-white p-8 shadow"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 flex items-center gap-4">
          <BackArrow href="/dashboard/admin/payroll-management" />
          <h1 className="text-2xl font-bold text-primary-100">
            Salary Change Log
            {' '}
            {employee.name ? `– ${employee.name}` : 'for Employee'}
          </h1>
        </div>

        <SalaryHistory
          employeeId={employeeId}
          employee={employee}
        />
      </div>
    </div>
  );
}
