import type { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInitializer = async () => {
      await fetch('/api/socket');
      const newSocket = io();

      newSocket.on('connect', () => {
        // eslint-disable-next-line no-console
        console.log('Connected to socket server');
      });

      newSocket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log('Disconnected from socket server');
      });

      setSocket(newSocket);
    };

    socketInitializer();

    // Cleanup on unmount
    return () => {
      if (socket) {
        // Remove all event listeners before disconnecting
        socket.off('connect');
        socket.off('disconnect');
        socket.disconnect();
      }
    };
  }, [socket]);

  return socket;
};
