import type { NextRequest } from 'next/server';
import { auth } from 'auth';
import { NextResponse } from 'next/server';

const publicPaths = ['/', '/sign-in', '/sign-up'];
// Add service worker and PWA related paths
const pwaFiles = ['/sw.js', '/offline.html', '/manifest.json', '/android-chrome-192x192.png', '/android-chrome-512x512.png'];

// Define protected route patterns
const adminRoutePattern = /^\/dashboard\/admin/;
const employeeRoutePattern = /^\/dashboard\/employee/;
const dashboardRootPattern = /^\/dashboard\/?$/;

export default async function middleware(req: NextRequest) {
  // Handle service worker and PWA related files
  const isPWAFile = pwaFiles.includes(req.nextUrl.pathname);
  if (isPWAFile) {
    // Skip any processing for PWA files to ensure they're served correctly
    return NextResponse.next();
  }

  // Extract tenant information from hostname
  const hostname = req.headers.get('host') || '';
  const hostParts = hostname.split('.');
  let tenant = '';

  if (hostParts.length >= 3) {
    // For subdomain.hr-ify.com
    tenant = hostParts[0] || '';
  } else if (hostParts.length === 2) {
    // For hr-ify.com (base domain)
    tenant = 'base';
  }

  // Skip tenant detection for localhost
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    tenant = 'base';
  }

  // Add tenant information to request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant', tenant);
  requestHeaders.set('x-tenant-type', tenant === 'base' ? 'base' : 'company');

  const publicPathnameRegex = new RegExp(`^(?:${publicPaths.join('|')})?/?$`, 'i');
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Check if it's the dashboard root path that needs redirection
  const isDashboardRoot = dashboardRootPattern.test(req.nextUrl.pathname);
  if (isDashboardRoot) {
    // Get the session to determine user role
    const session = await auth();

    // If no session, redirect to sign-in
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Get user role from session
    const userRole = (session.user as any)?.role?.toLowerCase();

    // Redirect based on role
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin/overview', req.url));
    } else if (userRole === 'employee') {
      return NextResponse.redirect(new URL('/dashboard/employee/overview', req.url));
    } else {
      // No valid role, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  // Check if it's a protected role-based route
  const isAdminRoute = adminRoutePattern.test(req.nextUrl.pathname);
  const isEmployeeRoute = employeeRoutePattern.test(req.nextUrl.pathname);

  if (isAdminRoute || isEmployeeRoute) {
    // Get the session
    const session = await auth();

    // If no session, redirect to sign-in
    if (!session) {
      const callbackUrl = encodeURIComponent(req.nextUrl.href);
      return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${callbackUrl}`, req.url));
    }

    // Get user role from session
    const userRole = (session.user as any)?.role?.toLowerCase();

    // Check role-based access
    if (!userRole) {
      // No role defined, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Enforce admin-only routes
    if (isAdminRoute && userRole !== 'admin') {
      // Not an admin, redirect to employee dashboard
      return NextResponse.redirect(new URL('/dashboard/employee/overview', req.url));
    }

    // Enforce employee-only routes
    if (isEmployeeRoute && userRole !== 'employee') {
      // Admin trying to access employee routes, redirect to admin dashboard
      return NextResponse.redirect(new URL('/dashboard/admin/overview', req.url));
    }
  }

  // Continue with the request
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
