const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: String, // using firebaseUid or mongo ObjectId string
    required: true
  },
  role: {
    type: String,
    enum: ['talent', 'brand'],
    required: true
  },
  category: {
    type: String,
    default: 'Other'
  },
  eventType: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Online'
  },
  location: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  deadline: {
    type: Date
  },
  requirements: {
    type: String
  },
  budget: {
    type: String
  },
  perks: {
    type: String
  },
  tags: [{
    type: String
  }],
  image: {
    type: String
  },
  applicants: [applicantSchema],
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
