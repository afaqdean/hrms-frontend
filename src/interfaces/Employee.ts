export type Employee = {
  _id: string;
  name: string;
  email: string;
  employeeID: string;
  password?: string;
  role: string;
  position: string;
  joiningDate: string;
  annualLeaveBank: number;
  casualLeaveBank: number;
  sickLeaveBank: number;
  availedSickLeaves?: number;
  availedCasualLeaves?: number;
  availedAnnualLeaves?: number;
  totalLeaves?: number;
  totalAvailedLeaves?: number;
  startDate?: string;

  contact?: {
    phone: string;
    address: string;
    _id?: string;
  };

  emergencyContact?: {
    contact1: {
      phone: string;
      relation: string;
    };
    contact2: {
      phone: string;
      relation: string;
    };
    address: string;
    _id?: string;
  };

  machineID: string;
  profileImage: string;
  salary?: number;
  __v?: number;
};
