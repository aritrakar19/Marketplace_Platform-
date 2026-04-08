const Campaign = require('./campaign.model');
const User = require('../../models/User');

exports.create = async (brandId, data) => {
  const campaign = new Campaign({ ...data, createdBy: brandId, status: 'open' });
  await campaign.save();
  return campaign;
};

exports.getAll = async (status) => {
  const query = status ? { status } : {};
  const campaigns = await Campaign.find(query).sort({ createdAt: -1 }).limit(20).lean();
  
  const userIds = [...new Set(campaigns.map(c => c.createdBy))];
  const users = await User.find({ firebaseUid: { $in: userIds } }).lean();
  
  const userMap = {};
  users.forEach(u => { userMap[u.firebaseUid] = u; });

  return campaigns.map(c => ({
    ...c,
    id: c._id,
    brandInfo: userMap[c.createdBy] || null
  }));
};

exports.getById = async (id) => {
  const campaign = await Campaign.findById(id).lean();
  if (!campaign) return null;
  const user = await User.findOne({ firebaseUid: campaign.createdBy }).lean();
  return {
    ...campaign,
    id: campaign._id,
    brandInfo: user || null
  };
};

exports.getCount = async (status) => {
  const query = status ? { status } : {};
  return await Campaign.countDocuments(query);
};