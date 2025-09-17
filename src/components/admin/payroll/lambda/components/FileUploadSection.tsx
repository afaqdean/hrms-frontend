'use client';

import Dropzone from '@/components/ui/Dropzone';
import React from 'react';

type FileUploadSectionProps = {
  title: string;
  icon: React.ReactNode;
  description: string;
  onDrop: (files: File[]) => void;
  accept: Record<string, string[]>;
  supportedFormats: string[] | readonly string[];
  currentFile?: File;
  maxFiles?: number;
  disabled?: boolean;
};

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  title,
  icon,
  description,
  onDrop,
  accept,
  supportedFormats,
  currentFile,
  maxFiles = 1,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-secondary-300">
        {icon}
        {title}
      </div>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        supportedFormats={supportedFormats}
        currentFile={currentFile}
        maxFiles={maxFiles}
        disabled={disabled}
      />
      <p className="text-xs text-secondary-300">
        {description}
      </p>
    </div>
  );
};

export default FileUploadSection;
