import type { UserData } from '@/lib/cookie-utils';
import { createContext } from 'react';

// Re-export UserData type for external use
export type { UserData } from '@/lib/cookie-utils';

export type AuthContextType = {
  isAdmin: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  userData: UserData | null;
  isSigningOut: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  isAuthenticated: false,
  userRole: null,
  userData: null,
  isSigningOut: false,
  signOut: async () => {},
});
