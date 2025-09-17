import type { Announcement } from '../interfaces/Annnouncement';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { API } from '../Interceptors/Interceptor';

const useAnnouncementsForEmployee = () => {
  const { userRole } = useAuth();
  function formatDate(date: Date) {
    return format(date, 'hh:mm a | d MMMM yyyy');
  }

  const fetchAnnouncements = async () => {
    const { data } = await API.get(`/announcement/${userRole?.toLowerCase() === 'admin' ? 'admin' : userRole?.toLowerCase() === 'employee' && 'employee'}`);

    // Ensure the API response contains `announcements`
    if (data?.announcements) {
      return data.announcements.map((item: Announcement) => ({
        ...item,
        day: new Date(item.date).getDate(),
        weekday: new Date(item.date).toLocaleDateString('en', {
          weekday: 'long',
        }),
        month: new Date(item.date).toLocaleDateString('en', {
          month: 'short',
        }),
        time: formatDate(new Date(item.date)),
      }));
    }

    return []; // Return an empty array if `announcements` is not found
  };

  const {
    data: Announcements = [], // Ensure `Announcements` defaults to an empty array
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['Announcements'],
    queryFn: fetchAnnouncements,
  });

  return {
    Announcements,
    isLoading,
    isError,
  };
};

export default useAnnouncementsForEmployee;
