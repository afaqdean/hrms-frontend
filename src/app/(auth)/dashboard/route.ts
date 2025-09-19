import type { NextRequest } from 'next/server';
import { auth } from 'auth';
import { NextResponse } from 'next/server';

// This route handler will capture any direct GET requests to the /dashboard path
export async function GET(request: NextRequest) {
  // Get session
  const session = await auth();

  // If not authenticated, redirect to sign-in
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Get user role and company information
  const userRole = (session.user as any)?.role?.toLowerCase();
  const userCompanySubdomain = (session.user as any)?.companySubdomain;

  // Redirect based on role and company
  if (userRole === 'admin' && userCompanySubdomain) {
    // Redirect admin to their company subdomain
    const companyUrl = `https://${userCompanySubdomain}.hr-ify.com/dashboard/admin/overview`;
    return NextResponse.redirect(companyUrl);
  } else if (userRole === 'admin') {
    return NextResponse.redirect(new URL('/dashboard/admin/overview', request.url));
  } else if (userRole === 'employee') {
    return NextResponse.redirect(new URL('/dashboard/employee/overview', request.url));
  } else {
    // No valid role, redirect to sign-in
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}
