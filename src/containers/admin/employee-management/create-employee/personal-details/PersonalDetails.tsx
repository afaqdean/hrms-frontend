'use client'; // Ensure the file runs on the client side

import { Button } from '@/components/ui/button';
import Dropzone from '@/components/ui/Dropzone';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,

  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type PersonalDetailsFormValues, personalDetailsSchema } from '@/containers/types';
import { useMultiStepForm } from '@/hooks/useMultiForm';
import { useSpecificEmployeeData } from '@/hooks/useSpecificEmployeeData';
import { useUpdateEmployeeStep } from '@/hooks/useUpdateEmployeeStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import MiniProgressBar from '../MiniProgressBar';

type PersonalDetailsProps = {
  mode?: 'create' | 'edit';
  employeeId?: string;
  initialData?: any; // Type this properly based on your employee interface
};

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  mode = 'create',
  employeeId,
  initialData,
}) => {
  const router = useRouter(); // Next.js router for navigation
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [remoteImageUrl, setRemoteImageUrl] = React.useState<string | null>(null);
  const [isSavingAndExiting, setIsSavingAndExiting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const { submitStep, isPending: isUpdating } = useUpdateEmployeeStep();
  const [isNavigating, setIsNavigating] = useState(false);

  const pathname = usePathname();

  // If employeeId is not provided directly, try to extract it from pathname
  const extractedEmployeeId = !employeeId
    ? pathname.split('/').find((_, index, array) =>
        array[index - 1] === 'edit-employee',
      )
    : null;

  // Use provided employeeId or fallback to extracted or empty string
  const effectiveEmployeeId = employeeId || extractedEmployeeId || '';

  // Fetch employee data in edit mode
  const { data: employeeData } = useSpecificEmployeeData(effectiveEmployeeId);

  const { formData, updateFormData } = useMultiStepForm();

  // Modify the schema to make avatar optional for initial validation
  // We'll handle the avatar validation manually
  const modifiedSchema = React.useMemo(() => {
    return personalDetailsSchema.omit({ avatar: true }).extend({
      avatar: personalDetailsSchema.shape.avatar.optional(),
    });
  }, []);

  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(modifiedSchema),
    mode: 'onChange',
    defaultValues: {
      employeeName: '',
      employeeRole: 'Employee',
      jobTitle: '',
      joiningDate: new Date(),
      avatar: '',
      originalFileName: '',
    },
  });

  // Update form values for edit mode when employee data is available
  useEffect(() => {
    if (mode === 'edit' && !isFormInitialized) {
      // Use initialData if provided, otherwise use fetched employeeData
      const dataToUse = initialData || employeeData;

      if (dataToUse) {
        if (dataToUse.profileImage && typeof dataToUse.profileImage === 'string') {
          setRemoteImageUrl(dataToUse.profileImage);
        }

        form.reset({
          employeeName: dataToUse.name || '',
          employeeRole: dataToUse.role || 'Employee',
          jobTitle: dataToUse.position || '',
          joiningDate: dataToUse.joiningDate ? new Date(dataToUse.joiningDate) : new Date(),
          avatar: dataToUse.profileImage || '',
        });
        setIsFormInitialized(true);
      }
    }
  }, [employeeData, initialData, mode, form, isFormInitialized]);

  // Update form values for create mode when form data changes (only on initial load)
  useEffect(() => {
    if ((!mode || mode === 'create') && !isFormInitialized) {
      // For create mode, load data from the context only on initial load
      const storedPersonalDetails = formData.personalDetails;

      form.reset({
        employeeName: storedPersonalDetails.employeeName || '',
        jobTitle: storedPersonalDetails.jobTitle || '',
        avatar: storedPersonalDetails.avatar || '',
        employeeRole: storedPersonalDetails.employeeRole || 'Employee',
        joiningDate: storedPersonalDetails.joiningDate || new Date(),
        originalFileName: storedPersonalDetails.originalFileName || '',
      });

      // If there's an avatar in the stored data, set it
      if (storedPersonalDetails.avatar && typeof storedPersonalDetails.avatar === 'string') {
        setRemoteImageUrl(storedPersonalDetails.avatar);
        setOriginalFileName(storedPersonalDetails.originalFileName || '');
      }
      setIsFormInitialized(true);
    }
  }, [mode, formData.personalDetails, form, isFormInitialized]);

  const onSubmit = (data: PersonalDetailsFormValues, shouldExit?: boolean) => {
    // Set the appropriate loading state
    if (shouldExit) {
      setIsSavingAndExiting(true);
    } else {
      setIsNavigating(true);
    }

    // Check if we have either a file or remote image
    const hasAvatar = selectedFile || remoteImageUrl;

    if (!hasAvatar && mode === 'create') {
      form.setError('avatar', {
        type: 'manual',
        message: 'Profile picture is required',
      });
      return;
    }

    // Ensure we're saving the data to context before navigation
    const dataToSave = {
      ...data,
      avatar: selectedFile || remoteImageUrl || data.avatar,
      originalFileName,
    };
    updateFormData('personalDetails', dataToSave);

    // Handle file uploads
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const updatedData = {
          ...data,
          avatar: reader.result as string,
          originalFileName,
        };

        updateFormData('personalDetails', updatedData);

        if (mode === 'edit' && effectiveEmployeeId) {
          // Update immediately when in edit mode
          submitStep({
            employeeId: effectiveEmployeeId,
            stepData: updatedData,
            stepName: 'personalDetails',
          }, () => {
            // Navigate based on shouldExit flag
            router.push(shouldExit
              ? '/dashboard/admin/employees-management'
              : `/dashboard/admin/edit-employee/${effectiveEmployeeId}/account-details`,
            );
          });
        } else {
          router.push('/dashboard/admin/add-employee/account-details');
        }
      };
    } else {
      // If no new file selected but we have a remote image, keep using it
      const updatedData = {
        ...data,
        avatar: remoteImageUrl || data.avatar,
        originalFileName: originalFileName || data.originalFileName, // Keep this expanded since we're using a fallback
      };

      updateFormData('personalDetails', updatedData);

      if (mode === 'edit' && effectiveEmployeeId) {
        // Update immediately when in edit mode
        submitStep({
          employeeId: effectiveEmployeeId,
          stepData: updatedData,
          stepName: 'personalDetails',
        }, () => {
          // Navigate based on shouldExit flag
          router.push(shouldExit
            ? '/dashboard/admin/employees-management'
            : `/dashboard/admin/edit-employee/${effectiveEmployeeId}/account-details`,
          );
        });
      } else {
        router.push('/dashboard/admin/add-employee/account-details');
      }
    }
  };

  return (
    <div className="w-full rounded-2xl px-2  md:p-3 md:pb-0  xl:p-4 xxl:p-6">
      <span className="text-xs text-[#B3B3B3]">
        Step 1/5
      </span>
      <h2 className="text-sm font-medium text-primary-100 md:text-base">
        {mode === 'edit' ? 'Edit personal details' : 'Enter personal details'}
      </h2>

      <hr className="my-2 border-[#F1F1F1]" />

      <Form {...form}>
        <form className="max-md:space-y-6 xl:space-y-6">
          <div className="md:scrollbar space-y-3 pb-2 md:h-[33vh] md:space-y-2 md:overflow-auto xl:h-[42vh]  xxl:max-h-[38vh]">
            {/* Profile Picture Dropzone */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture *</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={(files) => {
                        const file = files[0];
                        if (file) {
                          const newFile = new File([file], file.name, { type: file.type });
                          setSelectedFile(newFile);
                          setOriginalFileName(file.name);
                          setRemoteImageUrl(null);
                          const reader = new FileReader();
                          reader.onload = () => {
                            const base64String = reader.result as string;
                            field.onChange(base64String);
                            // Get current form values to preserve user input
                            const currentFormValues = form.getValues();
                            // Store both base64 and original filename in form data, merging with current form values
                            updateFormData('personalDetails', {
                              ...formData.personalDetails,
                              ...currentFormValues, // Preserve current user input
                              avatar: base64String,
                              originalFileName: file.name,
                            });
                            form.setValue('originalFileName', file.name); // Update form state
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      currentFile={
                        selectedFile instanceof File
                          ? selectedFile
                          : typeof remoteImageUrl === 'string'
                            ? form.getValues('originalFileName') || remoteImageUrl // Use originalFileName if available
                            : typeof field.value === 'string'
                              ? form.getValues('originalFileName') || field.value // Use originalFileName if available
                              : undefined
                      }
                      supportedFormats={['JPEG', 'PNG', 'JPG']}
                      accept={{
                        'image/*': ['.jpeg', '.png', '.jpg'],
                      }}
                      maxFiles={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employee Name */}
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Name *</FormLabel>
                  <FormControl>
                    <Input className="text-sm" placeholder="e.g., Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Job Title */}
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input className="text-sm" placeholder="e.g., Backend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* employeeRole */}
            <FormField
              control={form.control}
              name="employeeRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Role *</FormLabel>
                  <FormControl>
                    <Select
                      disabled
                      onValueChange={field.onChange}
                      defaultValue={field.value || 'Employee'}
                    >
                      <SelectTrigger className="bg-secondary-100 text-secondary-300">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Joining Date */}
            <FormField
              control={form.control}
              name="joiningDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining Date *</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      type="date"
                      className="cursor-pointer flex-col text-sm"
                      onFocus={e => e.target.showPicker()}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Progress Bar */}
          <div className={`flex items-center justify-between  md:mt-2 `}>
            <MiniProgressBar mode={mode} />
            {
              mode === 'edit' && (
                // Save and exit button
                <div className="flex w-full">
                  <Button
                    className="mr-2 w-full md:w-auto"
                    type="submit"
                    disabled={isUpdating || isSavingAndExiting}
                    onClick={form.handleSubmit((data) => {
                      onSubmit(data, true);
                    })}
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
            <div className="flex h-full items-center justify-center gap-2 max-md:w-full md:mt-2  md:items-end">
              <Button
                className="hidden md:block md:w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/dashboard/admin/employees-management');
                }}
                variant="secondary"
                type="button"
                disabled={isUpdating || isNavigating}
              >
                Back
              </Button>
              {/* Submit Button */}
              <Button
                className="w-full md:w-auto"
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
            onClick={(e) => {
              e.preventDefault();
              router.push('/dashboard/admin/employees-management');
            }}
            variant="secondary"
            type="button"
            disabled={isUpdating || isNavigating}
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
      </Form>
    </div>
  );
};

export default PersonalDetails;
