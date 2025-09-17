import type { EditLeavesFormData } from '@/interfaces/Leave';
import type { SubmitHandler } from 'react-hook-form';
import { ToastStyle } from '@/components/ToastStyle';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

type EditLeavesProps = {
  onClose: () => void;
  onSave?: (updatedLeaves: { annual: number; casual: number; sick: number }) => void;
  selectedEmployeeId: string | null;
};

const EditLeaves: React.FC<EditLeavesProps> = ({ onClose, selectedEmployeeId }) => {
  const queryClient = useQueryClient();
  const [isFormValid, setIsFormValid] = useState(false);

  // Fetch current employee data
  const { data: employeeData, isLoading: isLoadingEmployee } = useSpecificEmployeeData(selectedEmployeeId || '');

  // Initialize the form with default values using react-hook-form
  const form = useForm<EditLeavesFormData>({
    defaultValues: {
      sick: undefined, // Default sick leaves
      casual: undefined, // Default casual leaves
      annual: undefined, // Default annual leaves
    },
  });

  // Populate form with current employee's leave bank values when data is available
  useEffect(() => {
    if (employeeData && !isLoadingEmployee) {
      form.reset({
        sick: employeeData.sickLeaveBank || 0,
        casual: employeeData.casualLeaveBank || 0,
        annual: employeeData.annualLeaveBank || 0,
      });
    }
  }, [employeeData, isLoadingEmployee, form]);

  // Watch all form fields to check if any have been changed and are not empty
  const watchedFields = useWatch({
    control: form.control,
    name: ['sick', 'casual', 'annual'],
  });

  // Check if form is valid (at least one field has a value)
  useEffect(() => {
    const hasValue = watchedFields.some(field => field != null);
    setIsFormValid(hasValue);
  }, [watchedFields]);

  const updateLeaveBank = async (employeeId: string, leaveData: EditLeavesFormData) => {
    const formattedData = {
      annual: Number(leaveData.annual),
      casual: Number(leaveData.casual),
      sick: Number(leaveData.sick),
    };
    const response = await API.patch(`/admin/leave-bank/${employeeId}`, formattedData);
    return response.data;
  };

  const useUpdateLeaveBank = (employeeId: string) => {
    return useMutation({
      mutationFn: (leaveData: EditLeavesFormData) => updateLeaveBank(employeeId, leaveData),
      onSuccess: () => {
        toast.success('Leave bank updated successfully', ToastStyle);
      },
      onError: (error) => {
        toast.error('Failed to update leave bank. Please try again.', ToastStyle);
        console.error('Failed to update leave bank:', error);
      },

    },
    );
  };

  const { mutate, isPending } = useUpdateLeaveBank(selectedEmployeeId || '');

  // Submit handler for form submission
  const onSubmit: SubmitHandler<EditLeavesFormData> = (data) => {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['Leaves'],
        });
        queryClient.invalidateQueries({
          queryKey: ['Employees'],
        });
        // Invalidate the specific employee query to refresh the data
        queryClient.invalidateQueries({
          queryKey: ['specificEmployee', selectedEmployeeId],
        });
        onClose(); // Close modal or form after submission
      },
    });
  };

  return (
    <div className=" w-[60vw] rounded-2xl  md:w-[50vw] md:p-6">
      {/* Form Title */}
      <h2 className="mb-4 text-left text-xl font-semibold">Update Leave Counts</h2>

      {/* Form Provider to pass form context to all fields */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          {/* Expiry Date Field */}
          {/* <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="text-sm text-secondary-300 md:text-base">Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    className="flex-col text-sm md:text-base"
                    type="date"
                    {...field}
                    value={field.value ? field.value.toISOString().split('T')[0] : ''}
                    onChange={e => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}

          {/* Total Leaves Count Field */}
          {/* <FormField
            control={form.control}
            name="totalLeavesCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-secondary-300 md:text-base">Total Leaves Count</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          /> */}

          {/* Grid layout for Sick, Casual, and Annual Leave Fields */}
          <div className="grid grid-cols-1 gap-1  md:gap-2">
            {/* Sick Leave Field */}
            <FormField
              control={form.control}
              name="sick"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-secondary-300 md:text-base">Sick Leave</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="max-md:text-sm"
                      placeholder={isLoadingEmployee ? 'Fetching Sick Leave...' : 'Enter Sick Leave'}
                      disabled={isLoadingEmployee}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Casual Leave Field */}
            <FormField
              control={form.control}
              name="casual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-secondary-300 md:text-base">Casual Leave</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="max-md:text-sm"
                      placeholder={isLoadingEmployee ? 'Fetching Casual Leave...' : 'Enter Casual Leave'}
                      disabled={isLoadingEmployee}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Annual Leave Field */}
            <FormField
              control={form.control}
              name="annual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-secondary-300 md:text-base">Annual Leaves</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="max-md:text-sm"
                      placeholder={isLoadingEmployee ? 'Fetching Annual Leave...' : 'Enter Annual Leave'}
                      disabled={isLoadingEmployee}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex w-full gap-2">
            <Button type="button" disabled={isPending || isLoadingEmployee} variant="secondary" className="w-1/2" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isFormValid || isLoadingEmployee}
              className="w-1/2"
            >
              {isPending ? 'Updating...' : isLoadingEmployee ? 'Loading...' : 'Submit'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditLeaves;
