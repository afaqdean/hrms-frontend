import EmployeeEmergencyContactDetails from '@/containers/employee/profile-settings/employee-emergency-contact-details/EmployeeEmergencyContactDetails';

import ProfileSettingsContainer from '@/containers/employee/profile-settings/ProfileSettingsContainer';
import React from 'react';

const page = () => {
  return (
    <ProfileSettingsContainer>
      <EmployeeEmergencyContactDetails />
    </ProfileSettingsContainer>
  );
};

export default page;
