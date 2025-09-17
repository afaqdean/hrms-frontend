/* eslint-disable no-console */
import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { parseCookies } from 'nookies';

// Create an Axios instance
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor with debug logging
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Get token from cookies
      const cookies = parseCookies();
      const token = cookies.token;

      if (token) {
        // Set the Authorization header properly
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Add a response interceptor that handles 401 errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      message: error.message,
    });

    // Skip auth error handling for OTP verification endpoint
    const isOtpEndpoint = error.config?.url?.includes('/auth/verify-otp');

    // Handle 401 Unauthorized errors by signing out the user
    if (error.response?.status === 401 && !isOtpEndpoint) {
      console.log('Authentication error (401): User will be signed out');

      // Only attempt to sign out if we're in the browser
      if (typeof window !== 'undefined') {
        // Import and use the signOut function dynamically to avoid circular dependencies
        import('@/lib/auth-utils').then(({ handleAuthError }) => {
          handleAuthError();
        }).catch((err) => {
          console.error('Failed to import auth utils:', err);
          // Fallback: Redirect to sign-in page
          window.location.href = '/sign-in';
        });
      }
    }

    return Promise.reject(error);
  },
);
