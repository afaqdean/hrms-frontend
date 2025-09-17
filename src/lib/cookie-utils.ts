import { destroyCookie, parseCookies, setCookie } from 'nookies';

// User data interface
export type UserData = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  role: string;
  employeeID?: string;
  position?: string;
  cnic?: string; // CNIC field for employee identification
};

// Cookie utility functions for client-side use
export const cookieUtils = {
  // Get a cookie value
  get: (name: string): string | undefined => {
    const cookies = parseCookies();
    return cookies[name];
  },

  // Set a cookie
  set: (
    name: string,
    value: string,
    options: {
      maxAge?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {},
  ): void => {
    setCookie(null, name, value, {
      maxAge: options.maxAge || 30 * 24 * 60 * 60, // 30 days by default
      path: options.path || '/',
      domain: options.domain,
      secure: options.secure || process.env.NODE_ENV === 'production',
      sameSite: options.sameSite || 'lax',
    });

    // Also update localStorage for backward compatibility
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },

  // Remove a cookie
  remove: (name: string, options: { path?: string; domain?: string } = {}): void => {
    destroyCookie(null, name, {
      path: options.path || '/',
      domain: options.domain,
    });

    // Also remove from localStorage for backward compatibility
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },

  // Check if a cookie exists
  exists: (name: string): boolean => {
    const cookies = parseCookies();
    return !!cookies[name];
  },

  // Get user role from cookies or fallback to path-based detection
  getUserRole: (): string | null => {
    const cookies = parseCookies();

    // If we have a dedicated role cookie, use it
    if (cookies.userRole) {
      return cookies.userRole;
    }

    // Try localStorage as fallback
    if (typeof window !== 'undefined') {
      const localRole = localStorage.getItem('userRole');
      if (localRole) {
        return localRole;
      }

      // Otherwise, try to infer from the URL path
      const path = window.location.pathname;
      if (path.includes('/admin/')) {
        return 'admin';
      } else if (path.includes('/employee/')) {
        return 'employee';
      }
    }

    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const cookies = parseCookies();
    if (cookies.token) {
      return true;
    }

    // Try localStorage as fallback
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }

    return false;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    return cookieUtils.getUserRole()?.toLowerCase() === 'admin';
  },

  // Get user data from cookies
  getUserData: (): UserData | null => {
    try {
      const cookies = parseCookies();
      const userDataCookie = cookies.userData;

      if (userDataCookie) {
        return JSON.parse(userDataCookie);
      }

      // Try localStorage as fallback
      if (typeof window !== 'undefined') {
        // Try the new userData format first
        const localUserData = localStorage.getItem('userData');
        if (localUserData) {
          return JSON.parse(localUserData);
        }

        // Try the legacy 'user' format
        const legacyUser = localStorage.getItem('user');
        if (legacyUser) {
          const userData = JSON.parse(legacyUser);
          return {
            id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            profilePic: userData.profilePic || userData.profileImage,
            role: userData.role,
            employeeID: userData.employeeID,
            position: userData.position,
            cnic: userData.cnic, // Include CNIC field
          };
        }
      }
    } catch (error) {
      console.error('Error parsing user data from cookies:', error);
    }

    return null;
  },

  // Set user data in cookies
  setUserData: (userData: UserData): void => {
    const userDataStr = JSON.stringify(userData);

    setCookie(null, 'userData', userDataStr, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Also update localStorage for backward compatibility
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', userDataStr);

      // Also set the legacy 'user' item
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        profileImage: userData.profilePic,
      }));
    }
  },

  // Clear all auth cookies
  clearAuthCookies: (): void => {
    destroyCookie(null, 'token', { path: '/' });
    destroyCookie(null, 'userRole', { path: '/' });
    destroyCookie(null, 'userData', { path: '/' });

    // Also clear localStorage for backward compatibility
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');

      // For extra safety, clear any other potential auth-related items
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
};
