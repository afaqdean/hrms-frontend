'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { changePasswordSchema, type FormValues, useChangePassword } from '@/hooks/useChangePassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';

const AdminProfileSettings = () => {
  const { userData } = useAuth();
  const { changePasswordMutation } = useChangePassword();
  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="m-2 flex flex-col  items-start justify-center md:h-5/6">
      <h3 className="mb-4 ml-2 text-lg font-medium md:mb-2 md:text-2xl">Settings</h3>
      <div className="mr-2  flex h-5/6 w-full flex-col rounded-xl bg-white p-2 md:m-0 md:items-center md:justify-center md:p-6">
        <div className="flex flex-col items-center justify-center md:mb-4">
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-full md:mb-4 md:size-28">
            <Image alt="profile" src={userData?.profilePic ?? ''} height={200} width={200} className="size-full object-cover" />
          </div>
          <p className="text-xl text-secondary-300 md:text-2xl  xxl:text-3xl">{userData?.name}</p>
        </div>
        <h3 className="text-lg font-medium text-primary-100 max-smd:mt-4">Change Password</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-3 md:mt-0 md:w-3/4 md:space-y-4">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input isPassword type="password" placeholder="Enter old password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input isPassword type="password" placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full gap-2 md:justify-end">
              <Button
                type="button"
                className="w-1/2 md:w-auto"
                variant="secondary"
                onClick={() => window.history.back()}
                disabled={changePasswordMutation.isPending}
              >
                Back
              </Button>
              <Button
                className="w-1/2 md:w-auto"
                type="submit"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Updating...
                      </>
                    )
                  : (
                      'Save'
                    )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminProfileSettings;
