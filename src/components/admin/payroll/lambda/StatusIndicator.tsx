'use client';

import React from 'react';
import { HiCheckCircle, HiClock, HiExclamationCircle, HiInformationCircle, HiSearch, HiSparkles } from 'react-icons/hi';
import { HiRocketLaunch } from 'react-icons/hi2';

type UploadStatus = 'idle' | 'uploading' | 'verifying' | 'ready' | 'processing' | 'completed' | 'error';

type StatusIndicatorProps = {
  status: UploadStatus;
  message: string;
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, message }) => {
  if (status === 'idle' || !message) {
    return null;
  }

  const getStatusConfig = (status: UploadStatus) => {
    switch (status) {
      case 'uploading':
        return {
          bgColor: 'bg-secondary-100',
          borderColor: 'border-secondary-200',
          textColor: 'text-primary-100',
          icon: <HiClock className="size-5" />,
          showSpinner: true,
        };
      case 'verifying':
        return {
          bgColor: 'bg-light-warning',
          borderColor: 'border-warning',
          textColor: 'text-primary-100',
          icon: <HiSearch className="size-5" />,
          showSpinner: true,
        };
      case 'ready':
        return {
          bgColor: 'bg-light-success',
          borderColor: 'border-success',
          textColor: 'text-success',
          icon: <HiCheckCircle className="size-5" />,
          showSpinner: false,
        };
      case 'processing':
        return {
          bgColor: 'bg-secondary-100',
          borderColor: 'border-primary-100',
          textColor: 'text-primary-100',
          icon: <HiRocketLaunch className="size-5" />,
          showSpinner: true,
        };
      case 'completed':
        return {
          bgColor: 'bg-light-success',
          borderColor: 'border-success',
          textColor: 'text-success',
          icon: <HiSparkles className="size-5" />,
          showSpinner: false,
        };
      case 'error':
        return {
          bgColor: 'bg-light-danger',
          borderColor: 'border-danger',
          textColor: 'text-danger',
          icon: <HiExclamationCircle className="size-5" />,
          showSpinner: false,
        };
      default:
        return {
          bgColor: 'bg-secondary-100',
          borderColor: 'border-secondary-200',
          textColor: 'text-secondary-300',
          icon: <HiInformationCircle className="size-5" />,
          showSpinner: false,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`rounded-2xl border p-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center">
        <span className="mr-3">{config.icon}</span>
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {message}
          </p>
        </div>
        {config.showSpinner && (
          <div className="ml-3">
            <div className={`size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${config.textColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicator;
