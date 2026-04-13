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
        io.to(receiverId).emit('new_message', data);
        // Also emit back to sender for sync
        socket.emit('message_sent', data);
        socket.emit('message_sent', data);
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (err) {
        console.error('Error in send_message:', err.message);
      }
    });

    // Handle message delivered
    socket.on('message_delivered', async (data) => {
      // data: { messageId, senderId }
      try {
        const Message = require('../models/Message');
        // Only update if it exists (using string or objectid works)
        if (data.messageId) {
          await Message.findByIdAndUpdate(data.messageId, { status: 'delivered' });
        }
        // Emit back to sender
        io.to(data.senderId).emit('message_status_update', {
          messageId: data.messageId,
          status: 'delivered'
        });
      } catch (err) {
        console.error('Error in message_delivered:', err.message);
      }
    });

    // Handle messages seen
    socket.on('messages_seen', async (data) => {
      // data: { senderId, receiverId } - receiverId is the person opening the chat
      try {
        const Message = require('../models/Message');
        // Update all previous messages from senderId to receiverId that are not 'seen'
        await Message.updateMany(
          { senderId: data.senderId, receiverId: data.receiverId, status: { $ne: 'seen' } },
          { status: 'seen' }
        );
        // Emit back to sender
        io.to(data.senderId).emit('messages_status_update', {
          receiverId: data.receiverId,
          status: 'seen'
        });
      } catch (err) {
        console.error('Error in messages_seen:', err.message);
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
