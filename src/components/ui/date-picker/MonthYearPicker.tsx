'use client';

import React, { useState } from 'react';

type MonthYearPickerProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ selectedDate, onDateChange }) => {
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
    <div className="w-64">
      {/* Year Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleYearChange('prev')}
          className="flex size-8 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-900">{currentYear}</span>
        <button
          type="button"
          onClick={() => handleYearChange('next')}
          className="flex size-8 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
                  : 'text-gray-700 hover:bg-gray-100'
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
