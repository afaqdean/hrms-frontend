'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MultiStepFormContext, type MultiStepFormData } from './EmployeeFormContextTypes';

// Re-export types and context for external use
export { MultiStepFormContext, type MultiStepFormData } from './EmployeeFormContextTypes';

// Storage key for form data
const FORM_STORAGE_KEY = 'employee_creation_form_data';

// Context Provider
export const MultiStepFormProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize form data with default values
  const initialFormData: MultiStepFormData = {
    personalDetails: { employeeName: '', employeeRole: '', jobTitle: '', avatar: '', joiningDate: new Date() },
    accountDetails: { email: '', employeeId: '', machineId: '', password: '' },
    contactDetails: {
      contact: {
        phone: '',
        address: '',
      },
    },
    emergencyContactDetails: {
      emergencyContact: {
        contact1: {
          phone: '',
          relation: '',
        },
        contact2: {
          phone: '',
          relation: '',
        },
        address: '',
      },
    },
    leavesCountDetails: {
      expiryDate: '',
      sickLeave: '',
      casualLeave: '',
      annualLeave: '',
    },
  };

  const [formData, setFormData] = useState<MultiStepFormData>(initialFormData);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(FORM_STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);

          // Handle date conversion
          if (parsedData.personalDetails && parsedData.personalDetails.joiningDate) {
            parsedData.personalDetails.joiningDate = new Date(parsedData.personalDetails.joiningDate);
          }

          setFormData(parsedData);
        }
      } catch (error) {
        console.error('Error loading form data from storage:', error);
      }
    }
  }, []);

  // Function to update specific form step data
  const updateFormData = (step: string, data: any) => {
    setFormData(() => {
      const dataFromStorage = localStorage.getItem(FORM_STORAGE_KEY);
      const parsedData = dataFromStorage ? JSON.parse(dataFromStorage) : null;

      const updatedData = { ...parsedData, [step]: data };
      // Save to localStorage immediately after update
      if (typeof window !== 'undefined') {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(updatedData));
      }
      return updatedData;
    });
  };

  // Reset form when needed
  const resetForm = () => {
    const resetData = {
      personalDetails: {
        employeeName: '',
        jobTitle: '',
        avatar: '',
        employeeRole: 'Employee',
        joiningDate: new Date(),
      },
      accountDetails: {
        email: '',
        employeeId: '',
        machineId: '',
        password: '',
      },
      contactDetails: {
        contact: {
          phone: '',
          address: '',
        },
      },
      emergencyContactDetails: {
        emergencyContact: {
          contact1: {
            phone: '',
            relation: '',
          },
          contact2: {
            phone: '',
            relation: '',
          },
          address: '',
        },
      },
      leavesCountDetails: {
        expiryDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
        sickLeave: '',
        casualLeave: '',
        annualLeave: '',
      },
    };

    setFormData(resetData);

    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
  };

  // ✅ Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ formData, updateFormData, resetForm }),
    [formData],
  );

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      {children}
    </MultiStepFormContext.Provider>
  );
};
