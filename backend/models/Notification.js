const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['invite', 'system', 'other', 'application'],
    default: 'invite',
  },
  message: {
    type: String,
    required: true,
  },
  referenceId: {
    type: String,
  },
  eventId: {
    type: String,
  },
  fromUser: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
