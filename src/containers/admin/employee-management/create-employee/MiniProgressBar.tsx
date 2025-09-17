'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

const steps = [
  '/dashboard/admin/add-employee',
  '/dashboard/admin/add-employee/account-details',
  '/dashboard/admin/add-employee/contact-details',
  '/dashboard/admin/add-employee/emergency-contact-details',
  '/dashboard/admin/add-employee/leaves-count',

];
const MiniProgressBar = ({ mode }: { mode?: 'create' | 'edit' }) => {
  const pathName = usePathname();

  if (mode === 'edit') {
    return null;
  }

  // Determine current step based on URL
  const currentStep = steps.findIndex(step => pathName === step);
  const completedSteps = currentStep + 1; // Ensure step counting starts from 1
  return (
    <div className="hidden w-56 justify-between md:flex">
      {steps.map((step, index) => {
        const isCompleted = index < completedSteps;
        return (
          <span
            key={step}
            className={`h-2 w-10 rounded-full transition-all ${
              isCompleted ? 'bg-primary-100' : 'bg-[#D9D9D9]'
            }`}
          >
          </span>
        );
      })}
    </div>

  );
};

export default MiniProgressBar;
