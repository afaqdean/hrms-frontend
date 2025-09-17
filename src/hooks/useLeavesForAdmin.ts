import type { Leave } from '../interfaces/Leave';
import { useQuery } from '@tanstack/react-query';
import { API } from '../Interceptors/Interceptor';

/**
 * Fetch Leaves for the Employee
 *
 * Retrieves leave records and formats them for UI display.
 *
 * @returns {Promise<Leave[]>} A promise resolving to an array of leave objects.
 * @throws Will throw an error if the API request fails.
 */
const fetchLeaves = async (employeeId?: string): Promise<Leave[]> => {
  try {
    const { data } = await API.get(`/leave?employeeId=${employeeId}&limit=100`);

    if (data?.leaves && Array.isArray(data.leaves)) {
      return data.leaves.map((item: Leave) => ({
        ...item,
        type: item.leaveType.toLowerCase().split(' ')[0],
        day: item.startDate ? new Date(item.startDate).toLocaleDateString('en', { weekday: 'long' }) : '',
        date: item.startDate
          ? new Date(item.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '',
        dateEnd: item.endDate
          ? `${new Date(item.endDate).toLocaleDateString('en', { month: 'short' })} ${new Date(item.endDate).getDate()}`
          : '',
      })) as Leave[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return [];
  }
};

/**
 * Custom Hook: useLeavesForEmployee
 *
 * Uses React Query to fetch leave records for the employee.
 */
const useLeavesForEmployee = (employeeId: string) => {
  const { data: Leaves = [], isLoading, isError } = useQuery<Leave[]>({
    queryKey: ['Leaves', employeeId],
    queryFn: () => fetchLeaves(employeeId),
  });

  return { Leaves, isLoading, isError };
};

export default useLeavesForEmployee;
