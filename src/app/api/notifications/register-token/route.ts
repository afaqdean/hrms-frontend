import type { NextRequest } from 'next/server';
import { auth } from 'auth';
import { NextResponse } from 'next/server';

/**
 * API endpoint to register a FCM token for a user
 * This would typically store the token in your database
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current session to identify the user
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get the FCM token from the request body
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 },
      );
    }

    // Here you would typically store the token in your database
    // associated with the current user
    // eslint-disable-next-line no-console
    console.log(`Registering FCM token for user ${session.user.email}:`, token);

    // For now, we'll just return success
    // In a real implementation, you would save this to your database
    return NextResponse.json({
      success: true,
      message: 'FCM token registered successfully',
    });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to register FCM token' },
      { status: 500 },
    );
  }
}
