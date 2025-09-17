import type { Attendance } from '@/interfaces/Attendance';
import type { Employee } from '@/interfaces/Employee';
import Loader from '@/components/ui/Loader';
import { useFetchAttendance } from '@/hooks/useFetchAttendance';
import { getHoursColorClass } from '@/utils/getTimeTrackingStatus';
import { formatWeekRange, getWeekStart } from '@/utils/weekUtils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import noRecordFound from 'public/assets/record-not-found.png';
import React, { useMemo } from 'react';
import { LuCalendarDays, LuClock5 } from 'react-icons/lu';

import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../ui/table';

/**
 * NoTableDataFound Component
 * - Displays a message when there are no records available in the table.
 */
const NoTableDataFound = () => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="w-full">
        <div className="flex flex-col items-center justify-center bg-secondary-100 md:h-[44vh] xl:h-[40vh] xxl:h-[54vh]">
          <Image src={noRecordFound} alt="no-record-found" height={130} width={170} />
          <p className="mt-2 text-center text-sm text-secondary-400">
            Oops! It looks like there are no time tracking records available at the moment
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

const LoadingMessage = () => (
  <div className="hidden flex-col items-center justify-center bg-white md:flex  xl:h-[45vh] xxl:h-[55vh]">
    <Loader size="md" withText text="Loading Time Tracking Data..." />
  </div>
);

/**
 * Week Separator Component
 */
const WeekSeparator: React.FC<{ weekRange: string }> = ({ weekRange }) => {
  return (
    <TableRow>
      <TableCell colSpan={4} className="py-6">
        <div className="relative flex items-center justify-center">
          {/* Background gradient line */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-secondary-300"></div>
          </div>

          {/* Week label with enhanced styling */}
          <div className="relative flex items-center gap-3  px-6 py-2">
            <div className="flex items-center gap-2 rounded-lg border border-secondary-200 bg-white px-4 py-2 shadow-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary-100 text-white">
                <LuCalendarDays className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-secondary-400">
                  Work Week
                </span>
                <span className="text-sm font-semibold text-primary-100">
                  {weekRange}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

/**
 * TimeTrackingTable Component
 * - Displays a table of employee time tracking records.
 * - If no records are found, it renders the `NoTableDataFound` component.
 */

type TimeTrackingTableProps = {
  attendanceFilter?: string;
  className?: string;
  selectedYear?: string;
  selectedMonth?: string;
  employee?: Employee;
  dateFilterForAdmin?: string;
  monthFilter?: string;
};

const TimeTrackingTable: React.FC<TimeTrackingTableProps> = ({ attendanceFilter, className, selectedYear, selectedMonth, employee, dateFilterForAdmin, monthFilter }) => {
  const { data: timeData, loading, error } = useFetchAttendance(
    useMemo(() => ({ id: employee?.machineID }), [employee?.machineID]),
  );
  const pathname = usePathname();
  const dateRange = dateFilterForAdmin?.split(' to ');

  // Function to filter attendance based on total hours time, year, and month
  const filteredData = useMemo(() => {
    if (!timeData) {
      return [];
    }
    return timeData
      ?.filter((entry: Attendance) => {
        const totalHours = Number.parseInt(entry.totalHours?.split(':')[0] ?? '0', 10);

        const entryDate = new Date(entry.date);
        const entryYear = entryDate.getFullYear().toString();
        const entryMonth = entryDate.toLocaleString('en-US', { month: 'short' });
        const employeeEntryMonth = entryDate.toLocaleString('en-US', { month: 'long' });

        if (monthFilter && monthFilter !== 'All Time' && employeeEntryMonth.toLowerCase() !== monthFilter.toLowerCase()) {
          return false;
        }

        if (selectedYear && entryYear !== selectedYear) {
          return false;
        }
        if (selectedMonth && entryMonth !== selectedMonth) {
          return false;
        }
        if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
          const fromDate = new Date(dateRange[0]);
          const toDate = new Date(dateRange[1]);
          if (entryDate < fromDate || entryDate > toDate) {
            return false;
          }
        }

        if (attendanceFilter?.toLowerCase() === 'present') {
          return totalHours >= 7.75; // Green: ≥ 07h 45m
        }
        if (attendanceFilter?.toLowerCase() === 'partial') {
          return totalHours >= 6.0 && totalHours < 7.75; // Yellow: 06h 00m – 07h 44m
        }
        if (attendanceFilter?.toLowerCase() === 'short') {
          return totalHours < 6.0; // Red: < 06h 00m
        }
        // 'all' or any other value shows all records
        return true;
      })
      .sort((a: Attendance, b: Attendance) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by latest date
  }, [timeData, selectedYear, selectedMonth, dateRange, attendanceFilter, monthFilter]);

  // Group data by weeks and create table rows with separators
  const tableRows = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    const rows: React.ReactNode[] = [];
    let currentWeekStart: Date | null = null;
    let rowIndex = 0;

    filteredData.forEach((entry: Attendance, _index: number) => {
      const entryDate = new Date(entry.date);
      const entryWeekStart = getWeekStart(entryDate);

      // Check if we need to add a week separator
      if (!currentWeekStart || entryWeekStart.getTime() !== currentWeekStart.getTime()) {
        // Add separator (except for the first week)
        if (currentWeekStart !== null) {
          rows.push(
            <WeekSeparator
              key={`week-separator-${entryWeekStart.getTime()}`}
              weekRange={formatWeekRange(entryWeekStart)}
            />,
          );
        }
        currentWeekStart = entryWeekStart;
      }

      const date = new Date(entry.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      rows.push(
        <TableRow key={entry.date} className="border-b">
          {/* Day & Date Column */}
          <TableCell>
            <div className="flex items-center gap-2">
              {/* Circular Index Number */}
              <span className={`flex size-10 items-center justify-center rounded-full ${getHoursColorClass(entry.totalHours || '')}`}>
                {rowIndex + 1}
              </span>
              <div>
                <span className="flex justify-start font-normal text-primary-100">
                  {entry.day}
                </span>
                <span className="block text-sm text-secondary-400">{date}</span>
              </div>
            </div>
          </TableCell>

          {/* Check-In Time Column */}
          <TableCell>
            <div className="flex items-center gap-1 text-primary-100">
              <LuClock5 />
              <span>{entry.firstCheckIn}</span>
            </div>
          </TableCell>

          {/* Check-Out Time Column */}
          <TableCell>
            <div className="flex items-center gap-1 text-primary-100">
              <LuClock5 />
              <span>{entry.lastCheckOut}</span>
            </div>
          </TableCell>

          {/* Total Hours Column */}
          <TableCell className="py-3">
            <div
              className={`flex max-w-24 items-center justify-center gap-2 rounded-full p-1 ${
                getHoursColorClass(entry.totalHours || '')
              }`}
            >
              <LuClock5 />
              <span>{entry.totalHours}</span>
            </div>
          </TableCell>
        </TableRow>,
      );

      rowIndex++;
    });

    return rows;
  }, [filteredData]);

  return (
    <div className={`scrollbar hidden w-full overflow-y-scroll rounded-2xl bg-white shadow-sm md:block md:h-[56vh] md:p-4 xxl:p-6 ${
      pathname === '/dashboard/employee/time-tracking'
        ? 'lg:max-h-[62vh] lg:min-h-[74vh] xl:min-h-[66vh] xxl:min-h-[74vh]'
        : ''
    } ${className}`}
    >
      {/* Loading State */}
      {loading && (
        <LoadingMessage />)}

      {!loading && (
        <Table>
          {/* Table Header */}
          <TableHeader className="custom-table-header">
            <TableRow>
              <TableCell>Day/Date</TableCell>
              <TableCell>Check In Time</TableCell>
              <TableCell>Check Out Time</TableCell>
              <TableCell>Total Hours</TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {filteredData?.length === 0 || error
              ? (
                  <NoTableDataFound />
                )
              : (
                  tableRows
                )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TimeTrackingTable;
