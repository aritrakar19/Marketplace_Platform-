const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
const User = require('../../models/User');

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.firebaseUid;
    const conversations = await Conversation.find({ participants: userId })
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    const formattedConvs = await Promise.all(conversations.map(async (conv) => {
      const partnerId = conv.participants.find(p => p !== userId);
      const partnerUser = await User.findOne({ firebaseUid: partnerId });

      return {
        _id: conv._id,
        id: conv._id,
        partnerId,
        participants: conv.participants,
        partnerName: partnerUser ? (partnerUser.fullName || partnerUser.name || 'User') : 'Unknown User',
        partnerImage: partnerUser?.profileImage || `https://ui-avatars.com/api/?name=${partnerUser?.name || 'User'}&background=random`,
        lastMessage: conv.lastMessage ? conv.lastMessage.content : '',
        time: conv.updatedAt,
      };
    }));

    res.status(200).json({ success: true, data: formattedConvs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    
    // Map them for frontend
    const mappedMessages = messages.map(msg => ({
      _id: msg._id,
      id: msg._id,
      senderId: msg.senderId,
      sender: msg.senderId === req.user.firebaseUid ? 'me' : 'them',
      content: msg.content,
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    res.status(200).json({ success: true, data: mappedMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { content } = req.body;
    const senderId = req.user.firebaseUid;

    const newMsg = new Message({
      conversationId,
      senderId,
      content
    });
    await newMsg.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: newMsg._id,
      updatedAt: new Date()
    });

    res.status(200).json({ success: true, data: newMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};