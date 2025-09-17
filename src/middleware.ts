import type { NextRequest } from 'next/server';
import { auth } from 'auth';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './libs/i18nNavigation';

const intlMiddleware = createIntlMiddleware(routing);

const publicPaths = ['/', '/sign-in', '/sign-up'];
// Add service worker and PWA related paths
const pwaFiles = ['/sw.js', '/offline.html', '/manifest.json', '/android-chrome-192x192.png', '/android-chrome-512x512.png'];

// Define protected route patterns
const adminRoutePattern = /^\/[^/]+\/dashboard\/admin/;
const employeeRoutePattern = /^\/[^/]+\/dashboard\/employee/;
const dashboardRootPattern = /^\/[^/]+\/dashboard\/?$/;

export default async function middleware(req: NextRequest) {
  // Handle service worker and PWA related files
  const isPWAFile = pwaFiles.includes(req.nextUrl.pathname);
  if (isPWAFile) {
    // Skip any processing for PWA files to ensure they're served correctly
    return NextResponse.next();
  }

  const publicPathnameRegex = new RegExp(`^(/(${routing.locales.join('|')}))?(${publicPaths.join('|')})?/?$`, 'i');
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  }

  // Check if it's the dashboard root path that needs redirection
  const isDashboardRoot = dashboardRootPattern.test(req.nextUrl.pathname);
  if (isDashboardRoot) {
    // Get the session to determine user role
    const session = await auth();

    // If no session, redirect to sign-in
    if (!session) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
    }

    // Get user role from session
    const userRole = (session.user as any)?.role?.toLowerCase();

    // Redirect based on role
    const locale = req.nextUrl.pathname.split('/')[1] || 'en';
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/admin/overview`, req.url));
    } else if (userRole === 'employee') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/employee/overview`, req.url));
    } else {
      // No valid role, redirect to sign-in
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
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
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      const callbackUrl = encodeURIComponent(req.nextUrl.href);
      return NextResponse.redirect(new URL(`/${locale}/sign-in?callbackUrl=${callbackUrl}`, req.url));
    }

    // Get user role from session
    const userRole = (session.user as any)?.role?.toLowerCase();

    // Check role-based access
    if (!userRole) {
      // No role defined, redirect to sign-in
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
    }

    // Enforce admin-only routes
    if (isAdminRoute && userRole !== 'admin') {
      // Not an admin, redirect to employee dashboard
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/dashboard/employee/overview`, req.url));
    }

    // Enforce employee-only routes
    if (isEmployeeRoute && userRole !== 'employee') {
      // Admin trying to access employee routes, redirect to admin dashboard
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/dashboard/admin/overview`, req.url));
    }
  }

  // Apply intl middleware for all requests
  return intlMiddleware(req);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
