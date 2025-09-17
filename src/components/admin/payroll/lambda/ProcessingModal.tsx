'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import { HiCheck, HiExclamation, HiX } from 'react-icons/hi';

type ProcessingModalProps = {
  monthYear: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
};

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  monthYear,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary-100">
            Ready for Bulk Processing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-secondary-300">
            Both files have been uploaded and verified successfully for
            {' '}
            <strong>{monthYear}</strong>
            !
          </p>

          <div className="rounded-2xl border border-warning bg-light-warning p-4">
            <h4 className="mb-3 flex items-center text-sm font-semibold text-primary-100">
              <HiExclamation className="mr-2 size-4" />
              This will:
            </h4>
            <ul className="space-y-2 text-sm text-primary-100">
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 flex size-4 items-center justify-center rounded-full bg-warning text-xs font-bold text-white">•</span>
                <span>Process all employees in the uploaded salaries file</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 flex size-4 items-center justify-center rounded-full bg-warning text-xs font-bold text-white">•</span>
                <span>Generate PDF payslips for each employee</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 flex size-4 items-center justify-center rounded-full bg-warning text-xs font-bold text-white">•</span>
                <span>Send email notifications to all employees</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-0.5 flex size-4 items-center justify-center rounded-full bg-warning text-xs font-bold text-white">•</span>
                <span>Take several minutes to complete</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full border-secondary-200 sm:w-auto"
          >
            <HiX className="mr-1 size-4" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full bg-primary-100 hover:bg-primary-100/90 sm:w-auto"
          >
            <HiCheck className="mr-1 size-4" />
            Start Bulk Processing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessingModal;
