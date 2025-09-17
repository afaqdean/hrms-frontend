import type { Payslip } from '@/interfaces/Payslip';

/**
 * Utility functions for payroll data processing and formatting
 */

/**
 * Converts YYYY-MM format to Month-Year format for API calls
 * @param period - Period in YYYY-MM format
 * @returns Formatted string like "January-2024" or empty string if invalid
 */
export const formatMonthYear = (period: string): string => {
  if (!period || typeof period !== 'string') {
    return '';
  }

  const [yearStr, monthStr] = period.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1; // JS months are 0-indexed

  if (Number.isNaN(year) || Number.isNaN(month) || month < 0 || month > 11) {
    return '';
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return `${monthNames[month]}-${year}`;
};

/**
 * Filters payslips by selected month
 * @param payslips - Array of payslips to filter
 * @param selectedMonth - Date object representing the selected month
 * @returns Filtered array of payslips
 */
export const filterPayslipsByMonth = (payslips: Payslip[], selectedMonth: Date): Payslip[] => {
  return payslips.filter((entry) => {
    if (!entry.period) {
      return false;
    }

    // entry.period is 'YYYY-MM'
    const [yearStr, monthStr] = entry.period.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr) - 1; // JS months are 0-indexed

    if (Number.isNaN(year) || Number.isNaN(month)) {
      return false;
    }

    // Compare with selected month
    return year === selectedMonth.getFullYear() && month === selectedMonth.getMonth();
  });
};

/**
 * Formats currency values with proper localization
 * @param value - Numeric value to format
 * @returns Formatted string with proper thousand separators
 */
export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) {
    return '0';
  }
  return value.toLocaleString?.() ?? value.toString();
};
