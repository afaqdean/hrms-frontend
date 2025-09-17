import type { Employee } from '@/interfaces/Employee';
import { fetchUserProfile, updateUserProfile } from '@/services/userProfileService';
import { useEffect, useState } from 'react';

type UpdateProfileParams = {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  contact?: {
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

export const useUserProfile = () => {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await fetchUserProfile();
      setProfile(userData);

      // Update localStorage with the latest user data
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await updateUserProfile(data);
      setProfile(updatedProfile);

      // Update localStorage with the latest user data
      localStorage.setItem('user', JSON.stringify(updatedProfile));

      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateProfile,
  };
};
