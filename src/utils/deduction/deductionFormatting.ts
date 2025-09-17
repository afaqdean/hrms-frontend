import { DEDUCTION_TYPE_BADGE_CONFIG, STATUS_BADGE_CONFIG } from '@/constants/deduction/deductionConfig';
import { getDeductionTypeLabel } from '@/constants/deduction/deductionTypes';
import { format } from 'date-fns';

/**
 * Format month/year from various date string formats
 */
export const formatMonthYear = (dateString: string): string => {
  try {
    // Handle month periods (YYYY-MM format)
    if (dateString && dateString.match(/^\d{4}-\d{2}$/)) {
      const parts = dateString.split('-');
      if (parts.length === 2 && parts[0] && parts[1]) {
        const year = Number.parseInt(parts[0], 10);
        const month = Number.parseInt(parts[1], 10);
        const monthIndex = month - 1; // Month is 0-indexed
        const date = new Date(year, monthIndex, 1);
        return format(date, 'MMMM yyyy');
      }
    }

    // Handle full dates (YYYY-MM-DD format) as fallback
    if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateString);
      if (!Number.isNaN(date.getTime())) {
        return format(date, 'MMMM yyyy');
      }
    }

    // Handle invalid or missing data
    if (!dateString || dateString === 'Invalid Date') {
      return 'No Period Set';
    }

    // Try to parse as regular date (fallback)
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return `Invalid Period (${dateString})`;
    }

    return format(date, 'MMMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return `Error: ${dateString}`;
  }
};

/**
 * Format amount as PKR currency
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(amount);
};

/**
 * Get status badge configuration
 */
export const getStatusBadgeConfig = (isActive: boolean) => {
  return isActive ? STATUS_BADGE_CONFIG.active : STATUS_BADGE_CONFIG.inactive;
};

/**
 * Get type badge configuration
 */
export const getTypeBadgeConfig = (type: string) => {
  return DEDUCTION_TYPE_BADGE_CONFIG[type as keyof typeof DEDUCTION_TYPE_BADGE_CONFIG]
    || { bg: 'bg-gray-100', text: 'text-gray-800', label: getDeductionTypeLabel(type) };
};
