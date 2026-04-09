const Notification = require('../../models/Notification');
const Invite = require('../../models/Invite');
const { getIO } = require('../../utils/socket');

// Create Invite
exports.createInvite = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.firebaseUid;

    if (!receiverId) {
      console.log("createInvite 400 ERROR: receiverId missing. body:", req.body);
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    // Check if invite already exists
    const existingInvite = await Invite.findOne({ senderId, receiverId, status: 'pending' });
    if (existingInvite) {
      console.log("createInvite 400 ERROR: existingInvite. senderId:", senderId, "receiverId:", receiverId);
      return res.status(400).json({ success: false, message: 'Invite already sent' });
    }

    const invite = new Invite({
      senderId,
      receiverId,
      status: 'pending'
    });

    await invite.save();

    // Create Notification
    const notification = new Notification({
      userId: receiverId,
      senderId,
      type: 'invite',
      message: 'You received a new collaboration invite',
      referenceId: invite._id
    });
    await notification.save();

    // Emit real-time notification to receiver
    try {
      const io = getIO();
      io.to(receiverId).emit('new_invite', {
        inviteId: invite._id,
        senderId,
        senderName: req.user.name || 'A Brand', // Assuming req.user has name from auth middleware
        createdAt: invite.createdAt
      });
    } catch (socketErr) {
      console.error('Socket notification failed:', socketErr.message);
    }

    res.status(201).json({ success: true, data: invite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Invites for logged-in user
exports.getInvites = async (req, res) => {
  try {
    const userId = req.user.firebaseUid;
    // Get invites where user is either sender or receiver
    const invites = await Invite.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: invites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept or Reject Invite
exports.updateInviteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const userId = req.user.firebaseUid;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const invite = await Invite.findById(id);

    if (!invite) {
      return res.status(404).json({ success: false, message: 'Invite not found' });
    }

    // Only the receiver can accept/reject
    if (invite.receiverId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this invite' });
    }

    invite.status = status;
    await invite.save();

    // If accepted, notify the brand and create Connection & Conversation
    if (status === 'accepted') {
      try {
        const Connection = require('../../models/Connection');
        const Conversation = require('../../models/Conversation');
        
        // 1. Check if connection already exists
        const existingConnection = await Connection.findOne({
          $or: [
            { user1: invite.senderId, user2: invite.receiverId },
            { user1: invite.receiverId, user2: invite.senderId }
          ]
        });

        if (!existingConnection) {
          const newConnection = new Connection({
            user1: invite.senderId,
            user2: invite.receiverId
          });
          await newConnection.save();
        }

        // 2. Check if conversation already exists
        const existingConv = await Conversation.findOne({
          participants: { $all: [invite.senderId, invite.receiverId] }
        });

        if (!existingConv) {
          const newConv = new Conversation({
            participants: [invite.senderId, invite.receiverId]
          });
          await newConv.save();
        }

        const io = getIO();
        io.to(invite.senderId).emit('invite_accepted', {
          inviteId: invite._id,
          receiverId: invite.receiverId,
          receiverName: req.user.name || 'A Talent'
        });
      } catch (err) {
        console.error('Accept flow error:', err.message);
      }
    }

    res.status(200).json({ success: true, data: invite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};