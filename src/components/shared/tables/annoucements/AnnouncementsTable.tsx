'use client';

import type { Announcement } from '@/interfaces/Annnouncement';
import DeleteAnnouncements from '@/components/admin/pop-ups/DeleteAnnouncements';
import EditAudience from '@/components/admin/pop-ups/EditAudience';
import PublishAnnouncement from '@/components/admin/pop-ups/PublishAnnouncement';
import ModalUI from '@/components/Modal';

import { ToastStyle } from '@/components/ToastStyle';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import useAnnouncementsForEmployee from '@/hooks/useAnnouncementsForEmployee';
import useDeleteAnnouncement from '@/hooks/useDeleteAnnouncement';
import announcementRecordNotFound from '@/public/assets/announcement-record-not-found.png';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { BiSolidEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

type AnnouncementTableProps = {
  isAdmin?: boolean;
  announcementFilter?: string;
  className?: string;
  query?: string;
};

const NoTableDataFound = () => (
  <div className="w-full">
    <div className="flex min-w-full flex-1 flex-col items-center justify-center bg-secondary-100 xl:h-[51vh] xxl:h-[64vh]">
      <Image src={announcementRecordNotFound} alt="no-record-found" height={130} width={133} />
      <p className="mt-2 text-center text-sm text-secondary-400">
        You have no announcements. Time to make one!
      </p>
    </div>
  </div>
);

const LoadingMessage = () => (
  <div className="hidden flex-col items-center justify-center bg-white md:flex xl:h-[49vh] xxl:h-[55vh]">
    <p className="text-center text-sm text-secondary-400">Loading announcements...</p>
  </div>
);

const AnnouncementsTable: React.FC<AnnouncementTableProps> = ({ isAdmin, announcementFilter, className, query }) => {
  const { Announcements, isLoading } = useAnnouncementsForEmployee();
  const { mutate: deleteAnnouncement, isPending } = useDeleteAnnouncement(); // ✅ Use the mutation hook

  const [editAudienceModalOpen, setEditAudienceModalOpen] = useState(false);
  const [deleteAnnouncementModalOpen, setDeleteAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const [editAnnouncement, setEditAnnouncement] = useState(false);
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

  // Combine filtering and searching in one useMemo
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
    <div className={`scrollbar hidden size-full overflow-y-scroll rounded-2xl bg-white md:block ${className}`}>
      <Table>
        <TableHeader className="custom-table-header">
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Announcement</TableCell>
            <TableCell>Audience</TableCell>
            {isAdmin && <TableCell align="center">Action</TableCell>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredAnnouncements?.length === 0
            ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3}>
                    <NoTableDataFound />
                  </TableCell>
                </TableRow>
              )
            : (
                [...filteredAnnouncements]?.map(entry => (
                  <TableRow key={entry._id} className="border-b">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <span className="flex w-32 flex-col items-center justify-center rounded-lg bg-secondary-100 px-4 py-2 text-primary-100">
                            <span className="text-lg font-medium">{new Date(entry.date).getDate()}</span>
                            <span className="text-base">
                              {new Date(entry.date).toLocaleString('en-US', { month: 'long' })}
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="flex justify-start font-normal text-primary-100">
                            {new Date(entry.date).toLocaleString('en-US', { weekday: 'long' })}
                          </span>
                          <p className="text-sm text-secondary-300">
                            {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="block  text-base text-primary-100">{entry.title}</span>
                        <p className="break-all text-sm text-secondary-400">{entry.desc}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link
                          onClick={() => isAdmin && setEditAudienceModalOpen(true)}
                          href="#"
                          className={`cursor-default text-base font-normal text-primary-100 ${
                            isAdmin && 'hover:cursor-pointer hover:text-black hover:underline'
                          }`}
                        >
                          {entry.audience}
                        </Link>
                      </div>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" className="mr-2 bg-none" onClick={() => handleEditClick(entry)}>
                            <BiSolidEditAlt />
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-none text-danger hover:bg-light-danger hover:text-danger"
                            onClick={() => handleDeleteClick(entry._id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
        </TableBody>
      </Table>

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

export default AnnouncementsTable;
