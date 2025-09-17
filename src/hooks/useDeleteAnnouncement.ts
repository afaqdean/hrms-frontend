import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteAnnouncement = async (id: string) => {
  const response = await API.delete(`/announcement/${id}`);
  return response.data;
};

const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Announcements'] });
    },
    onError: (error) => {
      console.error('Error deleting announcement:', error);
    },
  });
};

export default useDeleteAnnouncement;
