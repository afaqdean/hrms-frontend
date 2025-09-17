'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

type MonthYearPickerProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
};

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  selectedDate,
  onDateChange,
  className = 'w-64',
}) => {
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    onDateChange(newDate);
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  return (
    <div className={className}>
      {/* Year Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleYearChange('prev')}
          className="flex size-8 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-100"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-lg font-semibold text-gray-900">{currentYear}</span>
        <button
          type="button"
          onClick={() => handleYearChange('next')}
          className="flex size-8 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary-100"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Months Grid */}
      <div className="grid grid-cols-4 gap-1">
        {months.map((month, index) => {
          const isSelected = selectedDate.getFullYear() === currentYear && selectedDate.getMonth() === index;
          return (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthClick(index)}
              className={`flex h-12 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-primary-100 text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary-100'
              }`}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthYearPicker;
