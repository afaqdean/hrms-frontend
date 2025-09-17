'use client';

import { ToastStyle } from '@/components/ToastStyle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { API } from '@/Interceptors/Interceptor';
import huddleImage from '@/public/assets/huddle-image.png';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

const formSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^A-Z0-9]/i, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match. Please try again.',
  path: ['confirmPassword'],
});

const SetNewPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (!email) {
        throw new Error('Email not found in URL parameters');
      }

      const decodedEmail = decodeURIComponent(email);
      await API.post('/auth/reset-password', {
        email: decodedEmail,
        newPassword: values.password,
      });

      toast.success('Password updated successfully!', ToastStyle);
      // Show success message and redirect after a short delay
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage, ToastStyle);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center rounded-2xl bg-white md:w-1/2">
      <Card className="flex size-full flex-col justify-center border-none shadow-none">
        <CardHeader>
          <div className="mb-2 mt-6 flex justify-center md:justify-start">
            <div className="mt-3 flex justify-start md:mt-0 md:justify-center">
              <Image
                src={huddleImage}
                height={140}
                width={140}
                className="object-contain"
                alt="HuddleHR Logo"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 text-center">
            <CardTitle className="text-lg font-semibold text-primary">Set a New Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isPassword
                        type="password"
                        placeholder="Enter your password"
                        label="New Password *"
                        className={form.formState.errors.password ? 'border-danger bg-red-50' : ''}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isPassword
                        type="password"
                        placeholder="Confirm your password"
                        label="Confirm Password *"
                        className={form.formState.errors.confirmPassword ? 'border-danger bg-red-50' : ''}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-start text-sm text-secondary-300">
                <p className="text-xs text-secondary-300">* Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.</p>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetNewPasswordForm;
