'use client';

// Importing necessary components and libraries
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ButtonLoadingSpinner } from '@/components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTenant } from '@/context/useTenant';
import { cookieUtils } from '@/lib/cookie-utils';
import huddleImage from '@/public/assets/huddle-image.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';
import * as z from 'zod';

// Define the form schema using Zod for validation
const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
  role: z.string({
    required_error: 'Please select a role',
  }),
});

// Main SignInForm component
export default function SignInForm() {
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [accountNotFound, setAccountNotFound] = useState<boolean> (false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { tenantType } = useTenant();

  // Initialize the form using react-hook-form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'Employee', // Default role
    },
  });

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setError(null);
      setAccountNotFound(false);

      // Clear any existing auth data from both cookies and localStorage
      cookieUtils.clearAuthCookies();

      // Also clear localStorage directly for extra safety
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }

      // Extract tenant information from the current hostname
      const hostname = window.location.hostname;
      const hostParts = hostname.split('.');
      let tenant = 'base';
      let tenantType = 'base';

      if (hostParts.length >= 3) {
        // For subdomain.hr-ify.com
        tenant = hostParts[0] || 'base';
        tenantType = 'company';
      } else if (hostParts.length === 2) {
        // For hr-ify.com (base domain)
        tenant = 'base';
        tenantType = 'base';
      }

      // Skip tenant detection for localhost
      if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
        tenant = 'base';
        tenantType = 'base';
      }

      // Additional check for hr-ify.com specifically
      if (hostname === 'hr-ify.com' || hostname === 'www.hr-ify.com' || hostname.endsWith('.hr-ify.com')) {
        if (hostname === 'hr-ify.com' || hostname === 'www.hr-ify.com') {
          tenant = 'base';
          tenantType = 'base';
        } else {
          // Extract subdomain from hr-ify.com (excluding www)
          const subdomain = hostname.replace('.hr-ify.com', '');
          if (subdomain === 'www') {
            tenant = 'base';
            tenantType = 'base';
          } else {
            tenant = subdomain;
            tenantType = 'company';
          }
        }
      }

      // Use NextAuth for authentication with tenant information
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        role: values.role,
        tenant,
        tenantType,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setAccountNotFound(true);
        setIsLoading(false);
      } else {
        // Success - add a small delay before navigation to allow NextAuth to complete its processes
        // This helps prevent the "stuck" issue by giving time for the session to be properly established

        // Keep loading state active during redirect
        setTimeout(() => {
          // Check if user has company information and redirect accordingly
          if ((result as any)?.user?.companySubdomain && values.role.toLowerCase() === 'admin') {
            // Redirect admin to their company subdomain
            const companyUrl = `https://${(result as any).user.companySubdomain}.hr-ify.com/dashboard/admin/overview`;
            window.location.href = companyUrl;
          } else if (values.role.toLowerCase() === 'admin') {
            router.push('/dashboard/admin/overview');
          } else {
            router.push('/dashboard/employee/overview');
          }
        }, 500);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center rounded-2xl  bg-white  md:w-1/2">
      <Card className="flex size-full flex-col justify-center border-none shadow-none">
        <CardHeader>
          {/* Display the HuddleHR logo */}
          <div className=" mt-3 flex justify-center md:mt-0 md:justify-start">
            <Image
              src={huddleImage}
              height={140}
              width={140}
              className="object-contain"
              alt="HuddleHR Logo"
            />
          </div>
          {/* Display the welcome message */}
          <div className="flex flex-col gap-1 md:mt-6 md:gap-2">
            <CardTitle className="mt-1 text-sm text-primary smd:mt-4">Welcome Back 👋</CardTitle>
            <p className="text-base font-medium text-primary md:text-lg">Enter your credentials to access your account</p>
          </div>
        </CardHeader>
        <CardContent className=" ">
          {/* Display error message if there is an error */}
          {accountNotFound && (
            <div className="my-1 flex justify-start gap-2 rounded-xl border border-danger bg-[#FFF5F5]  p-1 smd:p-2 md:mb-2 md:justify-between">
              <div className="flex items-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-danger text-white md:size-8">
                  <RxCross2 className="size-5  rounded-full smd:size-4" />
                </div>
              </div>
              <div className="flex w-full">
                <div className="text-primary-100">
                  <p className="text-sm font-medium ">No Registered Account Found</p>
                  <p className="text-xs">No such user exists. Please enter a valid email to sign in</p>
                </div>

              </div>
              <div className="flex items-center ">
                <RxCross2 className="cursor-pointer" onClick={() => setAccountNotFound(false)} />
              </div>
            </div>
          )}
          {/* Form for email and password input */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 smd:space-y-6">
              {/* Email input field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className={`${error && 'border-red-500'}`} placeholder="Enter your email" label="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password input field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className={`${error && 'border-danger'} text-sm md:text-base`} type="password" isPassword placeholder="Enter your password" label="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role selection dropdown */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary-300">Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary-100">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me checkbox and Forgot Password link */}
              <div className="flex items-center justify-end">
                <Link href="/reset-password" className="cursor-pointer text-sm text-primary hover:underline">Forgot Password?</Link>
              </div>
              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? (
                      <div className="flex items-center justify-center">
                        <ButtonLoadingSpinner />
                        <span className="ml-2">Signing In...</span>
                      </div>
                    )
                  : (
                      'Sign In'
                    )}
              </Button>

              {/* Company Signup Section - Only show on base domain */}
              {tenantType === 'base' && (
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">New to HuddleHR?</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href="/company-signup">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        Sign Up Your Company
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
