import type { DateRange } from '@/types/salaryHistory';
import { useState } from 'react';

export const useSalaryHistoryFilters = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedType, setSelectedType] = useState<string>('all');

  const clearAllFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setSelectedType('all');
  };

  return {
    dateRange,
    setDateRange,
    selectedType,
    setSelectedType,
    clearAllFilters,
  };
};
