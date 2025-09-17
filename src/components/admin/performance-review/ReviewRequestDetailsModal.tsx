'use client';

import type { ReviewRequest } from '@/interfaces/PerformanceReview';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

import ReviewRequestDetails from './ReviewRequestDetails';

type ReviewRequestDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reviewRequest?: ReviewRequest;
};

const ReviewRequestDetailsModal: React.FC<ReviewRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  reviewRequest,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {reviewRequest
            ? (
                <ReviewRequestDetails reviewRequest={reviewRequest} />
              )
            : (
                <div className="py-8 text-center text-gray-500">
                  <p>No review request selected.</p>
                </div>
              )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewRequestDetailsModal;
