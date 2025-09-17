import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';
import EmergencyContactDetails from '@/containers/admin/employee-management/create-employee/emergency-contact-details/EmergencyContactDetails';
import React from 'react';

const page = () => {
  return (
    <CreateEmployeeContainer>
      <EmergencyContactDetails />

    </CreateEmployeeContainer>
  );
};

export default page;
