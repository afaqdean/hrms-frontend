'use client';

import type { Employee } from '@/interfaces/Employee';
import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

const fetchEmployeeData = async (id: string): Promise<Employee> => {
  if (!id) {
    throw new Error('Employee ID is required');
  }

  const { data } = await API.get(`/admin/employee/${id}`);
  return data;
};

export const useSpecificEmployeeData = (id: string) => {
  return useQuery({
    queryKey: ['specificEmployee', id],
    queryFn: () => fetchEmployeeData(id),
    enabled: !!id,
    select: data => data,
  });
};
