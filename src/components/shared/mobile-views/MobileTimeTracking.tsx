import type { Attendance } from '@/interfaces/Attendance';
import type { Employee } from '@/interfaces/Employee';
import { useFetchAttendance } from '@/hooks/useFetchAttendance';
import noRecordFound from '@/public/assets/record-not-found.png';
import { getHoursColorClass } from '@/utils/getTimeTrackingStatus';
import { formatWeekRange, getWeekStart } from '@/utils/weekUtils';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { IoMdTime } from 'react-icons/io';
import { LuCalendarDays } from 'react-icons/lu';

/**
 * Mobile Week Separator Component
 */
const MobileWeekSeparator: React.FC<{ weekRange: string }> = ({ weekRange }) => {
  return (
    <div className="mb-4 py-6">
      <div className="relative flex items-center justify-center">
        {/* Background dashed line */}
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
    </div>
  );
};

const NoDataFound = () => {
  return (
    <div className="flex h-4/5 flex-col items-center justify-center bg-secondary-100 p-4 sm:hidden">
      <Image src={noRecordFound} alt="no-record-found" height={130} width={170} />
      <p className="mt-2 text-center text-sm text-secondary-400">
        Oops! It looks like there are no time tracking records available at the moment
      </p>
    </div>
  );
};

type MobileTimeTrackerProps = {
  attendanceFilter?: string;
  selectedYear?: string;
  selectedMonth?: string;
  employee?: Employee;
  dateFilterForAdmin?: string;
  monthFilter?: string;
};

const MobileTimeTracker: React.FC<MobileTimeTrackerProps> = ({ attendanceFilter, selectedMonth, selectedYear, employee, dateFilterForAdmin }) => {
  const { data: attendanceData, loading, error } = useFetchAttendance(
    useMemo(() => ({ id: employee?.machineID as string }), [employee?.machineID]),
  );

  // Function to filter attendance based on total hours time, year, and month
  const filteredData = useMemo(() => {
    if (!attendanceData) {
      return [];
    }
    return attendanceData?.filter((entry: Attendance) => {
      const totalHours = Number.parseInt(entry.totalHours?.split(':')[0] ?? '0', 10);

      if (entry.day === 'Saturday' || entry.day === 'Sunday') {
        return false;
      }

      const entryDate = new Date(entry.date);
      const entryYear = entryDate.getFullYear().toString();
      const entryMonth = entryDate.toLocaleString('en-US', { month: 'short' });

      if (selectedYear && entryYear !== selectedYear) {
        return false;
      }
      if (selectedMonth && entryMonth !== selectedMonth) {
        return false;
      }
      if (dateFilterForAdmin) {
        const dateRange = dateFilterForAdmin.split(' to ');
        if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
          const fromDate = new Date(dateRange[0]);
          const toDate = new Date(dateRange[1]);
          if (entryDate < fromDate || entryDate > toDate) {
            return false;
          }
        }
      }

      if (attendanceFilter?.toLowerCase() === 'late') {
        return totalHours < 8;
      }
      if (attendanceFilter?.toLowerCase() === 'present') {
        return totalHours >= 8;
      }
      if (attendanceFilter?.toLowerCase() === 'present') {
        return totalHours;
      }
      return true;
    }).sort((a: Attendance, b: Attendance) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by latest date;
  }, [attendanceData, selectedYear, dateFilterForAdmin, selectedMonth, attendanceFilter]);

  // Group data by weeks and create mobile cards with separators
  const mobileCards = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }

    const cards: React.ReactNode[] = [];
    let currentWeekStart: Date | null = null;

    filteredData.forEach((attendance: Attendance) => {
      const entryDate = new Date(attendance.date);
      const entryWeekStart = getWeekStart(entryDate);

      // Check if we need to add a week separator
      if (!currentWeekStart || entryWeekStart.getTime() !== currentWeekStart.getTime()) {
        // Add separator (except for the first week)
        if (currentWeekStart !== null) {
          cards.push(
            <MobileWeekSeparator
              key={`mobile-week-separator-${entryWeekStart.getTime()}`}
              weekRange={formatWeekRange(entryWeekStart)}
            />,
          );
        }
        currentWeekStart = entryWeekStart;
      }

      // Add the original attendance card with preserved styling
      cards.push(
        <div key={attendance.date} className="mb-4 rounded-md bg-white p-3 shadow-md">
          <div className="flex items-center gap-2">
            <div className="my-1 flex w-fit flex-col items-center justify-center rounded-lg bg-secondary-100 px-2 py-1.5">
              <span className="text-sm text-primary-100">
                {new Date(attendance.date).toLocaleDateString('en-GB', { day: '2-digit' })}
              </span>
              <span className="text-sm font-medium text-primary-100">
                {new Date(attendance.date).toLocaleDateString('en-GB', { month: 'short' })}
              </span>
            </div>
            <div className="w-full">
              <p className="text-sm text-primary-100">{attendance.day}</p>
              <p className="text-xs text-secondary-300">
                <span>{attendance.firstCheckIn}</span>
                {' '}
                -
                <span>{attendance.lastCheckOut}</span>
              </p>
            </div>
          </div>
          <hr className="my-3 border border-[#F1F1F1]" />

          <div className="rounded-lg bg-secondary-100 p-1">
            <div className="flex">
              <div className="flex w-full flex-col justify-center">
                <span className="block text-center text-xs">
                  <span className="inline-block size-3 rounded-full bg-[#177B1B]"></span>
                  {' '}
                  <span>
                    Check In
                  </span>
                </span>
                <span className="mt-3 text-center text-sm font-medium text-primary-100">{attendance.firstCheckIn}</span>
              </div>
              <div className="flex w-full flex-col justify-center">
                <span className="block text-center text-xs">
                  <span className="inline-block size-3 rounded-full bg-[#F44336]"></span>
                  {' '}
                  Check Out
                </span>
                <span className="mt-3 text-center text-sm font-medium text-primary-100">{attendance.lastCheckOut}</span>
              </div>
              <div className="flex w-full flex-col items-center">
                <span className="flex items-center justify-center text-xs">
                  <IoMdTime />
                  {' '}
                  Total Hours
                </span>
                <span className={`mt-3 rounded-full px-2 py-1 text-sm font-medium ${getHoursColorClass(attendance.totalHours || '')}`}>
                  {attendance.totalHours}
                </span>
              </div>
            </div>
          </div>
        </div>,
      );
    });

    return cards;
  }, [filteredData]);

  if (loading) {
    return <div className="text-center text-lg font-semibold text-primary-100 md:hidden">Loading...</div>;
  }

  if (error) {
    return <NoDataFound />;
  }

  return (
    <div className="h-full rounded-md bg-secondary-100 p-3 md:hidden">
      {filteredData?.length > 0 ? mobileCards : <NoDataFound />}
    </div>
  );
};

export default MobileTimeTracker;
