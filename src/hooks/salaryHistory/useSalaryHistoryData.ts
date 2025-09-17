import type { SalaryChangeLogEntry } from '@/interfaces/SalaryIncrement';
import type { DateRange } from '@/types/salaryHistory';
import { filterEntries, sortEntriesByTimestamp } from '@/utils/salaryHistoryUtils';
import { useMemo } from 'react';

export const useSalaryHistoryData = (
  salaryChangeLog: SalaryChangeLogEntry[] | undefined,
  dateRange: DateRange,
  selectedType: string,
) => {
  // Sort entries by timestamp (most recent first)
  const sortedEntries = useMemo(() => {
    if (!salaryChangeLog || !Array.isArray(salaryChangeLog)) {
      return [];
    }
    return sortEntriesByTimestamp(salaryChangeLog);
  }, [salaryChangeLog]);

  // Filter entries based on date range and type
  const filteredEntries = useMemo(() => {
    return filterEntries(sortedEntries, dateRange, selectedType);
  }, [sortedEntries, dateRange, selectedType]);

  return {
    sortedEntries,
    filteredEntries,
  };
};
