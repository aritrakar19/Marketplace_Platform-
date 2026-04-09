const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  user1: {
    type: String, // firebaseUid
    required: true,
    index: true
  },
  user2: {
    type: String, // firebaseUid
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Connection', ConnectionSchema);
