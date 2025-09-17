import { format } from 'date-fns';

/**
 * Auto-calculate payment date as end of selected month
 * @param date - The selected date
 * @returns Payment date string in YYYY-MM-DD format
 */
export const calculatePaymentDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
};

/**
 * Format date for month-year display (e.g., "January 2024")
 * @param date - The date to format
 * @returns Formatted string
 */
export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

/**
 * Format date for month-year processing (e.g., "January-2024")
 * @param date - The date to format
 * @returns Formatted string for processing
 */
export const formatMonthYearForProcessing = (date: Date): string => {
  return format(date, 'MMMM-yyyy');
};

/**
 * Format date for period string (e.g., "2024-01")
 * @param date - The date to format
 * @returns Period string in YYYY-MM format
 */
export const formatPeriodString = (date: Date): string => {
  return format(date, 'yyyy-MM');
};
