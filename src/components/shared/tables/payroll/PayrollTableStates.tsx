import LoadingState from '@/components/ui/LoadingState';
import { TableCell, TableRow } from '@/components/ui/table';
import React from 'react';

/**
 * Props for PayrollTableStates component
 */
type PayrollTableStatesProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty: boolean;
  showTimeout: boolean;
  onRetry: () => void;
  onBypassLoading: () => void;
  onRefreshPage: () => void;
};

/**
 * Component for rendering different table states (loading, error, empty)
 * Handles the complex loading timeout logic and user actions
 */
export const PayrollTableStates: React.FC<PayrollTableStatesProps> = ({
  isLoading,
  isError,
  error,
  isEmpty,
  showTimeout,
  onRetry,
  onBypassLoading,
  onRefreshPage,
}) => {
  // Loading state with timeout handling
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="px-6 py-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <LoadingState
              type="loading"
              message="Loading payslips..."
              showSpinner
              className="py-4"
            />
            {showTimeout && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-orange-600">
                  ⚠️ Loading is taking longer than expected
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-200"
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={onBypassLoading}
                    className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-800 hover:bg-orange-200"
                  >
                    Continue Anyway
                  </button>
                  <button
                    type="button"
                    onClick={onRefreshPage}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }

  // Error state
  if (isError) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="px-6 py-4 text-center">
          <LoadingState
            type="error"
            message="Error loading payslips"
            contextText={error ? String(error) : 'Unable to load payroll data.'}
            actionText="Retry"
            onAction={onRetry}
            showSpinner={false}
            className="py-4"
          />
        </TableCell>
      </TableRow>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="px-6 py-4 text-center">
          <LoadingState
            type="empty"
            message="No payroll records found for this period."
            showSpinner={false}
            className="py-4"
          />
        </TableCell>
      </TableRow>
    );
  }

  // This component only renders states, not data rows
  return null;
};
