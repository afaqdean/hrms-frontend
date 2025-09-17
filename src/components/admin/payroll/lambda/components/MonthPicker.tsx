import { format } from 'date-fns';
import React from 'react';

type MonthPickerProps = {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
};

const MonthPicker: React.FC<MonthPickerProps> = ({ selectedMonth, onMonthChange }) => {
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + 1);
    onMonthChange(newDate);
  };

  return (
    <div className="flex justify-end">
      <div className="flex flex-col items-end">
        <label htmlFor="processing-month" className="mb-2 flex items-center gap-2 text-sm font-medium text-secondary-300">
          Processing Month
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-secondary-200 bg-secondary-100 px-4 py-2 text-sm font-medium text-primary-100">
          <button
            type="button"
            className="rounded px-2 py-1 text-xs transition-colors hover:bg-secondary-200"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            ←
          </button>
          <span>{format(selectedMonth, 'MMM yyyy')}</span>
          <button
            type="button"
            className="rounded px-2 py-1 text-xs transition-colors hover:bg-secondary-200"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthPicker;
