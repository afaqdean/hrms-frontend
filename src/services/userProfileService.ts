import type { Employee } from '@/interfaces/Employee';
import { API } from '@/Interceptors/Interceptor';

type ProfileUpdateRequest = {
  name?: string;
  email?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  emergencyContact?: {
    contact1?: {
      phone?: string;
      relation?: string;
    };
    contact2?: {
      phone?: string;
      relation?: string;
    };
    address?: string;
  };
};

/**
 * Fetches the current user's profile
 */
export const fetchUserProfile = async (): Promise<Employee> => {
  const response = await API.get('/user/profile');
  return response.data;
};

/**
 * Updates the current user's profile
 */
export const updateUserProfile = async (profileData: ProfileUpdateRequest): Promise<Employee> => {
  const response = await API.patch('/user/profile', profileData);
  return response.data;
};
