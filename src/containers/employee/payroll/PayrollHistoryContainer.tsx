'use client';
import ApplyLoanRequestButton from '@/components/employee/payroll/loan/ApplyLoanRequestButton';
import LoanHistoryTable from '@/components/employee/payroll/loan/LoanHistoryTable';
import AuthGuard from '@/components/employee/payroll/status/AuthGuard';
import CnicStatusAlert from '@/components/employee/payroll/status/CnicStatusAlert';
import MobilePayrollHistory from '@/components/shared/mobile-views/MobilePayrollHistory';
import { PayrollHistoryTable } from '@/components/shared/tables/payroll';
import MonthYearPicker from '@/components/ui/date-picker/MonthYearPicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useUserCnic } from '@/hooks/useUserCnic';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { MdOutlineCalendarMonth } from 'react-icons/md';

const PayrollHistoryContainer = () => {
  const { employeeId } = useAuthGuard();
  const { cnic: employeeCnic } = useUserCnic();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col gap-6 px-2 py-4 md:px-4">
        {/* Employee Payroll Section */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          {/* CNIC Status */}
          <CnicStatusAlert />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary-100">Employee Payroll</h2>
              <p className="mt-1 text-sm text-gray-600">Detailed breakdown of employee compensation and modifications</p>
            </div>
            {/* Month Selector */}
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-lg bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-200"
                  onClick={() => setDatePickerOpen(!datePickerOpen)}
                >
                  <MdOutlineCalendarMonth className="text-xl" />
                  <span>{format(selectedMonth, 'MMM yyyy')}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-4">
                <MonthYearPicker
                  selectedDate={selectedMonth}
                  onDateChange={(date) => {
                    setSelectedMonth(date);
                    setDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="h-full xl:h-[67vh] xxl:h-[75vh]">
            <PayrollHistoryTable employeeId={employeeId} employeeCnic={employeeCnic || ''} selectedMonth={selectedMonth} />
            <MobilePayrollHistory employeeId={employeeId} employeeCnic={employeeCnic || ''} />
          </div>
        </div>

        {/* Loan History Section */}
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xl font-bold text-primary-100">Loan History</span>
            <ApplyLoanRequestButton />
          </div>
          <LoanHistoryTable />
        </div>
      </div>
    </AuthGuard>
  );
};

export default PayrollHistoryContainer;
