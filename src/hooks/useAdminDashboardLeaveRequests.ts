import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

export const fetchDashboardLeaveRequests = async () => {
  const { data } = await API.get('/admin/leave-requests?leaveStatus=Pending');
  const leaves = data?.leaves || [];
  return leaves;
};

export const useFetchDashboardLeaveRequest = () => {
  return useQuery({
    queryKey: ['dashboardLeaveRequests'],
    queryFn: fetchDashboardLeaveRequests,
    refetchInterval: 180000, // 3 minutes
  });
};
