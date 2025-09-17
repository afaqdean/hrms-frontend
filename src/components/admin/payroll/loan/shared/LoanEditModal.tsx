import type { LoanRequest, UpdateLoanRequestInput } from '@/interfaces/LoanRequest';

import {
  EmployeeInfoCard,
  LOAN_STATUS_OPTIONS,
  LoanAdminRemarksField,
  LoanAmountField,
  LoanInstallmentsField,
  LoanMonthlyDeductionField,
  LoanReasonField,
  LoanSourceField,
  LoanStatusField,
} from '@/components/admin/payroll/loan';

import { Button } from '@/components/ui/button';
import { useUpdateLoanRequest } from '@/hooks/useAdminLoanManagement';
import { Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type LoanEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loanRequest: LoanRequest | null;
  employee: {
    _id: string;
    name: string;
    email: string;
    position?: string;
    employeeID?: string;
  } | null;
  onSuccess?: () => void;
};

export const LoanEditModal = ({
  isOpen,
  onClose,
  loanRequest,
  employee,
  onSuccess,
}: LoanEditModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    installments: '',
    reason: '',
    status: '',
    adminRemarks: '',
  });

  const updateLoanMutation = useUpdateLoanRequest();

  useEffect(() => {
    if (loanRequest && isOpen) {
      setFormData({
        amount: loanRequest.amount.toString(),
        reason: loanRequest.reason,
        status: loanRequest.status,
        installments: loanRequest.installments.toString(),
        adminRemarks: loanRequest.adminRemarks || '',
      });
      setIsEditMode(false);
    }
  }, [loanRequest, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loanRequest) {
      return;
    }

    try {
      const updateData: UpdateLoanRequestInput = {
        status: formData.status as 'Pending' | 'Approved' | 'Declined',
        installments: Number.parseInt(formData.installments, 10),
        adminRemarks: formData.adminRemarks || undefined,
      };

      await updateLoanMutation.mutateAsync({
        loanId: loanRequest._id,
        updateData,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating loan request:', error);
    }
  };

  const handleClose = () => {
    setIsEditMode(false);
    onClose();
  };

  if (!isOpen || !loanRequest) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b bg-white p-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? 'Edit' : 'View'}
              {' '}
              Loan Request
            </h2>
            <span className="text-sm text-gray-500">
              #
              {loanRequest._id.slice(-6)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditMode && (
              <Button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2"
              >
                <Save className="size-4" />
                Edit Loan
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="flex items-center gap-2"
            >
              <X className="size-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Employee Information */}
          <div className="rounded-2xl bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Employee Information</h3>
            <EmployeeInfoCard
              employee={employee || {
                name: loanRequest.employeeName,
                email: loanRequest.employeeEmail,
                _id: loanRequest.employeeId as string,
              }}
              showBorder={false}
              size="sm"
            />
          </div>

          {/* Loan Details Form */}
          <div className="rounded-2xl border bg-white p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Amount - Read Only */}
                <LoanAmountField amount={formData.amount} />

                {/* Installments */}
                <LoanInstallmentsField
                  value={formData.installments}
                  onChange={value => handleInputChange('installments', value)}
                  required
                  disabled={!isEditMode}
                />

                {/* Status */}
                <LoanStatusField
                  value={formData.status}
                  onChange={value => handleInputChange('status', value)}
                  options={LOAN_STATUS_OPTIONS.slice(1)}
                  disabled={!isEditMode}
                />

                {/* Monthly Deduction (Read-only) */}
                <LoanMonthlyDeductionField
                  amount={formData.amount}
                  installments={formData.installments}
                />

                {/* Source (Read-only) */}
                <LoanSourceField source={loanRequest.source} />
              </div>

              {/* Reason - Read Only */}
              <LoanReasonField reason={formData.reason} />

              {/* Admin Remarks */}
              <LoanAdminRemarksField
                value={formData.adminRemarks}
                onChange={value => handleInputChange('adminRemarks', value)}
                disabled={!isEditMode}
              />

              {/* Action Buttons */}
              {isEditMode && (
                <div className="flex justify-end gap-4 border-t pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel Edit
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateLoanMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="size-4" />
                    {updateLoanMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
