'use client';

import MobileTimeTracker from '@/components/shared/mobile-views/MobileTimeTracking';
import TimeTrackingTable from '@/components/shared/tables/time-tracking/TimeTrackingTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';

const EmployeeTimeTrackingContainer = () => {
  const [attendanceFilter, setAttendanceFilter] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('All Time');

  const months = [
    'All Time',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-col items-start justify-between px-2 sm:flex-row sm:items-center md:px-0">
        <span className="text-lg font-medium text-primary-100">Time Tracking</span>
        <div className="flex gap-2 max-sm:mt-4 max-sm:w-full">

          <Select onValueChange={setMonthFilter} value={monthFilter}>
            <SelectTrigger className="w-36 bg-white max-sm:w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setAttendanceFilter} value={attendanceFilter}>
            <SelectTrigger className="w-36 bg-white max-sm:w-full">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Partial">Partial</SelectItem>
              <SelectItem value="Short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-2xl md:mt-4 xl:h-[67vh] xxl:h-[74vh]">
        <TimeTrackingTable attendanceFilter={attendanceFilter} monthFilter={monthFilter} />
        <MobileTimeTracker attendanceFilter={attendanceFilter} monthFilter={monthFilter} />
      </div>
    </div>
  );
};

export default EmployeeTimeTrackingContainer;
