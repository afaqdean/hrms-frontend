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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

// Zod schema for email validation
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      await API.post('/auth/request-otp', {
        email: values.email,
      });

      toast.success(`Reset instructions sent to ${values.email}`, ToastStyle);
      router.push(`/reset-password/otp-verification?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset instructions. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to send reset instructions. Please try again.', ToastStyle);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center rounded-2xl bg-white md:w-1/2">
      <Card className="flex size-full flex-col justify-center border-none shadow-none">
        <CardHeader>
          {/* Top Icon */}
          <div className="mb-2 mt-6 flex justify-center md:justify-start">
            {/* Display the HuddleHR logo */}
            <div className="mt-3 flex  justify-start md:mt-0 md:justify-center">
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
            <CardTitle className="text-lg font-semibold text-primary">Forgot Your Password?</CardTitle>
            <p className="text-sm text-secondary-300">
              Enter your registered email address, and we'll send you instructions to reset your password.
            </p>
          </div>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Email"
                        type="email"
                        className={error ? 'border-danger' : ''}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Link href="/sign-in" className="text-sm text-primary hover:underline">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
