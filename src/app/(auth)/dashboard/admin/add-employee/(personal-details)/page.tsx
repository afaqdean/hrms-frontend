import { MultiStepFormProvider } from '@/containers/admin/employee-management/context/EmployeeFormContext';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';
import PersonalDetails from '@/containers/admin/employee-management/create-employee/personal-details/PersonalDetails';
import React from 'react';

const AddEmployee = () => {
  return (
    <MultiStepFormProvider>
      <CreateEmployeeContainer>
        <PersonalDetails />
      </CreateEmployeeContainer>
    </MultiStepFormProvider>
  );
};

export default AddEmployee;
