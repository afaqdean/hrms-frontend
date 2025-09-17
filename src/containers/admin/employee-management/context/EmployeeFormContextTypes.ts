import type {
  AccountDetailsFormValues,
  ContactDetailsFormValues,
  EmergencyContactDetailsFormValues,
  LeavesCountFormValues,
  PersonalDetailsFormValues,
} from '@/containers/types';
import { createContext } from 'react';

// Define the structure of the entire form data
export type MultiStepFormData = {
  personalDetails: PersonalDetailsFormValues;
  accountDetails: AccountDetailsFormValues;
  contactDetails: ContactDetailsFormValues;
  emergencyContactDetails: EmergencyContactDetailsFormValues;
  leavesCountDetails: LeavesCountFormValues;
};

// Define the context type
export type MultiStepFormContextType = {
  formData: MultiStepFormData;
  updateFormData: (step: keyof MultiStepFormData, data: any) => void;
  resetForm: () => void;
};

// Create the context
export const MultiStepFormContext = createContext<MultiStepFormContextType | undefined>(undefined);
