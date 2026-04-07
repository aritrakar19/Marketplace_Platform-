const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['talent', 'brand', 'admin'],
    required: true
  },
  category: {
    type: String,
    required: false
  },
  fullName: String,
  profileImage: String,
  displayName: String,
  subCategory: String,
  bio: String,
  location: String,
  followers: String,
  engagementRate: String,
  portfolio: [String],
  socialMedia: {
    instagram: String,
    youtube: String,
    twitter: String,
    tiktok: String
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt
});

module.exports = mongoose.model('User', UserSchema);
