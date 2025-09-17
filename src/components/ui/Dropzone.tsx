'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { LuUpload } from 'react-icons/lu';

type DropzoneProps = {
  onDrop: (files: File[]) => void;
  accept?: { [key: string]: string[] };
  maxFiles?: number;
  currentFile?: File | string | { file: string; filename: string; type: string };
  supportedFormats?: readonly string[]; // Customizable supported formats
  disabled?: boolean;
};

const DEFAULT_SUPPORTED_FORMATS = ['JPEG', 'PNG', 'JPG', 'GIF', 'WEBP']; // Default formats

const Dropzone: React.FC<DropzoneProps> = ({
  onDrop,
  accept,
  maxFiles = 1,
  currentFile,
  supportedFormats = DEFAULT_SUPPORTED_FORMATS, // Default formats
  disabled = false,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept || { 'image/*': supportedFormats.map(format => `.${format.toLowerCase()}`) },
    maxFiles,
    onDrop: (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all
        ${disabled
      ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-50'
      : `cursor-pointer hover:bg-secondary-100 ${currentFile ? 'border-success bg-light-success' : 'border-gray-300'}`
    }`}
    >
      <input {...getInputProps()} />
      <div className="flex justify-center gap-2">
        <LuUpload className="mb-1 size-4 text-gray-400" />
        <p className="mb-0.5 text-sm text-gray-500 md:text-xs xl:text-sm">
          {isDragActive ? 'Drop the file here' : currentFile ? 'File selected' : 'Drag & drop or click to select a file'}
        </p>
      </div>
      <p className="text-xs text-gray-400">
        Supported formats:
        {' '}
        {supportedFormats.join(', ')}
      </p>
      {currentFile && (
        <p className="mt-1 text-sm text-success">
          {currentFile instanceof File
            ? currentFile.name
            : typeof currentFile === 'object' && 'filename' in currentFile
              ? currentFile.filename
              : typeof currentFile === 'string'
                ? currentFile.split('/').pop()?.replace(/^.*?_/, '') || currentFile
                : ''}
        </p>
      )}
    </div>
  );
};

export default Dropzone;
