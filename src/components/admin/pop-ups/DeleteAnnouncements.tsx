import { Button } from '@/components/ui/button';
import React from 'react';
import { MdDelete } from 'react-icons/md';

type DeleteAnnouncementsProps = {
  onClose: () => void; // Function to close the modal
  onConfirm: () => void; // Function to confirm deletion
  isLoading: boolean;
};

const DeleteAnnouncements: React.FC<DeleteAnnouncementsProps> = ({ onClose, onConfirm, isLoading }) => {
  return (
    <div className="w-72 rounded-2xl px-3 py-2 md:w-full md:px-6 md:py-3">
      {/* Container for delete confirmation modal */}
      <div className="flex w-full flex-col items-center ">

        {/* Delete icon inside a circular background */}
        <div className="flex size-14 items-center justify-center rounded-full bg-[#FFECEC] text-danger">
          <MdDelete className="size-6" />
        </div>

        {/* Confirmation message */}
        <h4 className="mt-4 text-center text-sm font-medium md:text-base">
          Are you sure you want to delete this announcement?
        </h4>

        {/* Action buttons: Cancel & Delete */}
        <div className="mt-3 flex w-full gap-2 md:mt-6 md:gap-4">
          {/* Cancel button to close the modal */}
          <Button disabled={isLoading} className="h-10 w-1/2 text-sm md:h-auto md:text-base" variant="secondary" onClick={() => onClose()}>
            No, Cancel
          </Button>

          {/* Confirm delete button - calls onConfirm and then closes the modal */}
          <Button
            className="h-10 w-1/2 text-sm md:h-auto md:text-base"
            variant="destructive"
            disabled={isLoading}
            onClick={onConfirm}

          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAnnouncements;
