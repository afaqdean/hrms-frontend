'use client';

import type { DeductionFormProps } from './DeductionFormTypes';
import MonthYearPicker from '@/components/shared/date-picker/MonthYearPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DEDUCTION_TYPES } from '@/constants/deduction/deductionTypes';
import { format } from 'date-fns';
import { useState } from 'react';
import { MdOutlineCalendarMonth } from 'react-icons/md';

const DeductionForm: React.FC<DeductionFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  effectiveMonth,
  onEffectiveMonthChange,
  loading = false,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Add New Deduction</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="deduction-type" className="mb-1 block text-sm font-medium">
              Deduction Type
            </label>
            <Select value={formData.type} onValueChange={value => onInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select deduction type" />
              </SelectTrigger>
              <SelectContent>
                {DEDUCTION_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="deduction-amount" className="mb-1 block text-sm font-medium">
              Amount (PKR)
            </label>
            <Input
              id="deduction-amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={e => onInputChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="effective-month" className="mb-1 block text-sm font-medium">
              Effective Period
            </label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  id="effective-month"
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50"
                  onClick={() => setDatePickerOpen(!datePickerOpen)}
                  type="button"
                >
                  <MdOutlineCalendarMonth className="text-xl" />
                  <span>{format(effectiveMonth, 'MMM yyyy')}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-4">
                <MonthYearPicker
                  selectedDate={effectiveMonth}
                  onDateChange={(date) => {
                    onEffectiveMonthChange(date);
                    setDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <label htmlFor="deduction-reason" className="mb-1 block text-sm font-medium">
            Reason *
          </label>
          <Input
            id="deduction-reason"
            value={formData.reason}
            onChange={e => onInputChange('reason', e.target.value)}
            placeholder="Why is this deduction being applied?"
            required
          />
        </div>

        <div>
          <label htmlFor="deduction-notes" className="mb-1 block text-sm font-medium">
            Notes (Optional)
          </label>
          <Textarea
            id="deduction-notes"
            value={formData.notes}
            onChange={e => onInputChange('notes', e.target.value)}
            placeholder="Additional notes for audit trail"
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Deduction'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeductionForm;
