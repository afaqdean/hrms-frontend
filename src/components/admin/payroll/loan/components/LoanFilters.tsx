import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import React from 'react';
import { LOAN_SOURCE_OPTIONS, LOAN_STATUS_OPTIONS } from '../utils/loanConstants';

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type LoanFiltersProps = {
  searchQuery: string;
  statusFilter: string;
  sourceFilter: string;
  dateRange: DateRange;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
};

const LoanFilters: React.FC<LoanFiltersProps> = ({
  searchQuery,
  statusFilter,
  sourceFilter,
  dateRange,
  onSearchChange,
  onStatusChange,
  onSourceChange,
  onDateRangeChange,
  className = '',
}) => {
  const handleDateClick = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      // Start new range
      onDateRangeChange({
        from: date,
        to: undefined,
      });
    } else {
      // Complete the range
      onDateRangeChange({
        from: dateRange.from,
        to: date,
      });
    }
  };

  const resetDateRange = () => {
    onDateRangeChange({ from: undefined, to: undefined });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search, Status, and Source Filter Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by employee name, email, or reason..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {LOAN_STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={onSourceChange}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              {LOAN_SOURCE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range Filter Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 size-4" />
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, 'MMM yyyy')} - ${format(dateRange.to, 'MMM yyyy')}`
                  : 'Pick a month range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onDayClick={handleDateClick}
                initialFocus
                numberOfMonths={2}
                className="rounded-md border"
              />
              <div className="flex justify-end gap-2 p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetDateRange}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    // Close the popover
                    const popoverTrigger = document.querySelector('[data-radix-popper-content-wrapper]');
                    if (popoverTrigger) {
                      (popoverTrigger as HTMLElement).click();
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          {dateRange?.from && dateRange?.to && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetDateRange}
              className="text-xs"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanFilters;
