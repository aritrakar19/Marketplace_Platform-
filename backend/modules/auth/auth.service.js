const { db, admin } = require('../../config/firebase');
exports.register = async ({ uid, email, role }) => {
  if (!['Talent', 'Brand', 'Admin'].includes(role)) throw new Error('Invalid role');
  await db.collection('Users').doc(uid).set({ email, role, createdAt: admin.firestore.FieldValue.serverTimestamp() });
};
exports.getUserProfile = async (uid) => {
  const doc = await db.collection('Users').doc(uid).get();
  if (!doc.exists) throw new Error('User not found');
  return doc.data();
};