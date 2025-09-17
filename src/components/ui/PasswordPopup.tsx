'use client';

import { Check, Copy, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './button';

type PasswordPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  title?: string;
};

const PasswordPopup: React.FC<PasswordPopupProps> = ({
  isOpen,
  onClose,
  password,
  title = 'PDF Password',
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="mb-3 text-sm text-gray-600">
            Your payslip has been downloaded successfully. Use the password below to open the PDF file:
          </p>

          {/* Password Display */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <code className="flex-1 font-mono text-lg font-semibold text-gray-900">
              {password}
            </code>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {copied
                ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      Copied!
                    </>
                  )
                : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordPopup;
