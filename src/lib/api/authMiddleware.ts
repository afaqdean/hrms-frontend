import type { NextRequest } from 'next/server';
import type { ExtendedSession, UserRole } from '../auth/authTypes';
import { auth } from 'auth';
import { NextResponse } from 'next/server';
import { ROLES } from '../auth/authTypes';
import { hasRole } from '../auth/roleUtils';

/**
 * Middleware to protect API routes requiring authentication
 */
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
): Promise<NextResponse> {
  const session = await auth() as ExtendedSession | null;

  if (!session || !session.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 },
    );
  }

  return handler(req);
}

/**
 * Middleware to protect API routes requiring specific role
 */
export async function withRole(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  allowedRoles: UserRole[],
): Promise<NextResponse> {
  const session = await auth() as ExtendedSession | null;

  if (!session || !session.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 },
    );
  }

  if (!hasRole(session, allowedRoles)) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403 },
    );
  }

  return handler(req);
}

/**
 * Middleware for admin-only API routes
 */
export async function withAdminAuth(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
): Promise<NextResponse> {
  return withRole(req, handler, [ROLES.ADMIN]);
}

/**
 * Middleware for employee-only API routes
 */
export async function withEmployeeAuth(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
): Promise<NextResponse> {
  return withRole(req, handler, [ROLES.EMPLOYEE]);
}
