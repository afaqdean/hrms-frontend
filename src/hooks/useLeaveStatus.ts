import { ToastStyle } from '@/components/ToastStyle';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useLeaveStatus = () => {
  const queryClient = useQueryClient();

  // Function to fetch fresh user data and update localStorage
  // const updateUserData = async (employeeId: string) => {
  //   try {
  //     const { data } = await API.get(`/employees/${employeeId}`);
  //     console.log('data', data);
  //     if (data && data.employee) {
  //       const userFromStorage = window.localStorage.getItem('user');
  //       if (userFromStorage) {
  //         const user = JSON.parse(userFromStorage);
  //         const updatedUser = {
  //           ...user,
  //           ...data.employee,
  //         };
  //         window.localStorage.setItem('user', JSON.stringify(updatedUser));
  //         window.dispatchEvent(new Event('storage'));
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error updating user data:', error);
  //   }
  // };

  const updateLeaveStatus = useMutation({
    mutationFn: async ({ leaveId, status }: { leaveId: string; status: 'Approved' | 'Rejected' }) => {
      const response = await API.post(`/leave/${leaveId}/status`, { status });
      return response.data;
    },
    onSuccess: async (_, variables) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['dashboardLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['Leaves'] });
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast.success(
        `Leave Request has been ${variables.status} Successfully`,
        ToastStyle,
      );
    },
    onError: (error, variables) => {
      console.error(`Error ${variables.status}ing Leave:`, error);
      toast.error(`Failed to ${variables.status.toLowerCase()} leave`);
    },
  });

  return {
    updateLeaveStatus,
    // updateUserData,
  };
};
