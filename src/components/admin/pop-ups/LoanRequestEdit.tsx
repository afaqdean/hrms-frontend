'use client';

import type { LoanRequest, UpdateLoanRequestInput } from '@/interfaces/LoanRequest';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateLoanRequest } from '@/hooks/useAdminLoanManagement';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const updateLoanSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Declined']),
  installments: z.number().min(1, 'Installments must be at least 1').max(60, 'Installments cannot exceed 60'),
  deductionStartMonth: z.date().optional(),
  adminRemarks: z.string().optional(),
});

type UpdateLoanFormData = z.infer<typeof updateLoanSchema>;

type LoanRequestEditProps = {
  loanRequest: LoanRequest;
  onClose: () => void;
  onSuccess: () => void;
};

const LoanRequestEdit: React.FC<LoanRequestEditProps> = ({ loanRequest, onClose, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    loanRequest.deductionStartDate ? new Date(loanRequest.deductionStartDate) : undefined,
  );
  const updateLoanMutation = useUpdateLoanRequest();

  const form = useForm<UpdateLoanFormData>({
    resolver: zodResolver(updateLoanSchema),
    defaultValues: {
      status: loanRequest.status,
      installments: loanRequest.installments,
      deductionStartMonth: loanRequest.deductionStartDate ? new Date(loanRequest.deductionStartDate) : undefined,
      adminRemarks: loanRequest.adminRemarks || '',
    },
  });

  const onSubmit = async (data: UpdateLoanFormData) => {
    const updateData: UpdateLoanRequestInput = {
      status: data.status,
      installments: data.installments,
      deductionStartMonth: data.deductionStartMonth
        ? `${data.deductionStartMonth.getFullYear()}-${String(data.deductionStartMonth.getMonth() + 1).padStart(2, '0')}`
        : undefined,
      adminRemarks: data.adminRemarks,
    };

    try {
      await updateLoanMutation.mutateAsync({
        loanId: loanRequest._id,
        updateData,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating loan request:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Edit Loan Request</h2>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Employee Info Display */}
      <div className="mb-6 rounded-lg border bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">Employee Information</h3>
        <div className="text-sm text-gray-600">
          <div className="font-medium">
            {loanRequest.employeeName || `Employee ${loanRequest.employeeId}`}
          </div>
          <div>{loanRequest.employeeEmail || 'No email available'}</div>
        </div>
      </div>

      {/* Edit Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installments (months)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="deductionStartMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deduction Start Month</FormLabel>
                <div className="flex gap-3">
                  <Select
                    onValueChange={(month) => {
                      const currentYear = selectedDate?.getFullYear() || new Date().getFullYear();
                      const newDate = new Date(currentYear, Number.parseInt(month) - 1, 1);
                      setSelectedDate(newDate);
                      field.onChange(newDate);
                    }}
                    value={selectedDate ? String(selectedDate.getMonth() + 1) : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthDate = new Date(2024, i, 1);
                        const monthNumber = i + 1;
                        const loanRequestDate = new Date(loanRequest.requestedAt);
                        const currentYear = selectedDate?.getFullYear() || loanRequestDate.getFullYear();

                        // Allow same month or later for loan request year, all months for future years
                        const isDisabled = currentYear === loanRequestDate.getFullYear()
                          && monthNumber < loanRequestDate.getMonth() + 1;

                        return (
                          <SelectItem
                            key={monthNumber}
                            value={String(monthNumber)}
                            disabled={isDisabled}
                          >
                            {format(monthDate, 'MMM')}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(year) => {
                      const currentMonth = selectedDate?.getMonth() || new Date().getMonth();
                      const newDate = new Date(Number.parseInt(year), currentMonth, 1);
                      setSelectedDate(newDate);
                      field.onChange(newDate);
                    }}
                    value={selectedDate ? String(selectedDate.getFullYear()) : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }, (_, i) => {
                        const loanRequestDate = new Date(loanRequest.requestedAt);
                        const startYear = loanRequestDate.getFullYear();
                        const year = startYear + i;

                        return (
                          <SelectItem
                            key={year}
                            value={String(year)}
                          >
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                {selectedDate && (
                  <p className="mt-1 text-sm text-gray-600">
                    Selected:
                    {' '}
                    {format(selectedDate, 'MMMM yyyy')}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adminRemarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Remarks</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any remarks or notes..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateLoanMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateLoanMutation.isPending}
            >
              {updateLoanMutation.isPending ? 'Updating...' : 'Update Request'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoanRequestEdit;
