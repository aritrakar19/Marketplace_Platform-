const { db } = require('../../config/firebase');
exports.getAllUsers = async () => {
  const snapshot = await db.collection('Users').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};