import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useConversation } from '@/hooks/useConversation';
import useLeavesForEmployee from '@/hooks/useLeavesForEmployee';
import { getLeaveTypeBackground, getLeaveTypeIcon, getStatusColorClasses, getStatusIcon } from '@/hooks/useLeaveStyles';
import { useMessages } from '@/hooks/useMessages';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import leaveHistoryNotFound from 'public/assets/leave-history-record-not-found.png';
import React, { useMemo, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { LuMessageCircleMore } from 'react-icons/lu';
import { MdOutlineCalendarMonth, MdOutlineFileDownload } from 'react-icons/md';
import Avatar from '../avatars/avatar/Avatar';
import NoMessagesFound from '../pop-ups/NoMessagesFound';

type MobileLeavesHistoryType = {
  isAdmin?: boolean;
  typeFilter: string;
  statusFilter: string;
};

const MobileLeavesHistory: React.FC<MobileLeavesHistoryType> = ({ typeFilter, statusFilter }) => {
  const { userData } = useAuth();
  const [conversationDrawerOpen, setCoversationDrawerOpen] = useState<boolean>(false);
  const { Leaves, isLoading } = useLeavesForEmployee();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { conversation, conversationMessagesLoading, chatContainerRef, scrollAnchorRef } = useConversation(activeConversationId || '');
  const { sendMessageMutation } = useMessages(activeConversationId || '');

  const filteredLeaveData = useMemo(() => {
    let filteredData = [...(Leaves || [])];

    if (typeFilter && typeFilter !== 'All') {
      filteredData = filteredData.filter((l) => {
        const leaveTypeLower = l.leaveType.toLowerCase();
        const filterTypeLower = typeFilter.toLowerCase();

        return (
          leaveTypeLower === filterTypeLower
          // Handle Casual Leave cases
          || (filterTypeLower === 'casual leave' && leaveTypeLower === 'casual')
          // Handle Sick Leave cases
          || (filterTypeLower === 'sick leave' && leaveTypeLower === 'sick')
          // Handle Annual Leave cases
          || (filterTypeLower === 'annual leave' && leaveTypeLower === 'annual')
        );
      });
    }

    if (statusFilter && statusFilter !== 'All') {
      filteredData = filteredData.filter(l => l.status === statusFilter);
    }

    return filteredData;
  }, [Leaves, typeFilter, statusFilter]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversationId) {
      return;
    }
    try {
      setMessage(''); // Immediately clear the message as user clicks send
      const messageContent = message;
      await sendMessageMutation.mutateAsync(messageContent);
    } catch (error) {
      console.error('Error Sending Message:', error);
    }
  };

  return (
    <div className="h-full rounded-lg md:hidden">
      {isLoading
        ? (
            <div className="flex size-full items-center justify-center text-lg font-semibold text-secondary-300">
              Loading
            </div>
          )
        : filteredLeaveData.length > 0
          ? (
              <Accordion type="single" collapsible className="w-full">
                {[...filteredLeaveData].map(entry => (
                  <AccordionItem className="my-3 rounded-lg bg-white" key={entry._id} value={entry._id}>
                    <AccordionTrigger className="flex w-full items-center justify-between rounded-lg border p-4 no-underline">
                      <div className="flex w-full items-center gap-2">
                        <Avatar
                          className={getLeaveTypeBackground(entry.leaveType)}
                          icon={getLeaveTypeIcon(entry.leaveType)}
                        />
                        <span className="text-xs text-primary-100">{entry.leaveType}</span>
                        <span className="text-xs text-secondary-300">
                          {entry.leaveCount}
                          {' '}
                          {`${entry.leaveCount !== 1 ? 'Leaves' : 'Leave'}`}
                        </span>
                        <span className={`flex items-center justify-center gap-0.5 rounded-full px-2 py-1 text-xs ${getStatusColorClasses(entry.status)}`}>
                          <span>{getStatusIcon(entry.status)}</span>
                          <span>{entry.status}</span>
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <div>
                        <p className="flex items-center justify-between text-sm">
                          <span className="font-normal text-primary-100">Submission Date: </span>
                          <span className="flex items-center text-sm text-secondary-300">
                            <span className="flex gap-1 text-xs">
                              <MdOutlineCalendarMonth />
                              <span>
                                {new Date(entry.startDate).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </span>
                          </span>
                        </p>
                        <p className="flex items-center justify-between text-sm">
                          <span className="font-normal text-primary-100">
                            <span>Leave </span>
                            {`${entry.leaveCount !== 1 ? 'Dates: ' : 'Date: '}`}
                          </span>
                          <span className="flex gap-1 text-xs text-secondary-300">
                            <MdOutlineCalendarMonth />
                            <span>
                              {new Date(entry.startDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            {' '}
                            <span className={`${entry.leaveCount !== 1 ? 'inline' : 'hidden'}`}>
                              -
                              <span>
                                {' '}
                                {new Date(entry.endDate).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </span>
                          </span>
                        </p>

                        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-[#F1F1F1] p-3 text-sm">
                          <span className="font-normal text-primary-100">Message:</span>
                          <p className="text-secondary-300">{entry.reason}</p>
                          {/* Attachment Section */}
                          {entry.attachmentUrl && (
                            <>
                              <p className="text-sm text-primary-100">Attachment:</p>
                              <p className="flex items-center gap-1 text-sm text-secondary-300">
                                <IoDocumentTextOutline className="size-4" />
                                <span>{entry.leaveType}</span>
                                <Link
                                  href={entry.attachmentUrl}
                                  download={entry.attachmentUrl.split('/').slice(-1)[0]?.split('_')?.slice(-1)[0]}
                                >
                                  <MdOutlineFileDownload className="size-6 hover:text-black" />
                                </Link>
                              </p>
                            </>
                          )}
                        </div>

                        <Button
                          variant="default"
                          className="my-4 w-full"
                          onClick={() => {
                            setActiveConversationId(entry.conversationId);
                            setCoversationDrawerOpen(true);
                          }}
                        >
                          <LuMessageCircleMore />
                          Message
                        </Button>

                        <Sheet open={conversationDrawerOpen} onOpenChange={setCoversationDrawerOpen}>
                          <SheetContent side="bottom" className="mx-auto max-h-[80vh] w-full max-w-full p-0">
                            <div className="flex size-full flex-col">
                              {/* Header */}
                              <div className="bg-secondary-100 p-4">
                                <h4 className="text-base font-medium text-primary-100">Conversation:</h4>
                              </div>

                              {/* Chat Content */}
                              <div
                                ref={chatContainerRef}
                                className="scrollbar flex max-h-96 flex-col overflow-y-auto border-[#F1F1F1] bg-[#FAFAFA] px-4"
                              >
                                {conversationMessagesLoading
                                  ? (
                                      <div className="flex flex-1 items-center justify-center">
                                        <span className="text-secondary-400">Loading conversation...</span>
                                      </div>
                                    )
                                  : !conversation || !conversation.messages || conversation.messages.length === 0
                                      ? (
                                          <NoMessagesFound />
                                        )
                                      : (
                                          conversation.messages.map((chat: any) => (
                                            <div
                                              key={chat.content + chat.timestamp}
                                              className={`mt-4 max-w-[70%] rounded-lg border-[#F1F1F1] p-2 ${
                                                chat.senderId._id === userData?.id
                                                  ? 'ml-auto bg-[#F3F3F3] text-left'
                                                  : 'mr-auto bg-white text-left'
                                              }`}
                                            >
                                              <div className="flex items-center gap-2">
                                                <Image
                                                  src={chat?.senderId?.profileImage}
                                                  alt="profile-pic"
                                                  height={32}
                                                  width={32}
                                                  className="rounded-full"
                                                />
                                                <div className="flex flex-col text-xs">
                                                  <p>{chat.senderId?.name}</p>
                                                  <p className="text-secondary-300">{format(new Date(chat.timestamp), 'hh:mm a')}</p>
                                                </div>
                                              </div>
                                              <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-xs text-secondary-300">
                                                {chat.content}
                                              </p>
                                            </div>
                                          ))
                                        )}
                                <div ref={scrollAnchorRef} />
                              </div>

                              {/* Message Input Section */}
                              <div className="relative flex w-full items-center border-t border-[#F1F1F1] bg-white p-3">
                                <Textarea
                                  value={message}
                                  onChange={e => setMessage(e.target.value)}
                                  className="hide-scrollbar min-h-[10px] flex-1 resize-none border border-gray-300 pr-10 text-sm shadow-none focus-visible:ring-0"
                                  placeholder="Your Reply..."
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSendMessage();
                                    }
                                  }}
                                />
                                <div className="absolute right-6 top-1/2 flex -translate-y-1/2 items-center">
                                  <Button
                                    variant="outline"
                                    className="border-none p-2"
                                    disabled={sendMessageMutation.isPending || !message.trim()}
                                    onClick={handleSendMessage}
                                  >
                                    <IoMdSend className="size-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )
          : (
              <div className="flex h-full flex-col items-center justify-center bg-secondary-100 xl:h-[55vh]">
                <Image src={leaveHistoryNotFound} alt="no-record-found" height={130} width={151} />
                <p className="mt-2 text-center text-sm text-secondary-400">
                  Uh-oh! It seems there are no leave history records to display here
                </p>
              </div>
            )}
    </div>
  );
};

export default MobileLeavesHistory;
