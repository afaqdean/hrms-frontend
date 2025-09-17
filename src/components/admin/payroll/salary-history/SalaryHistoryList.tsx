import type { SalaryChangeLogEntry } from '@/interfaces/SalaryIncrement';
import type { DateRange } from '@/types/salaryHistory';
import LoadingState from '@/components/ui/LoadingState';
import React from 'react';
import SalaryChangeEntry from './SalaryChangeEntry';

type SalaryHistoryListProps = {
  entries: SalaryChangeLogEntry[];
  dateRange: DateRange;
  selectedType: string;
  isLoading: boolean;
  salaryChangeLog: SalaryChangeLogEntry[] | undefined;
};

const SalaryHistoryList: React.FC<SalaryHistoryListProps> = ({
  entries,
  dateRange,
  selectedType,
  isLoading,
  salaryChangeLog,
}) => {
  if (isLoading) {
    return (
      <LoadingState
        type="loading"
        message="Loading salary history..."
        showSpinner
        className="py-8"
      />
    );
  }

  if (!salaryChangeLog || !Array.isArray(salaryChangeLog)) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-2 text-4xl text-gray-400">⚠️</div>
          <div className="text-gray-500">Unable to load salary history</div>
          <div className="mt-1 text-sm text-gray-400">
            Data format error: Expected array but got
            {' '}
            {typeof salaryChangeLog}
          </div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="mb-2 text-4xl text-gray-400"></div>
          <div className="text-gray-500">
            {dateRange.from || dateRange.to || selectedType !== 'all'
              ? 'No salary changes found with the selected filters'
              : 'No salary changes found'}
          </div>
          <div className="mt-1 text-sm text-gray-400">
            {dateRange.from || dateRange.to || selectedType !== 'all'
              ? 'Try adjusting your filters or clear all filters'
              : 'Salary changes will appear here once bonuses, deductions, or increments are created'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
      {entries.map((entry: SalaryChangeLogEntry) => (
        <SalaryChangeEntry key={entry._id} entry={entry} />
      ))}
    </div>
  );
};

export default SalaryHistoryList;
