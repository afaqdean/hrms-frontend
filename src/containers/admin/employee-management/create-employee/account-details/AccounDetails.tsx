'use client';

import type { Employee } from '@/interfaces/Employee';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type AccountDetailsFormValues, accountDetailsSchema } from '@/containers/types';
import useEmployees from '@/hooks/useEmployees';
import { useMultiStepForm } from '@/hooks/useMultiForm';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useUpdateEmployeeStep } from '@/hooks/useUpdateEmployeeStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RiCheckLine, RiFileCopyLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { z } from 'zod';
import MiniProgressBar from '../MiniProgressBar';

type AccountDetailsProps = {
  mode?: 'create' | 'edit';
  employeeId?: string;
  initialData?: any;
};

const AccountDetails: React.FC<AccountDetailsProps> = ({
  mode = 'create',
  employeeId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSavingAndExiting, setIsSavingAndExiting] = useState(false);
  const { submitStep, isPending: isUpdating } = useUpdateEmployeeStep();

  // Extract employeeId from pathname
  const extractedEmployeeId = pathname.split('/').find((element, index, array) =>
    element === 'edit-employee' ? array[index + 1] : undefined,
  );

  // Use extracted employeeId if not provided as prop
  const effectiveEmployeeId = employeeId || extractedEmployeeId;

  const { formData, updateFormData } = useMultiStepForm();
  const [isCopied, setIsCopied] = useState(false); // ✅ Track if password is copied

  const { Employees, isLoading } = useEmployees();
  const { data: employeeData } = useSpecificEmployeeData(effectiveEmployeeId || '');

  // ✅ Initialize react-hook-form with validation
  const form = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(
      mode === 'edit'
        ? accountDetailsSchema.omit({ password: true }).extend({
            password: z.string().optional(),
          })
        : accountDetailsSchema,
    ),
    defaultValues: {
      employeeId: '',
      email: '',
      password: '',
      machineId: '',
    },
  });

  // Update form values when employee data is available
  useEffect(() => {
    if (mode === 'edit' && employeeData) {
      form.reset({
        employeeId: employeeData.employeeID || '',
        email: employeeData.email || '',
        password: '', // Don't populate password in edit mode
        machineId: employeeData.machineID || '',
      });
    } else if (!mode || mode === 'create') {
      const storedAccountDetails = formData.accountDetails || {};

      form.reset({
        employeeId: storedAccountDetails.employeeId || '',
        email: storedAccountDetails.email || '',
        password: storedAccountDetails.password || '',
        machineId: storedAccountDetails.machineId || '',
      });
    }
  }, [employeeData, mode, formData.accountDetails, form]);

  const checkDuplicateEmployeeId = (value: string) => {
    if (!Employees || isLoading) {
      return true;
    }

    // In edit mode, exclude the current employee's ID from duplicate check
    const isDuplicate = Employees.some(
      (employee: any) =>
        employee.employeeID?.toLowerCase() === value.toLowerCase()
        && employee._id !== effectiveEmployeeId, // Exclude current employee in edit mode
    );

    if (isDuplicate) {
      form.setError('employeeId', {
        type: 'manual',
        message: 'This Employee ID already exists',
      });
      toast.error('This Employee ID is already in use');
      return false;
    }
    return true;
  };

  //  the check Duplicate MachineId function
  const checkDuplicateMachineId = (value: string) => {
    // If value is empty or undefined, return true since it's optional
    if (!value || !Employees || isLoading) {
      return true;
    }

    // In edit mode, exclude the current employee's machine ID from duplicate check
    const isDuplicate = Employees.some(
      (employee: Employee) =>
        employee.machineID?.toLowerCase() === value.toLowerCase()
        && employee._id !== effectiveEmployeeId, // Exclude current employee in edit mode
    );

    if (isDuplicate) {
      form.setError('machineId', {
        type: 'manual',
        message: 'This Machine ID already exists',
      });
      toast.error('This Machine ID is already in use');
      return false;
    }
    return true;
  };

  // ✅ Function to handle form submission
  const onSubmit = async (data: AccountDetailsFormValues, shouldExit?: boolean) => {
    // Set the appropriate loading state
    if (shouldExit) {
      setIsSavingAndExiting(true);
    } else {
      setIsNavigating(true);
    }

    // Check Employee ID only in create mode
    const isEmployeeIdValid = mode === 'create' ? checkDuplicateEmployeeId(data.employeeId) : true;

    // Only check Machine ID if a value was entered
    const isMachineIdValid = data.machineId
      ? checkDuplicateMachineId(data.machineId)
      : true;

    // If either check fails, prevent form submission
    if (!isEmployeeIdValid || !isMachineIdValid) {
      toast.error(
        !isEmployeeIdValid
          ? 'Employee ID already exists'
          : 'Machine ID already exists',
      );
      return;
    }

    // If in edit mode and password is empty, remove it from the data
    const formDataToUpdate = mode === 'edit' && !data.password?.trim()
      ? { ...data, password: undefined }
      : data;

    // Always save to context before navigation
    updateFormData('accountDetails', formDataToUpdate);

    if (mode === 'edit' && effectiveEmployeeId) {
      // Update immediately when in edit mode
      submitStep({
        employeeId: effectiveEmployeeId,
        stepData: formDataToUpdate,
        stepName: 'accountDetails',
      }, () => {
        // Navigate based on shouldExit flag
        router.push(shouldExit
          ? '/dashboard/admin/employees-management'
          : `/dashboard/admin/edit-employee/${effectiveEmployeeId}/contact-details`,
        );
      }, true);
    } else {
      router.push('/dashboard/admin/add-employee/contact-details');
    }
  };

  // ✅ Function to copy password to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // ✅ Reset icon & tooltip after 3 seconds
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full rounded-2xl px-2 md:p-2 xl:p-4 xxl:p-6">
      {/* Progress Indicator */}
      <span className="text-xs text-[#B3B3B3]">Step 2/5</span>
      <h2 className="text-sm font-medium text-primary-100 md:text-base">
        Set up the employee's login credentials
      </h2>

      <hr className="my-2 border-[#F1F1F1]" />

      {/* Wrap the form with FormProvider for easy access to form methods */}
      <FormProvider {...form}>
        <form className="space-y-6 md:space-y-3 xl:space-y-6">
          <div className="md:scrollbar space-y-3 md:max-h-64 md:space-y-1 md:overflow-y-auto xl:space-y-3 xxl:max-h-96">
            {/* Employee ID */}
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID*</FormLabel>
                  <FormControl>
                    <Input
                      className="max-md:text-sm"
                      placeholder="Enter Employee-ID e.g (CH-PK-XXX)"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear error when user starts typing
                        form.clearErrors('employeeId');
                      }}
                      onBlur={() => {
                        field.onBlur();
                        if (field.value) {
                          checkDuplicateEmployeeId(field.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Machine ID */}
            <FormField
              control={form.control}
              name="machineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine ID</FormLabel>
                  <FormControl>
                    <Input
                      className="max-md:text-sm"
                      placeholder="Enter Machine-ID e.g (000)"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear error when user starts typing
                        form.clearErrors('machineId');
                      }}
                      onBlur={() => {
                        field.onBlur();
                        if (field.value) {
                          checkDuplicateMachineId(field.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      className="max-md:text-sm"
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      disabled={mode === 'edit'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField

              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={`${mode === 'edit' && 'hidden'}`}>
                  <FormLabel>Password *</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        className="max-md:text-sm"
                        type="password"
                        isPassword={mode === 'create'}
                        placeholder="Enter password"
                        {...field}

                      />
                    </FormControl>

                    {/* ✅ Copy Icon with Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className={`absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 transition ${
                              isCopied ? 'text-green-500' : 'hover:text-gray-600'
                            }
                            ${mode === 'edit' && 'hidden'}
                            `}
                            onClick={() => copyToClipboard(field.value || '')}
                          >
                            {isCopied ? <RiCheckLine size={25} /> : <RiFileCopyLine size={25} />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isCopied ? 'Copied!' : 'Copy password'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Progress Bar & Navigation Buttons */}
          <div className="flex items-center justify-between md:mt-0 xl:mt-2">
            <MiniProgressBar mode={mode} />
            {
              mode === 'edit' && (
                // Save and exit button
                <div className="flex w-full">
                  <Button
                    className="mr-2 w-full md:w-auto"
                    type="submit"
                    disabled={isUpdating || isSavingAndExiting}
                    onClick={form.handleSubmit(data => onSubmit(data, true))}
                  >
                    {isSavingAndExiting ? 'Saving...' : 'Save & Exit'}
                  </Button>
                  <Button
                    variant="secondary"
                    className="  hidden md:block"
                    type="submit"
                    disabled={isUpdating || isSavingAndExiting}
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
            <div className="flex h-full items-center justify-center gap-2 max-md:w-full md:mt-0 xl:mt-2">
              {/* Back Button */}
              <Button
                className="hidden md:block md:w-auto"
                variant="secondary"
                type="button"
                disabled={isUpdating}
                onClick={(e) => {
                  e.preventDefault();
                  if (mode === 'edit' && effectiveEmployeeId) {
                    router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/personal-details`);
                  } else {
                    router.push('/dashboard/admin/add-employee');
                  }
                }}
              >
                Back
              </Button>
              {/* Submit Button */}
              <Button
                className=" w-full md:w-auto"
                type="submit"
                disabled={isUpdating || isNavigating}
                onClick={form.handleSubmit(data => onSubmit(data, false))}
              >
                {isUpdating && !isSavingAndExiting
                  ? 'Saving...'
                  : isNavigating && mode === 'create'
                    ? 'Continuing...'
                    : 'Continue'}
              </Button>
            </div>
          </div>
          <Button
            className="w-full md:hidden"
            variant="secondary"
            type="button"
            disabled={isUpdating}
            onClick={(e) => {
              e.preventDefault();
              if (mode === 'edit' && effectiveEmployeeId) {
                router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/personal-details`);
              } else {
                router.push('/dashboard/admin/add-employee');
              }
            }}
          >
            Back
          </Button>
          <Button
            variant="secondary"
            className="w-full md:hidden"
            type="submit"
            disabled={isUpdating || isSavingAndExiting}
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

export default AccountDetails;
