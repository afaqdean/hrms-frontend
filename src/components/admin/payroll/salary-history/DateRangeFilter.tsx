import type { DateRange } from '@/types/salaryHistory';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

type DateRangeFilterProps = {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
};

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
  className,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 justify-start text-left font-normal',
            !dateRange.from && !dateRange.to && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-3.5" />
          {dateRange.from
            ? (
                dateRange.to
                  ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')}
                        {' '}
                        -
                        {' '}
                        {format(dateRange.to, 'LLL dd, y')}
                      </>
                    )
                  : (
                      format(dateRange.from, 'LLL dd, y')
                    )
              )
            : (
                <span>Date range</span>
              )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={dateRange}
          onSelect={range => onDateRangeChange({ from: range?.from, to: range?.to })}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;
