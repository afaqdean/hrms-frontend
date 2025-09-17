import { format } from 'date-fns';

/**
 * Format currency amount with PKR prefix
 */
export const formatCurrency = (amount: number): string => {
  return `PKR ${amount.toLocaleString()}`;
};

/**
 * Format loan request date with fallback handling
 */
export const formatLoanDate = (requestedAt?: string, createdAt?: string): string => {
  if (requestedAt) {
    return format(new Date(requestedAt), 'MMM dd, yyyy');
  }
  if (createdAt) {
    return format(new Date(createdAt), 'MMM dd, yyyy');
  }
  return 'No date available';
};

/**
 * Calculate monthly deduction from amount and installments
 */
export const calculateMonthlyDeduction = (amount: number, installments: number): number => {
  return installments > 0 ? amount / installments : 0;
};

/**
 * Format installments with month suffix
 */
export const formatInstallments = (installments: number): string => {
  return `${installments} months`;
};

/**
 * Format employee name with fallback
 */
export const formatEmployeeName = (employeeName?: string, employeeId?: string): string => {
  return employeeName || `Employee ${employeeId || 'Unknown'}`;
};

/**
 * Format employee email with fallback
 */
export const formatEmployeeEmail = (employeeEmail?: string): string => {
  return employeeEmail || 'No email available';
};
