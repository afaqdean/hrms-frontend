import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { MdSchedule } from 'react-icons/md';

type LastUpdatePillProps = {
  storageKey?: string;
  className?: string;
};

type UpdateInfo = {
  fileName: string;
  uploadTime: string;
};

const LastUpdatePill: React.FC<LastUpdatePillProps> = ({
  storageKey = 'lastCSVUpload',
  className = '',
}) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    const loadUpdateInfo = () => {
      try {
        const savedInfo = localStorage.getItem(storageKey);
        if (savedInfo) {
          const parsedInfo = JSON.parse(savedInfo);
          setUpdateInfo(parsedInfo);
        }
      } catch (error) {
        console.error('Error loading update info:', error);
      }
    };

    loadUpdateInfo();

    // Listen for storage changes to update in real-time (for other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        loadUpdateInfo();
      }
    };

    // Listen for custom events to update in the same tab
    const handleCustomUpdate = () => {
      loadUpdateInfo();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('csvUploadComplete', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('csvUploadComplete', handleCustomUpdate);
    };
  }, [storageKey]);

  if (!updateInfo) {
    return null;
  }

  const formattedTime = moment
    .tz(updateInfo.uploadTime, moment.tz.guess())
    .format('MMM Do, h:mm A');

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="group relative overflow-hidden rounded-full border border-slate-200/60 bg-gradient-to-r from-slate-50 via-white to-slate-50/80 px-4 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
        {/* Subtle background decoration */}
        <div className="absolute -right-1 -top-1 size-8 rounded-full bg-slate-100/40 blur-lg transition-opacity duration-300 group-hover:opacity-60" />

        <div className="relative z-10 flex items-center space-x-2.5">
          <div className="flex size-6 items-center justify-center rounded-full bg-primary shadow-sm">
            <MdSchedule className="size-3.5 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium leading-tight text-slate-700">
              Last Updated
            </span>
            <span className="text-xs font-normal leading-tight text-slate-500">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent" />
      </div>
    </div>
  );
};

export default LastUpdatePill;
