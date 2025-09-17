import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';

const getConversationMessages = async (
  conversationId: string,
) => {
  const { data } = await API.get(`/conversations/${conversationId}`);
  const { conversation } = data || {};
  return {
    messages: conversation?.messages || [],
    participants: conversation?.participants || [],
  };
};

export const useConversationMessages = (
  conversationId: string,

) => {
  return useQuery({
    queryKey: ['conversationMessages', conversationId],
    queryFn: () => getConversationMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 60000,
  });
};
