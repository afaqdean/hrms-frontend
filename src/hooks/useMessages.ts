import { useAuth } from '@/context/AuthContext';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const { userData } = useAuth();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await API.post(`/conversations/${conversationId}/messages`, {
        content,
      });
      return response.data;
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['conversationMessages', conversationId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['conversationMessages', conversationId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['conversationMessages', conversationId], (old: any) => {
        const optimisticMessage = {
          content: newMessage,
          senderId: {
            _id: userData?.id,
            name: userData?.name,
            profileImage: userData?.profilePic || null,
          },
          timestamp: new Date().toISOString(),
          attachmentUrl: null,
        };
        return {
          ...old,
          messages: [...old.messages, optimisticMessage],
        };
      });

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    onError: (error: Error, _variables: string, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(['conversationMessages', conversationId], context.previousMessages);
      }
      toast.error('Failed to send message');
      console.error('Message send error:', error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['conversationMessages', conversationId] });
    },
  });

  return {
    sendMessageMutation,
  };
};
