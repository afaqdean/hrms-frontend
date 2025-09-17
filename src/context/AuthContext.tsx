'use client';
import { cookieUtils } from '@/lib/cookie-utils';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext, type UserData } from './AuthContextTypes';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  // Check authentication status on mount and periodically
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = cookieUtils.isAuthenticated();
      const role = cookieUtils.getUserRole();
      const user = cookieUtils.getUserData();

      setIsAuthenticated(isAuth);
      setIsAdmin(cookieUtils.isAdmin());
      setUserRole(role);
      setUserData(user);
    };

    // Check auth on mount
    checkAuth();

    // Set up an interval to check auth status periodically
    const interval = setInterval(checkAuth, 5000); // Check every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Set signing out state to prevent multiple calls
      setIsSigningOut(true);

      // Clear cookies and localStorage
      cookieUtils.clearAuthCookies();

      // Clear localStorage directly as well for extra safety
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }

      // Call NextAuth signOut
      await nextAuthSignOut({ redirect: false });

      // Update state
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserRole(null);
      setUserData(null);

      // Add a small delay before navigation to prevent race conditions
      setTimeout(() => {
        // Redirect to sign-in
        router.push('/sign-in');
      }, 300);
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force redirect on error after a small delay
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 300);
    }
  }, [router]);

  const contextValue = useMemo(
    () => ({
      isAdmin,
      isAuthenticated,
      userRole,
      userData,
      isSigningOut,
      signOut,
    }),
    [isAdmin, isAuthenticated, userRole, userData, isSigningOut, signOut],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
