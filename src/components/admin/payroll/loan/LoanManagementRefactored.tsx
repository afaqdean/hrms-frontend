'use client';

import type { Employee } from '@/interfaces/Employee';
import type { LoanRequest } from '@/interfaces/LoanRequest';
import ErrorState from '@/components/ui/ErrorState';
import LoadingState from '@/components/ui/LoadingState';
import { useAdminLoanRequests, useDeleteLoanRequest } from '@/hooks/useAdminLoanManagement';
import React, { useMemo, useState } from 'react';

import {
  LoanFilters,
  LoanStats,
  LoanTable,
} from './components';
import {
  LoanDeleteConfirmation,
  LoanEditModal,
} from './shared';
import { filterAndSortLoans } from './utils';

type LoanManagementProps = {
  employeeId?: string;
  employeeData?: Employee; // ✅ Properly typed using Employee interface
};

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const LoanManagementRefactored: React.FC<LoanManagementProps> = ({ employeeId, employeeData }) => {
  const { loanRequests, isLoading, isError } = useAdminLoanRequests();
  const deleteLoanMutation = useDeleteLoanRequest();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Modal state
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    loanId: string | null;
    loan?: LoanRequest;
  }>({
    show: false,
    loanId: null,
    loan: undefined,
  });

  // Apply filters and sorting
  const filteredAndSortedLoanRequests = useMemo(() => {
    return filterAndSortLoans(loanRequests, {
      employeeId,
      statusFilter,
      sourceFilter,
      searchQuery,
      dateRange,
    });
  }, [loanRequests, employeeId, statusFilter, sourceFilter, searchQuery, dateRange]);

  // Modal handlers
  const handleViewDetails = (loanRequest: LoanRequest) => {
    setSelectedLoan(loanRequest);
    setIsModalOpen(true);
  };

  const handleEditRequest = (loanRequest: LoanRequest) => {
    setSelectedLoan(loanRequest);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  const handleModalSuccess = () => {
    // Refresh data or handle success
    handleCloseModal();
  };

  // Delete handlers
  const showDeleteConfirmation = (loanId: string) => {
    const loan = loanRequests.find(l => l._id === loanId);
    setDeleteConfirmation({ show: true, loanId, loan });
  };

  const cancelDeleteConfirmation = () => {
    setDeleteConfirmation({ show: false, loanId: null, loan: undefined });
  };

  const handleDeleteLoan = async () => {
    if (!deleteConfirmation.loanId) {
      return;
    }

    try {
      await deleteLoanMutation.mutateAsync(deleteConfirmation.loanId);
      cancelDeleteConfirmation();
    } catch (error) {
      console.error('Failed to delete loan:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState type="loading" message="Loading loan requests..." showSpinner />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState
        title="Error Loading Loan Requests"
        message="Error loading loan requests. Please try again."
      />
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <LoanStats
        filteredCount={filteredAndSortedLoanRequests.length}
        totalCount={loanRequests.length}
        employeeId={employeeId}
      />

      {/* Filters - Only show when not filtering by specific employee */}
      {!employeeId && (
        <LoanFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          sourceFilter={sourceFilter}
          dateRange={dateRange}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          onSourceChange={setSourceFilter}
          onDateRangeChange={setDateRange}
          className="mb-6"
        />
      )}

      {/* Loan Requests Table or Empty State */}
      {filteredAndSortedLoanRequests.length === 0
        ? (
            <LoadingState
              type="empty"
              message="No loan requests found."
              showSpinner={false}
            />
          )
        : (
            <LoanTable
              loanRequests={filteredAndSortedLoanRequests}
              showEmployeeColumn={!employeeId}
              onView={handleViewDetails}
              onEdit={handleEditRequest}
              onDelete={showDeleteConfirmation}
            />
          )}

      {/* Delete Confirmation Dialog */}
      <LoanDeleteConfirmation
        isOpen={deleteConfirmation.show}
        onConfirm={handleDeleteLoan}
        onCancel={cancelDeleteConfirmation}
        isLoading={deleteLoanMutation.isPending}
        loanAmount={deleteConfirmation.loan?.amount}
        employeeName={deleteConfirmation.loan?.employeeName}
      />

      {/* Loan Edit/View Modal */}
      <LoanEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        loanRequest={selectedLoan}
        employee={employeeData || (selectedLoan
          ? {
              _id: selectedLoan.employeeId as string,
              name: selectedLoan.employeeName || 'Unknown Employee',
              email: selectedLoan.employeeEmail || 'No email available',
            }
          : null)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default LoanManagementRefactored;
