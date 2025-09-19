import ChangePassword from '@/containers/employee/profile-settings/change-password/ChangePassword';
import ProfileSettingsContainer from '@/containers/employee/profile-settings/ProfileSettingsContainer';

import React from 'react';

const page = () => {
  return (
    <ProfileSettingsContainer>
      <ChangePassword />
    </ProfileSettingsContainer>
  );
};

export default page;
