'use client';

import Avatar from '@/components/shared/avatars/avatar/Avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import huddleHRLogo from 'public/assets/huddle-image.png';
import React, { useMemo, useState } from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { CiMoneyBill } from 'react-icons/ci';
import { GrAnnounce, GrNotes } from 'react-icons/gr';
import { IoDocumentTextOutline, IoMenu, IoSettingsOutline } from 'react-icons/io5';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { WiTime4 } from 'react-icons/wi';
import NotificationPanel from './NotificationPanel';

type NavLink = {
  text: string;
  icon: React.ElementType;
  path: string;
};

const ADMIN_MOBILE_LINKS: NavLink[] = [
  { text: 'Overview', icon: BiLogInCircle, path: '/dashboard/admin/overview' },
  { text: 'Employees Management', icon: GrNotes, path: '/dashboard/admin/employees-management' },
  { text: 'Leaves Management', icon: GrNotes, path: '/dashboard/admin/leaves-management' },
  { text: 'Time Tracking', icon: WiTime4, path: '/dashboard/admin/time-tracking' },
  { text: 'Announcements', icon: GrAnnounce, path: '/dashboard/admin/announcements' },
  { text: 'Settings', icon: IoSettingsOutline, path: '/dashboard/admin/profile-settings' },
  { text: 'Logout', icon: RiLogoutCircleLine, path: '/sign-in' },
] as const;

const EMPLOYEE_MOBILE_LINKS: NavLink[] = [
  { text: 'Overview', icon: BiLogInCircle, path: '/dashboard/employee/overview' },
  { text: 'Time Tracking', icon: WiTime4, path: '/dashboard/employee/time-tracking' },
  { text: 'Leaves History', icon: GrNotes, path: '/dashboard/employee/leaves-history' },
  { text: 'Announcements', icon: GrAnnounce, path: '/dashboard/employee/announcements' },
  { text: 'Payroll', icon: CiMoneyBill, path: '/dashboard/employee/payroll' },
  { text: 'Review Management', icon: IoDocumentTextOutline, path: '/dashboard/employee/review-management' },
  { text: 'Settings', icon: IoSettingsOutline, path: '/dashboard/employee/profile-settings' },
  { text: 'Logout', icon: RiLogoutCircleLine, path: '/sign-in' },
] as const;

type MobileNavigationBarProps = {
  isAdmin: boolean;
};

const MobileNavigationBar: React.FC<MobileNavigationBarProps> = ({ isAdmin }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const navigationLinks = isAdmin ? ADMIN_MOBILE_LINKS : EMPLOYEE_MOBILE_LINKS;
  const router = useRouter();

  // Updated checkActive function to match NavigationBar behavior
  const checkActive = useMemo(
    () => (path: string) => {
      // Check if current path includes add-employee or edit-employee and link is employees-management
      if ((pathname.includes('/dashboard/admin/add-employee')
        || pathname.includes('/dashboard/admin/edit-employee'))
      && path === '/dashboard/admin/employees-management') {
        return true;
      }
      // Regular path check
      return pathname.includes(path);
    },
    [pathname],
  );

  const { userRole, userData } = useAuth(); // Get data from AuthContext
  const { handleLogout } = useLogout();

  // Determine the dashboard path based on user role
  const getDashboardPath = () => {
    if (userRole?.toLowerCase() === 'admin') {
      return '/dashboard/admin/overview';
    }
    return '/dashboard/employee/overview';
  };

  return (
    <div className="w-full bg-white p-4 smd:hidden">
      <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>
        <div className="flex items-center justify-between">
          <SheetTrigger asChild>
            <IoMenu size={26} />
          </SheetTrigger>

          <Image
            src={huddleHRLogo.src}
            height={50}
            width={150}
            className="object-contain"
            alt="HuddleHR Logo"
            onClick={() => router.push(getDashboardPath())} // Redirect based on role

          />
          <NotificationPanel />
        </div>

        <SheetContent side="left" className="w-72 bg-white px-4 py-10">
          {/* Logo */}
          <div className="my-3 flex justify-center">
            <Image src={huddleHRLogo} height={100} width={100} alt="HR-logo" />
          </div>

          {/* Profile */}
          <div className="flex w-full flex-col items-center justify-center">

            <Avatar src={userData?.profilePic} className="size-24" />
            <p className="mt-2 text-center text-base font-medium text-primary-100">
              {userData?.name}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="mt-4 flex flex-col gap-4 py-3">
            {navigationLinks.map(link => (
              <Link
                key={link.text}
                href={link.path}
                onClick={() => {
                  setOpenDrawer(false);
                  if (link.text.toLowerCase() === 'logout') {
                    handleLogout();
                  }
                }}
                className={clsx(
                  `flex w-full items-center gap-2 rounded-full border border-[#F1F1F1] px-4 py-2 text-sm transition-all duration-300`,
                  checkActive(link.path)
                    ? 'bg-primary-100 text-white'
                    : 'bg-white text-black hover:bg-primary-100 hover:text-white',
                )}
              >
                {React.createElement(link.icon, { size: 18 })}
                {link.text}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigationBar;
