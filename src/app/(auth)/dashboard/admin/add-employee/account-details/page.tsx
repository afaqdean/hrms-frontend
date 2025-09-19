import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import AccounDetails from '@/containers/admin/employee-management/create-employee/account-details/AccounDetails';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';
import React from 'react';

const AddEmployee = () => {
  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <AccounDetails />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
};

export default AddEmployee;
