import { API } from '@/Interceptors/Interceptor';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const uploadAttendanceData = async (data: any[], queryClient: any) => {
  try {
    await API.post('/attendance/upload', data);
    queryClient.invalidateQueries({ queryKey: ['attendance'] });
  } catch (error: any) {
    console.error('Error uploading attendance data:', error);
    // Check if error response status is 409 Conflict
    if (error.response?.status === 409) {
      toast.error(
        'Duplicate attendance records detected. Please review your data.',
      );
    } else {
      const errorMessage
        = error.response?.data?.message || 'Failed to upload attendance data.';
      toast.error(errorMessage);
    }
  }
};

// Custom hook to use in components
export const useUploadAttendance = () => {
  const queryClient = useQueryClient();

  const upload = async (data: any[]) => {
    await uploadAttendanceData(data, queryClient);
  };

  return { upload };
};
