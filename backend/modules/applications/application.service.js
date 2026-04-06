const { db, admin } = require('../../config/firebase');
exports.apply = async (campaignId, talentId) => {
  return await db.collection('Applications').add({ campaignId, talentId, status: 'pending', createdAt: admin.firestore.FieldValue.serverTimestamp() });
};
exports.updateStatus = async (id, status) => {
  if(!['accepted','rejected'].includes(status)) throw new Error('Invalid status');
  await db.collection('Applications').doc(id).update({ status });
};