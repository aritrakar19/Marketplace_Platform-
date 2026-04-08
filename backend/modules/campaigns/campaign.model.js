const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, required: true },
  campaignType: { type: String, required: true },
  platform: { type: String, required: true },
  createdBy: { type: String, required: true }, // firebaseUid
  status: { type: String, default: 'open' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', CampaignSchema);