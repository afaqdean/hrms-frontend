'use client';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type ContactDetailsFormValues, contactDetailsSchema } from '@/containers/types';
import { useMultiStepForm } from '@/hooks/useMultiForm';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useUpdateEmployeeStep } from '@/hooks/useUpdateEmployeeStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import MiniProgressBar from '../MiniProgressBar';

type ContactDetailsProps = {
  mode?: 'create' | 'edit';
  employeeId?: string;
};

const ContactDetails: React.FC<ContactDetailsProps> = ({
  mode = 'create',
  employeeId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { submitStep, isPending: isUpdating } = useUpdateEmployeeStep();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isSavingAndExiting, setIsSavingAndExiting] = useState(false);

  // Extract employeeId from pathname if not provided directly
  const extractedEmployeeId = !employeeId
    ? pathname.split('/').find((element, index, array) =>
        element === 'edit-employee' ? array[index + 1] : undefined,
      )
    : null;

  // Use provided employeeId or fallback to extracted
  const effectiveEmployeeId = employeeId || extractedEmployeeId;

  // Access the form context for multi-step form
  const { formData, updateFormData } = useMultiStepForm();

  // Fetch employee data when in edit mode
  const { data: employeeData } = useSpecificEmployeeData(mode === 'edit' ? effectiveEmployeeId || '' : '');

  // Initialize form with validation schema
  const form = useForm<ContactDetailsFormValues>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      contact: {
        phone: '',
        address: '',
      },
    },
  });

  // Update form values when employee data is available
  useEffect(() => {
    // Load employee data for edit mode
    if (mode === 'edit' && employeeData) {
      try {
        const contact = employeeData.contact && typeof employeeData.contact === 'string'
          ? JSON.parse(employeeData.contact)
          : employeeData.contact || { phone: '', address: '' };

        form.reset({
          contact,
        });
      } catch (err) {
        console.error('Error parsing contact data:', err);
        form.reset({
          contact: { phone: '', address: '' },
        });
      }
    } else if (!mode || mode === 'create') {
      // For create mode, load from context
      const storedContactDetails = formData.contactDetails || {};

      form.reset({
        contact: {
          phone: storedContactDetails.contact?.phone || '',
          address: storedContactDetails.contact?.address || '',
        },
      });
    }
  }, [employeeData, mode, updateFormData, formData.contactDetails, form]);

  const handleSkip = () => {
    setIsSkipping(true);
    // Get current form values
    const currentFormData = form.getValues();
    // Update context with current form values
    updateFormData('contactDetails', currentFormData);

    if (mode === 'edit' && effectiveEmployeeId) {
      router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/emergency-contact-details`);
    } else {
      router.push('/dashboard/admin/add-employee/emergency-contact-details');
    }
  };

  const onSubmit = (data: ContactDetailsFormValues, shouldExit?: boolean) => {
    // Set the appropriate loading state
    if (shouldExit) {
      setIsSavingAndExiting(true);
    } else {
      setIsNavigating(true);
    }

    // Update form data in context
    updateFormData('contactDetails', data);

    if (mode === 'edit' && effectiveEmployeeId) {
      submitStep(
        {
          employeeId: effectiveEmployeeId,
          stepData: data,
          stepName: 'contactDetails',
        },
        () => {
          if (shouldExit) {
            router.push('/dashboard/admin/employees-management');
          } else {
            router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/emergency-contact-details`);
          }
        },
      );
    } else {
      router.push('/dashboard/admin/add-employee/emergency-contact-details');
    }
  };

  return (
    <div className="w-full rounded-2xl px-2 md:p-4 xxl:p-6">
      <span className="text-xs text-[#B3B3B3]">Step 3/5</span>
      <h2 className="text-sm font-medium text-primary-100 md:text-base">
        {mode === 'edit' ? 'Edit contact details' : 'Enter contact details'}
      </h2>

      <hr className="my-2 border-[#F1F1F1]" />

      <FormProvider {...form}>
        <form className="space-y-4">
          {/* Phone Number Field */}
          <FormField
            name="contact.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    className="max-md:text-sm"
                    {...field}
                    type="tel"
                    placeholder="e.g., 03XXXXXXXXX"
                    maxLength={11}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Field */}
          <FormField
            name="contact.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} className="py-4 max-md:text-sm" placeholder="Type your address here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Progress Bar */}
          <div className="mt-2 flex items-center justify-between">
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
            <div className="flex h-full items-center justify-center gap-2 max-md:w-full">
              <Button
                className="hidden md:block md:w-auto"
                variant="secondary"
                type="button"
                disabled={isUpdating || isSkipping || isNavigating}
                onClick={(e) => {
                  e.preventDefault();
                  handleSkip();
                }}
              >
                {isSkipping ? 'Skipping...' : 'Skip'}
              </Button>
              <Button
                className="hidden md:block md:w-auto"
                variant="secondary"
                type="button"
                disabled={isUpdating || isSkipping || isNavigating}
                onClick={(e) => {
                  e.preventDefault();
                  if (mode === 'edit' && effectiveEmployeeId) {
                    router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/account-details`);
                  } else {
                    router.push('/dashboard/admin/add-employee/account-details');
                  }
                }}
              >
                Back
              </Button>
              <Button
                className="w-full md:w-auto"
                type="submit"
                onClick={form.handleSubmit(data => onSubmit(data, false))}
                disabled={isUpdating || isSkipping || isNavigating}
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
            disabled={isUpdating || isSkipping || isNavigating}
            onClick={handleSkip}
          >
            {isSkipping ? 'Skipping...' : 'Skip'}
          </Button>
          <Button
            className="w-full md:hidden"
            variant="secondary"
            type="button"
            disabled={isUpdating || isSkipping || isNavigating}
            onClick={() => {
              if (mode === 'edit' && effectiveEmployeeId) {
                router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/account-details`);
              } else {
                router.push('/dashboard/admin/add-employee/account-details');
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

export default ContactDetails;
