import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

export const fetchTopEmployeesStats = async (filter: string) => {
  const { data } = await API.get(`/admin/top-employees?duration=${filter}`);
  return data;
};

export const useFetchTopEmployees = (filter: string) => {
  return useQuery({
    queryKey: ['topEmployeesStats', filter],
    queryFn: () => fetchTopEmployeesStats(filter),
    enabled: !!filter, // Only run query when filter is provided
  });
};
