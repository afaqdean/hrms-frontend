import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as NetServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      // eslint-disable-next-line no-console
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  return res.socket.server.io;
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  initSocket(res);
  res.status(200).json({ message: 'Socket server initialized' });
}
