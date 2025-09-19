'use client';

import type { SalaryIncrementFormData } from '@/interfaces/SalaryIncrement';
import Avatar from '@/components/shared/avatars/avatar/Avatar';
import BackArrow from '@/components/ui/back-arrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingState from '@/components/ui/LoadingState';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Textarea } from '@/components/ui/textarea';
import { useSalaryIncrement } from '@/hooks/useSalaryIncrement';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineCalendarMonth } from 'react-icons/md';

// MonthYearPicker Component
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
              type="button"
              key={month}
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

export default function AddSalaryIncrementPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.employeeId as string;

  // Get employee data using the ID from URL
  const { data: employee, isLoading: employeeLoading } = useSpecificEmployeeData(employeeId);

  // Use the salary increment hook
  const { createSalaryIncrementAsync, isCreating } = useSalaryIncrement();

  // Form state
  const [formData, setFormData] = useState<SalaryIncrementFormData>({
    employeeId: '',
    amount: '',
    percentage: '',
    reason: '',
    period: format(new Date(), 'yyyy-MM'),
    type: 'salary_increment',
    notes: '',
    incrementType: 'amount',
    calculatedSalary: '',
    effectiveDate: '',
  });

  // State for month/year picker
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Update employeeId when employee data is loaded
  useEffect(() => {
    if (employee?._id) {
      setFormData(prev => ({
        ...prev,
        employeeId: employee._id,
        calculatedSalary: employee.salary?.toString() || '0',
      }));
    }
  }, [employee?._id, employee?.salary]);

  // Update effectiveDate when selectedMonth changes
  useEffect(() => {
    const formattedDate = format(selectedMonth, 'yyyy-MM-dd');
    setFormData(prev => ({ ...prev, effectiveDate: formattedDate }));
  }, [selectedMonth]);

  // Calculate new salary whenever amount or percentage changes
  useEffect(() => {
    const currentSalary = employee?.salary || 0;
    let newSalary = currentSalary;

    if (formData.incrementType === 'amount' && formData.amount) {
      const incrementAmount = Number.parseFloat(formData.amount) || 0;
      newSalary = currentSalary + incrementAmount;
    } else if (formData.incrementType === 'percentage' && formData.percentage) {
      const percentage = Number.parseFloat(formData.percentage) || 0;
      const incrementAmount = (currentSalary * percentage) / 100;
      newSalary = currentSalary + incrementAmount;
    }

    setFormData(prev => ({
      ...prev,
      calculatedSalary: newSalary.toString(),
    }));
  }, [formData.amount, formData.percentage, formData.incrementType, employee?.salary]);

  const handleInputChange = (field: keyof SalaryIncrementFormData, value: string | boolean) => {
    if (field === 'incrementType') {
      // Reset amount and percentage when switching types
      const newType = value as 'amount' | 'percentage';
      setFormData(prev => ({
        ...prev,
        [field]: newType,
        amount: newType === 'amount' ? prev.amount : '',
        percentage: newType === 'percentage' ? prev.percentage : '',
        calculatedSalary: '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.employeeId) {
      return false;
    }

    if (formData.incrementType === 'amount') {
      if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
        return false;
      }
    } else if (formData.incrementType === 'percentage') {
      if (!formData.percentage || Number.parseFloat(formData.percentage) <= 0) {
        return false;
      }
    }

    if (!formData.reason.trim()) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');

    try {
      let incrementAmount = 0;
      if (formData.incrementType === 'amount' && formData.amount) {
        incrementAmount = Number.parseFloat(formData.amount);
      } else if (formData.incrementType === 'percentage' && formData.percentage) {
        const currentSalary = employee?.salary || 0;
        const percentage = Number.parseFloat(formData.percentage);
        incrementAmount = (currentSalary * percentage) / 100;
      }

      const payload = {
        amount: incrementAmount,
        reason: formData.reason.trim(),
        period: format(selectedMonth, 'yyyy-MM'),
        type: formData.type,
        notes: formData.notes.trim() || undefined,
      };

      await createSalaryIncrementAsync({ employeeId: formData.employeeId, payload });
      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create salary increment.');
    }
  };

  // Show loading while fetching employee data
  if (employeeLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <LoadingState
          type="loading"
          message="Loading Employee Data..."
          showSpinner
          className="w-full max-w-xl rounded-2xl bg-white p-8 shadow"
        />
      </div>
    );
  }

  // Show error if employee not found
  if (!employee) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <LoadingState
          type="error"
          message="Employee Not Found"
          contextText="The employee you're looking for doesn't exist or you don't have permission to view them."
          actionText="Go Back"
          onAction={() => router.back()}
          showSpinner={false}
          className="w-full max-w-xl rounded-2xl bg-white p-8 shadow"
        />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8">
        <LoadingState
          type="empty"
          message="Salary Increment Created Successfully!"
          contextText="The salary increment has been created successfully. Redirecting back to payroll management..."
          showSpinner
          className="w-full max-w-xl rounded-2xl bg-white p-8 shadow"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="mb-6 flex items-center gap-4">
          <BackArrow href="/dashboard/admin/payroll-management" />
          <h1 className="text-2xl font-bold text-primary-100">
            Add Salary Increment
            {' '}
            {employee.name ? `– ${employee.name}` : 'to Employee Salary'}
          </h1>
        </div>

        {/* Employee Information */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <div className="flex items-center gap-4 border-b pb-4">
            <Avatar src={employee.profileImage} className="size-16" />
            <div>
              <div className="text-lg font-semibold">{employee.name}</div>
              <div className="text-sm text-gray-500">
                ID:
                {' '}
                {employee.employeeID}
              </div>
              <div className="text-sm text-gray-500">{employee.position}</div>
              <div className="text-sm text-gray-500">
                Current Salary: PKR
                {' '}
                {employee.salary?.toLocaleString() || '0'}
              </div>
              {formData.calculatedSalary && (
                <div className="text-sm font-medium text-green-600">
                  New Salary: PKR
                  {' '}
                  {Number.parseFloat(formData.calculatedSalary).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Salary Increment Form */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Add New Salary Increment</h2>

          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="increment-type-select" className="mb-2 block text-sm font-medium">
                  Increment Type
                </label>
                <Select
                  value={formData.incrementType}
                  onValueChange={value => handleInputChange('incrementType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select increment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amount">Amount (PKR)</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="effective-month" className="mb-2 block text-sm font-medium">
                  Effective Month
                </label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="effective-month"
                      className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50"
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

              {formData.incrementType === 'amount' && (
                <div>
                  <label htmlFor="increment-amount" className="mb-2 block text-sm font-medium">
                    Increment Amount (PKR) *
                  </label>
                  <Input
                    id="increment-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={e => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Amount to add to current salary
                  </p>
                </div>
              )}

              {formData.incrementType === 'percentage' && (
                <div>
                  <label htmlFor="increment-percentage" className="mb-2 block text-sm font-medium">
                    Increment Percentage (%) *
                  </label>
                  <Input
                    id="increment-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.percentage}
                    onChange={e => handleInputChange('percentage', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Percentage to add to current salary
                  </p>
                </div>
              )}

              <div className="md:col-span-2">
                <label htmlFor="calculated-salary" className="mb-2 block text-sm font-medium">
                  Calculated New Salary (PKR) *
                </label>
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">New Salary Amount</p>
                      <p className="text-xs text-green-600">Automatically calculated based on your input</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700">
                        PKR
                        {' '}
                        {formData.calculatedSalary
                          ? Number.parseFloat(formData.calculatedSalary).toLocaleString()
                          : '0'}
                      </p>
                      {formData.calculatedSalary && employee?.salary && (
                        <p className="text-sm text-green-600">
                          +
                          {((Number.parseFloat(formData.calculatedSalary) - employee.salary)
                            / employee.salary
                            * 100).toFixed(1)}
                          % increase
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div>
              <label htmlFor="increment-reason" className="mb-2 block text-sm font-medium">
                Reason *
              </label>
              <Input
                id="increment-reason"
                value={formData.reason}
                onChange={e => handleInputChange('reason', e.target.value)}
                placeholder="Why is this increment being given?"
                required
              />
            </div>

            <div>
              <label htmlFor="increment-notes" className="mb-2 block text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="increment-notes"
                value={formData.notes}
                onChange={e => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes for audit trail"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                disabled={isCreating}
                className="min-w-[150px]"
              >
                {isCreating ? 'Creating...' : 'Create Salary Increment'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
