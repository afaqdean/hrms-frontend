'use client';
import type React from 'react';
import { Accordion, AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AccordionItem } from '@radix-ui/react-accordion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdOutlinePhoneEnabled } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import ChangePassword from './change-password/ChangePassword';
import EmployeeEmergencyContactDetails from './employee-emergency-contact-details/EmployeeEmergencyContactDetails';
import EmployeePersonalDetails from './employee-personal-details/EmployeePersonalDetails';
import 'react-loading-skeleton/dist/skeleton.css';

const steps = [
  {
    label: 'Personal Details',
    icon: FaRegUser,
    path: '/dashboard/employee/profile-settings',
  },
  {
    label: 'Emergency Contact Details',
    icon: MdOutlinePhoneEnabled,
    path: '/dashboard/employee/profile-settings/emergency-contact-details',
  },
  {
    label: 'Change Password',
    icon: IoDocumentTextOutline,
    path: '/dashboard/employee/profile-settings/change-password',
  },
];

type ProfileSettingsContainerProps = {
  children?: React.ReactNode;
};

const ProfileSettingsContainer: React.FC<ProfileSettingsContainerProps> = ({ children }) => {
  const pathName = usePathname();
  const { profile, isLoading } = useUserProfile();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="mx-auto h-full rounded-2xl bg-none p-4 md:bg-white md:p-6 xl:h-[75vh] xxl:h-[80vh]">
      {/* Heading */}
      <div>
        <h2 className="text-base font-medium text-primary-100">Settings</h2>
      </div>
      <hr className="my-3 w-full border-[#F1F1F1]" />

      {/* Mobile Profile Section */}
      <div className="mb-6 flex flex-col items-center justify-center md:hidden">
        <div className="mb-4">
          <div className="size-20 overflow-hidden rounded-full">
            {isLoading && <Skeleton circle className="size-full" />}
            {profile?.profileImage && (
              <Image
                src={profile.profileImage}
                alt="profile-pic"
                height={80}
                width={80}
                className="size-full rounded-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="text-center">
          <h4 className="mb-1 text-base font-medium text-gray-900">
            {profile?.name || <Skeleton width={120} />}
          </h4>
          <p className="text-sm text-primary-100">
            {profile?.position || <Skeleton width={80} />}
          </p>
        </div>
      </div>

      {/* Mobile Accordion */}
      <div className="flex h-full flex-col gap-4  md:hidden">
        <Accordion type="single" collapsible className="rounded-lg bg-white p-4">
          <AccordionItem value="personal-details">
            <AccordionTrigger className="rounded-lg bg-white">Personal Details</AccordionTrigger>
            <AccordionContent>
              <div className="mt-4">
                <EmployeePersonalDetails />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className=" rounded-lg bg-white p-4">
          <AccordionItem value="emergency-contact-details">
            <AccordionTrigger className="rounded-lg bg-white">Emergency Contact Details</AccordionTrigger>
            <AccordionContent>

              <div className="mt-4">
                <EmployeeEmergencyContactDetails />
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
        <Accordion type="single" collapsible className=" rounded-lg bg-white p-4">
          <AccordionItem value="change-password">
            <AccordionTrigger className="rounded-lg bg-white">Change Password</AccordionTrigger>
            <AccordionContent>

              <div className="mt-4">
                <ChangePassword />
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>

      </div>

      {/* Desktop Layout */}
      <div className="mt-5 hidden h-full gap-4 md:flex xl:h-[60vh]">
        {/* Sidebar Steps */}
        <div className="flex h-full w-2/6 flex-col rounded-2xl bg-secondary-100 p-6">
          {/* Profile Section at Top */}
          <div className="mb-8 flex flex-col items-center justify-center">
            <div className="mb-4">
              <div className="size-20 overflow-hidden rounded-full">
                {(!imageLoaded || isLoading) && <Skeleton circle className="absolute size-full" />}
                {profile?.profileImage && (
                  <Image
                    src={profile.profileImage}
                    alt="profile-pic"
                    height={80}
                    width={80}
                    className="size-full rounded-full object-cover"
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
              </div>
            </div>
            <div className="text-center">
              <h4 className="mb-1 text-base font-medium text-gray-900">
                {profile?.name || <Skeleton width={120} />}
              </h4>
              <p className="text-sm text-primary-100">
                {profile?.position || <Skeleton width={80} />}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            {steps.map((step) => {
              const isActive = pathName === step.path;
              const Icon = step.icon;

              return (
                <Link
                  key={step.label}
                  href={step.path}
                  className={`group flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 transition-all
                    ${isActive ? 'text-primary-100' : 'text-secondary-300 hover:text-primary-100'}`}
                >
                  <span className="text-sm font-medium transition-all group-hover:text-primary-100">
                    {step.label}
                  </span>
                  <span
                    className={`flex size-12 items-center justify-center rounded-full transition-all
                      ${isActive ? 'bg-primary-100 text-white' : 'bg-white text-primary-100 group-hover:bg-primary-100 group-hover:text-white'}`}
                  >
                    <Icon className="size-5 transition-all" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex w-full">
          {/* Form Content */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsContainer;
