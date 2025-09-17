'use client'; // Ensures this component runs only on the client side

import CreateLeaveRequest from '@/components/employee/pop-ups/CreateLeaveRequest';
import ModalUI from '@/components/Modal';
import NotificationPanel from '@/components/NotificationPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import huddleHRLogo from 'public/assets/huddle-image.png';
import React, { useState } from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import { IoMdLogOut, IoMdPerson } from 'react-icons/io';
import { Button } from '../../ui/button';
import Avatar from '../avatars/avatar/Avatar';

/**
 * Header Component
 *
 * Displays the logo, navigation buttons, notifications, and user profile menu.
 */
const Header = () => {
  const router = useRouter(); // Router hook to handle navigation
  const pathname = usePathname(); // Hook to get the current path
  const [applyLeave, setApplyLeave] = useState<boolean>(false); // State to control leave application modal visibility
  const { handleLogout } = useLogout();
  const { userData, userRole } = useAuth();

  // Determine the dashboard path based on user role
  const getDashboardPath = () => {
    if (userRole?.toLowerCase() === 'admin') {
      return '/dashboard/admin/overview';
    }
    return '/dashboard/employee/overview';
  };

  return (
    <div className="hidden w-full items-center justify-between pb-3 md:flex">
      {/* Left Section: Logo */}
      <Image
        src={huddleHRLogo.src} // Company logo image
        height={50}
        width={150}
        className="cursor-pointer object-contain"
        alt="HuddleHR Logo"
        onClick={() => router.push(getDashboardPath())} // Redirect based on role
      />

      {/* Right Section: Contains action buttons and profile menu */}
      <div className="flex items-center gap-4">

        {/* Show 'Apply for Leave' button only on Leave History Page */}
        {pathname === '/dashboard/employee/leaves-history' && (
          <>
            <Button variant="outline" onClick={() => setApplyLeave(true)} className="flex h-full items-center rounded-full hover:bg-primary-100 hover:text-white">
              <BsArrowUpRightCircle />
              <span>Apply for Leave</span>
            </Button>

            {/* Modal for Leave Application */}
            {applyLeave && (
              <ModalUI
                handleClose={() => setApplyLeave(false)}
                handleOpen={() => setApplyLeave(true)}
                isOpen={applyLeave}
              >
                <CreateLeaveRequest onClose={() => setApplyLeave(false)} />
              </ModalUI>
            )}
          </>
        )}

        {/* Show 'Publish Announcement' button only on Announcements Page */}
        {pathname === '/announcements' && (
          <Button>
            <FaPlus className="mr-2" />
            {' '}
            {/* Plus icon */}
            Publish Announcement
          </Button>
        )}

        {/* Notification Icon */}
        <div className="group cursor-pointer">
          <NotificationPanel />
        </div>

        {/* Profile Dropdown Menu */}
        <div className="group flex cursor-pointer items-center justify-between rounded-full border border-[#F1F1F1] bg-[#FFFFFF] hover:bg-primary-100 hover:text-white">

          {/* User Avatar */}
          <Avatar src={userData?.profilePic} className="group-hover:text-white" />

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-auto" asChild>
              <Button variant="link" className="hover:no-underline focus-visible:ring-0 group-hover:text-white">
                {userData?.name || 'Profile'}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Dropdown Options */}
              <DropdownMenuGroup>
                {/* Profile Settings Option */}
                <DropdownMenuItem
                  className="flex cursor-pointer justify-start"
                  onClick={() => {
                    if (userData?.role.toLowerCase() === 'admin') {
                      router.push('/dashboard/admin/profile-settings');
                    } else {
                      router.push('/dashboard/employee/profile-settings');
                    }
                  }}
                >
                  <IoMdPerson className="text-gray-500" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>

                {/* Logout Option */}
                <DropdownMenuItem
                  className="flex cursor-pointer justify-start"
                  onClick={handleLogout}
                >
                  <IoMdLogOut className="text-danger" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
