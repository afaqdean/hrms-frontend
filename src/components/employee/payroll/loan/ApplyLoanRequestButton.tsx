'use client';

import ModalUI from '@/components/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import ApplyLoanRequestForm from './ApplyLoanRequestForm';

const ApplyLoanRequestButton: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <button
        type="button"
        className="group flex items-center gap-2 rounded-full border-2 border-primary-100 bg-primary-100 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-in hover:bg-white hover:text-primary-100"
        style={{ minWidth: 140 }}
        onClick={() => setShowModal(true)}
      >
        Request a loan
        <BsArrowUpRightCircle
          className="inline-block align-middle text-xl text-white transition-colors duration-200 ease-in group-hover:text-primary-100"
        />
      </button>
      {showModal && (
        <ModalUI isOpen={showModal} handleClose={() => setShowModal(false)}>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="mx-auto w-full max-w-3xl"
            >
              <ApplyLoanRequestForm onClose={() => setShowModal(false)} />
            </motion.div>
          </AnimatePresence>
        </ModalUI>
      )}
    </>
  );
};

export default ApplyLoanRequestButton;
