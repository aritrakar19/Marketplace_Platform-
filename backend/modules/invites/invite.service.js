const { db, admin } = require('../../config/firebase');
exports.send = async (brandId, { talentId, message }) => {
  return await db.collection('Invites').add({ brandId, talentId, message, status: 'pending', createdAt: admin.firestore.FieldValue.serverTimestamp() });
};
exports.getTalentInvites = async (talentId) => {
  return (await db.collection('Invites').where('talentId', '==', talentId).get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
exports.updateStatus = async (inviteId, talentId, status) => {
  const ref = db.collection('Invites').doc(inviteId);
  const doc = await ref.get();
  if (!doc.exists || doc.data().talentId !== talentId) throw new Error('Unauthorized');
  await ref.update({ status });
};