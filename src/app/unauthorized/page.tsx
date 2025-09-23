'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const userCompanySubdomain = (session?.user as any)?.companySubdomain;
  const userRole = (session?.user as any)?.role?.toLowerCase();

  useEffect(() => {
    if (!session) {
      router.push('/sign-in');
    }
  }, [session, router]);

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    if (userCompanySubdomain && userRole) {
      const companyUrl = `https://${userCompanySubdomain}.hr-ify.com/dashboard/${userRole}/overview`;
      window.location.href = companyUrl;
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!session) {
    return null; // Will redirect to sign-in
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="size-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Unauthorized Access
          </CardTitle>
          <CardDescription className="text-gray-600">
            You don't have permission to access this company's subdomain.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-600">
              You are logged in as a user from
              {' '}
              <span className="font-medium text-blue-600">
                {userCompanySubdomain || 'your company'}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Click the button below to go to your company's dashboard.
            </p>
          </div>

          {isRedirecting && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="size-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="text-sm">Redirecting...</span>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleManualRedirect}
              className="flex-1"
              disabled={isRedirecting}
            >
              {isRedirecting ? 'Redirecting...' : 'Go to My Company Dashboard'}
            </Button>
            <Button
              variant="outline"
              onClick={handleGoBack}
              disabled={isRedirecting}
            >
              <ArrowLeft className="mr-1 size-4" />
              Go Back
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500">
            If you believe this is an error, please contact your administrator.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
