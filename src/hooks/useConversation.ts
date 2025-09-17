import { useConversationMessages } from '@/hooks/useConversationMessages';
import React, { useEffect, useRef } from 'react';

export const useConversation = (conversationId: string) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const { data: conversationMessages, isLoading: conversationMessagesLoading } = useConversationMessages(conversationId);

  const conversation = React.useMemo(() => {
    if (conversationMessages) {
      return {
        messages: conversationMessages.messages.map((message: any) => ({
          attachmentUrl: message.attachmentUrl,
          content: message.content,
          senderId: message.senderId,
          timestamp: message.timestamp,
        })),
        participants: conversationMessages.participants,
      };
    }
    return null;
  }, [conversationMessages]);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages?.length, conversationMessagesLoading]);

  return {
    conversation,
    conversationMessagesLoading,
    chatContainerRef,
    scrollAnchorRef,
  };
};
