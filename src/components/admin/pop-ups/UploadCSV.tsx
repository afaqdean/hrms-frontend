'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useEmployees from '@/hooks/useEmployees';
import { processCSVFile } from '@/hooks/useProcessFile';
import { useUploadAttendance } from '@/hooks/useUploadAttendance';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

type UploadCSVProps = {
  onCloseAction: () => void;
};

export const UploadCSV: React.FC<UploadCSVProps> = ({ onCloseAction }) => {
  const { Employees } = useEmployees();
  const { upload } = useUploadAttendance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [lastUploadInfo, setLastUploadInfo] = useState<{
    fileName: string;
    uploadTime: string;
  } | null>(null);

  // React Query mutation for CSV upload
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (files.length === 0) {
        throw new Error('Please select at least one CSV file');
      }

      if (!Employees || Employees.length === 0) {
        throw new Error('There are no employees for which the data can be uploaded.');
      }

      const uploadResults: { fileName: string; uploadTime: string }[] = [];

      for (const file of files) {
        try {
          const formattedData = await new Promise<any>((resolve, reject) => {
            processCSVFile(
              file,
              data => resolve(data),
              error => reject(error),
            );
          });

          await upload(formattedData);

          uploadResults.push({
            fileName: file.name,
            uploadTime: new Date().toISOString(),
          });
        } catch (error: any) {
          throw new Error(`Error processing ${file.name}: ${error.message}`);
        }
      }

      return uploadResults;
    },
    onSuccess: (uploadResults) => {
      if (uploadResults.length > 0) {
        const last = uploadResults[uploadResults.length - 1];
        localStorage.setItem('lastCSVUpload', JSON.stringify(last));
        toast.success(selectedFiles.length === 1 ? 'File uploaded successfully' : 'All files uploaded successfully');

        // Refresh state from localStorage to make sure it's set before modal closes
        const stored = localStorage.getItem('lastCSVUpload');
        if (stored) {
          try {
            setLastUploadInfo(JSON.parse(stored));
          } catch {}
        }
      }
      onCloseAction();
    },
    onError: (error: any) => {
      toast.error(`Upload process failed: ${error.message}`);
      console.error('Upload process failed:', error);
    },
  });

  useEffect(() => {
    const savedUploadInfo = localStorage.getItem('lastCSVUpload');
    if (savedUploadInfo) {
      try {
        const parsed = JSON.parse(savedUploadInfo);
        setLastUploadInfo(parsed);
      } catch (error) {
        console.error('Error parsing saved upload info:', error);
        setLastUploadInfo(null);
      }
    }
  }, []);

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleUpload = async () => {
    uploadMutation.mutate(selectedFiles);
  };

  return (
    <div className="w-72 space-y-4 sm:w-96 md:w-auto md:space-y-6">
      <h1 className="text-sm font-medium text-primary-100 md:text-base">Upload a CSV File</h1>
      <p className="text-sm font-normal text-secondary-300 md:text-base">
        The CSV file must include the following columns:
        {' '}
        <strong className="text-xs font-medium text-primary-100 md:text-sm">
          Employee ID, Date, Time In, Time Out, Break Start, Break End
        </strong>
      </p>

      <div className="space-y-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileSelection}
          className="cursor-pointer"
        />

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary-100">Selected Files:</p>
            <ul className="space-y-1">
              {selectedFiles.map(file => (
                <li key={`${file.name}-${file.size}-${file.lastModified}`} className="text-sm text-secondary-300">
                  {file.name}
                  {' '}
                  (
                  {(file.size / 1024).toFixed(2)}
                  {' '}
                  KB)
                </li>
              ))}
            </ul>
          </div>
        )}

        {lastUploadInfo && (
          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-sm text-green-800">
              <strong>Last Upload:</strong>
              {' '}
              {lastUploadInfo.fileName}
            </p>
            <p className="text-xs text-green-600">
              {new Date(lastUploadInfo.uploadTime).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCloseAction}
          disabled={uploadMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploadMutation.isPending}
          className="bg-primary-100 text-white hover:bg-black"
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      {uploadMutation.isPending && (
        <div className="text-center">
          <div className="inline-block size-6 animate-spin rounded-full border-2 border-primary-100 border-t-transparent"></div>
          <p className="mt-2 text-sm text-secondary-300">Processing files...</p>
        </div>
      )}
    </div>
  );
};
