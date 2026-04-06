const { db, admin } = require('../../config/firebase');
exports.save = async (uid, data) => {
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  data.userId = uid;
  const docRef = db.collection('TalentProfiles').doc(uid);
  const doc = await docRef.get();
  if (!doc.exists) {
    data.verified = false;
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }
  await docRef.set(data, { merge: true });
};
exports.getById = async (id) => {
  const doc = await db.collection('TalentProfiles').doc(id).get();
  if (!doc.exists) throw new Error('Not found');
  return doc.data();
};
exports.search = async (queryReq) => {
  let query = db.collection('TalentProfiles');
  if (queryReq.category) query = query.where('category', '==', queryReq.category);
  const snap = await query.get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};