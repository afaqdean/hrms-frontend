'use client';

import DeductionsList from '@/components/admin/deduction/display/DeductionsList';
import EmployeeDeductionHeader from '@/components/admin/deduction/display/EmployeeDeductionHeader';
import DeductionForm from '@/components/admin/deduction/forms/DeductionForm';
import DeleteDeductionModal from '@/components/admin/deduction/modals/DeleteDeductionModal';
import BackArrow from '@/components/ui/back-arrow';
import LoadingState from '@/components/ui/LoadingState';
import { useDeductionForm } from '@/hooks/deduction/useDeductionForm';
import { useDeductionList } from '@/hooks/deduction/useDeductionList';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddDeductionPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;

  // Get employee data using the ID from URL
  const { data: employee, isLoading: employeeLoading } = useSpecificEmployeeData(employeeId);

  // Success state for form submission
  const [success, setSuccess] = useState(false);

  // Initialize deduction list hook first
  const deductionList = useDeductionList({ employeeId });

  // Use our custom hooks for form and list management
  const deductionForm = useDeductionForm({
    employeeId: employee?._id || '',
    onSuccess: () => {
      deductionList.refreshDeductions();
      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    },
  });

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

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <LoadingState
          type="empty"
          message="Deduction Created Successfully!"
          contextText="Redirecting back to payroll management..."
          showSpinner
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
            Add Deduction
            {' '}
            {employee.name ? `– ${employee.name}` : 'to Employee Salary'}
          </h1>
        </div>

        <EmployeeDeductionHeader employee={employee} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {/* Add Deduction Form */}
          <DeductionForm
            formData={deductionForm.formData}
            onInputChange={deductionForm.handleInputChange}
            onSubmit={deductionForm.handleSubmit}
            effectiveMonth={deductionForm.effectiveMonth}
            onEffectiveMonthChange={deductionForm.setEffectiveMonth}
            loading={deductionForm.loading}
          />

          {/* Employee Deductions List */}
          <DeductionsList
            deductions={deductionList.deductions}
            loading={deductionList.loading}
            onDeleteDeduction={deductionList.showDeleteConfirmation}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteDeductionModal
        isOpen={deductionList.deleteConfirmation.show}
        onConfirm={() =>
          deductionList.deleteConfirmation.deductionId
          && deductionList.handleDeleteDeduction(deductionList.deleteConfirmation.deductionId)}
        onCancel={deductionList.cancelDeleteConfirmation}
      />
    </div>
  );
}
