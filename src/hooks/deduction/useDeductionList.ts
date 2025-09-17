import { useDeductions, useDeleteDeduction } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

type UseDeductionListProps = {
  employeeId: string;
};

export const useDeductionList = ({ employeeId }: UseDeductionListProps) => {
  // Use the new React Query hooks
  const { data: deductions = [], isLoading, isError, refetch } = useDeductions(employeeId);
  const deleteDeductionMutation = useDeleteDeduction();

  const [hasError, setHasError] = useState(false);

  // Use ref to track if we should fetch (prevents infinite loops)
  const shouldFetchRef = useRef(true);

  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    deductionId: string | null;
  }>({
    show: false,
    deductionId: null,
  });

  // Reset error state when employeeId changes
  useEffect(() => {
    if (employeeId && shouldFetchRef.current) {
      setHasError(false);
    }
  }, [employeeId]);

  // Reset shouldFetch flag when employeeId changes
  useEffect(() => {
    shouldFetchRef.current = true;
  }, [employeeId]);

  // Handle deduction deletion
  const handleDeleteDeduction = async (deductionId: string) => {
    try {
      await deleteDeductionMutation.mutateAsync(deductionId);
      // The mutation will automatically invalidate and refetch the data
    } catch (error) {
      console.error('Failed to delete deduction:', error);
    }
    // Close confirmation dialog
    setDeleteConfirmation({ show: false, deductionId: null });
  };

  // Show delete confirmation
  const showDeleteConfirmation = (deductionId: string) => {
    setDeleteConfirmation({ show: true, deductionId });
  };

  // Cancel delete confirmation
  const cancelDeleteConfirmation = () => {
    setDeleteConfirmation({ show: false, deductionId: null });
  };

  // Refresh deductions (useful after form submission)
  const refreshDeductions = async () => {
    setHasError(false); // Reset error state when manually refreshing
    await refetch();
  };

  // Sort deductions by most recent first
  const sortedDeductions = deductions.sort((a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return {
    deductions: sortedDeductions,
    loading: isLoading,
    deleteConfirmation,
    handleDeleteDeduction,
    showDeleteConfirmation,
    cancelDeleteConfirmation,
    refreshDeductions,
    hasError: isError || hasError,
  };
};
