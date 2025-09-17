'use client'; // ✅ Enables client-side rendering for this component
import type { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type LeavesCountFormValues, leavesCountSchema } from '@/containers/types';
import { accountDetailsSchema, personalDetailsSchema } from '@/containers/types';
import { useMultiStepForm } from '@/hooks/useMultiForm';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useSubmitEditEmployeeForm } from '@/hooks/useSubmitEditEmployeeForm';
import { useUpdateEmployeeStep } from '@/hooks/useUpdateEmployeeStep';
import { API } from '@/Interceptors/Interceptor';
import { formatDate } from '@/utils/Helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import MiniProgressBar from '../MiniProgressBar';

// Add this type for better error handling
type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
};

type LeavesCountProps = {
  mode?: 'create' | 'edit';
  employeeId?: string;
};

const LeavesCount: React.FC<LeavesCountProps> = ({
  mode = 'create',
  employeeId,
}) => {
  const router = useRouter();
  const { formData, updateFormData, resetForm } = useMultiStepForm();
  const queryClient = useQueryClient();
  const { data: employeeData } = useSpecificEmployeeData(mode === 'edit' ? employeeId || '' : '');

  // Always call hooks at the top level, regardless of conditions
  const { isPending: isEditSubmitting } = useSubmitEditEmployeeForm(mode === 'edit' ? employeeId || '' : '');
  const { submitStep, isPending: isUpdatingStep } = useUpdateEmployeeStep();

  // ✅ Initialize react-hook-form with validation
  const form = useForm<LeavesCountFormValues>({
    resolver: zodResolver(leavesCountSchema),
    defaultValues: {
      expiryDate: `31/12/${new Date().getFullYear()}`,
      sickLeave: '',
      casualLeave: '',
      annualLeave: '',
    },
  });

  // Update form when employee data is available in edit mode
  useEffect(() => {
    if (mode === 'edit' && employeeData) {
      form.reset({
        expiryDate: form.getValues().expiryDate || `31/12/${new Date().getFullYear()}`,
        sickLeave: employeeData.sickLeaveBank?.toString() || '',
        casualLeave: employeeData.casualLeaveBank?.toString() || '',
        annualLeave: employeeData.annualLeaveBank?.toString() || '',
      });
    } else if (mode === 'create') {
      // For create mode, load from context
      const storedLeavesDetails = formData.leavesCountDetails || {};

      form.reset({
        expiryDate: storedLeavesDetails.expiryDate || `31/12/${new Date().getFullYear()}`,
        sickLeave: storedLeavesDetails.sickLeave || '',
        casualLeave: storedLeavesDetails.casualLeave || '',
        annualLeave: storedLeavesDetails.annualLeave || '',
      });
    }
  }, [employeeData, mode, formData.leavesCountDetails, form]);

  // ✅ Mutation to submit new employee data
  const submitCreateMutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.personalDetails.employeeName);
      formDataToSend.append('email', formData.accountDetails.email);
      formDataToSend.append('role', formData.personalDetails.employeeRole ?? '');
      formDataToSend.append('employeeID', formData.accountDetails.employeeId);
      formDataToSend.append('password', formData.accountDetails.password ?? '');
      formDataToSend.append('position', formData.personalDetails.jobTitle || '');
      formDataToSend.append('annualLeaveBank', formData.leavesCountDetails.annualLeave?.toString() || '0');
      formDataToSend.append('casualLeaveBank', formData.leavesCountDetails.casualLeave?.toString() || '0');
      formDataToSend.append('sickLeaveBank', formData.leavesCountDetails.sickLeave?.toString() || '0');

      // Handle joining date
      let joiningDateString = '';
      if (formData.personalDetails.joiningDate) {
        const joiningDate = new Date(formData.personalDetails.joiningDate);
        joiningDateString = formatDate(joiningDate);
      }
      formDataToSend.append('joiningDate', joiningDateString);

      // Handle contact data
      if (formData.contactDetails && formData.contactDetails.contact) {
        formDataToSend.append('contact', JSON.stringify(formData.contactDetails.contact));
      }

      // Handle emergency contact data
      if (formData.emergencyContactDetails && formData.emergencyContactDetails.emergencyContact) {
        formDataToSend.append('emergencyContact', JSON.stringify(formData.emergencyContactDetails.emergencyContact));
      }

      // Handle machine ID
      formDataToSend.append('machineID', formData.accountDetails?.machineId ?? '');

      // Handle profile image
      if (formData.personalDetails.avatar) {
        if (formData.personalDetails.avatar instanceof File) {
          formDataToSend.append('profileImage', formData.personalDetails.avatar, formData.personalDetails.avatar.name);
        } else if (typeof formData.personalDetails.avatar === 'string' && formData.personalDetails.avatar.startsWith('data:')) {
          // Convert base64 to blob
          try {
            const res = await fetch(formData.personalDetails.avatar);
            // const blob = await res.blob();
            const blob = await res.blob();
            // Use the original filename if available, or a default name
            const originalFileName = formData.personalDetails.originalFileName || 'profile.jpg';
            const file = new File([blob], originalFileName, { type: 'image/jpeg' });
            formDataToSend.append('profileImage', file, file.name);
          } catch (error) {
            console.error('Error converting base64 to file:', error);
          }
        }
      }

      const response = await API.post('/user/createUser', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Employee Created Successfully');
      resetForm();
      form.reset();
      localStorage.removeItem('employee_creation_form_data');
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
      router.push('/dashboard/admin/employees-management');
    },
    onError: (error: AxiosError<ApiError>) => {
      if (error.response?.status === 400) {
        // Handle validation errors
        const errorData = error.response.data;
        if (errorData.errors) {
          // Show first validation error
          const firstError = Object.values(errorData.errors)[0]?.[0];
          toast.error(firstError || 'Please check your input');
          return;
        }
        toast.error(errorData.message || 'Please check your form data');
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized access. Please login again.');
      } else if (error.response?.status === 409) {
        toast.error('Employee with this email already exists.');
      } else if (error.response?.status === 500) {
        toast.error('Please fill all the required fields.');
      } else if (!error.response) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    },
  });

  // ✅ Function to handle form submission
  const onSubmit = (data: LeavesCountFormValues) => {
    // Always save to context before submission
    updateFormData('leavesCountDetails', data);

    if (mode === 'edit' && employeeId) {
      // Update leave counts immediately using the new submitStep
      submitStep({
        employeeId,
        stepData: {
          annualLeaveBank: Number.parseInt(data.annualLeave || '0'),
          casualLeaveBank: Number.parseInt(data.casualLeave || '0'),
          sickLeaveBank: Number.parseInt(data.sickLeave || '0'),
        },
        stepName: 'leavesCount',
      }, () => {
        // Navigate directly to employees list instead of calling submitWithoutToast
        router.push('/dashboard/admin/employees-management');
      }, true); // Allow this toast since we're suppressing the other one
    } else {
      submitCreateMutation.mutate();
    }
  };

  const isSubmitting = mode === 'edit' ? (isEditSubmitting || isUpdatingStep) : submitCreateMutation.isPending;

  const isPersonalDetailsValid = mode === 'edit' || personalDetailsSchema.safeParse(formData.personalDetails).success;
  const isAccountDetailsValid = mode === 'edit' || accountDetailsSchema.safeParse(formData.accountDetails).success;

  // Rewrite the condition to avoid the type comparison issue
  const isFormComplete = mode === 'edit' ? true : (isAccountDetailsValid && isPersonalDetailsValid);

  return (
    <div className="w-full rounded-2xl px-2 md:p-4 xxl:p-6">
      {/* Progress Indicator */}
      <span className="text-xs text-[#B3B3B3]">Step 5/5</span>
      <h2 className="text-sm font-medium text-primary-100 md:text-base">
        {mode === 'edit' ? 'Edit leave details' : 'Enter the employee\'s leave details'}
      </h2>

      <hr className="my-2 border-[#F1F1F1]" />

      {/* Wrap the form with FormProvider for easy access to form methods */}
      <FormProvider {...form}>
        <form className="space-y-3">
          {/* Expiry Date */}
          <FormField
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    value={
                      field.value
                      && (typeof field.value === 'string' || typeof field.value === 'number')
                      && !Number.isNaN(new Date(field.value).getTime())
                        ? new Date(field.value).toISOString().split('T')[0]
                        : ''
                    }
                    type="date"
                    className="cursor-pointer flex-col text-sm"
                    onFocus={e => e.target.showPicker()}
                    onChange={e => field.onChange(e.target.value)}
                    placeholder="Enter expiry date"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sick Leave, Casual Leave, and Annual Leave Fields */}
          <div className="flex w-full flex-col gap-3 md:flex-row md:gap-4">
            <div className="w-full">
              <FormField
                name="sickLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sick Leave</FormLabel>
                    <FormControl>
                      <Input className="text-sm" min={0} {...field} type="number" placeholder="Enter Sick Leave" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                name="casualLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Casual Leave</FormLabel>
                    <FormControl>
                      <Input {...field} min={0} className="text-sm" type="number" placeholder="Enter Casual Leave" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                name="annualLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Leave</FormLabel>
                    <FormControl>
                      <Input {...field} min={0} type="number" className="max-md:text-sm" placeholder="Enter Annual Leave" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {!isFormComplete && (
            <p className="mt-2 text-sm text-danger">
              ⚠️ Please complete all required fields in previous steps before finishing.
            </p>
          )}

          {/* Progress Bar & Navigation Buttons */}
          <div className="mt-2 flex items-center justify-between">
            <MiniProgressBar mode={mode} />
            {/* For Styling purpose */}
            {
              mode === 'edit' && (
                // Save and exit button
                <div className="flex w-full max-md:hidden">

                  <Button
                    variant="secondary"
                    className="  hidden md:block"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/dashboard/admin/employees-management');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )
            }

            <div className="mt-2 flex h-full items-center justify-center gap-2 max-md:w-full">
              {/* Back Button */}
              <Button
                className="max-md:w-1/2"
                variant="secondary"
                type="button"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  if (mode === 'edit' && employeeId) {
                    router.push(`/dashboard/admin/edit-employee/${employeeId}/emergency-contact-details`);
                  } else {
                    router.push('/dashboard/admin/add-employee/emergency-contact-details');
                  }
                }}
              >
                Back
              </Button>

              {/* Submit Button */}
              <Button
                className="max-md:w-1/2"
                type="submit"
                disabled={isSubmitting || !isFormComplete}
                onClick={form.handleSubmit(data => onSubmit(data))}
              >
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Finish & Update' : 'Finish & Create'}
              </Button>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full md:hidden"
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              router.push('/dashboard/admin/employees-management');
            }}
          >
            Cancel
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default LeavesCount;
