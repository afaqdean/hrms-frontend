'use client';

type DeleteDeductionModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteDeductionModal: React.FC<DeleteDeductionModalProps> = ({
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
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Confirm Deletion
        </h3>
        <div className="mt-2 px-7 py-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this deduction? This action cannot be undone.
          </p>
        </div>
        <div className="items-center px-4 py-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 w-full rounded-md bg-gray-200 px-4 py-2 text-base font-medium text-gray-800 shadow-sm hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDeductionModal;
