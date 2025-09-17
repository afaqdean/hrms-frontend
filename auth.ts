import type { NextAuthConfig, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { cookies } from 'next/headers';
import { API } from './src/Interceptors/Interceptor';

// For cookie access in server components
type UnsafeUnwrappedCookies = {
  get: (name: string) => { value: string } | undefined;
  set: (
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      secure?: boolean;
      maxAge?: number;
      path?: string;
      sameSite?: 'strict' | 'lax' | 'none';
    }
  ) => void;
};

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://honest-dog-dev-104c88de45c2.herokuapp.com/api';
// These interfaces are put in to another next-auth.s.ts file inside the types folder.
// declare module 'next-auth' {
//   type Session = {
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       role?: string;
//     };
//     accessToken?: string;
//     error?: string;
//   };
//   type User = {
//     role?: string;
//     accessToken?: string;
//     refreshToken?: string;
//     accessTokenExpires?: number;
//   };
// }

// declare module 'next-auth/jwt' {
//   type JWT = {
//     accessToken?: string;
//     refreshToken?: string;
//     accessTokenExpires?: number;
//     user?: {
//       id: string;
//       email: string;
//       name: string;
//       role?: string;
//     };
//     error?: string;
//   };
// }

// Note: We're not using localStorage directly in this server component
// Instead, we'll handle token storage in the client components

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || 'HRMS-SECRETS',

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
              role: (credentials as any)?.role || 'Employee',
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Authentication failed');
          }

          const data = await response.json();

          // Create a properly typed user object
          return {
            id: data.user._id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role || (credentials as any)?.role || 'Employee',
            token: data.tokens.access_token,
            refreshToken: data.tokens.refresh_token,
            tokenExpires: 24 * 60 * 60, // 24 hours in seconds
            profilePic: data.user.profileImage || '',
            employeeID: data.user.employeeID || '',
            position: data.user.position || '',
          };
        } catch (error) {
          console.error('NextAuth authorize error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }): Promise<JWT> {
      if (user) {
        return {
          ...token,
          accessToken: user.token,
          accessTokenExpires: Date.now() + user.tokenExpires * 1000,
          refreshToken: user.refreshToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic || '',
            role: user.role,
            employeeID: user.employeeID || '',
            position: user.position || '',
          },
        };
      }

      // Fetch the latest token from cookies
      try {
        const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
        const newAccessToken = cookieStore.get('token');

        if (newAccessToken && newAccessToken.value !== token.accessToken) {
          return {
            ...token,
            accessToken: newAccessToken.value,
          };
        }
      } catch (error) {
        console.error('Error accessing cookies in jwt callback:', error);
      }

      // If token is not expired, return it
      if (
        typeof token.accessTokenExpires === 'number'
        && Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // Refresh the token
      return await refreshAccessToken(token);
    },

    async session({ session, token }: { session: Session; token: JWT }): Promise<any> {
      if (token.error === 'RefreshAccessTokenError') {
        return null;
      }

      return {
        ...session,
        accessToken: token.accessToken,
        user: token.user,
      };
    },
  },
  events: {
    async signIn({ user }: { user: any }) {
      if (user?.token) {
        try {
          const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;

          // Set token cookie
          cookieStore.set('token', user.token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: user.tokenExpires,
            path: '/',
            sameSite: 'lax',
          });

          // Set user role cookie
          cookieStore.set('userRole', user.role || 'Employee', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: user.tokenExpires,
            path: '/',
            sameSite: 'lax',
          });

          // Set user data cookie
          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic || '',
            role: user.role,
            employeeID: user.employeeID || '',
            position: user.position || '',
          };

          cookieStore.set('userData', JSON.stringify(userData), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: user.tokenExpires,
            path: '/',
            sameSite: 'lax',
          });

          // Also update localStorage if we're in the browser
          if (typeof window !== 'undefined') {
            // Clear any existing data first
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
            localStorage.removeItem('user');

            // Set new data
            localStorage.setItem('token', user.token);
            localStorage.setItem('userRole', user.role || 'Employee');
            localStorage.setItem('userData', JSON.stringify(userData));

            // Also set the legacy 'user' item for backward compatibility
            localStorage.setItem('user', JSON.stringify({
              ...userData,
              profileImage: userData.profilePic,
            }));
          }
        } catch (error) {
          console.error('Error setting cookies in signIn event:', error);
        }
      }
    },
    async signOut() {
      try {
        const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;

        // Clear the API instance authorization header
        if (typeof window !== 'undefined') {
          API.defaults.headers.common.Authorization = '';

          // Clear all auth-related items from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
          localStorage.removeItem('user'); // Clear the old 'user' item as well

          // For extra safety, clear any other potential auth-related items
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }

        // Clear all auth-related cookies
        cookieStore.set('token', '', { maxAge: -1, path: '/' });
        cookieStore.set('userRole', '', { maxAge: -1, path: '/' });
        cookieStore.set('userData', '', { maxAge: -1, path: '/' });
      } catch (error) {
        console.error('Error clearing cookies in signOut event:', error);
      }
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.refreshToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    // Update token in cookies
    try {
      const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;
      cookieStore.set('token', data.tokens.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours in seconds
        path: '/',
        sameSite: 'lax',
      });
    } catch (error) {
      console.error('Error updating cookies in refreshAccessToken:', error);
    }

    return {
      ...token,
      accessToken: data.tokens.access_token,
      accessTokenExpires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      refreshToken: data.tokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error('RefreshAccessTokenError:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Add a custom signOut function that also clears cookies
export const customSignOut = async () => {
  try {
    // Clear localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      // Clear all auth-related items from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('user'); // Clear the old 'user' item as well

      // For extra safety, clear any other potential auth-related items
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    // Call the NextAuth signOut function
    await signOut({ redirect: false });

    return { success: true };
  } catch (error) {
    console.error('Error in customSignOut:', error);
    return { success: false, error };
  }
};
