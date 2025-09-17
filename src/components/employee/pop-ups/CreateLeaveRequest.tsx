import type { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import Dropzone from '@/components/ui/Dropzone';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type LeaveFormData, leaveSchema } from '@/containers/types';
import { API } from '@/Interceptors/Interceptor';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// Type for LeaveRequest Component
type CreateLeaveRequestProps = {
  onClose: () => void;
};

// Function to handle API submission
const createLeaveRequest = async (data: FormData) => {
  const response = await API.post('/leave', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

const CreateLeaveRequest: React.FC<CreateLeaveRequestProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [fileName, setFileName] = useState<string>('No Attachment');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const router = useRouter();

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: '',
      startDate: new Date(),
      endDate: new Date(),
      reason: '',
      attachment: undefined,
    },
  });

  // Calculate leave days
  const calculateLeaveDays = (startDate: Date, endDate: Date): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return 0;
    }

    const timeDifference = end.getTime() - start.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates

    return daysDifference;
  };

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const leaveDays = calculateLeaveDays(startDate, endDate);

  const mutation = useMutation({
    mutationFn: async (data: LeaveFormData) => {
      const formData = new FormData();
      formData.append('leaveType', data.leaveType);
      formData.append('startDate', new Date(data.startDate).toISOString()); // Convert to ISO string
      formData.append('endDate', new Date(data.endDate).toISOString()); // Convert to ISO string
      formData.append('reason', data.reason);
      if (data.attachment) {
        formData.append('attachment', data.attachment);
      }
      return createLeaveRequest(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Leave request created successfully!');
      // queryClient.invalidateQueries({ queryKey: ['Leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardLeaveRequests'] });
      form.reset();
      setFileName('No Attachment');
      onClose();
      router.push('/dashboard/employee/leaves-history');
    },
    onError: (error: AxiosError) => {
      // Display the specific error message from the backend
      const errorMessage = (error.response?.data as any)?.message || 'Something went wrong';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: LeaveFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="rounded-2xl max-md:w-72 md:w-[50vw]">
      <h2 className="mb-4 text-center text-xl font-semibold">Apply for Leave</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 xl:space-y-1">
          <div className="scrollbar space-y-4 overflow-auto py-2  max-md:max-h-[60vh] md:space-y-1 md:overflow-visible">
            {/* Leave Type Dropdown */}
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-secondary-300 md:text-base">Leave Type</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-secondary-100">
                        <SelectValue placeholder="Select Leave Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Casual">Casual Leave</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Annual">Annual Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date & End Date Inputs */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-secondary-300 md:text-base">Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={e => field.onChange(new Date(e.target.value))}
                        className="cursor-pointer flex-col text-sm md:text-sm"
                        onClick={(e) => {
                          e.currentTarget.showPicker();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-secondary-300 md:text-base">End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={e => field.onChange(new Date(e.target.value))}
                        className="cursor-pointer flex-col text-sm md:text-sm"
                        onClick={(e) => {
                          e.currentTarget.showPicker();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Leave Days Counter */}
            <FormItem>
              <FormLabel className="text-sm text-secondary-300 md:text-sm">
                Leave Count:
                {' '}
                <span className="text-sm text-primary md:text-base">
                  {leaveDays}
                </span>
              </FormLabel>

            </FormItem>

            {/* File Upload Input for Attachment */}
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-secondary-300 md:text-base">Add Attachment</FormLabel>
                  <FormControl>
                    <Dropzone
                      onDrop={(files) => {
                        if (files.length > 0) {
                          const file = files[0];
                          if (file) { // Add null check
                            setSelectedFile(file);
                            field.onChange(file);
                            setFileName(file.name);
                          }
                        }
                      }}
                      currentFile={selectedFile || field.value}
                      supportedFormats={['PDF', 'DOC', 'DOCX']}
                      accept={{
                        'application/pdf': ['.pdf'],
                        'application/msword': ['.doc'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                      }}
                      maxFiles={1}
                    />
                  </FormControl>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    Selected File:
                    {' '}
                    {fileName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">Accepted file types: PDF, Word, JPG</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Textarea for Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-secondary-300 md:text-base">Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="resize-none bg-secondary-100 text-sm focus:outline-none focus:ring-0 md:text-sm"
                      {...field}
                      placeholder="Tell us in words here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          {/* Submit Button */}
          <Button type="submit" disabled={mutation.isPending} className="mt-4 w-full">
            {mutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateLeaveRequest;
