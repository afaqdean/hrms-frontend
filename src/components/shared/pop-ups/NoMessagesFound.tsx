import messagesNotFound from '@/public/assets/messagesNotFound.png';
import Image from 'next/image';

// Component to display when there are no messages in the conversation
const NoMessagesFound = () => (
  <div className="flex w-full flex-col items-center justify-center bg-secondary-100 p-4 xl:h-[49vh]">
    <Image src={messagesNotFound} alt="no-record-found" height={72} width={72} />
    <p className="mt-2 text-center text-sm text-secondary-400">
      No messages yet. Start a conversation to see your chats here
    </p>
  </div>
);

export default NoMessagesFound;
