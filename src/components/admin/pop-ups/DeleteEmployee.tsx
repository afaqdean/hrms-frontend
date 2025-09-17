import { Button } from '@/components/ui/button';
import employeeDeletion from '@/public/assets/employeeDeletion.png'; // Importing the deletion image
import Image from 'next/image';
import React from 'react';

type DeleteEmployeeProps = {
  onClose: () => void; // Function to close the modal
  onConfirmDelete: () => void;
  isDeleting: boolean;
};

const DeleteEmployee: React.FC<DeleteEmployeeProps> = ({ onClose, onConfirmDelete, isDeleting }) => {
  return (
    <div className="max-w-64 rounded-2xl md:max-w-3xl md:p-6">
      {/* Container for delete confirmation modal */}
      <div className="flex flex-col items-center">

        {/* Employee deletion image */}
        <Image
          src={employeeDeletion}
          alt="employee-delete-image"
          height={110}
          width={156}
        />

        {/* Confirmation message */}
        <h4 className="mt-4 text-center text-sm font-medium md:text-base">
          Are you sure you want to permanently delete this employee?
        </h4>
      </div>

      {/* Action buttons: Cancel & Delete */}
      <div className="mt-6 flex w-full gap-2">
        {/* Cancel button to close the modal */}
        <Button
          className="w-1/2"
          variant="secondary"
          onClick={() => onClose()}
          disabled={isDeleting}
        >
          No, Cancel
        </Button>

        {/* Confirm delete button  */}
        <Button
          className="w-1/2"
          variant="destructive"
          onClick={onConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting
            ? (
                <>
                  <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting...
                </>
              )
            : (
                'Yes, Delete'
              )}
        </Button>
      </div>
    </div>
  );
};

export default DeleteEmployee;
