const { Server } = require('socket.io');
const Invite = require('../models/Invite');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', 
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room based on firebaseUid
    socket.on('join_room', (firebaseUid) => {
      socket.join(firebaseUid);
      console.log(`User ${firebaseUid} joined room`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      // data: { senderId, receiverId, content, timestamp }
      const { senderId, receiverId, content } = data;

      try {
        // Check if an accepted invite exists between these two users
        const acceptedInvite = await Invite.findOne({
          $or: [
            { senderId, receiverId, status: 'accepted' },
            { senderId: receiverId, receiverId: senderId, status: 'accepted' }
          ]
        });

        if (!acceptedInvite) {
          console.log(`Blocked message from ${senderId} to ${receiverId}: No accepted invite`);
          socket.emit('error_message', { message: 'You can only chat after an invite is accepted.' });
          return;
        }

        // Emit to receiver's room
        io.to(receiverId).emit('receive_message', data);
        // Also emit back to sender for sync
        socket.emit('message_sent', data);
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (err) {
        console.error('Error in send_message:', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };
