import { useSearchParams } from 'next/navigation';

/**
 * Extracts email from URL query parameters
 * @returns The email from URL parameters or null if not found
 */
export const useEmailFromParams = (): string | null => {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email');

  // Log error if email is not found
  if (!email) {
    console.error('Email not found in URL parameters');
  }

  return email;
};

export default useEmailFromParams;
