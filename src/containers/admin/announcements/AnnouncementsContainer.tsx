'use client'; // ✅ Enables client-side rendering for this component

import { SearchBar } from '@/components/admin/employee-section/Employees';
import PublishAnnouncement from '@/components/admin/pop-ups/PublishAnnouncement';
import ModalUI from '@/components/Modal';
import MobileAnnouncement from '@/components/shared/mobile-views/MobileAnnouncement';
import AnnouncementsTable from '@/components/shared/tables/annoucements/AnnouncementsTable';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdOutlineAdd } from 'react-icons/md'; // ✅ Importing the "Add" icon from Material Icons

/**
 * AnnouncementsContainer Component
 * - Displays a searchable list of company announcements.
 * - Allows administrators to publish new announcements.
 * - Uses a modal (`ModalUI`) for publishing announcements.
 */
const AnnouncementsContainer = () => {
  // State to manage search query input
  const [query, setQuery] = useState<string>('');

  // State to manage modal visibility for publishing announcements
  const [publishAnnouncement, setPublishAnnouncement] = useState<boolean>(false);
  const { userData } = useAuth();

  const isAdmin = userData?.role.toLowerCase() === 'admin';

  return (
    <div className=" mt-4 rounded-2xl px-2 md:bg-white md:px-6 md:py-4">
      {/* Header Section */}
      <div className="mb-2 flex justify-between">
        {/* Title and Description */}
        <div className="flex  w-full items-center justify-between md:mb-4 md:w-auto md:flex-none">
          <div>
            <p className="text-base font-medium">Announcements</p>
            <p className="text-sm text-secondary-300">Manage all company announcements</p>
          </div>
          {/* View For Mobile Devices */}
          <Link href="#" onClick={() => setPublishAnnouncement(true)} className="flex size-12 items-center justify-center rounded-full bg-primary-100 md:hidden">
            <MdOutlineAdd className="size-6 text-white" />
          </Link>
        </div>

        {/* Search Bar and Publish Button */}
        <div className="hidden w-full items-center  justify-end gap-2 md:flex md:w-1/2">
          {/* Search Bar for filtering announcements */}
          <SearchBar query={query} setQuery={setQuery} />

          {/* Button to Open Modal for Publishing an Announcement */}
          <Button onClick={() => setPublishAnnouncement(true)}>
            <MdOutlineAdd />
            <span>Publish Announcement</span>
          </Button>

          {/* Modal for Creating a New Announcement */}
          {publishAnnouncement && (
            <ModalUI
              isOpen={publishAnnouncement}
              handleOpen={() => setPublishAnnouncement(true)}
              handleClose={() => setPublishAnnouncement(false)}
            >
              <PublishAnnouncement onClose={() => setPublishAnnouncement(false)} />
            </ModalUI>
          )}
        </div>
      </div>

      {/* Announcements Table (Scrollable) */}
      <div className="h-full xl:h-[60vh] xxl:h-[70vh]">
        {/* Displaying the announcements list (Admin mode enabled) */}
        <AnnouncementsTable query={query} isAdmin={isAdmin} />

        <div className="md:hidden">
          <SearchBar className="h-10" query={query} setQuery={setQuery} />
          <MobileAnnouncement query={query} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsContainer;
