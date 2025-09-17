'use client';
import React from 'react';

import MobileNavigationBar from './MobileNavigationBar';
import NavigationBar from './NavigationBar';

type RoleBasedLayoutProps = {
  isAdmin: boolean;

};

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ isAdmin }) => {
  return (
    <>
      <MobileNavigationBar isAdmin={isAdmin} />
      <NavigationBar isAdmin={isAdmin} />
    </>
  );
};

export default RoleBasedLayout;
