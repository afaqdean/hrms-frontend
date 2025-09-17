import { API } from '@/Interceptors/Interceptor';

/**
 * Send the FCM token to the backend for registration
 * @param token FCM token to register
 * @returns Promise with the response
 */
export const registerFcmToken = async (token: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await API.post('/user/fcm-token', {
      token,
    });

    if (response.status >= 400) {
      throw new Error('Failed to register FCM token with backend');
    }

    return {
      success: true,
      message: 'FCM token registered successfully',
    };
  } catch (error) {
    console.error('Error registering FCM token:', error);
    throw error;
  }
};
