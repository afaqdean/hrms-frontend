'use client';

import type { Leave } from '@/interfaces/Leave';
import ModalUI from '@/components/Modal';
import NoMessagesFound from '@/components/shared/pop-ups/NoMessagesFound';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useConversation } from '@/hooks/useConversation';
import { useLeaveActions } from '@/hooks/useLeaveActions';
import { useMessages } from '@/hooks/useMessages';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useState } from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { LuClock5, LuMessageCircleMore } from 'react-icons/lu';
import { MdClose } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import ViewLeaveApplication from '../../shared/pop-ups/ViewLeaveApplication';

type EmployeeLeaveCardProps = {
  leave: Leave;
};

const EmployeeLeaveCard: React.FC<EmployeeLeaveCardProps> = ({ leave }) => {
  const { userData } = useAuth();

  const [viewApplicationModalOpen, setViewApplicationModalOpen] = useState<boolean>(false);
  const [conversationDrawerOpen, setCoversationDrawerOpen] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const { sendMessageMutation } = useMessages(activeConversationId || '');
  const { conversation, conversationMessagesLoading, chatContainerRef, scrollAnchorRef } = useConversation(activeConversationId || '');
  const { handleApprove, handleReject, isApproving, isRejecting } = useLeaveActions(leave, () => {});

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversationId) {
      return;
    }
    setMessage('');
    const messageContent = message;
    try {
      await sendMessageMutation.mutateAsync(messageContent);
    } catch (error) {
      console.error('Error Sending Message:', error);
    }
  };

  return (
    <div className="my-2 h-full rounded-md bg-white p-2 md:h-auto md:p-4">
      <div className="mb-4 rounded-lg border border-gray-200 p-2 md:p-3 xl:p-4">
        {/* Leave type and duration */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex flex-col gap-1 md:flex-row md:items-center  md:gap-0">
            {/* Dynamic leave type badge */}
            <span
              className={`${
                leave?.type.toLowerCase() === 'sick'
                  ? 'bg-[#2196F3]'
                  : leave?.type.toLowerCase() === 'casual'
                    ? 'bg-danger'
                    : 'bg-success'
              } flex w-28 items-center justify-center rounded p-1 text-xs text-white md:w-auto  md:px-2 md:py-1 md:text-sm`}
            >
              {leave?.type.charAt(0).toUpperCase() + leave?.type.slice(1)}
              {' '}
              Leave
            </span>

            {/* Leave count and date range */}
            <span className="hidden text-xs text-primary-100 md:ml-2 md:inline md:text-sm">
              {leave?.leaveCount}
              {' '}
              {leave?.leaveCount !== 1 ? 'Leaves' : 'Leave'}
              {' '}
              |
              {' '}
              {leave?.date}
              <span className={`${leave.leaveCount !== 1 ? 'inline' : 'hidden'}`}>
                {' '}
                -
                {leave?.dateEnd}
              </span>
            </span>
          </div>

          {/* Leave status and view details button */}
          <div className="flex items-center">
            {leave?.status === 'Approved'
              ? (
                  <span className="flex items-center gap-4">
                    <span className="flex items-center justify-center gap-1 rounded-full bg-light-success px-2 py-1 text-sm text-success md:px-4 md:py-2 md:text-base  ">
                      <FaCheck />
                      Approved
                    </span>
                    <BsArrowUpRightCircle
                      onClick={() => setViewApplicationModalOpen(true)}
                      className=" size-5 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-150 hover:text-black"
                    />
                  </span>
                )
              : leave?.status === 'Pending'
                ? (
                    <span className="flex items-center gap-4">
                      <span className="flex items-center justify-center gap-1 rounded-full bg-light-warning px-2 py-1 text-sm text-warning md:px-4 md:py-2 md:text-base">
                        <LuClock5 />
                        Pending
                      </span>
                      <BsArrowUpRightCircle
                        onClick={() => setViewApplicationModalOpen(true)}
                        className="size-5 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-150 hover:text-black"
                      />
                    </span>
                  )
                : (
                    <span className="flex items-center gap-4">
                      <span className="flex items-center justify-center gap-1 rounded-full bg-light-danger px-2 py-1 text-sm text-danger md:px-4 md:py-2 md:text-base">
                        <RxCross1 />
                        Rejected
                      </span>
                      <BsArrowUpRightCircle
                        onClick={() => setViewApplicationModalOpen(true)}
                        className="size-5 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-150 hover:text-black"
                      />
                    </span>
                  )}
          </div>
        </div>

        {/* Leave details section */}
        <div className="flex flex-col items-start gap-2 rounded-lg md:flex-row md:items-center md:p-4">
          <span className="text-sm text-primary-100 md:hidden">
            Message:
          </span>
          {/* Leave start date display */}
          <span className="hidden flex-col items-center justify-center rounded-lg bg-secondary-100 px-4 py-2 text-primary-100 md:flex ">
            <span className="text-lg font-medium">{new Date(leave.date).getDate()}</span>
            <span className="text-base">
              {new Date(leave?.date).toLocaleString('default', { month: 'long' })}
            </span>
          </span>

          {/* Leave reason display */}
          <div className="w-full rounded-md border border-gray-200 p-4">
            <p className="max-w-full overflow-hidden whitespace-pre-wrap break-words text-sm text-gray-600">{leave?.reason}</p>
          </div>
        </div>
        <div className="mt-2 md:hidden">
          <div className="mt-4 flex items-center gap-2">
            <Button
              className="w-full rounded-full bg-light-danger text-danger hover:bg-danger hover:text-white"
              onClick={(e) => {
                e.preventDefault();
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
            <SheetContent
              side="bottom"
              className="mx-auto max-h-[80vh] w-full max-w-full p-0 "
            >
              <div className="flex size-full flex-col">
                {/* Header */}
                <div className=" bg-secondary-100 p-4">
                  <h4 className="text-base font-medium text-primary-100">Conversation:</h4>
                </div>

                {/* Chat Content */}
                <div
                  ref={chatContainerRef}
                  className={` max-h-96 overflow-y-scroll border-[#F1F1F1] bg-[#FAFAFA] ${conversation?.messages?.length === 0 ? 'px-0' : 'scrollbar px-4'}`}
                >
                  {
                    conversationMessagesLoading
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
                              conversation?.messages.map((chat: any) => (
                                <div
                                  key={chat.content + chat.timestamp}
                                  className={`
                                        mt-4 max-w-[70%] rounded-lg border-[#F1F1F1] p-2
                                        ${chat.senderId._id === userData?.id
                                  ? 'ml-auto bg-[#F3F3F3] text-left'
                                  : 'mr-auto bg-white text-left'}
                                      `}
                                >
                                  <div className="flex items-center gap-2">
                                    <Image src={chat?.senderId?.profileImage} alt="profile-pic" height={32} width={32} className="rounded-full" />
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

                            )
                  }
                  {/* Show "Chat Closed" message if leave is approved or rejected */}
                  {!conversationMessagesLoading && (leave?.status === 'Approved' || leave?.status === 'Rejected') && (
                    <div className="mt-4 flex justify-center pb-10">
                      <div className="rounded-lg bg-[#F0F2F5] px-6 py-3 text-center shadow-sm">
                        <div className="flex items-center justify-center gap-2">
                          <div className="size-1 rounded-full bg-gray-400"></div>
                          <p className="text-xs font-medium text-gray-500 md:text-sm">
                            This conversation has ended
                          </p>
                          <div className="size-1 rounded-full bg-gray-400"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollAnchorRef} />
                </div>

                {/* Message Input Section */}
                {leave.status !== 'Approved' && leave.status !== 'Rejected' && (
                  <div className="relative   flex w-full items-center border-t border-[#F1F1F1] bg-white p-2">
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
                )}
              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>

      {/* Leave application details modal */}
      {viewApplicationModalOpen && (
        <ModalUI
          handleClose={() => setViewApplicationModalOpen(false)}
          handleOpen={() => setViewApplicationModalOpen(true)}
          isOpen={viewApplicationModalOpen}
        >
          <ViewLeaveApplication leaveData={leave} onClose={() => setViewApplicationModalOpen(false)} />
        </ModalUI>
      )}
    </div>
  );
};

export default EmployeeLeaveCard;
