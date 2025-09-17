import type { StaticImageData } from 'next/image';

type Conversation = {
  id: number;
  sender: string;
  avatar: StaticImageData;
  time: string;
  message: string;
  isAdmin: boolean;
};

export default Conversation;
