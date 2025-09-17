import type { MultiStepFormData } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import type { CreateEmployeeFormData } from '@/interfaces/CreateEmployeeFormData';
import { getEmployee, updateEmployee } from '@/services/employeeService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const transformToCreateEmployeeData = (data: MultiStepFormData): CreateEmployeeFormData => ({
  name: data.personalDetails.employeeName,
  email: data.accountDetails.email,
  employeeID: data.accountDetails.employeeId,
  password: data.accountDetails.password ?? '',
  role: data.personalDetails.employeeRole,
  position: data.personalDetails.jobTitle,
  annualLeaveBank: Number(data.leavesCountDetails.annualLeave) || 0,
  casualLeaveBank: Number(data.leavesCountDetails.casualLeave) || 0,
  sickLeaveBank: Number(data.leavesCountDetails.sickLeave) || 0,
  joiningDate: data.personalDetails.joiningDate instanceof Date
    ? data.personalDetails.joiningDate.toISOString()
    : data.personalDetails.joiningDate,
  contact: {
    email: data.accountDetails.email,
    phone: data.contactDetails.contact?.phone || '',
    address: data.contactDetails.contact?.address || '',
  },
  emergencyContact: {
    contact1: {
      phone: data.emergencyContactDetails.emergencyContact?.contact1?.phone || '',
      relation: data.emergencyContactDetails.emergencyContact?.contact1?.relation || '',
    },
    contact2: {
      phone: data.emergencyContactDetails.emergencyContact?.contact2?.phone || '',
      relation: data.emergencyContactDetails.emergencyContact?.contact2?.relation || '',
    },
    address: data.emergencyContactDetails.emergencyContact?.address || '',
  },
  machineID: data.accountDetails.machineId || '',
  profileImage: typeof data.personalDetails.avatar === 'string'
    ? data.personalDetails.avatar
    : data.personalDetails.avatar instanceof File
      ? data.personalDetails.avatar
      : '',
});

export const useEmployeeQuery = (id: string) => {
  return useQuery({
    queryKey: ['Employee', id],
    queryFn: () => getEmployee(id),
    select: (data) => {
      if (!id) {
        return null;
      }
      return data;
    },
    enabled: !!id,
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MultiStepFormData }) =>
      updateEmployee(id, transformToCreateEmployeeData(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
