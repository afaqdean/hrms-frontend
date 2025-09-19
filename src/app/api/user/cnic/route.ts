import type { NextRequest } from 'next/server';
import { auth } from 'auth';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the current session to identify the user
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Get user profile data from the existing /user/profile endpoint
    let userProfile = null;

    try {
      // Make a request to the existing user profile endpoint
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${(session as any).accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profileResponse.ok) {
        throw new Error(`Profile fetch failed: ${profileResponse.status}`);
      }

      userProfile = await profileResponse.json();
    } catch (profileError) {
      console.error('Error fetching user profile:', profileError);

      // Fallback: try to get user data from cookies or session
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const userDataMatch = cookies.match(/userData=([^;]+)/);
        if (userDataMatch && userDataMatch[1]) {
          try {
            userProfile = JSON.parse(decodeURIComponent(userDataMatch[1]));
          } catch (e) {
            console.warn('Failed to parse userData cookie:', e);
          }
        }
      }

      // If still no userProfile, try session data
      if (!userProfile && session.user) {
        userProfile = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: (session.user as any).role || 'user',
          cnic: (session.user as any).cnic,
        };
      }
    }

    // Check if we have CNIC data
    if (!userProfile || !userProfile.cnic) {
      return NextResponse.json(
        { error: 'CNIC not found for user' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      cnic: userProfile.cnic,
    });
  } catch (error) {
    console.error('Error fetching user CNIC:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user CNIC' },
      { status: 500 },
    );
  }
}
