import ContactDetails from '@/containers/admin/employee-management/create-employee/contact-details/ContactDetails';
import CreateEmployeeContainer from '@/containers/admin/employee-management/create-employee/CreateEmployeeContainer';

import React from 'react';

const page = () => {
  return (
    <CreateEmployeeContainer>
      <ContactDetails />
    </CreateEmployeeContainer>
  );
};

export default page;
