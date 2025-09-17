import { useQuery } from '@tanstack/react-query';
import { API } from '../Interceptors/Interceptor';

export const fetchDashboardStats = async () => {
  const { data } = await API.get('/admin/overview');
  return data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });
};
