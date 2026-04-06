const { db, admin } = require('../../config/firebase');
exports.add = async (brandId, { talentId, rating, comment }) => {
  return await db.collection('Reviews').add({ brandId, talentId, rating, comment, createdAt: admin.firestore.FieldValue.serverTimestamp() });
};
exports.getTalentReviews = async (talentId) => {
  return (await db.collection('Reviews').where('talentId', '==', talentId).get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
};