'use client';

import { ToastStyle } from '@/components/ToastStyle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { API } from '@/Interceptors/Interceptor';
import huddleImage from '@/public/assets/huddle-image.png';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import * as z from 'zod';

const formSchema = z.object({
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});

export default function OtpVerificationForm() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsVerifying(true);

    try {
      if (!email) {
        throw new Error('Email not found in URL parameters');
      }

      const decodedEmail = decodeURIComponent(email);

      try {
        await API.post('/auth/verify-otp', {
          email: decodedEmail,
          otp: values.otp,
        });

        toast.success('OTP verified successfully!', ToastStyle);
        router.push(`/reset-password/set-new-password?email=${encodeURIComponent(email)}`);
      } catch (err) {
        // Check if it's an axios error
        if (axios.isAxiosError(err)) {
          // Handle 401 or other status codes specifically for OTP verification
          const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
          toast.error(errorMessage, ToastStyle);
          form.reset();
          return; // Prevent global error handler from triggering
        }
        throw err; // Re-throw if it's not an axios error
      }
    } catch (error: any) {
      if (error.message === 'Email not found in URL parameters') {
        toast.error(error.message, ToastStyle);
      } else {
        const errorMessage = 'Something went wrong. Please try again.';
        toast.error(errorMessage, ToastStyle);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (!email) {
        throw new Error('Email not found in URL parameters');
      }

      setIsResending(true);

      const decodedEmail = decodeURIComponent(email);
      await API.post('/auth/request-otp', {
        email: decodedEmail,
      });

      // Clear the OTP input after successful resend
      form.reset();
      const successMessage = 'New OTP has been sent to your email.';
      toast.success(successMessage, ToastStyle);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage, ToastStyle);
    } finally {
      setIsResending(false);
    }
  };

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
            <CardTitle className="text-lg font-semibold text-primary">OTP Verification</CardTitle>
            <p className="text-sm text-secondary-300">
              We've sent a one-time password (OTP) to your email address. Enter the OTP below to verify your account and reset your password.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="mt-4 flex flex-col items-center justify-center gap-2">
                        <OtpInput
                          value={field.value}
                          onChange={field.onChange}
                          numInputs={6}
                          renderInput={props => <input {...props} />}
                          containerStyle="gap-3 max-md:gap-2"
                          inputStyle={{
                            width: '45px',
                            height: '45px',
                            border: '1px solid black',
                            backgroundColor: 'bg-secondary-100',
                            borderRadius: '8px',
                            fontSize: '16px',
                            textAlign: 'center',
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify & Reset Password'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 flex justify-center gap-1 text-center text-sm">
            <span className="text-secondary-300">Didn't receive the OTP?</span>
            <button
              onClick={handleResendOTP}
              className="text-primary hover:underline"
              type="button"
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
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
