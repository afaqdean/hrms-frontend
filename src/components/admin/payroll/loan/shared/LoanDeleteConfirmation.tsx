import { Button } from '@/components/ui/button';
import React from 'react';

type LoanDeleteConfirmationProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  loanAmount?: number;
  employeeName?: string;
};

const LoanDeleteConfirmation: React.FC<LoanDeleteConfirmationProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
  loanAmount,
  employeeName,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <div className="mb-3 text-4xl"></div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Loan Request</h3>
        </div>

        <div className="mb-6 text-center text-gray-600">
          <p className="mb-2">
            Are you sure you want to delete this loan request?
          </p>
          {employeeName && (
            <p className="text-sm">
              <strong>Employee:</strong>
              {' '}
              {employeeName}
            </p>
          )}
          {loanAmount && (
            <p className="text-sm">
              <strong>Amount:</strong>
              {' '}
              PKR
              {loanAmount.toLocaleString()}
            </p>
          )}
          <p className="mt-3 text-sm font-medium text-red-600">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanDeleteConfirmation;
