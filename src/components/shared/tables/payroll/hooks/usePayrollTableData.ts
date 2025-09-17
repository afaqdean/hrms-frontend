import type { Payslip } from '@/interfaces/Payslip';
import { usePayslipsForEmployee } from '@/hooks/usePayslipsForEmployee';
import { filterPayslipsByMonth } from '@/utils/payrollUtils';
import React, { useMemo, useState } from 'react';

/**
 * Custom hook for managing payroll table data and loading states
 */
export const usePayrollTableData = (employeeId: string, selectedMonth: Date) => {
  const { payslips, isLoading: loading, isError, error, refetch } = usePayslipsForEmployee(employeeId);
  const [payslipsTimeout, setPayslipsTimeout] = useState(false);
  const [bypassLoading, setBypassLoading] = useState(false);

  // Set a timeout for payslips loading to prevent eternal loading
  React.useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setPayslipsTimeout(true);
      }, 20000); // 20 seconds timeout for payslips

      return () => clearTimeout(timeout);
    } else {
      setPayslipsTimeout(false);
      return undefined;
    }
  }, [loading]);

  // Filter payslips by selectedMonth
  const filteredPayslips = useMemo(() => {
    return filterPayslipsByMonth(payslips as Payslip[], selectedMonth);
  }, [payslips, selectedMonth]);

  // Loading state management
  const isLoading = loading && !bypassLoading;
  const showTimeout = payslipsTimeout;

  const handleRetry = () => {
    setPayslipsTimeout(false);
    refetch();
  };

  const handleBypassLoading = () => {
    setBypassLoading(true);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return {
    filteredPayslips,
    isLoading,
    isError,
    error,
    showTimeout,
    handleRetry,
    handleBypassLoading,
    handleRefreshPage,
  };
};
