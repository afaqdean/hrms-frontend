'use client';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserProfile } from '@/hooks/useUserProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EmployeeEmergencyContactDetailsSchema = z.object({
  emergencyContact1: z
    .string()
    .refine((value) => {
      if (!value) {
        return true;
      }
      return /^03\d{9}$/.test(value);
    }, {
      message: 'Emergency contact must start with 03 and be exactly 11 digits (e.g., 03XXXXXXXXX)',
    })
    .default(''),

  relationWithContact1: z
    .string()
    .refine((value) => {
      if (!value) {
        return true;
      }
      return /^[A-Z\s]+$/i.test(value) && value.length >= 3 && value.length <= 30;
    }, {
      message: 'Relation must be 3-30 characters and contain only letters and spaces',
    })
    .default(''),

  emergencyContact2: z
    .string()
    .refine((value) => {
      if (!value) {
        return true;
      }
      return /^03\d{9}$/.test(value);
    }, {
      message: 'Emergency contact must start with 03 and be exactly 11 digits (e.g., 03XXXXXXXXX)',
    })
    .default(''),

  relationWithContact2: z
    .string()
    .refine((value) => {
      if (!value) {
        return true;
      }
      return /^[A-Z\s]+$/i.test(value) && value.length >= 3 && value.length <= 30;
    }, {
      message: 'Relation must be 3-30 characters and contain only letters and spaces',
    })
    .default(''),

  emergencyContactAddress: z
    .string()
    .refine((value) => {
      if (!value) {
        return true;
      }
      return value.length >= 3;
    }, {
      message: 'Emergency contact address must be at least 3 characters',
    })
    .default(''),
});

type FormValues = z.infer<typeof EmployeeEmergencyContactDetailsSchema>;

const EmployeeEmergencyContactDetails = () => {
  const router = useRouter();
  const { profile, isLoading, updateProfile } = useUserProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(EmployeeEmergencyContactDetailsSchema),
    defaultValues: {
      emergencyContact1: '',
      relationWithContact1: '',
      emergencyContact2: '',
      relationWithContact2: '',
      emergencyContactAddress: '',
    },
  });

  useEffect(() => {
    if (profile?.emergencyContact) {
      form.reset({
        emergencyContact1: profile.emergencyContact.contact1?.phone || '',
        relationWithContact1: profile.emergencyContact.contact1?.relation || '',
        emergencyContact2: profile.emergencyContact.contact2?.phone || '',
        relationWithContact2: profile.emergencyContact.contact2?.relation || '',
        emergencyContactAddress: profile.emergencyContact.address || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: FormValues) => {
    const success = await updateProfile({
      emergencyContact: {
        contact1: {
          phone: data.emergencyContact1 || undefined,
          relation: data.relationWithContact1 || undefined,
        },
        contact2: {
          phone: data.emergencyContact2 || undefined,
          relation: data.relationWithContact2 || undefined,
        },
        address: data.emergencyContactAddress || undefined,
      },
    });

    if (success) {
      router.push('/dashboard/employee/profile-settings/change-password');
    }
  };

  return (
    <div className="flex size-full flex-col justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="emergencyContact1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact 1</FormLabel>
                    <Input
                      {...field}
                      placeholder="e.g., 03XXXXXXXXX"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="relationWithContact1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Input {...field} placeholder="e.g., Parent" disabled={isLoading} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="emergencyContact2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact 2</FormLabel>
                    <Input
                      {...field}
                      placeholder="e.g., 03XXXXXXXXX"
                      disabled={isLoading}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        field.onChange(value);
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="relationWithContact2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Input {...field} placeholder="e.g., Relative" disabled={isLoading} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="emergencyContactAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Address</FormLabel>
                <Textarea
                  className="resize-none bg-secondary-100 px-3 pb-9 pt-4 text-sm"
                  {...field}
                  placeholder="Type your address here"
                  disabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              className="w-1/2"
              type="button"
              onClick={() => router.push('/dashboard/employee/profile-settings')}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              className="w-1/2"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmployeeEmergencyContactDetails;
