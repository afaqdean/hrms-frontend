import type { SalaryChangeLogEntry } from '@/interfaces/SalaryIncrement';
import type { DateRange } from '@/types/salaryHistory';

/**
 * Sorts salary change log entries by timestamp (most recent first)
 */
export const sortEntriesByTimestamp = (entries: SalaryChangeLogEntry[]): SalaryChangeLogEntry[] => {
  if (!entries || !Array.isArray(entries)) {
    return [];
  }
  return [...entries].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
};

/**
 * Filters entries based on date range and type
 */
export const filterEntries = (
  entries: SalaryChangeLogEntry[],
  dateRange: DateRange,
  selectedType: string,
): SalaryChangeLogEntry[] => {
  let filtered = entries;

  // Filter by type
  if (selectedType !== 'all') {
    filtered = filtered.filter(entry => entry.type === selectedType);
  }

  // Filter by date range
  if (dateRange.from || dateRange.to) {
    filtered = filtered.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const fromDate = dateRange.from ? new Date(dateRange.from.setHours(0, 0, 0, 0)) : null;
      const toDate = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : null;

      if (fromDate && toDate) {
        return entryDate >= fromDate && entryDate <= toDate;
      } else if (fromDate) {
        return entryDate >= fromDate;
      } else if (toDate) {
        return entryDate <= toDate;
      }

      return true;
    });
  }

  return filtered;
};

/**
 * Formats amount for display with proper sign and currency
 */
export const formatAmount = (amount: number): string => {
  const isPositive = amount >= 0;
  const formattedAmount = Math.abs(amount).toLocaleString();
  return `${isPositive ? '+' : '-'} PKR ${formattedAmount}`;
};

/**
 * Capitalizes and formats text by replacing underscores with spaces
 */
export const formatText = (text: string): string => {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Default filter options for salary history
 */
export const DEFAULT_FILTER_OPTIONS = [
  { value: 'all', label: 'All Changes' },
  { value: 'salary_increment', label: 'Salary Increments' },
  { value: 'bonus', label: 'Bonuses' },
  { value: 'deduction', label: 'Deductions' },
] as const;
