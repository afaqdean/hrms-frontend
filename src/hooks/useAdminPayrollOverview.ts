import { useQuery } from '@tanstack/react-query';
import { API } from '../Interceptors/Interceptor';

export const fetchAdminPayrollOverview = async (period?: string) => {
  const params = period ? { params: { period } } : {};
  const { data } = await API.get('/payroll/overview', params);
  return data;
};

export const useAdminPayrollOverview = (period?: string) => {
  return useQuery({
    queryKey: ['adminPayrollOverview', period],
    queryFn: () => fetchAdminPayrollOverview(period),
  });
};
