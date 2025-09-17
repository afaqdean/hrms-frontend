import { ToastStyle } from '@/components/ToastStyle';
import { useLogout } from '@/hooks/useLogout';
import { API } from '@/Interceptors/Interceptor';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Old password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password cannot be the same as old password',
  path: ['newPassword'],
});

export type FormValues = z.infer<typeof changePasswordSchema>;

export const useChangePassword = () => {
  const { handleLogout } = useLogout();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await API.patch('/user/reset-password', data);
    },
    onSuccess: () => {
      toast.success('Password changed successfully', ToastStyle);
      handleLogout();
    },
    onError: (error) => {
      console.error('Error resetting password:', error);
      toast.error('Failed to change password', ToastStyle);
    },
  });

  return { changePasswordMutation };
};
