'use client';

import ModalUI from '@/components/Modal';
import NoMessagesFound from '@/components/shared/pop-ups/NoMessagesFound';
import ViewLeaveApplication from '@/components/shared/pop-ups/ViewLeaveApplication';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useConversation } from '@/hooks/useConversation';
import { useLeaveActions } from '@/hooks/useLeaveActions';
import { useMessages } from '@/hooks/useMessages';
import { API } from '@/Interceptors/Interceptor';
import { useQuery } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import Image from 'next/image';
import React, { useState } from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { LuMessageCircleMore } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';

const fetchApprovedLeaves = async () => {
  // Get tomorrow's date
  const tomorrow = addDays(new Date(), 1);
  const startDate = format(tomorrow, 'yyyy-MM-dd');

  // Get date 30 days from tomorrow
  const endDate = format(addDays(tomorrow, 30), 'yyyy-MM-dd');

  const { data } = await API.get(`/leave?status=Approved&startDate=${startDate}&endDate=${endDate}`);
  return data?.leaves;
};

const ShowUpcomingLeaves = ({ onClose }: { onClose: () => void }) => {
  const { userData } = useAuth();
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [viewLeaveApplicationModal, setViewLeaveApplicationModal] = useState<boolean>(false);
  const [message, setMessage] = useState('');
  const [conversationDrawerOpen, setCoversationDrawerOpen] = useState<boolean>(false);

  const { conversation, conversationMessagesLoading, chatContainerRef, scrollAnchorRef } = useConversation(activeConversationId || '');
  const { sendMessageMutation } = useMessages(activeConversationId || '');
  const { handleApprove, handleReject, isApproving, isRejecting } = useLeaveActions(selectedLeave, () => {});

  const { data: approvedLeaves, isLoading: approvedLeavesLoading } = useQuery({
    queryKey: ['approvedLeaves'],
    queryFn: fetchApprovedLeaves,
  });

  const handleViewApplication = (leave: any) => {
    setSelectedLeave(leave);
    setViewLeaveApplicationModal(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversationId) {
      return;
    }
    try {
      setMessage('');
      const messageContent = message;
      await sendMessageMutation.mutateAsync(messageContent);
    } catch (error) {
      console.error('Error Sending Message:', error);
    }
  };

  return (
    <div className="scrollbar  w-80   sm:w-96 md:w-[400px]">
      {/* Header Section */}
      <div className="border-b border-gray-100 bg-white py-2 ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Leaves</h2>
            <p className="mt-1 text-sm text-gray-500">
              {approvedLeavesLoading ? 'Loading...' : `${approvedLeaves?.length || 0} approved leave${(approvedLeaves?.length || 0) !== 1 ? 's' : ''} scheduled`}
            </p>
          </div>
        </div>
      </div>
      <div className="scrollbar mt-4 max-h-[60vh] overflow-y-auto rounded-xl bg-gray-100 to-gray-100/50 p-6 px-2  shadow-inner ">
        {approvedLeavesLoading
          ? (
              <div className="flex h-full items-center justify-center">
                <Loader size="sm" withText text="Loading Leave Requests" />
              </div>
            )
          : approvedLeaves.length !== 0
            ? (
                approvedLeaves.map((leave: any) => (
                  <div key={leave._id} className="mb-4 rounded-lg p-2 hover:bg-gray-50 md:p-4">
                    <div className="flex gap-2 md:gap-4">
                      <div className="flex size-12 items-center justify-center overflow-hidden rounded-full">
                        <Image
                          src={leave.employeeId.profileImage}
                          alt="profile-pic"
                          height={48}
                          width={48}
                          className="h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium md:text-base">{leave.employeeId.name}</h3>
                          <p className="text-xs text-gray-600 md:text-sm">
                            Type:
                            {' '}
                            {leave.leaveType}
                            {' '}
                            <span className="">•</span>
                            {' '}
                            <span className="inline">
                              {new Date(leave.startDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                              {new Date(leave.startDate).getTime() !== new Date(leave.endDate).getTime() && (
                                <>
                                  {' - '}
                                  {new Date(leave.endDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                        <BsArrowUpRightCircle
                          className="size-6 cursor-pointer text-primary-100 transition-transform hover:scale-105 hover:text-black md:hover:scale-150"
                          onClick={() => handleViewApplication(leave)}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-4">
                      <div className="hidden flex-col items-center justify-center rounded-lg bg-secondary-100 p-2 text-primary-100 md:flex md:w-1/6 md:justify-start">
                        <span className="text-lg font-medium">
                          {new Date(leave.startDate.split(' ')[0] || leave.startDate).toLocaleDateString('en-GB', { day: '2-digit' })}
                        </span>
                        <span className="text-base">
                          {new Date(leave.startDate).toLocaleDateString('en-GB', { month: 'short' })}
                        </span>
                      </div>
                      <div className="w-full flex-1 rounded-md border border-gray-200 p-4">
                        <p className="max-w-full overflow-hidden whitespace-pre-wrap break-words text-sm text-gray-600">
                          {leave.reason}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 md:hidden">
                      <div className="mt-4 flex items-center gap-2">
                        <Button
                          className="w-full rounded-full bg-light-danger text-danger hover:bg-danger hover:text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedLeave(leave);
                            handleReject(e);
                          }}
                          variant="outline"
                          disabled={isRejecting}
                        >
                          <span className="flex w-full items-center justify-center px-2 py-1 md:px-3 md:py-2">
                            {isRejecting
                              ? (
                                  <>
                                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Rejecting...
                                  </>
                                )
                              : (
                                  <>
                                    <MdClose />
                                    Reject
                                  </>
                                )}
                          </span>
                        </Button>
                        <Button
                          className="w-full rounded-full bg-light-success text-success hover:bg-success hover:text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedLeave(leave);
                            handleApprove(e);
                          }}
                          variant="outline"
                          disabled={isApproving}
                        >
                          <span className="flex w-full items-center justify-center px-2 py-1 md:px-3 md:py-2">
                            {isApproving
                              ? (
                                  <>
                                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Accepting...
                                  </>
                                )
                              : (
                                  <>
                                    <FaCheck />
                                    Approve
                                  </>
                                )}
                          </span>
                        </Button>
                      </div>
                      <Button
                        variant="default"
                        className="my-4 w-full"
                        onClick={() => {
                          if (leave.conversationId) {
                            setActiveConversationId(leave?.conversationId);
                            setCoversationDrawerOpen(true);
                          }
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
                              className="scrollbar max-h-96 overflow-y-scroll border-[#F1F1F1] bg-[#FAFAFA] px-4"
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
                  </div>
                ))
              )
            : (
                <div className="flex h-full items-center justify-center text-base text-secondary-300 md:text-lg xl:text-xl">
                  <p>No Upcoming Leaves</p>
                </div>
              )}
      </div>
      <div className="mt-4">
        <Button variant="secondary" className="w-full" onClick={() => onClose()}>
          Cancel
        </Button>
      </div>
      {/* Leave Application Modal */}
      {viewLeaveApplicationModal && (
        <ModalUI
          handleClose={() => setViewLeaveApplicationModal(false)}
          handleOpen={() => setViewLeaveApplicationModal(true)}
          isOpen={viewLeaveApplicationModal}
        >
          <ViewLeaveApplication
            leaveData={selectedLeave}
            isAdmin
            onClose={() => setViewLeaveApplicationModal(false)}
          />
        </ModalUI>
      )}
    </div>
  );
};

export default ShowUpcomingLeaves;
