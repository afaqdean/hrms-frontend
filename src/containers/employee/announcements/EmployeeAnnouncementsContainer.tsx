'use client';

import MobileAnnouncement from '@/components/shared/mobile-views/MobileAnnouncement';
import AnnouncementsTable from '@/components/shared/tables/annoucements/AnnouncementsTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';

const EmployeeAnnouncementsContainer = () => {
  const [announcementFilter, setAnnouncementFilter] = useState<string>('');
  return (
    <div className="mx-2 mt-2  rounded-2xl  bg-secondary-100 p-2 md:mx-0 md:bg-white  md:p-6">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-primary-100">Announcements</span>
        <div>
          <Select onValueChange={setAnnouncementFilter} value={announcementFilter}>
            <SelectTrigger className="w-36 bg-white ">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="isRecent">New</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 xl:h-[62vh] xxl:h-[70vh]">
        <AnnouncementsTable announcementFilter={announcementFilter} isAdmin={false} />
        <MobileAnnouncement announcementFilter={announcementFilter} isAdmin={false} />
      </div>
    </div>
  );
};

export default EmployeeAnnouncementsContainer;
