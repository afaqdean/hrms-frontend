'use client';

import { EmployeeInfoCard } from '@/components/admin/payroll/loan';
import LoanManagement from '@/components/admin/payroll/LoanManagement';
import BackArrow from '@/components/ui/back-arrow';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useParams } from 'next/navigation';
import React from 'react';

export default function EmployeeLoanManagementPage() {
  const params = useParams();
  const employeeId = params.employeeId as string;

  // Get employee data using the ID from URL
  const { data: employee, isLoading: employeeLoading } = useSpecificEmployeeData(employeeId);

  // Show loading while fetching employee data
  if (employeeLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <LoadingState type="loading" message="Loading Employee Data..." showSpinner className="w-full max-w-xl" />
      </div>
    );
  }

  // Show error if employee not found
  if (!employee) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <ErrorState
          title="Employee Not Found"
          message="The employee you're looking for doesn't exist or you don't have permission to view them."
          className="w-full max-w-xl"
        />
        <div className="mt-4">
          <BackArrow href="/dashboard/admin/payroll-management" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 flex items-center gap-4">
          <BackArrow href="/dashboard/admin/payroll-management" />
          <h1 className="text-2xl font-bold text-primary-100">
            Loan Management
            {' '}
            {employee.name ? `– ${employee.name}` : 'for Employee'}
          </h1>
        </div>

        {employee.name && (
          <EmployeeInfoCard
            employee={employee}
            className="mb-6"
            showBorder
            size="md"
          />
        )}

        <LoanManagement employeeId={employeeId} employeeData={employee} />
      </div>
    </div>
  );
}
