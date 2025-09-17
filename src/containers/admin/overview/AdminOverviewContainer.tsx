/* eslint-disable style/multiline-ternary */
'use client';

import type { LoanDeduction, PayrollEmployee } from '@/interfaces/PayrollEmployee';
import AdminOverviewCardComponentsContainer from '@/components/admin/cards/AdminOverviewCardsContainer';
import ModalUI from '@/components/Modal';
import LastUpdatePill from '@/components/shared/pills/LastUpdatePill';
import ViewLeaveApplication from '@/components/shared/pop-ups/ViewLeaveApplication';
import { Button } from '@/components/ui/button';
import MonthYearPicker from '@/components/ui/date-picker/MonthYearPicker';
import Loader from '@/components/ui/Loader';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useFetchDashboardLeaveRequest } from '@/hooks/useAdminDashboardLeaveRequests';
import { useAdminPayrollOverview } from '@/hooks/useAdminPayrollOverview';
import { useConversation } from '@/hooks/useConversation';
import { useLeaveActions } from '@/hooks/useLeaveActions';

import { useMessages } from '@/hooks/useMessages';
import { useFetchTopEmployees } from '@/hooks/useTopEmployeesStats';
import avatar from '@/public/assets/avatar.jpg';
import { format } from 'date-fns';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import messagesNotFound from 'public/assets/messagesNotFound.png';
import React, { useEffect, useState } from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { LuMessageCircleMore } from 'react-icons/lu';
import { MdClose, MdOutlineCalendarMonth } from 'react-icons/md';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TooltipProps = {
  active?: boolean;
  payload?: { value: number; payload: { name: string } }[];
};

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border bg-secondary-100 p-2 shadow-md">
      {payload?.[0]?.payload && (
        <p className="text-sm font-semibold">
          {payload[0].payload.name.replace(/\./g, ' ')}
        </p>
      )}
      <p className="text-xs text-gray-600">
        Total Work Hours:
        {' '}
        {payload[0]?.value}
        {' '}
        hrs
      </p>
    </div>
  );
};

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const imageSize = 45;
  const yOffset = 5;

  const initialSrc = payload?.value || avatar;
  const [imgSrc, setImgSrc] = useState(initialSrc);

  // Re-run if payload.value changes
  useEffect(() => {
    setImgSrc(payload?.value || avatar);
  }, [payload?.value]);

  return (
    <foreignObject x={x - imageSize / 2} y={y + yOffset} width={imageSize} height={imageSize}>
      <div className="flex size-full justify-center">
        <Image
          src={imgSrc}
          alt="Profile"
          width={imageSize}
          height={imageSize}
          onError={() => setImgSrc(avatar)}
          className="rounded-full border border-gray-300 object-cover shadow-md"
        />
      </div>
    </foreignObject>
  );
};

// Component to display when there are no messages in the conversation
const NoMessagesFound = () => (
  <div className="flex w-full flex-col items-center justify-center bg-secondary-100 p-4 xl:h-[49vh]">
    <Image src={messagesNotFound} alt="no-record-found" height={72} width={72} />
    <p className="mt-2 text-center text-sm text-secondary-400">
      No messages yet. Start a conversation to see your chats here
    </p>
  </div>
);

const AdminOverview: React.FC = () => {
  const { userData } = useAuth();
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [viewLeaveApplicationModal, setViewLeaveApplicationModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [conversationDrawerOpen, setCoversationDrawerOpen] = useState<boolean>(false);

  // Remove calendarSelection, dateRange, and related range logic
  // Add selectedMonth state
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Calculate period string for backend
  const getPeriodString = () => {
    return `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  };
  const period = getPeriodString();
  const { conversation, conversationMessagesLoading, chatContainerRef, scrollAnchorRef } = useConversation(activeConversationId || '');
  const { sendMessageMutation } = useMessages(activeConversationId || '');
  const { handleApprove, handleReject, isApproving, isRejecting } = useLeaveActions(selectedLeave, () => {});

  const [selectedFilter, setSelectedFilter] = useState('month');
  const { data: topEmployees, isLoading: barChartDataLoading, isFetching: barChartDataFetching } = useFetchTopEmployees(selectedFilter);
  const { data: leaveRequests, isLoading: leaveRequestsLoading } = useFetchDashboardLeaveRequest();
  const { data: payrollOverview, isLoading: payrollLoading } = useAdminPayrollOverview(period);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleViewApplication = (leave: any) => {
    setSelectedLeave(leave);
    setViewLeaveApplicationModal(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversationId) {
      return;
    }
    try {
      setMessage(''); // Immediately clear the message as user clicks send
      const messageContent = message;
      await sendMessageMutation.mutateAsync(messageContent);
    } catch (error) {
      console.error('Error Sending Message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" withText text="Loading your dashboard..." />
      </div>
    );
  }

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return <h1 className="text-2xl font-semibold">Good Morning</h1>;
    } else if (currentHour < 18) {
      return <h1 className="text-2xl font-semibold">Good Afternoon</h1>;
    } else {
      return <h1 className="text-2xl font-semibold">Good Evening</h1>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 px-2 py-4 md:px-4">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between pr-4 md:flex-row md:items-center">
        <div className="flex flex-col">
          {getGreeting()}
          <p className="mt-1 text-lg font-light">
            Hello
            {' '}
            {userData?.name}
            {' '}
            <motion.span
              animate={{ rotate: [0, 20, 0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="inline-block"
            >
              👋
            </motion.span>
          </p>
        </div>
        <div className="flex items-center gap-2 max-md:mt-4">
          <h2 className="text-sm font-medium">Time Tracking: </h2>
          <LastUpdatePill />
        </div>
      </div>

      {/* Cards Section */}
      <div className="w-full">
        <AdminOverviewCardComponentsContainer />
      </div>

      {/* Main Content Section - Analytics and Leave Applications */}
      <div className="flex w-full flex-col gap-6 lg:flex-row">
        {/* Analytics Section */}
        <div className="flex w-full flex-col rounded-2xl lg:w-1/2">
          <div className="mb-4 flex items-center justify-between p-2">
            <span className="text-lg font-medium text-primary-100">Analytics</span>
            <BsArrowUpRightCircle
              className="size-6 cursor-pointer text-primary-100 transition-transform hover:scale-110 hover:text-black md:size-8"
              onClick={() => router.push('/dashboard/admin/employees-management')}
            />
          </div>

          <div className="flex-1 rounded-2xl bg-white px-2 py-4 md:p-6">
            <div className="flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Top 5 Employees Work Hours Analysis</p>
                <Select
                  value={selectedFilter}
                  onValueChange={value => setSelectedFilter(value)}
                >
                  <SelectTrigger className="w-32 border-gray-300 text-sm md:w-44">
                    <SelectValue placeholder="Select a filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="alltime">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="h-64 w-full md:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {barChartDataLoading || barChartDataFetching ? (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        <Loader size="md" withText text="Loading data..." />
                      </div>
                    ) : topEmployees?.employees?.length > 0 ? (
                      <BarChart
                        data={topEmployees.employees.map((emp: any) => ({
                          ...emp,
                          profileImage: emp?.profileImage,
                        }))}
                        margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                      >
                        <XAxis dataKey="profileImage" tick={<CustomXAxisTick />} tickSize={0} tickLine={false} interval={0} />
                        <YAxis tick={{ fontSize: 13, fill: '#555' }} tickFormatter={tick => `${tick}\u00A0hrs`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="totalHours" fill="bg-primary-100" radius={[50, 50, 0, 0]} barSize={10} />
                      </BarChart>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500 md:text-xl xl:text-2xl">
                        No data available for the selected period.
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Applications Section */}
        <div className="flex w-full flex-col rounded-2xl lg:w-1/2">
          <div className="flex items-center justify-between p-2">
            <div>
              <span className="text-lg font-medium">Leave Applications</span>
              <p className="text-sm text-gray-500">
                {leaveRequests?.length}
                {' '}
                <span>
                  New Leave
                  {' '}
                  {`${leaveRequests?.length !== 1 ? 'Requests' : 'Request'}`}
                </span>
              </p>
            </div>
            <BsArrowUpRightCircle
              className="size-6 cursor-pointer text-primary transition-transform hover:scale-110 hover:text-black md:size-8"
              onClick={() => router.push('/dashboard/admin/leaves-management')}
            />
          </div>

          <div className="flex-1 rounded-2xl bg-white">
            <div className="max-h-[500px] overflow-y-auto p-2 md:p-4">
              {leaveRequestsLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader size="md" withText text="Loading Leave Requests" />
                </div>
              ) : leaveRequests?.length !== 0 ? (
                leaveRequests?.map((leave: any) => (
                  <div key={leave._id} className="mb-4 rounded-lg p-2 hover:bg-gray-50 md:p-4">
                    <div className="flex gap-2 md:gap-4">
                      <div className="flex size-12 items-center justify-center overflow-hidden rounded-full">
                        <Image
                          src={leave.employeeProfilePicture}
                          alt="profile-pic"
                          height={48}
                          width={48}
                          className="h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium md:text-base">{leave.employeeName}</h3>
                          <p className="text-xs text-gray-600 md:text-sm">
                            Type:
                            {' '}
                            {leave.leaveType}
                            {' '}
                            <span className="">•</span>
                            {' '}
                            <span className="inline">
                              {new Date(leave.startDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                              {new Date(leave.startDate).getTime() !== new Date(leave.endDate).getTime() && (
                                <>
                                  {' - '}
                                  {new Date(leave.endDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                        <BsArrowUpRightCircle
                          className="size-6 cursor-pointer text-primary-100 transition-transform hover:scale-105 hover:text-black md:hover:scale-150"
                          onClick={() => handleViewApplication(leave)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <div className="hidden flex-col items-center justify-center rounded-lg bg-secondary-100 p-2 text-primary-100 md:flex md:w-1/6 md:justify-start">
                        <span className="text-lg font-medium">
                          {new Date(leave.startDate.split(' ')[0]).toLocaleDateString('en-GB', { day: '2-digit' })}
                        </span>
                        <span className="text-base">
                          {new Date(leave.startDate).toLocaleDateString('en-GB', { month: 'short' })}
                        </span>
                      </div>
                      <div className="w-full flex-1 rounded-md border border-gray-200 p-4">
                        <p className="max-w-full overflow-hidden whitespace-pre-wrap break-words text-sm text-gray-600">
                          {leave.reason}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 md:hidden">
                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          className="w-full rounded-full bg-light-danger text-danger hover:bg-danger hover:text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedLeave(leave);
                            handleReject(e);
                          }}
                          variant="outline"
                          disabled={isRejecting}
                        >
                          <span className="flex w-full items-center justify-center px-2 py-1 md:px-3 md:py-2">
                            {isRejecting ? (
                              <>
                                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <MdClose />
                                Reject
                              </>
                            )}
                          </span>
                        </Button>
                        <Button
                          className="w-full rounded-full bg-light-success text-success hover:bg-success hover:text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedLeave(leave);
                            handleApprove(e);
                          }}
                          variant="outline"
                          disabled={isApproving}
                        >
                          <span className="flex w-full items-center justify-center px-2 py-1 md:px-3 md:py-2">
                            {isApproving ? (
                              <>
                                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <FaCheck />
                                Approve
                              </>
                            )}
                          </span>
                        </Button>
                      </div>
                      <Button
                        variant="default"
                        className="my-4 w-full"
                        onClick={() => {
                          if (leave.conversationId) {
                            setActiveConversationId(leave?.conversationId);
                            setCoversationDrawerOpen(true);
                          }
                        }}
                      >
                        <LuMessageCircleMore />
                        Message
                      </Button>
                    </div>
                  </div>
                ),
                )) : (
                <div className="flex h-full items-center justify-center text-secondary-300 md:text-xl xl:text-2xl">
                  <p>No Leave Requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Section */}
      <div className="w-full space-y-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payroll Dashboard</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage employee payroll and loan requests for
              {format(selectedMonth, 'MMM yyyy')}
            </p>
          </div>

          {/* Date Range Button */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-200"
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                type="button"
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

        {/* Key Metric Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Monthly Payroll Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Monthly Payroll</p>
                {payrollLoading ? (
                  <Loader size="sm" withText text="Loading..." />
                ) : (
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {payrollOverview?.totalPayrollCost?.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' }) || '—'}
                  </p>
                )}
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                <svg className="size-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Employees Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {payrollOverview?.employees?.length || 0}
                </p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                <svg className="size-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Salary Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Salary</p>
                {payrollLoading ? (
                  <Loader size="sm" withText text="Loading..." />
                ) : (
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {payrollOverview?.employees?.length > 0
                      ? (payrollOverview.totalPayrollCost / payrollOverview.employees.length).toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })
                      : '—'}
                  </p>
                )}
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-yellow-100">
                <svg className="size-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Loan Approvals Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Loan Approvals</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {payrollOverview?.pendingLoans?.length || 0}
                  </p>
                  {payrollOverview?.pendingLoans?.length > 0 && (
                    <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                      <FaExclamationCircle className="mr-1 size-3" />
                      Action Required
                    </span>
                  )}
                </div>
              </div>
              <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
                <FaExclamationCircle className="size-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Payroll Section */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Employee Payroll</h3>
              <p className="text-sm text-gray-600">Detailed breakdown of employee compensation and modifications</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Employee Name</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Net Pay</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Base Pay</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Modifications</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Loans</th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payrollLoading ? (
                  <tr key="loading-row">
                    <td colSpan={6} className="py-12 text-center">
                      <Loader size="md" withText text="Loading payroll data..." />
                    </td>
                  </tr>
                ) : payrollOverview?.employees?.length > 0 ? (
                  payrollOverview.employees.map((emp: PayrollEmployee) => (
                    <tr key={emp.employeeID} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{emp.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {emp.netPay?.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">
                          {(emp.netPay - emp.bonuses + emp.deductions + (emp.loanDeductions?.reduce((a: number, l: LoanDeduction) => a + l.amount, 0) || 0))?.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {emp.bonuses > 0 && (
                            <div className="text-sm font-medium text-green-600">
                              +
                              {emp.bonuses.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                            </div>
                          )}
                          {emp.deductions > 0 && (
                            <div className="text-sm font-medium text-red-600">
                              -
                              {emp.deductions.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                            </div>
                          )}
                          {(emp.bonuses === 0 && emp.deductions === 0) && (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {emp.hasActiveLoan && emp.loanDeductions?.length > 0 ? (
                          <div className="space-y-1">
                            {emp.loanDeductions.map((loan: LoanDeduction) => (
                              <div key={`loan-${emp._id}-${loan.amount}`} className="text-sm font-medium text-red-600">
                                -
                                {loan.amount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR' })}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {emp.hasActiveLoan && (
                            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                              Active Loan
                            </span>
                          )}
                          {(emp.bonuses > 0 || emp.deductions > 0) && (
                            <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                              Modified
                            </span>
                          )}
                          {!emp.hasActiveLoan && emp.bonuses === 0 && emp.deductions === 0 && (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="empty-row">
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-gray-100 p-3">
                          <svg className="size-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">No payroll data found</p>
                          <p className="text-sm text-gray-500">No payroll data available for the selected period.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Conversation Sheet */}
      <Sheet open={conversationDrawerOpen} onOpenChange={setCoversationDrawerOpen}>
        <SheetContent side="bottom" className="mx-auto max-h-[80vh] w-full max-w-full p-0">
          <div className="flex size-full flex-col">
            {/* Header */}
            <div className="bg-secondary-100 p-4">
              <h4 className="text-base font-medium text-primary-100">Conversation:</h4>
            </div>

            {/* Chat Content */}
            <div
              ref={chatContainerRef}
              className="scrollbar max-h-96 overflow-y-scroll border-[#F1F1F1] bg-[#FAFAFA] px-4"
            >
              {conversationMessagesLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <span className="text-secondary-400">Loading conversation...</span>
                </div>
              ) : !conversation || !conversation.messages || conversation.messages.length === 0 ? (
                <NoMessagesFound />
              ) : (
                conversation.messages.map((chat: any) => (
                  <div
                    key={chat.content + chat.timestamp}
                    className={`mt-4 max-w-[70%] rounded-lg border-[#F1F1F1] p-2 ${
                      chat.senderId._id === userData?.id
                        ? 'ml-auto bg-[#F3F3F3] text-left'
                        : 'mr-auto bg-white text-left'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={chat?.senderId?.profileImage}
                        alt="profile-pic"
                        height={32}
                        width={32}
                        className="rounded-full"
                      />
                      <div className="flex flex-col text-xs">
                        <p>{chat.senderId?.name}</p>
                        <p className="text-secondary-300">{format(new Date(chat.timestamp), 'hh:mm a')}</p>
                      </div>
                    </div>
                    <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-xs text-secondary-300">
                      {chat.content}
                    </p>
                  </div>
                ))
              )}
              {/* Show "Chat Closed" message if leave is approved or rejected */}
              {!conversationMessagesLoading && (selectedLeave?.status === 'Approved' || selectedLeave?.status === 'Rejected') && (
                <div className="mt-4 flex justify-center pb-10">
                  <div className="rounded-lg bg-[#F0F2F5] px-6 py-3 text-center shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="size-1 rounded-full bg-gray-400"></div>
                      <p className="text-xs font-medium text-gray-500 md:text-sm">
                        This conversation has ended
                      </p>
                      <div className="size-1 rounded-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollAnchorRef} />
            </div>

            {/* Message Input Section */}
            {selectedLeave?.status !== 'Approved' && selectedLeave?.status !== 'Rejected' && (
              <div className="relative flex w-full items-center border-t border-[#F1F1F1] bg-white p-3">
                <Textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="hide-scrollbar min-h-[10px] flex-1 resize-none border border-gray-300 pr-10 text-sm shadow-none focus-visible:ring-0"
                  placeholder="Your Reply..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center">
                  <Button
                    variant="outline"
                    className="border-none p-2"
                    disabled={sendMessageMutation.isPending || !message.trim()}
                    onClick={handleSendMessage}
                  >
                    <IoMdSend className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Leave Application Modal */}
      {viewLeaveApplicationModal && (
        <ModalUI
          handleClose={() => setViewLeaveApplicationModal(false)}
          handleOpen={() => setViewLeaveApplicationModal(true)}
          isOpen={viewLeaveApplicationModal}
        >
          <ViewLeaveApplication
            leaveData={selectedLeave}
            isAdmin
            onClose={() => setViewLeaveApplicationModal(false)}
          />
        </ModalUI>
      )}
    </div>
  );
};

export default AdminOverview;
