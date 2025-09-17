'use client';

import type { BonusFormData, BonusType } from '@/interfaces/Bonus';
import MonthYearPicker from '@/components/shared/date-picker/MonthYearPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBonus } from '@/hooks';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { type AddBonusFormProps, BONUS_TYPES } from './BonusFormTypes';

const AddBonusForm: React.FC<AddBonusFormProps> = ({
  employeeId,
  onSuccess,
  onBonusCreated,
}) => {
  const { mutateAsync: createBonus, isPending: _loading } = useCreateBonus();

  // State for month/year picker
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<BonusFormData>({
    employeeId: '',
    amount: '',
    period: new Date().toISOString().split('T')[0] || '',
    type: BONUS_TYPES[0]?.value ?? 'bonus',
    reason: '',
    notes: '',
  });

  // Update employeeId when prop changes
  useEffect(() => {
    if (employeeId) {
      setFormData(prev => ({ ...prev, employeeId }));
    }
  }, [employeeId]);

  const handleInputChange = (field: keyof BonusFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.employeeId) {
      return false;
    }
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      return false;
    }
    if (!selectedMonth) {
      return false;
    }
    if (!formData.reason.trim()) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Format the selected month to YYYY-MM format (month period, not specific date)
      const monthPeriod = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;

      const payload = {
        employeeId: formData.employeeId,
        amount: Number.parseFloat(formData.amount),
        period: monthPeriod,
        type: formData.type as BonusType,
        reason: formData.reason.trim(),
        notes: formData.notes.trim() || undefined,
      };

      await createBonus(payload);

      // Re-fetch bonuses after successful creation
      await onBonusCreated();

      onSuccess();
    } catch (err: any) {
      console.error('Failed to create bonus:', err);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Add New Bonus</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="bonus-type" className="mb-1 block text-sm font-medium">
              Bonus Type
            </label>
            <Select value={formData.type} onValueChange={value => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select bonus type" />
              </SelectTrigger>
              <SelectContent>
                {BONUS_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="bonus-amount" className="mb-1 block text-sm font-medium">
              Amount (PKR)
            </label>
            <Input
              id="bonus-amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={e => handleInputChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="effective-month" className="mb-1 block text-sm font-medium">
              Effective Month
            </label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  id="effective-month"
                  className="flex w-full items-center gap-3 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-200"
                  onClick={() => setDatePickerOpen(!datePickerOpen)}
                  type="button"
                >
                  <MdOutlineCalendarMonth className="text-lg" />
                  <span>{format(selectedMonth, 'MMM yyyy')}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-4">
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
        </div>

        <div>
          <label htmlFor="bonus-reason" className="mb-1 block text-sm font-medium">
            Reason *
          </label>
          <Input
            id="bonus-reason"
            value={formData.reason}
            onChange={e => handleInputChange('reason', e.target.value)}
            placeholder="Why is this bonus being given?"
            required
          />
        </div>

        <div>
          <label htmlFor="bonus-notes" className="mb-1 block text-sm font-medium">
            Notes (Optional)
          </label>
          <Textarea
            id="bonus-notes"
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
          >
            Create Bonus
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBonusForm;
