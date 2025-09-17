import { useAuth } from '@/context/AuthContext';

export const useLogout = () => {
  const { signOut, isSigningOut } = useAuth();

  const handleLogout = async () => {
    try {
      if (!isSigningOut) {
        await signOut();
        window.location.href = '/sign-in';
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/sign-in';
    }
  };

  return { handleLogout };
};
