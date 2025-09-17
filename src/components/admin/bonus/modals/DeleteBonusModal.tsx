'use client';

import { Button } from '@/components/ui/button';

type DeleteBonusModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteBonusModal: React.FC<DeleteBonusModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Delete Bonus</h3>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this bonus? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBonusModal;
