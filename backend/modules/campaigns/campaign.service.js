const { db, admin } = require('../../config/firebase');
exports.create = async (brandId, data) => {
  const doc = await db.collection('Campaigns').add({ ...data, brandId, status: 'open', createdAt: admin.firestore.FieldValue.serverTimestamp() });
  return { id: doc.id };
};
exports.getAll = async (status) => {
  let query = db.collection('Campaigns').orderBy('createdAt', 'desc').limit(20);
  if (status) query = db.collection('Campaigns').where('status', '==', status).orderBy('createdAt', 'desc').limit(20);
  return (await query.get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
};