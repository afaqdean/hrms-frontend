import type { ComparisonResult } from '../types';
import { useCompareSalaryWithHRMS } from '@/hooks/useSalaryComparison';
import { toast } from 'react-toastify';
import { STATUS_MESSAGES, TOAST_MESSAGES } from '../utils/constants';
import { formatPeriodString } from '../utils/dateUtils';

export const useHRMSValidation = () => {
  const { mutateAsync: compareSalaryWithHRMS } = useCompareSalaryWithHRMS();

  /**
   * Check for HRMS modifications for a given period
   * @param selectedMonth - The month to check
   * @param onComparisonResult - Callback for comparison result
   * @param onStatusUpdate - Status update callback
   * @returns Promise<boolean> - Whether modifications were found
   */
  const checkHRMSModifications = async (
    selectedMonth: Date,
    onComparisonResult: (result: ComparisonResult) => void,
    onStatusUpdate: (message: string) => void,
  ): Promise<boolean> => {
    try {
      onStatusUpdate(STATUS_MESSAGES.CHECKING_HRMS);

      const periodStr = formatPeriodString(selectedMonth);
      const comparison = await compareSalaryWithHRMS(periodStr);

      onComparisonResult(comparison);

      if (comparison.hasModifications) {
        onStatusUpdate(STATUS_MESSAGES.HRMS_MODIFICATIONS_DETECTED);
        toast.warning(TOAST_MESSAGES.HRMS_WARNING);
        return true;
      } else {
        onStatusUpdate(STATUS_MESSAGES.NO_HRMS_MODIFICATIONS);
        return false;
      }
    } catch (error) {
      console.warn('Failed to check HRMS modifications:', error);
      onStatusUpdate(STATUS_MESSAGES.READY_FOR_PROCESSING);
      return false;
    }
  };

  /**
   * Handle HRMS validation after file processing
   * @param selectedMonth - The month to validate
   * @param onComparisonResult - Callback for comparison result
   * @param onWarningToggle - Callback to toggle warning display
   * @param onStatusUpdate - Status update callback
   */
  const handleHRMSValidation = async (
    selectedMonth: Date,
    onComparisonResult: (result: ComparisonResult) => void,
    onWarningToggle: (show: boolean) => void,
    onStatusUpdate: (message: string) => void,
  ) => {
    const hasModifications = await checkHRMSModifications(
      selectedMonth,
      onComparisonResult,
      onStatusUpdate,
    );

    onWarningToggle(hasModifications);
  };

  return {
    checkHRMSModifications,
    handleHRMSValidation,
  };
};
