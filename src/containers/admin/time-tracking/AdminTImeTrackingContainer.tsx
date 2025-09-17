'use client';

import type { DateRange } from 'react-day-picker';
import EmployeeDetailsBadge from '@/components/admin/employee-section/EmployeeDetailsBadge';
import Employees from '@/components/admin/employee-section/Employees';
import ImportDevice from '@/components/admin/pop-ups/ImportDevice';
import { UploadCSV } from '@/components/admin/pop-ups/UploadCSV';
import ModalUI from '@/components/Modal';
import MobileTimeTracker from '@/components/shared/mobile-views/MobileTimeTracking';
import LastUpdatePill from '@/components/shared/pills/LastUpdatePill';
import TimeTrackingTable from '@/components/shared/tables/time-tracking/TimeTrackingTable';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Loader from '@/components/ui/Loader';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { months } from '@/constants/data/months';
import useSelectedEmployee from '@/hooks/useSelectedEmployee';
import { cn } from '@/lib/utils';
import employeeRecordNotFound from '@/public/assets/NoEmployeeRecordFound.png';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BiImport } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineFileUpload } from 'react-icons/md';

// Add the NoEmployeeDisplaySection component
const NoEmployeeDisplaySection = () => {
  return (
    <div className="flex size-full flex-col items-center justify-center rounded-2xl bg-white md:mt-4 md:h-[73vh] xl:mt-2">
      <Image
        src={employeeRecordNotFound}
        alt="no-employee-records-pic"
        height={130}
        width={200}
      />
      <p className="mt-4 text-center text-sm text-secondary-400">
        No employees to display..!!
      </p>
    </div>
  );
};

const AdminTimeTrackingContainer: React.FC = () => {
  const router = useRouter();
  const { slug } = useParams();
  // Get employee ID from URL params
  const selectedEmployeeId = Array.isArray(slug) ? slug[0] : slug;

  // Custom hook to fetch and manage selected employee state
  const { employeeData, employeeLoading, selectedEmployee, setSelectedEmployeeId } = useSelectedEmployee();

  // Set selected employee ID when URL param changes
  useEffect(() => {
    if (selectedEmployeeId) {
      setSelectedEmployeeId(selectedEmployeeId);
    }
  }, [selectedEmployeeId, setSelectedEmployeeId]);

  // State for upload CSV modal
  const [uploadCSV, setUploadCSV] = useState<boolean>(false);
  const [importDevice, setImportDevice] = useState<boolean>(false);
  // State for selected month and year
  const currentMonthIndex = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  // List of years for dropdown
  const years = [currentYear, currentYear - 1, currentYear - 2];
  // State for attendance status filter
  const [attendanceFilter, setAttendanceFilter] = useState('All');

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Show loader while fetching employees
  if (employeeLoading || !employeeData) {
    return (
      <div className=" mx-2 mt-4 flex h-full items-center  justify-center rounded-2xl bg-white md:mx-0  md:h-[70vh] xxl:h-[80vh]">
        <Loader size="md" withText text="Loading employees..." />
      </div>
    );
  }

  // Show NoEmployeeDisplaySection if there are no employees
  if (!employeeData.length) {
    return (
      <div className="h-full max-sm:pl-2">
        <h2 className="mt-4 text-base font-medium text-primary-100 md:hidden">Time Tracking</h2>
        <div className="h-96 max-sm:absolute max-sm:top-36 max-sm:w-11/12">
          <NoEmployeeDisplaySection />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header section with title and upload CSV button (desktop only) */}
      <div className="mb-2 hidden flex-row items-center justify-between px-2 md:flex md:px-0">
        <span>
          <h2 className="text-sm font-medium text-primary-100 md:text-base">Time Tracking</h2>
          <p className="text-xs text-secondary-300 md:text-sm">Monitor and manage employee work hours effectively</p>
        </span>

        <div className="flex items-center gap-3">
          {/* Date Filter Popover */}
          <div className="flex items-center gap-4">
            <LastUpdatePill />
            <label htmlFor="date-filter" className="text-sm font-medium text-primary-100">
              Filter by Date:
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[270px] justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground',
                  )}
                >
                  {dateRange?.from && dateRange?.to
                    ? (
                        `${format(dateRange.from, 'dd MMMM yyyy')} - ${format(dateRange.to, 'dd MMMM yyyy')}`
                      )
                    : (
                        <span>Pick a date</span>
                      )}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dateRange?.from && dateRange?.to && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange(undefined)}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Import Device button */}
          <Button
            className="flex size-14 items-center justify-center rounded-full bg-primary text-sm text-white md:h-10 md:w-fit md:justify-evenly md:rounded-md"
            onClick={() => setImportDevice(true)}
          >
            <BiImport className=" text-lg md:mr-2" />
            <span className="hidden md:block">Import from Device</span>
          </Button>

          {/* Upload CSV button */}
          <Button
            className="flex size-14 items-center justify-center rounded-full bg-primary text-sm text-white md:h-10 md:w-fit md:justify-evenly md:rounded-md"
            onClick={() => setUploadCSV(true)}
          >
            <MdOutlineFileUpload className=" text-lg md:mr-2" />
            <span className="hidden md:block">Upload CSV File</span>
          </Button>

        </div>
        {/* Upload CSV Modal */}
        {uploadCSV && (
          <ModalUI
            isOpen={uploadCSV}
            handleOpen={() => setUploadCSV(true)}
            handleClose={() => setUploadCSV(false)}
          >
            <UploadCSV onCloseAction={() => setUploadCSV(false)} />
          </ModalUI>
        )}

        {/* Import device Modal */}
        {importDevice && (
          <ModalUI
            isOpen={importDevice}
            handleOpen={() => setImportDevice(true)}
            handleClose={() => setImportDevice(false)}
          >
            <ImportDevice
              onClose={() => setImportDevice(false)}
            />
          </ModalUI>
        )}

      </div>

      <div className="rounded-xl">
        {/* Mobile View */}
        <div className="block md:hidden">
          {selectedEmployee
            ? (
                // Show Time Tracking Details for selected employee
                <div className="mx-2 h-full rounded-2xl bg-white">
                  <div className="flex items-center justify-start py-2">
                    {/* Back button to employee list */}
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/admin/time-tracking')}
                      className="size-6 rounded-none border-none bg-none text-sm shadow-none"
                    >
                      <FaArrowLeft />
                    </Button>
                  </div>
                  <div className="mb-4">
                    {/* Employee details badge */}
                    <EmployeeDetailsBadge employeeName={selectedEmployee.name} employeePosition={selectedEmployee.position} imgSrc={selectedEmployee.profileImage} joiningDate={selectedEmployee.joiningDate} employeeId={selectedEmployee._id} />
                  </div>
                  <div className="mb-2 flex w-full items-center gap-2 px-2">

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !dateRange && 'text-muted-foreground',
                          )}
                        >
                          {dateRange?.from && dateRange?.to
                            ? (
                                `${format(dateRange.from, 'dd MMMM yyyy')} - ${format(dateRange.to, 'dd MMMM yyyy')}`
                              )
                            : (
                                <span>Filter by Date</span>
                              )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    {dateRange?.from && dateRange?.to && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDateRange(undefined)}
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {/* Dropdowns for selecting year and month */}
                  <div className="mb-2 flex w-full items-center justify-between px-2">
                    {/* Year Dropdown */}
                    <div className="w-1/2 pr-1">
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white p-2  shadow-sm">
                          <SelectValue>{selectedYear}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-50 rounded-lg border border-gray-200 bg-white text-center shadow-lg">
                          <SelectGroup>
                            {years.map(year => (
                              <SelectItem key={year} value={year.toString()} className="px-4 py-2 text-center hover:bg-gray-100">
                                {year}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Month Dropdown */}
                    <div className="w-1/2 pl-1">
                      <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
                        <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white p-2  shadow-sm">
                          <SelectValue>{attendanceFilter}</SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-50 rounded-lg border border-gray-200 bg-white shadow-lg">
                          <SelectGroup className="">
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Partial">Partial</SelectItem>
                            <SelectItem value="Short">Short</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Mobile time tracking table */}
                  <div className="h-full rounded-b-2xl bg-white px-2 pb-4 shadow-none">
                    <h4 className="py-2 text-base font-medium">Time Tracking</h4>
                    <MobileTimeTracker
                      selectedMonth={selectedMonth}
                      selectedYear={selectedYear}
                      employee={selectedEmployee}
                      dateFilterForAdmin={dateRange?.from && dateRange?.to ? `${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}` : undefined}
                      attendanceFilter={attendanceFilter}
                    />
                  </div>
                </div>
              )
            : (
                // Show Employee List if no employee is selected
                <div className="mx-2 h-full rounded-2xl">
                  <div className="mb-4 flex items-center justify-between ">
                    <span>
                      <h2 className="text-sm font-medium text-primary-100 md:text-base">Time Tracking</h2>
                      <p className="text-xs text-secondary-300 md:text-sm">Monitor and manage employee work hours effectively</p>
                    </span>

                    {/* Upload CSV button (mobile) */}
                    <Button
                      className="flex size-14 items-center justify-center rounded-full bg-primary text-sm text-white md:h-10 md:w-fit md:justify-evenly md:rounded-md"
                      onClick={() => setUploadCSV(true)}
                    >
                      <MdOutlineFileUpload className=" text-lg md:mr-2" />
                      <span className="hidden md:block">Upload CSV File</span>
                    </Button>
                  </div>

                  {/* Employees list */}
                  <Employees
                    employees={employeeData}
                    setter={(index) => {
                      const employee = employeeData?.[index];
                      if (employee) {
                        router.push(`/dashboard/admin/time-tracking/${employee._id}`);
                      }
                    }}
                  />
                </div>
              )}
        </div>

        {/* Desktop View (Unchanged Layout & Styling) */}
        <div className="hidden w-full gap-4 md:flex">
          {/* Employees list (left panel) */}
          <div className="size-full rounded-2xl md:h-[60vh] md:w-2/6 xl:h-[65vh] xxl:h-[74vh]">
            <Employees
              employees={employeeData}
              setter={(index) => {
                const employee = employeeData?.[index];
                if (employee) {
                  setSelectedEmployeeId(employee._id);
                  router.push(`/dashboard/admin/time-tracking/${employee._id}`);
                }
              }}
            />
          </div>

          {/* Time tracking table (right panel) */}
          <div className="rounded-2xl bg-white md:h-[60vh] md:w-4/6  xl:h-[65vh] xxl:h-[74vh]">
            {selectedEmployee
              ? (
                  <>

                    {/* Year and month selectors */}
                    <div className="flex items-center pr-4">
                      <div className="flex w-1/5 items-center justify-between px-4 py-2">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white p-2 text-center  shadow-sm">
                            <SelectValue>{selectedYear}</SelectValue>
                          </SelectTrigger>
                          <SelectContent className=" cursor-pointer rounded-lg border border-gray-200 bg-white shadow-lg ">
                            <SelectGroup>
                              {years.map(year => (
                                <SelectItem key={year} value={year.toString()} className="px-4 py-2 text-center hover:bg-gray-100 focus:ring-0 focus-visible:outline-none">
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Month buttons */}
                      <div className="flex w-full justify-between px-4 py-2">
                        {months.map(month => (
                          <Button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            variant="outline"
                            className={`rounded-full px-3 py-2 text-xs transition-all ${
                              selectedMonth === month ? 'bg-black text-white' : 'bg-white text-gray-500'
                            }`}
                          >
                            {month}
                          </Button>
                        ))}
                      </div>

                    </div>

                    {/* Time tracking table for selected employee */}
                    <div className="h-full  rounded-2xl  px-4 md:h-[50vh] xl:h-[50vh] xxl:h-[61vh]">
                      <TimeTrackingTable
                        selectedMonth={selectedMonth}
                        className=" rounded-xl  md:h-[44vh] xl:h-[54vh] xxl:h-[65vh]"
                        selectedYear={selectedYear}
                        employee={selectedEmployee}
                        dateFilterForAdmin={dateRange?.from && dateRange?.to ? `${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}` : undefined}
                        attendanceFilter={attendanceFilter}
                      />
                    </div>
                  </>
                )
              : (
                  // Prompt to select an employee if none is selected
                  <div className="flex h-full items-center justify-center text-lg text-gray-500">
                    Select an employee to see time tracking
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTimeTrackingContainer;
