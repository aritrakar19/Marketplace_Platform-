import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
  const { currentUser, userData } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      // Initialize socket connection
      const socket = io(SOCKET_URL);
      socketRef.current = socket;

      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Socket connected');
        
        // Join user room
        socket.emit('join_room', currentUser.uid);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Socket disconnected');
      });

      // Listen for notifications
      socket.on('new_invite', (data) => {
        toast.info(`New invite from ${data.senderName}`, {
          description: 'Check your dashboard to accept or reject.',
          duration: 5000,
        });
      });

      socket.on('invite_accepted', (data) => {
        toast.success(`Invite accepted by ${data.receiverName}`, {
          description: 'You can now start chatting!',
          duration: 5000,
        });
      });

      socket.on('error_message', (data) => {
        toast.error(data.message);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [currentUser]);

  const sendMessage = (receiverId: string, content: string) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit('send_message', {
        senderId: currentUser.uid,
        receiverId,
        content,
        timestamp: new Date().toISOString()
      });
    }
  };

  const onMessage = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('receive_message', callback);
      return () => {
        socketRef.current?.off('receive_message', callback);
      };
    }
    return () => {};
  };

  return { socket: socketRef.current, isConnected, sendMessage, onMessage };
};
