'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { BiLogInCircle } from 'react-icons/bi';
import { CiMoneyBill, CiTimer } from 'react-icons/ci';
import { HiUsers } from 'react-icons/hi';
import { IoMdMegaphone } from 'react-icons/io';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { RiFileListLine } from 'react-icons/ri';
import { WiTime4 } from 'react-icons/wi';

type NavLink = {
  text: string;
  icon: React.ElementType;
  path: string;
};

const ADMIN_LINKS: NavLink[] = [
  { text: 'Overview', icon: BiLogInCircle, path: '/dashboard/admin/overview' },
  { text: 'Employee Management', icon: HiUsers, path: '/dashboard/admin/employees-management' },
  { text: 'Leaves Management', icon: RiFileListLine, path: '/dashboard/admin/leaves-management' },
  { text: 'Time Tracking', icon: WiTime4, path: '/dashboard/admin/time-tracking' },
  { text: 'Announcements', icon: IoMdMegaphone, path: '/dashboard/admin/announcements' },
  { text: 'Payroll Management', icon: CiMoneyBill, path: '/dashboard/admin/payroll-management' },
] as const;

const EMPLOYEE_LINKS: NavLink[] = [
  { text: 'Overview', icon: BiLogInCircle, path: '/dashboard/employee/overview' },
  { text: 'Time Tracking', icon: CiTimer, path: '/dashboard/employee/time-tracking' },
  { text: 'Leaves History', icon: RiFileListLine, path: '/dashboard/employee/leaves-history' },
  { text: 'Announcements', icon: IoMdMegaphone, path: '/dashboard/employee/announcements' },
  { text: 'Payroll', icon: CiMoneyBill, path: '/dashboard/employee/payroll' },
  { text: 'Review Management', icon: IoDocumentTextOutline, path: '/dashboard/employee/review-management' },
] as const;

type NavItemProps = {
  link: NavLink;
  isActive: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ link, isActive }) => {
  const Icon = link.icon;

  // Same sizing for admin and employee (using admin sizing)
  const itemHeight = 'h-10';
  const iconSize = 16;
  const textSize = 'text-xs';
  const gap = 'gap-1';
  const padding = 'px-2';

  return (
    <motion.div
      className="w-full"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href={link.path}
        className={`group relative flex ${itemHeight} w-full items-center justify-center ${gap} rounded-full text-center transition-all duration-300`}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Background element */}
        <div
          className={`absolute inset-0 rounded-full transition-colors duration-300 ${
            isActive
              ? 'bg-primary-100'
              : 'bg-white group-hover:bg-primary-100/90'
          }`}
        />

        {/* Icon and text container */}
        <div className={`relative z-10 flex items-center ${gap} ${padding}`}>
          <Icon
            size={iconSize}
            className={`shrink-0 transition-colors duration-300 ${
              isActive
                ? 'text-white'
                : 'text-gray-600 group-hover:text-white'
            }`}
            aria-hidden="true"
          />
          <span
            className={`${textSize} font-medium transition-colors duration-300 ${
              isActive
                ? 'text-white'
                : 'text-gray-800 group-hover:text-white'
            }`}
          >
            {link.text}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

type NavigationBarProps = {
  isAdmin: boolean;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const NavigationBar: React.FC<NavigationBarProps> = ({ isAdmin }) => {
  const pathname = usePathname();
  const navigationLinks = isAdmin ? ADMIN_LINKS : EMPLOYEE_LINKS;
  const userType = isAdmin ? 'admin' : 'employee';

  // Same spacing and grid layout for admin and employee (using admin spacing)
  const containerClasses = isAdmin
    ? 'hidden w-full gap-3 border-y border-y-[#F1F1F1] py-3 pb-1 md:grid md:grid-cols-6 md:gap-1 lg:grid-cols-6 lg:gap-2 xl:grid-cols-6 xl:gap-3'
    : 'hidden w-full gap-3 border-y border-y-[#F1F1F1] py-3 pb-1 md:grid md:grid-cols-6 md:gap-1 lg:grid-cols-6 lg:gap-2 xl:grid-cols-6 xl:gap-3';

  const isLinkActive = (linkPath: string) => {
    // Check if current path includes add-employee or edit-employee and link is employees-management
    if ((pathname.includes('/dashboard/admin/add-employee')
      || pathname.includes('/dashboard/admin/edit-employee'))
    && linkPath === '/dashboard/admin/employees-management') {
      return true;
    }
    // Regular path check
    return pathname.startsWith(linkPath);
  };

  return (
    <motion.nav
      className={containerClasses}
      role="navigation"
      aria-label={`${userType} navigation`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {navigationLinks.map(link => (
        <motion.div key={link.path} variants={childVariants}>
          <NavItem
            link={link}
            isActive={isLinkActive(link.path)}
          />
        </motion.div>
      ))}
    </motion.nav>
  );
};

export default NavigationBar;
