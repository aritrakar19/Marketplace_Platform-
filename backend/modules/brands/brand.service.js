const { db, admin } = require('../../config/firebase');
exports.save = async (uid, data) => {
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  data.userId = uid;
  const docRef = db.collection('BrandProfiles').doc(uid);
  if (!(await docRef.get()).exists) data.createdAt = admin.firestore.FieldValue.serverTimestamp();
  await docRef.set(data, { merge: true });
};
exports.getById = async (id) => {
  const doc = await db.collection('BrandProfiles').doc(id).get();
  if (!doc.exists) throw new Error('Not found');
  return doc.data();
};