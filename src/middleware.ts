import type { NextRequest } from 'next/server';
import { auth } from 'auth';
import { NextResponse } from 'next/server';

const publicPaths = ['/', '/sign-in', '/sign-up', '/unauthorized'];
// Add service worker and PWA related paths
const pwaFiles = ['/sw.js', '/offline.html', '/manifest.json', '/android-chrome-192x192.png', '/android-chrome-512x512.png'];

// Define protected route patterns
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

  // If it's a public page, check if user is logged in and should be redirected to their company
  if (isPublicPage) {
    // Handle root path redirect to sign-in
    if (tenant === 'base' && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Only check for redirect if user is on base domain and not on sign-in/sign-up pages
    if (tenant === 'base' && req.nextUrl.pathname !== '/sign-in' && req.nextUrl.pathname !== '/sign-up') {
      const session = await auth();

      // Only redirect if user is actually logged in AND has a valid session
      if (session && session.user && (session.user as any)?.companySubdomain) {
        // User is logged in on base domain, redirect to their company subdomain
        const userCompanySubdomain = (session.user as any)?.companySubdomain;
        const userRole = (session.user as any)?.role?.toLowerCase();

        if (userCompanySubdomain && userRole) {
          const companyUrl = `https://${userCompanySubdomain}.hr-ify.com/dashboard/${userRole}/overview`;
          return NextResponse.redirect(companyUrl);
        }
      }
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // GLOBAL SECURITY CHECK: For any non-public page, validate user belongs to current subdomain
  // This catches ALL attempts to access other company's URLs/resources
  if (!isPublicPage) {
    const session = await auth();

    // Only check if user is authenticated
    if (session && session.user) {
      const userCompanySubdomain = (session.user as any)?.companySubdomain;

      // If user is on a company subdomain but doesn't belong to it
      // AND they're not already on the unauthorized page
      if (tenant !== 'base' && userCompanySubdomain && userCompanySubdomain !== tenant && req.nextUrl.pathname !== '/unauthorized') {
        // User is trying to access a different company's subdomain/resources
        // Redirect them to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
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

    // Get user role and company information from session
    const userRole = (session.user as any)?.role?.toLowerCase();
    const userCompanySubdomain = (session.user as any)?.companySubdomain;

    // If user has a company subdomain and is on base domain, redirect them to their company subdomain
    if (userCompanySubdomain && tenant === 'base') {
      // User is logged in and on base domain, redirect to their company subdomain
      const companyUrl = `https://${userCompanySubdomain}.hr-ify.com/dashboard/${userRole}/overview`;
      return NextResponse.redirect(companyUrl);
    } else if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin/overview', req.url));
    } else if (userRole === 'employee') {
      return NextResponse.redirect(new URL('/dashboard/employee/overview', req.url));
    } else {
      // No valid role, redirect to sign-in
      return NextResponse.redirect(new URL('/sign-in', req.url));
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
