import type { SalaryHistoryProps } from '@/types/salaryHistory';

import {
  EmployeeHeader,
  SalaryHistoryFilters,
  SalaryHistoryList,
} from '@/components/admin/payroll/salary-history';
import { useSalaryHistoryData, useSalaryHistoryFilters } from '@/hooks/salaryHistory';
import { useSalaryChangeLog } from '@/hooks/useSalaryIncrement';
import { DEFAULT_FILTER_OPTIONS } from '@/utils/salaryHistoryUtils';

import React from 'react';

const SalaryHistory: React.FC<SalaryHistoryProps> = ({ employeeId, employee, onBack }) => {
  const { data: salaryChangeLog, isLoading: changeLogLoading } = useSalaryChangeLog(employeeId);

  // Use custom hooks for filter state and data processing
  const { dateRange, setDateRange, selectedType, setSelectedType, clearAllFilters } = useSalaryHistoryFilters();
  const { filteredEntries } = useSalaryHistoryData(salaryChangeLog, dateRange, selectedType);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        {employee && <EmployeeHeader employee={employee} />}
        <SalaryHistoryFilters
          dateRange={dateRange}
          selectedType={selectedType}
          onDateRangeChange={setDateRange}
          onTypeChange={setSelectedType}
          onClearFilters={clearAllFilters}
          filterOptions={[...DEFAULT_FILTER_OPTIONS]}
          onBack={onBack}
        />
      </div>
      <SalaryHistoryList
        entries={filteredEntries}
        dateRange={dateRange}
        selectedType={selectedType}
        isLoading={changeLogLoading}
        salaryChangeLog={salaryChangeLog}
      />
    </div>
  );
};

export default SalaryHistory;
