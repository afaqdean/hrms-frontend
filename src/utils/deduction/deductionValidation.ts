import type { DeductionFormData } from '@/interfaces/Deduction';

/**
 * Validate deduction form data
 */
export const validateDeductionForm = (formData: DeductionFormData): boolean => {
  if (!formData.employeeId) {
    return false;
  }
  if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
    return false;
  }
  if (!formData.reason.trim()) {
    return false;
  }

  return true;
};

/**
 * Create month period string from Date (YYYY-MM format)
 */
export const createMonthPeriod = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
