'use client'; // ✅ Enables client-side rendering for this component

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type EmergencyContactDetailsFormValues, emergencyContactDetailsSchema } from '@/containers/types';
import { useMultiStepForm } from '@/hooks/useMultiForm';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useUpdateEmployeeStep } from '@/hooks/useUpdateEmployeeStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import MiniProgressBar from '../MiniProgressBar';

type EmergencyContactDetailsProps = {
  mode?: 'create' | 'edit';
  employeeId?: string;
  initialData?: any; // Type this properly based on your employee interface
};

const EmergencyContactDetails: React.FC<EmergencyContactDetailsProps> = ({
  mode = 'create',
  employeeId,
  initialData,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Extract employeeId from pathname
  const extractedEmployeeId = pathname.split('/').find((_, index, array) =>
    array[index - 1] === 'edit-employee',
  );

  // Use extracted employeeId if not provided as prop
  const effectiveEmployeeId = employeeId || extractedEmployeeId;

  const { formData, updateFormData } = useMultiStepForm();

  const { submitStep, isPending: isUpdating } = useUpdateEmployeeStep();
  const { data: employeeData } = useSpecificEmployeeData(mode === 'edit' ? effectiveEmployeeId || '' : '');

  const form = useForm<EmergencyContactDetailsFormValues>({
    resolver: zodResolver(emergencyContactDetailsSchema),
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: mode === 'edit'
      ? {
          emergencyContact: {
            contact1: {
              phone: initialData?.emergencyContact?.contact1?.phone || '',
              relation: initialData?.emergencyContact?.contact1?.relation || '',
            },
            contact2: {
              phone: initialData?.emergencyContact?.contact2?.phone || '',
              relation: initialData?.emergencyContact?.contact2?.relation || '',
            },
            address: initialData?.emergencyContact?.address || '',
          },
        }
      : {
          emergencyContact: {
            contact1: {
              phone: formData.emergencyContactDetails?.emergencyContact?.contact1?.phone || '',
              relation: formData.emergencyContactDetails?.emergencyContact?.contact1?.relation || '',
            },
            contact2: {
              phone: formData.emergencyContactDetails?.emergencyContact?.contact2?.phone || '',
              relation: formData.emergencyContactDetails?.emergencyContact?.contact2?.relation || '',
            },
            address: formData.emergencyContactDetails?.emergencyContact?.address || '',
          },
        },
  });

  const [isNavigating, setIsNavigating] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isSavingAndExiting, setIsSavingAndExiting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && employeeData) {
      try {
        // Try to parse the emergency contact data
        const emergencyContact = employeeData.emergencyContact
          ? (typeof employeeData.emergencyContact === 'string'
              ? JSON.parse(employeeData.emergencyContact)
              : employeeData.emergencyContact)
          : {
              contact1: { phone: '', relation: '' },
              contact2: { phone: '', relation: '' },
              address: '',
            };

        form.reset({
          emergencyContact,
        });
      } catch (error) {
        console.error('Error parsing emergency contact data:', error);
        form.reset({
          emergencyContact: {
            contact1: { phone: '', relation: '' },
            contact2: { phone: '', relation: '' },
            address: '',
          },
        });
      }
    } else if (!mode || mode === 'create') {
      // For create mode, load from context
      const storedEmergencyDetails = formData.emergencyContactDetails || {};

      form.reset({
        emergencyContact: storedEmergencyDetails.emergencyContact || {
          contact1: { phone: '', relation: '' },
          contact2: { phone: '', relation: '' },
          address: '',
        },
      });
    }
  }, [employeeData, mode, formData.emergencyContactDetails, form]);

  const handleSkip = () => {
    setIsSkipping(true);
    // Get current form values
    const currentFormData = form.getValues();
    // Update context with current form values
    updateFormData('emergencyContactDetails', currentFormData);

    if (mode === 'edit' && effectiveEmployeeId) {
      router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/leaves-count`);
    } else {
      router.push('/dashboard/admin/add-employee/leaves-count');
    }
  };

  const onSubmit = (data: EmergencyContactDetailsFormValues, shouldExit?: boolean) => {
    // Set the appropriate loading state
    if (shouldExit) {
      setIsSavingAndExiting(true);
    } else {
      setIsNavigating(true);
    }

    // Always save to context before navigation
    updateFormData('emergencyContactDetails', data);

    if (mode === 'edit' && effectiveEmployeeId) {
      submitStep({
        employeeId: effectiveEmployeeId,
        stepData: data,
        stepName: 'emergencyContactDetails',
      }, () => {
        router.push(shouldExit
          ? '/dashboard/admin/employees-management'
          : `/dashboard/admin/edit-employee/${effectiveEmployeeId}/leaves-count`,
        );
      }, true);
    } else {
      router.push('/dashboard/admin/add-employee/leaves-count');
    }
  };

  return (
    <div className="w-full px-2 md:p-2 xl:p-4 xxl:p-6">
      {/* Progress Indicator */}
      <span className="text-xs text-[#B3B3B3]">Step 4/5</span>
      <h2 className="text-sm font-medium text-primary-100 md:text-base">
        Provide the employee's emergency contact information
      </h2>

      <hr className="my-2 border-[#F1F1F1] md:my-1 xl:my-2" />

      {/* Wrap the form with FormProvider for easy access to form methods */}
      <FormProvider {...form}>
        <form className="space-y-4 md:space-y-3 xl:space-y-6">
          <div className="md:scrollbar space-y-3 md:max-h-64 md:space-y-2 md:overflow-y-auto xxl:max-h-72 xxl:space-y-3">
            {/* First Emergency Contact */}
            <div className="flex w-full flex-col justify-between md:flex-row md:gap-4">
              <div className="md:w-1/2">
                <FormField
                  name="emergencyContact.contact1.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact 1</FormLabel>
                      <FormControl>
                        <Input
                          className="max-md:text-sm"
                          type="tel"
                          {...field}
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
              </div>
              <div className="md:w-1/2">
                <FormField
                  name="emergencyContact.contact1.relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input className="max-md:text-sm" {...field} placeholder="e.g., Parent" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Second Emergency Contact */}
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="md:w-1/2">
                <FormField
                  name="emergencyContact.contact2.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact 2</FormLabel>
                      <FormControl>
                        <Input
                          className="max-md:text-sm"
                          type="tel"
                          {...field}
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
              </div>
              <div className="md:w-1/2">
                <FormField
                  name="emergencyContact.contact2.relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input className="max-md:text-sm" {...field} placeholder="e.g., Relative" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Emergency Contact Address */}
            <FormField
              name="emergencyContact.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Address</FormLabel>
                  <FormControl>
                    <Input className="py-4 max-md:py-2 max-md:text-sm" {...field} placeholder="Type your address here" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Progress Bar & Navigation Buttons */}
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
                onClick={handleSkip}
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
                    router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/contact-details`);
                  } else {
                    router.push('/dashboard/admin/add-employee/contact-details');
                  }
                }}
              >
                Back
              </Button>
              <Button
                className="w-full md:w-auto"
                type="submit"
                disabled={isUpdating || isSkipping || isNavigating}
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
            onClick={(e) => {
              e.preventDefault();
              if (mode === 'edit' && effectiveEmployeeId) {
                router.push(`/dashboard/admin/edit-employee/${effectiveEmployeeId}/contact-details`);
              } else {
                router.push('/dashboard/admin/add-employee/contact-details');
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

export default EmergencyContactDetails;
