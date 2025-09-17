import { ToastStyle } from '@/components/ToastStyle';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/Loader';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useConversation } from '@/hooks/useConversation';
import { useLeaveActions } from '@/hooks/useLeaveActions';
import { getLeaveTypeBackground, getLeaveTypeIcon, getStatusColorClasses, getStatusIcon } from '@/hooks/useLeaveStyles';
import { useMessages } from '@/hooks/useMessages';
import { API } from '@/Interceptors/Interceptor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import messagesNotFound from 'public/assets/messagesNotFound.png';
import React, { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { FaCheck } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { LuClock5 } from 'react-icons/lu';
import { MdClose, MdOutlineFileDownload } from 'react-icons/md';
import { toast } from 'react-toastify';
import Avatar from '../avatars/avatar/Avatar';

type ViewLeaveApplicationProps = {
  leaveData?: any;
  onClose: () => void;
  isAdmin?: boolean;
};

const NoMessagesFound = () => (
  <div className="flex w-full flex-col items-center justify-center bg-secondary-100 p-4 xl:h-[49vh]">
    <Image src={messagesNotFound} alt="no-record-found" height={72} width={72} />
    <p className="mt-2 text-center text-sm text-secondary-400">
      No messages yet. Start a conversation to see your chats here
    </p>
  </div>
);

const ViewLeaveApplication: React.FC<ViewLeaveApplicationProps> = ({
  leaveData,
  onClose,
}) => {
  const { userData } = useAuth();
  const [message, setMessage] = useState('');
  const conversationId = leaveData?.conversationId;
  const { conversation, conversationMessagesLoading, chatContainerRef, scrollAnchorRef } = useConversation(conversationId);
  const { sendMessageMutation } = useMessages(conversationId);
  const { handleApprove, handleReject, isApproving, isRejecting } = useLeaveActions(leaveData, onClose);
  const queryClient = useQueryClient();

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const { data } = await API.delete(`/leave/${leaveData._id}`);
      return data;
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['dashboardLeaveRequests'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['Leaves'] });
      queryClient.invalidateQueries({ queryKey: ['Employees'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });

      toast.success(
        `Leave Request has been withdrawn Successfully`,
        ToastStyle,
      );
      onClose();
    },
    onError: (error) => {
      console.error('Error withdrawing leave:', error);
      toast.error(
        `Error withdrawing leave: ${error.message}`,
        ToastStyle,
      );
    },
  });

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync();
    } catch (error) {
      console.error('Error withdrawing leave:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    setMessage(''); // Immediately clear the message as user clicks send
    const messageContent = message;
    try {
      await sendMessageMutation.mutateAsync(messageContent);
    } catch (error) {
      console.error('Error Sending Message:', error);
    }
  };

  if (!leaveData) {
    return null;
  }

  return (
    <div className="w-72 rounded-2xl sm:w-96 md:h-[70vh] md:w-[50vw] xxl:w-[55vw]">
      {/* Header - Leave Type and Icon */}
      <div className="flex items-center gap-2">
        <Avatar icon={getLeaveTypeIcon(leaveData?.leaveType)} className={getLeaveTypeBackground(leaveData?.leaveType)} />
        <span className="text-base font-normal text-primary-100">
          {leaveData?.leaveType}
          {' '}
          Leave: Application
        </span>
      </div>

      <hr className="my-4 border-[#F1F1F1]" />

      {/* Main Container */}
      <div className="flex gap-4">
        {/* Left Section - Leave Details */}
        <div className="w-full md:h-3/4 md:w-1/2">
          <div className="space-y-4">
            {/* Submission Date */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-primary-100 md:text-sm">Submission Date:</p>
              <p className="flex items-center gap-2 text-xs text-secondary-300 md:text-sm">
                <CiCalendar />
                <span>
                  {new Date(leaveData?.startDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </p>
            </div>

            {/* Submission Time */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-primary-100 md:text-sm">Submission Time:</p>
              <p className="flex items-center gap-2 text-xs text-secondary-300 md:text-sm">
                <LuClock5 />
                <span>
                  {new Date(leaveData?.createdAt || leaveData?.startDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </p>
            </div>

            {/* Total Leave Count */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-primary-100 md:text-sm">Total Leaves:</p>
              <p className="text-xs text-secondary-300 md:text-sm">
                {leaveData?.leaveCount}
                {' '}
                {`${leaveData?.leaveCount !== 1 ? 'Leaves' : 'Leave'}`}
              </p>
            </div>

            {/* Leave Dates */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-primary-100 md:text-sm">Leave Dates:</p>
              <p className="text-xs text-secondary-300 md:text-sm">
                <span>
                  {new Date(leaveData?.startDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {/* Only show end date if it's different from start date */}
                {new Date(leaveData?.startDate).toDateString() !== new Date(leaveData?.endDate).toDateString() && (
                  <>
                    -
                    {' '}
                    <span>
                      {new Date(leaveData?.endDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Leave Status */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-primary-100 md:text-sm">Leave Status:</p>
              <span
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm ${getStatusColorClasses(
                  leaveData.status,
                )}`}
              >
                {getStatusIcon(leaveData.status)}
                {leaveData.status}
              </span>
            </div>
          </div>

          {/* Leave Reason and Attachment */}
          <div className="mt-4 rounded-lg border border-[#F1F1F1] p-2 md:p-4">
            <p className="text-xs text-primary-100 md:text-sm">Message:</p>
            <p className="mt-2 max-w-full overflow-hidden break-words text-xs text-secondary-300 md:mt-4 md:text-sm">
              {leaveData?.reason}
            </p>

            {/* Attachment Section */}
            {leaveData?.attachmentUrl && (
              <>
                <p className="my-4 text-xs text-primary-100 md:text-sm">Attachment:</p>
                <p className="flex items-center gap-1 text-xs text-secondary-300 md:text-sm">
                  <IoDocumentTextOutline className="size-4" />
                  <span className="text-xs md:text-sm">{leaveData.leaveType}</span>
                  <Link
                    href={leaveData.attachmentUrl}
                    download={leaveData.attachmentUrl.split('_').pop()}
                    className="cursor-pointer"
                  >
                    <MdOutlineFileDownload className="size-6 hover:text-black" />
                  </Link>
                </p>
              </>
            )}
          </div>

          {/* Admin Actions: Approve/Reject Buttons */}
          {userData?.role.toLowerCase() === 'admin'
            ? (
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    onClick={handleReject}
                    href="#"
                    className="rounded-full bg-light-danger text-danger hover:bg-danger hover:text-white"
                  >
                    <span className="flex w-full items-center justify-center px-3 py-2 text-xs md:text-sm">
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
                  </Link>
                  <Link
                    href="#"
                    onClick={handleApprove}
                    className="rounded-full bg-light-success text-success hover:bg-success hover:text-white"
                  >
                    <span className="flex w-full items-center justify-center px-3 py-2 text-xs md:text-sm">
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
                  </Link>
                </div>
              )
            : userData?.role.toLowerCase() === 'employee' && leaveData?.status.toLowerCase() === 'pending' && (
              <Link
                onClick={handleWithdraw}
                href="#"
                className="mt-3 block"
              >
                <div className="flex  justify-start">
                  <span className="flex  items-center justify-center gap-2 rounded-full bg-light-warning px-3 py-2 text-xs text-warning hover:bg-warning hover:text-white md:text-sm">
                    {withdrawMutation.isPending
                      ? (
                          <>
                            <span className="mr-2 block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Withdrawing...
                          </>
                        )
                      : (
                          <>
                            <MdClose />
                            Withdraw
                          </>
                        )}
                  </span>
                </div>
              </Link>
            )}
        </div>

        {/* Right Section - Conversation Panel */}
        <div className="hidden shadow-sm md:block md:w-1/2">
          <div className="rounded-t-lg bg-secondary-100 p-4">
            <h4 className="text-base font-medium text-primary-100">Conversation:</h4>
          </div>

          <div
            className="scrollbar flex flex-col overflow-y-auto border-[#F1F1F1] bg-[#FAFAFA] p-4 md:max-h-[40vh] md:min-h-[42vh] xl:max-h-[42vh] xxl:max-h-[50vh]"
            ref={chatContainerRef}
          >
            {conversationMessagesLoading
              ? (
                  <div className="flex flex-1 items-center justify-center">
                    <Loader size="sm" withText text="Loading conversation..." />
                  </div>
                )
              : !conversation || !conversation.messages || conversation.messages.length === 0
                  ? (
                      <NoMessagesFound />
                    )
                  : (
                      <>
                        {conversation.messages.map((chat: any) => (
                          <div
                            key={chat.content + chat.timestamp}
                            className={`mt-4 max-w-[70%] rounded-lg border-[#F1F1F1] p-2 ${
                              chat.senderId._id === userData?.id
                                ? 'ml-auto bg-[#F3F3F3] text-left'
                                : 'mr-auto bg-white text-left'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar src={chat.senderId.profileImage} />
                              <div className="text-xs">
                                <p>{chat.senderId?.name}</p>
                                <p className="text-secondary-300">{format(new Date(chat.timestamp), 'hh:mm a')}</p>
                              </div>
                            </div>
                            <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-xs text-secondary-300">
                              {chat.content}
                            </p>
                          </div>
                        ))}

                        {/* Show "Chat Closed" message if leave is approved or rejected */}
                        {(leaveData?.status === 'Approved' || leaveData?.status === 'Rejected') && (
                          <div className="mt-4 flex justify-center">
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
                      </>
                    )}
            <div ref={scrollAnchorRef} />
          </div>

          {/* Message Input Section - Only show if leave is not approved or rejected */}
          {leaveData?.status !== 'Approved' && leaveData?.status !== 'Rejected' && (
            <div className="relative flex w-full flex-col gap-2 rounded-lg border border-[#F1F1F1] p-2">
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="hide-scrollbar min-h-[10px] resize-none border-none bg-white pr-8 shadow-none focus-visible:ring-0"
                placeholder="Your Reply..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="absolute right-1 top-1/2 flex -translate-y-1/2 justify-end">
                <Button
                  disabled={sendMessageMutation.isPending || !message.trim()}
                  variant="link"
                  onClick={handleSendMessage}
                  className="flex items-center justify-center rounded-full px-4 py-2"
                >
                  <IoMdSend className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLeaveApplication;
