import type { CreateEmployeeFormData } from '@/interfaces/CreateEmployeeFormData';
import type { Employee } from '@/interfaces/Employee';
import { API } from '@/Interceptors/Interceptor';

export const getEmployee = async (id: string): Promise<Employee> => {
  const response = await API.get(`/admin/employee/${id}`);
  return response.data;
};

export const updateEmployee = async (id: string, data: CreateEmployeeFormData): Promise<Employee> => {
  const response = await API.patch(`/admin/employee/${id}`, data);
  return response.data;
};
