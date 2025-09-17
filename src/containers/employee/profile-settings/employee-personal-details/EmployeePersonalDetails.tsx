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
import { Textarea } from '@/components/ui/textarea';
import { useUserProfile } from '@/hooks/useUserProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define schema using the same validations as in index.ts
const employeePersonalDetailsSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .max(30, { message: 'Name cannot exceed 30 characters' })
    .regex(/^[A-Z\s]+$/i, {
      message: 'Name must only contain letters and spaces',
    }),

  dateOfBirth: z
    .string()
    .min(10, { message: 'Date of birth is required' }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email format' })
    .max(100, { message: 'Email must be at most 100 characters long' }),

  avatar: z
    .union([z.string(), z.instanceof(File)])
    .optional(),

  phone: z
    .string()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }
        return /^03\d{9}$/.test(value);
      },
      {
        message: 'Phone number must start with 03 and be exactly 11 digits (e.g., 03XXXXXXXXX)',
      },
    )
    .default(''),

  address: z
    .string()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }
        return value.length >= 3 && value.length <= 100;
      },
      {
        message: 'Address must be between 3 and 100 characters when provided',
      },
    )
    .default(''),
});

// Define TypeScript type for form data
type FormValues = z.infer<typeof employeePersonalDetailsSchema>;

const EmployeePersonalDetails = () => {
  const router = useRouter();
  const { profile, isLoading, updateProfile } = useUserProfile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [remoteImageUrl, setRemoteImageUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(employeePersonalDetailsSchema),
    defaultValues: {
      name: '',
      email: '',
      avatar: '',
      phone: '',
      address: '',
      dateOfBirth: '',
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      // Set remote image URL if profile has an image
      if (profile.profileImage && typeof profile.profileImage === 'string') {
        setRemoteImageUrl(profile.profileImage);
      }

      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        avatar: profile.profileImage || '',
        phone: profile.contact?.phone || '',
        address: profile.contact?.address || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: FormValues) => {
    // Handle file uploads
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const success = await updateProfile({
          name: data.name,
          email: data.email,
          dateOfBirth: data.dateOfBirth,
          contact: {
            phone: data.phone || undefined,
            address: data.address || undefined,
          },
        });

        if (success) {
          router.push('/dashboard/employee/profile-settings/emergency-contact-details');
        }
      };
    } else {
      const success = await updateProfile({
        name: data.name,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        contact: {
          phone: data.phone || undefined,
          address: data.address || undefined,
        },
      });

      if (success) {
        router.push('/dashboard/employee/profile-settings/emergency-contact-details');
      }
    }
  };

  return (
    <div className="flex size-full flex-col justify-center rounded-2xl xxl:p-6">
      <div className="scrollbar max-h-full overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 xl:space-y-3 xxl:space-y-6">
            {/* Profile Picture */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={(files: File[]) => {
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
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      currentFile={
                        selectedFile instanceof File
                          ? selectedFile
                          : typeof remoteImageUrl === 'string'
                            ? originalFileName || remoteImageUrl
                            : typeof field.value === 'string'
                              ? originalFileName || field.value
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

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Smith" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., jane.smith@example.com" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth - Note: Backend support needed for full functionality */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input className="w-full flex-col md:text-sm" type="date" placeholder="Select your date of birth" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="e.g., 03XXXXXXXXX"
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => {
                        // Only allow numbers and limit to 11 digits
                        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none bg-secondary-100 px-3 pb-9 pt-4 text-sm"
                      placeholder="Enter your address"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="w-1/2"
                type="button"
                onClick={() => router.push('/dashboard/employee/overview')}
                disabled={isLoading}
              >
                Cancel
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
    </div>
  );
};

export default EmployeePersonalDetails;
