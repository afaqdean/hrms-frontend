'use client';

import { toast } from 'react-toastify';
import { useUpdateEmployeeAPI } from './useUpdateEmployeeAPI';

type UpdateStepParams = {
  employeeId: string;
  stepData: Record<string, any>;
  stepName: 'personalDetails' | 'accountDetails' | 'contactDetails' | 'emergencyContactDetails' | 'leavesCount';
};

export const useUpdateEmployeeStep = () => {
  const { mutate: updateEmployee, isPending } = useUpdateEmployeeAPI();

  const submitStep = async (params: UpdateStepParams, onSuccess?: () => void, showToast: boolean = true) => {
    const { employeeId, stepData, stepName } = params;

    // Prepare data based on which step we're updating
    const data: Record<string, any> = {};

    switch (stepName) {
      case 'personalDetails':
        data.name = stepData.employeeName || '';
        data.position = stepData.jobTitle || '';
        data.role = stepData.employeeRole || '';

        if (stepData.joiningDate) {
          const joiningDate = new Date(stepData.joiningDate);
          data.joiningDate = joiningDate.toISOString().split('T')[0];
        }

        if (stepData.avatar instanceof File) {
          data.profileImage = stepData.avatar;
        } else if (typeof stepData.avatar === 'string' && stepData.avatar.startsWith('data:')) {
          // Convert base64 to File object
          try {
            const res = await fetch(stepData.avatar);
            const blob = await res.blob();
            const originalFileName = stepData.originalFileName || 'profile.jpg';
            const file = new File([blob], originalFileName, { type: 'image/jpeg' });
            data.profileImage = file;
          } catch (error) {
            console.error('Error converting base64 to file:', error);
            // Fallback to string if conversion fails
            data.profileImage = stepData.avatar;
          }
        } else if (typeof stepData.avatar === 'string' && stepData.avatar) {
          data.profileImage = stepData.avatar;
        }
        break;

      case 'accountDetails':
        data.email = stepData.email || '';
        data.employeeID = stepData.employeeId || '';
        data.machineID = stepData.machineId || '';

        // Only include password if it's provided and not empty
        if (stepData.password && stepData.password.trim() !== '') {
          data.password = stepData.password;
        }
        break;

      case 'contactDetails':
        if (stepData.contact) {
          data.contact = JSON.stringify({
            phone: stepData.contact.phone || '',
            address: stepData.contact.address || '',
          });
        }
        break;

      case 'emergencyContactDetails':
        if (stepData.emergencyContact) {
          data.emergencyContact = JSON.stringify({
            contact1: {
              phone: stepData.emergencyContact.contact1?.phone || '',
              relation: stepData.emergencyContact.contact1?.relation || '',
            },
            contact2: {
              phone: stepData.emergencyContact.contact2?.phone || '',
              relation: stepData.emergencyContact.contact2?.relation || '',
            },
            address: stepData.emergencyContact.address || '',
          });
        }
        break;

      case 'leavesCount':
        if (stepData.annualLeaveBank !== undefined) {
          // If we receive direct bank fields (from LeavesCount component)
          data.sickLeaveBank = Number(stepData.sickLeaveBank) || 0;
          data.casualLeaveBank = Number(stepData.casualLeaveBank) || 0;
          data.annualLeaveBank = Number(stepData.annualLeaveBank) || 0;
        } else {
          // Handle the form field values
          data.sickLeaveBank = Number(stepData.sickLeave) || 0;
          data.casualLeaveBank = Number(stepData.casualLeave) || 0;
          data.annualLeaveBank = Number(stepData.annualLeave) || 0;
        }
        break;
    }

    // Make the API call
    updateEmployee(
      {
        employeeId,
        data,
        options: {
          // Disable the default toast notification from useUpdateEmployeeAPI
          showDefaultSuccessToast: false,
        },
      },
      {
        onSuccess: () => {
          const stepLabels = {
            personalDetails: 'Personal details',
            accountDetails: 'Account details',
            contactDetails: 'Contact details',
            emergencyContactDetails: 'Emergency contact details',
            leavesCount: 'Leave details',
          };
          localStorage.removeItem('employee_creation_form_data');

          // Only show toast if showToast is true
          if (showToast) {
            toast.success(`${stepLabels[stepName]} updated successfully`);
          }

          if (onSuccess) {
            onSuccess();
          }
        },
      },
    );
  };

  return {
    submitStep,
    isPending,
  };
};
