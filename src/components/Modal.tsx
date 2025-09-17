import type { ModalUIProps } from './types'; // ✅ Import the type definition for props
import { Dialog, DialogContent } from '@/components/ui/dialog'; // ✅ Import ShadCN UI Dialog components
import { DialogTitle } from '@radix-ui/react-dialog'; // ✅ Import the Radix UI DialogTitle for accessibility
import React from 'react';

// No-op function (used as a default prop to avoid undefined errors)
const noop = () => {};

/**
 * ModalUI Component
 * - A reusable modal component using Radix UI and ShadCN UI.
 * - Supports controlled visibility via `isOpen` prop.
 * - Handles closing via `handleClose` callback.
 *
 * @param {ModalUIProps} props - The props for the ModalUI component
 * @param {boolean} props.isOpen - Controls whether the modal is open or closed.
 * @param {() => void} props.handleClose - Callback function when the modal closes.
 * @param {React.ReactNode} props.children - Content inside the modal.
 */
const ModalUI: React.FC<ModalUIProps> = ({
  isOpen = false, // Default state is closed
  handleClose = noop, // Default to a no-op function to prevent errors
  children,
}) => {
  return (
    <Dialog
      open={isOpen} // Controls modal visibility
      onOpenChange={(open) => {
        if (!open) {
          handleClose(); // Call handleClose when modal closes
        }
      }}
    >
      <DialogContent
        className="flex w-full min-w-max flex-col rounded-lg bg-white p-0 shadow-lg"
        onInteractOutside={(e) => {
          // Allow popover interactions to pass through
          const target = e.target as Element;
          if (target.closest('[data-radix-popper-content-wrapper]')) {
            return;
          }
          e.preventDefault();
        }}
      >
        <DialogTitle></DialogTitle>
        {' '}
        {/* Placeholder for title (optional) */}
        {children}
        {' '}
        {/* Render modal content */}
      </DialogContent>
    </Dialog>
  );
};

export default ModalUI;
