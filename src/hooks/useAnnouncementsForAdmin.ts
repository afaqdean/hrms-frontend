import type { Announcement } from '../interfaces/Annnouncement';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { API } from '../Interceptors/Interceptor';

const useAnnouncementsForEmployee = () => {
  // const { userData } = useAuth();

  function formatDate(date: Date) {
    return format(date, 'hh:mm a | d MMMM yyyy');
  }
  const fetchAnnouncements = async () => {
    const { data } = await API.get(`/announcement/admin`);

    if (data) {
      return data.map((item: Announcement) => {
        return {
          ...item,
          day: new Date(item.date).getDate(),
          weekday: new Date(item.date).toLocaleDateString('en', {
            weekday: 'long',
          }),
          month: new Date(item.date).toLocaleDateString('en', {
            month: 'short',
          }),
          time: formatDate(new Date(item.date)),
        };
      });
    }
    return [];
  };

  const {
    data: Announcements,
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
