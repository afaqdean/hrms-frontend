export type Company = {
  id?: string;
  _id?: string;
  name: string;
  subdomain: string;
  createdAt: string;
  updatedAt: string;
  adminUserId: string;
};

export type CompanySignupForm = {
  companyName: string;
  subdomain: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminEmployeeID: string;
  adminCNIC: string;
  adminPosition: string;
  adminJoiningDate: string;
  adminMachineID: string;
};

export type CompanyUpdateData = {
  name?: string;
  subdomain?: string;
};

export type CompanyRegistrationData = {
  name: string;
  subdomain: string;
  adminUser: {
    name: string;
    email: string;
    password: string;
    employeeID: string;
    cnic: string;
    position: string;
    joiningDate: string;
    machineID: string;
    role: string;
  };
};

export type CompanyRegistrationResponse = {
  success: boolean;
  message: string;
  data?: {
    companyId: string;
    adminUserId: string;
  };
};
