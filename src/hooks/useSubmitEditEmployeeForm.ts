'use client';

import { API } from '@/Interceptors/Interceptor';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useMultiStepForm } from './useMultiForm';

// Define interfaces for type safety
type EmployeeUpdateData = {
  name: string;
  email: string;
  role: string;
  employeeID: string;
  position: string;
  annualLeaveBank: number;
  casualLeaveBank: number;
  sickLeaveBank: number;
  machineID: string;
  password?: string;
  joiningDate?: string;
  contact?: string;
  emergencyContact?: string;
  profileImage?: string;
  slackWebHookUrl?: string;
};

export const useSubmitEditEmployeeForm = (employeeId: string) => {
  const router = useRouter();
  const { formData } = useMultiStepForm();

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }

      // Check if avatar is a File, if so we need to use FormData
      const hasFileUpload = formData.personalDetails.avatar instanceof File;

      if (hasFileUpload) {
        // Use FormData for file uploads
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.personalDetails.employeeName || '');
        formDataToSend.append('email', formData.accountDetails.email || '');
        formDataToSend.append('role', formData.personalDetails.employeeRole || '');
        formDataToSend.append('employeeID', formData.accountDetails.employeeId || '');

        if (formData.accountDetails.password && formData.accountDetails.password.trim() !== '') {
          formDataToSend.append('password', formData.accountDetails.password);
        }

        formDataToSend.append('position', formData.personalDetails.jobTitle || '');
        formDataToSend.append('annualLeaveBank', formData.leavesCountDetails.annualLeave?.toString() || '0');
        formDataToSend.append('casualLeaveBank', formData.leavesCountDetails.casualLeave?.toString() || '0');
        formDataToSend.append('sickLeaveBank', formData.leavesCountDetails.sickLeave?.toString() || '0');

        // Handle date properly - formatted to YYYY-MM-DD
        if (formData.personalDetails.joiningDate) {
          const joiningDate = new Date(formData.personalDetails.joiningDate);
          const dateString = joiningDate.toISOString().split('T')[0];
          // Make sure dateString is a string and not undefined
          if (dateString) {
            formDataToSend.append('joiningDate', dateString);
          }
        }

        // Contact details as JSON string
        if (formData.contactDetails.contact) {
          const contactData = JSON.stringify({
            phone: formData.contactDetails.contact.phone || '',
            address: formData.contactDetails.contact.address || '',
          });
          formDataToSend.append('contact', contactData);
        }

        // Emergency contact details as JSON string
        if (formData.emergencyContactDetails.emergencyContact) {
          const emergencyData = JSON.stringify({
            contact1: {
              phone: formData.emergencyContactDetails.emergencyContact.contact1?.phone || '',
              relation: formData.emergencyContactDetails.emergencyContact.contact1?.relation || '',
            },
            contact2: {
              phone: formData.emergencyContactDetails.emergencyContact.contact2?.phone || '',
              relation: formData.emergencyContactDetails.emergencyContact.contact2?.relation || '',
            },
            address: formData.emergencyContactDetails.emergencyContact.address || '',
          });
          formDataToSend.append('emergencyContact', emergencyData);
        }

        formDataToSend.append('machineID', formData.accountDetails.machineId || '');
        if (formData.personalDetails.avatar instanceof File) {
          formDataToSend.append('profileImage', formData.personalDetails.avatar);
        } else if (typeof formData.personalDetails.avatar === 'string') {
          formDataToSend.append('profileImage', formData.personalDetails.avatar);
        }

        const response = await API.put(`/admin/employee/${employeeId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
      } else {
        // Use regular JSON for non-file data
        const dataToSend: EmployeeUpdateData = {
          name: formData.personalDetails.employeeName || '',
          email: formData.accountDetails.email || '',
          role: formData.personalDetails.employeeRole || '',
          employeeID: formData.accountDetails.employeeId || '',
          position: formData.personalDetails.jobTitle || '',
          annualLeaveBank: Number.parseInt(formData.leavesCountDetails.annualLeave?.toString() || '0', 10),
          casualLeaveBank: Number.parseInt(formData.leavesCountDetails.casualLeave?.toString() || '0', 10),
          sickLeaveBank: Number.parseInt(formData.leavesCountDetails.sickLeave?.toString() || '0', 10),
          machineID: formData.accountDetails.machineId || '',
        };

        // Only include password if provided and not empty
        if (formData.accountDetails.password && formData.accountDetails.password.trim() !== '') {
          dataToSend.password = formData.accountDetails.password;
        }

        // Handle date properly - formatted to YYYY-MM-DD
        if (formData.personalDetails.joiningDate) {
          const joiningDate = new Date(formData.personalDetails.joiningDate);
          dataToSend.joiningDate = joiningDate.toISOString().split('T')[0];
        }

        // Contact details as JSON string
        if (formData.contactDetails.contact) {
          dataToSend.contact = JSON.stringify({
            phone: formData.contactDetails.contact.phone || '',
            address: formData.contactDetails.contact.address || '',
          });
        }

        // Emergency contact details as JSON string
        if (formData.emergencyContactDetails.emergencyContact) {
          dataToSend.emergencyContact = JSON.stringify({
            contact1: {
              phone: formData.emergencyContactDetails.emergencyContact.contact1?.phone || '',
              relation: formData.emergencyContactDetails.emergencyContact.contact1?.relation || '',
            },
            contact2: {
              phone: formData.emergencyContactDetails.emergencyContact.contact2?.phone || '',
              relation: formData.emergencyContactDetails.emergencyContact.contact2?.relation || '',
            },
            address: formData.emergencyContactDetails.emergencyContact.address || '',
          });
        }

        // Include profileImage if it's a string URL
        if (typeof formData.personalDetails.avatar === 'string' && formData.personalDetails.avatar) {
          dataToSend.profileImage = formData.personalDetails.avatar;
        }

        const response = await API.put(`/admin/employee/${employeeId}`, dataToSend, {
          headers: { 'Content-Type': 'application/json' },
        });

        return response.data;
      }
    },
    onSuccess: () => {
      toast.success('Employee data updated successfully');
      router.push('/dashboard/admin/employees-management');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      toast.error(errorMessage);
    },
  });

  return {
    submitForm: submitMutation.mutate,
    submitWithoutToast: () => {
      submitMutation.mutate(undefined, {
        onSuccess: () => {
          router.push('/dashboard/admin/employees-management');
        },
      });
    },
    isPending: submitMutation.isPending,
  };
};
