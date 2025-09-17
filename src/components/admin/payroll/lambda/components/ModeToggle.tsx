'use client';

import React from 'react';
import { HiUser, HiUsers } from 'react-icons/hi';

type ModeToggleProps = {
  isIndividualMode: boolean;
  onModeChange: (isIndividual: boolean) => void;
  disabled?: boolean;
  hasData?: boolean;
};

const ModeToggle: React.FC<ModeToggleProps> = ({
  isIndividualMode,
  onModeChange,
  disabled = false,
  hasData = false,
}) => {
  const handleModeSwitch = (targetMode: boolean) => {
    if (isIndividualMode === targetMode) {
      return;
    }

    if (hasData) {
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm(
        'Switching modes will clear your current data. Are you sure?',
      );
      if (!confirmed) {
        return;
      }
    }

    onModeChange(targetMode);
  };

  return (
    <div className="mx-auto max-w-xs">
      <div className="relative flex rounded-lg bg-gray-100 p-0.5">
        {/* Background slider */}
        <div
          className={`absolute inset-y-0.5 w-1/2 rounded-md bg-white shadow-sm transition-transform duration-200 ease-out ${
            isIndividualMode ? 'translate-x-full' : 'translate-x-0'
          }`}
        />

        {/* Bulk Processing Option */}
        <button
          type="button"
          onClick={() => handleModeSwitch(false)}
          className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors duration-150 ${
            !isIndividualMode
              ? 'text-primary-100'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          disabled={disabled}
        >
          <HiUsers className="size-3" />
          <span>Bulk</span>
        </button>

        {/* Individual Processing Option */}
        <button
          type="button"
          onClick={() => handleModeSwitch(true)}
          className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors duration-150 ${
            isIndividualMode
              ? 'text-primary-100'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          disabled={disabled}
        >
          <HiUser className="size-3" />
          <span>Individual</span>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
