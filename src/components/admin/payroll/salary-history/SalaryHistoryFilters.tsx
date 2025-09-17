import type { DateRange, FilterOption } from '@/types/salaryHistory';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import React from 'react';
import DateRangeFilter from './DateRangeFilter';
import TypeFilter from './TypeFilter';

type SalaryHistoryFiltersProps = {
  dateRange: DateRange;
  selectedType: string;
  onDateRangeChange: (range: DateRange) => void;
  onTypeChange: (type: string) => void;
  onClearFilters: () => void;
  filterOptions: FilterOption[];
  onBack?: () => void;
};

const SalaryHistoryFilters: React.FC<SalaryHistoryFiltersProps> = ({
  dateRange,
  selectedType,
  onDateRangeChange,
  onTypeChange,
  onClearFilters,
  filterOptions,
  onBack,
}) => {
  const hasActiveFilters = dateRange.from || dateRange.to || selectedType !== 'all';

  return (
    <div className="flex items-center gap-3">
      <DateRangeFilter
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />
      <TypeFilter
        selectedType={selectedType}
        onTypeChange={onTypeChange}
        options={filterOptions}
      />
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearFilters}
          className="size-8"
        >
          <X className="size-3.5" />
        </Button>
      )}
      {onBack && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          className="h-8"
        >
          Back
        </Button>
      )}
    </div>
  );
};

export default SalaryHistoryFilters;
