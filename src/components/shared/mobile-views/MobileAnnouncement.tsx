'use client';

import type { Announcement } from '@/interfaces/Annnouncement';
import DeleteAnnouncements from '@/components/admin/pop-ups/DeleteAnnouncements';
import EditAudience from '@/components/admin/pop-ups/EditAudience';
import PublishAnnouncement from '@/components/admin/pop-ups/PublishAnnouncement';
import ModalUI from '@/components/Modal';
import { ToastStyle } from '@/components/ToastStyle';
import { Button } from '@/components/ui/button';
import useAnnouncementsForEmployee from '@/hooks/useAnnouncementsForEmployee';
import useDeleteAnnouncement from '@/hooks/useDeleteAnnouncement';
import announcementRecordNotFound from '@/public/assets/announcement-record-not-found.png';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

const NoTableDataFound = () => (
  <div className="mt-4 size-full rounded-lg bg-white p-4 md:mt-0">
    <div className="flex h-96 flex-col items-center justify-center">
      <Image alt="announcement-not-found" src={announcementRecordNotFound} height={80} width={83} />
      <p className="mt-3 w-full text-center text-xs  text-secondary-300 md:text-sm">You have no announcements. Time to make one!</p>
    </div>
  </div>
);

const LoadingMessage = () => (
  <div className="mt-4 flex size-full h-96 items-center justify-center rounded-lg bg-white p-4 md:hidden">
    <p className="text-sm text-secondary-300">Loading announcements...</p>
  </div>
);

type MobileAnnouncementProps = {
  isAdmin?: boolean;
  announcementFilter?: string;
  query?: string;
};
const MobileAnnouncement: React.FC<MobileAnnouncementProps> = ({ isAdmin, announcementFilter, query }) => {
  const { Announcements, isLoading } = useAnnouncementsForEmployee();
  const { mutate: deleteAnnouncement, isPending } = useDeleteAnnouncement(); // ✅ Use the mutation hook
  const [editAudienceModalOpen, setEditAudienceModalOpen] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(false);
  const [deleteAnnouncementModalOpen, setDeleteAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const handleEditClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setEditAnnouncement(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedAnnouncementId(id);
    setDeleteAnnouncementModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAnnouncementId) {
      deleteAnnouncement(selectedAnnouncementId, {
        onSuccess: () => {
          toast.success('Announcement Deleted Successfully', ToastStyle);
          setDeleteAnnouncementModalOpen(false);
        },
      });
    }
  };

  const filteredAnnouncements = useMemo(() => {
    let filteredData = Announcements;
    if (announcementFilter === 'isRecent') {
      filteredData = filteredData.filter((it: Announcement) => it.isRecent === true);
    } else if (announcementFilter === 'All') {
      filteredData = Announcements; // Show all entries
    }
    // Now filter by query (case-insensitive)
    return (filteredData || []).filter(
      (a: Announcement) =>
        (a.title?.toLowerCase() ?? '').includes(query?.toLowerCase() ?? '')
        || (a.desc?.toLowerCase() ?? '').includes(query?.toLowerCase() ?? ''),
    );
  }, [Announcements, announcementFilter, query]);

  if (isLoading) {
    return <LoadingMessage />;
  }

  return (
    <div className=" md:hidden">
      {filteredAnnouncements?.length === 0
        ? (
            <NoTableDataFound />
          )
        : (
            [...filteredAnnouncements]?.map((announcement: Announcement) => {
              const entryDate = new Date(announcement.date);
              const day = entryDate.toLocaleDateString('en-US', { weekday: 'long' });
              const month = entryDate.toLocaleDateString('en-US', { month: 'short' });
              const dateNumber = entryDate.getDate();

              return (
                <div key={announcement._id} className="my-3 rounded-md bg-white p-3">
                  <div className="flex items-center gap-2">
                    <div className="my-1 flex size-14 flex-col items-center justify-center rounded-lg bg-secondary-100 px-2 py-1.5">
                      <span className="text-lg font-medium text-primary-100">{dateNumber}</span>
                      <span className="text-base text-primary-100">{month}</span>
                    </div>
                    <div className="w-full">
                      <p className="text-base text-primary-100">{day}</p>
                      <p className="text-sm text-secondary-300">
                        <span>
                          {' '}
                          {new Date(announcement.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    </div>
                    {
                      isAdmin && (
                        <div className=" flex justify-between gap-2">
                          <Button variant="outline" className="size-10" onClick={() => handleEditClick(announcement)}>
                            <BiSolidEditAlt />
                          </Button>
                          <Button variant="outline" className="size-10 bg-none text-danger hover:bg-light-danger hover:text-danger" onClick={() => handleDeleteClick(announcement._id)}>
                            <MdDelete />
                          </Button>
                        </div>
                      )
                    }
                  </div>
                  <hr className=" my-4 border-[#F1F1F1]" />
                  <p className="text-base font-medium text-primary-100">{announcement.title}</p>
                  <p className="mt-2 text-sm text-secondary-300">{announcement.desc}</p>
                  <div className="mt-4">
                    <span>
                      <Link
                        onClick={() => isAdmin && setEditAudienceModalOpen(true)}
                        href="#"
                        className={` text-sm font-normal text-primary-100 md:text-base ${
                          isAdmin && 'hover:cursor-pointer hover:text-black hover:underline'
                        }`}
                      >
                        Audience:
                        {' '}
                        {announcement.audience}
                      </Link>
                    </span>
                  </div>

                </div>
              );
            })
          )}
      {/* Modals */}
      {editAnnouncement && isAdmin && (
        <ModalUI handleClose={() => setEditAnnouncement(false)} isOpen={editAnnouncement}>
          <PublishAnnouncement announcement={selectedAnnouncement} onClose={() => setEditAnnouncement(false)} isEditing={editAnnouncement} />
        </ModalUI>
      )}

      {editAudienceModalOpen && isAdmin && (
        <ModalUI handleClose={() => setEditAudienceModalOpen(false)} isOpen={editAudienceModalOpen}>
          <EditAudience onClose={() => setEditAudienceModalOpen(false)} />
        </ModalUI>
      )}

      {deleteAnnouncementModalOpen && isAdmin && (
        <ModalUI handleClose={() => setDeleteAnnouncementModalOpen(false)} isOpen={deleteAnnouncementModalOpen}>
          <DeleteAnnouncements isLoading={isPending} onClose={() => setDeleteAnnouncementModalOpen(false)} onConfirm={handleConfirmDelete} />
        </ModalUI>
      )}
    </div>
  );
};

export default MobileAnnouncement;
