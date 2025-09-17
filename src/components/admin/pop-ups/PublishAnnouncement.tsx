import type { Announcement } from '@/interfaces/Annnouncement';
import type { SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useEmployees from '@/hooks/useEmployees';
import { API } from '@/Interceptors/Interceptor';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

// Schema for form validation using Zod
const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  desc: z.string().min(1, 'Description is required'),
  priority: z.string().min(1, 'Announcment priority is required'),
  date: z.string().min(1, 'Date is required'), // Keep as string for form input
  audience: z.string().min(1, 'Target audience is required'),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

type PublishAnnouncementProps = {
  isEditing?: boolean;
  onClose: () => void;
  announcement?: Announcement | null;
};

const createAnnouncement = async (data: AnnouncementForm) => {
  const response = await API.post('/announcement', data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

// Function to update an announcement
const updateAnnouncement = async (id: string, data: AnnouncementForm) => {
  const response = await API.patch(`/announcement/${id}`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

const PublishAnnouncement: React.FC<PublishAnnouncementProps> = ({ onClose, isEditing = false, announcement }) => {
  const queryClient = useQueryClient();
  const { Employees } = useEmployees();

  // Initialize form with default values
  const form = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title || '',
      desc: announcement?.desc || '',
      priority: announcement?.priority || '',
      date: announcement?.date
        ? new Date(announcement.date).toISOString() // Convert to ISO string if it's a Date object
        : new Date().toISOString(), // Default to current date as ISO string      audience: announcement?.audience || '',
    },
  });

  // Mutation for creating/editing announcements
  const mutation = useMutation({
    mutationFn: (data: AnnouncementForm) => {
      if (Employees?.length === 0) {
        return Promise.reject(new Error('No employees available'));
      }
      if (isEditing && announcement) {
        // If editing, call the update function
        return updateAnnouncement(announcement._id, data);
      } else {
        // If creating, call the create function
        return createAnnouncement(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Announcements'] });
      toast.success(
        isEditing
          ? 'Announcement updated successfully'
          : 'Announcement published successfully',
      );
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(
        `Failed to ${isEditing ? 'update' : 'publish'} the announcement. ${
          error.message
        }`,
      );
    },
  });

  const onSubmit: SubmitHandler<AnnouncementForm> = (data) => {
    mutation.mutate(data);
  };
  return (
    <div className="w-64 rounded-2xl md:w-[40vw]">
      <h1 className="text-base font-medium text-primary-100">
        {isEditing ? 'Edit Announcement' : 'Create Announcement'}
      </h1>
      <hr className="mt-2 xxl:mt-4" />

      <div className="mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter announcement title" className="w-full text-sm text-primary-100 md:text-sm" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="w-full resize-none bg-secondary-100 text-sm text-primary-100 placeholder:text-secondary-400"
                      {...field}
                      placeholder="Enter announcement description"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="flex w-full justify-between bg-secondary-100 text-sm">
                        <SelectValue placeholder="Select Announcment Prioirty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Date Input */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      className="w-full cursor-pointer flex-col bg-secondary-100 text-sm text-primary-100 md:text-sm"
                      {...field}
                      value={
                        new Date(field.value).toISOString().split('T')[0]
                      } // Ensure proper format for input type="date"
                      onChange={(e) => {
                        const formattedDate = new Date(e.target.value).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        });
                        field.onChange(formattedDate);
                      }}
                      onClick={(e) => {
                        // Ensure the date picker opens when clicking anywhere on the input
                        (e.target as HTMLInputElement).showPicker();
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="flex w-full justify-between bg-secondary-100 text-sm">
                        <SelectValue placeholder="Select Audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Employee">All Employees</SelectItem>
                      <SelectItem value="Admin">All Admins</SelectItem>

                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4 w-full" disabled={mutation.isPending}>
              {mutation.isPending
                ? isEditing
                  ? 'Updating...' // Show "Updating..." when editing
                  : 'Publishing...' // Show "Publishing..." when creating
                : isEditing
                  ? 'Update' // Show "Update" when not loading and editing
                  : 'Publish'}

              {/* Show "Publish" when not loading and creating */}

            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PublishAnnouncement;
