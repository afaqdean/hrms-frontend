import EmployeePersonalDetails from '@/containers/employee/profile-settings/employee-personal-details/EmployeePersonalDetails';
import ProfileSettingsContainer from '@/containers/employee/profile-settings/ProfileSettingsContainer';

import React from 'react';

const page = () => {
  return (
    <ProfileSettingsContainer>
      <EmployeePersonalDetails />
    </ProfileSettingsContainer>

  );
};

export default page;
