'use client';

import BonusListCard from '@/components/admin/bonus/display/BonusListCard';
import EmployeeHeader from '@/components/admin/bonus/display/EmployeeHeader';
import AddBonusForm from '@/components/admin/bonus/forms/AddBonusForm';
import DeleteBonusModal from '@/components/admin/bonus/modals/DeleteBonusModal';
import BackArrow from '@/components/ui/back-arrow';
import LoadingState from '@/components/ui/LoadingState';
import { useBonuses, useDeleteBonus } from '@/hooks';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddBonusPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;

  // Get employee data using the ID from URL
  const { data: employee, isLoading: employeeLoading } = useSpecificEmployeeData(employeeId);

  // Use the new React Query hooks
  const { data: bonuses = [], isLoading: bonusesLoading, refetch } = useBonuses(employeeId);
  const deleteBonusMutation = useDeleteBonus();

  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; bonusId: string | null }>({
    show: false,
    bonusId: null,
  });

  // Sort bonuses by creation date (most recent first) and map to expected type
  const sortedBonuses = bonuses
    .filter(bonus => bonus.id || bonus._id) // Check for both id and _id
    .map(bonus => ({
      id: bonus.id || bonus._id, // Use _id as fallback if id doesn't exist
      amount: bonus.amount,
      type: bonus.type as any, // Cast to BonusType
      reason: bonus.reason,
      period: bonus.period || bonus.createdAt, // Use period or fallback to createdAt
      notes: bonus.notes,
      isActive: bonus.isActive,
      createdAt: bonus.createdAt,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

  // Handle bonus deletion
  const handleDeleteBonus = async (bonusId: string) => {
    try {
      await deleteBonusMutation.mutateAsync(bonusId);
      // The mutation will automatically invalidate and refetch the data
    } catch (error) {
      console.error('Failed to delete bonus:', error);
    }
    // Close confirmation dialog
    setDeleteConfirmation({ show: false, bonusId: null });
  };

  // Show delete confirmation
  const showDeleteConfirmation = (bonusId: string) => {
    setDeleteConfirmation({ show: true, bonusId });
  };

  // Cancel delete confirmation
  const cancelDeleteConfirmation = () => {
    setDeleteConfirmation({ show: false, bonusId: null });
  };

  const [success, setSuccess] = useState(false);

  const handleBonusSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  // Function to handle bonus creation success
  const handleBonusCreated = async () => {
    await refetch();
  };

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
          message="Bonus Created Successfully!"
          contextText="The bonus has been created successfully. Redirecting back to payroll management..."
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
            Add Bonus
            {' '}
            {employee.name ? `– ${employee.name}` : 'to Employee Salary'}
          </h1>
        </div>

        <EmployeeHeader employee={employee} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Add Bonus Form */}
          <AddBonusForm
            employeeId={employeeId}
            onSuccess={handleBonusSuccess}
            onBonusCreated={handleBonusCreated}
          />

          {/* Employee Bonuses Table */}
          <BonusListCard
            bonuses={sortedBonuses}
            isLoading={bonusesLoading}
            onDeleteBonus={showDeleteConfirmation}
          />
        </div>
      </div>

      <DeleteBonusModal
        isOpen={deleteConfirmation.show}
        onConfirm={() => handleDeleteBonus(deleteConfirmation.bonusId!)}
        onCancel={cancelDeleteConfirmation}
      />
    </div>
  );
}
