import type { Employee } from '../interfaces/Employee';
import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const useEmployees = () => {
  // get trainers data using react query

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get(`/user/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      return data?.map((item: Employee) => ({
        ...item,
        totalLeaves: item.casualLeaveBank + item.annualLeaveBank + item.sickLeaveBank,
        joiningDate: new Date(item.joiningDate).toLocaleDateString('en', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        totalAvailedLeaves:
          (item?.availedCasualLeaves ?? 0) + (item?.availedAnnualLeaves ?? 0) + (item?.availedSickLeaves ?? 0),
      })) as Employee[];
    } catch (error) {
      console.error('Failed to fetch employees. Please try again.');
      throw error;
    }
  };

  const {
    data: Employees,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['Employees'],
    queryFn: fetchEmployees,
  });

  // Delete Track
  // Function to handle deleting a track
  const handleTrackDelete = async (musicId: string) => {
    try {
      // Send delete request to API
      await API.delete(`/api/music/delete/${musicId}`);
    } catch (err) {
      // Display error message if request fails
      toast.error(`Error occurred while deleting track : ${err}`);
    }
  };

  return {
    Employees,
    isLoading,
    isError,
    handleTrackDelete,
  };
};

export default useEmployees;
