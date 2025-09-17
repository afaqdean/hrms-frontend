import { API } from '@/Interceptors/Interceptor';

/**
 * Fetches CNIC directly from the user profile endpoint
 * This is an alternative to the /user/cnic endpoint
 */
export const fetchCnicFromProfile = async (): Promise<string | null> => {
  try {
    const response = await API.get('/user/profile');
    return response.data?.cnic || null;
  } catch {
    console.error('Error fetching CNIC from profile');
    return null;
  }
};

/**
 * Gets CNIC from multiple sources with fallback strategy
 * 1. Try /user/cnic endpoint first
 * 2. Fallback to /user/profile endpoint
 * 3. Fallback to localStorage/cookies
 */
export const getCnicWithFallback = async (): Promise<string | null> => {
  try {
    // First try the dedicated CNIC endpoint
    const cnicResponse = await API.get('/user/cnic');
    if (cnicResponse.data?.cnic) {
      return cnicResponse.data.cnic;
    }
  } catch {
    console.warn('CNIC endpoint failed, trying profile endpoint...');
  }

  try {
    // Fallback to profile endpoint
    const profileResponse = await API.get('/user/profile');
    if (profileResponse.data?.cnic) {
      return profileResponse.data.cnic;
    }
  } catch {
    console.warn('Profile endpoint failed, trying local storage...');
  }

  // Final fallback to local storage
  if (typeof window !== 'undefined') {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed.cnic) {
          return parsed.cnic;
        }
      }

      const legacyUser = localStorage.getItem('user');
      if (legacyUser) {
        const parsed = JSON.parse(legacyUser);
        if (parsed.cnic) {
          return parsed.cnic;
        }
      }
    } catch {
      console.error('Error reading from local storage');
    }
  }

  return null;
};
