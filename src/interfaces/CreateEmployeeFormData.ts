// import { ContactInfo } from "interfaces/ContactInfo";
// import { EmergencyContact } from "interfaces/EmergencyContact";

import type { ContactInfo } from './ContactInfo';
import type { EmergencyContact } from './EmergencyContact';

export type CreateEmployeeFormData = {
  name: string;
  email: string;
  employeeID: string;
  password: string;
  role: string;
  position?: string;
  annualLeaveBank?: number;
  casualLeaveBank?: number;
  sickLeaveBank?: number;
  joiningDate: string;
  contact: ContactInfo;
  emergencyContact: EmergencyContact;
  machineID: string;
  profileImage: File | string;
};
