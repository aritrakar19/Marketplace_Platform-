const { db, admin } = require('../../config/firebase');
exports.send = async (senderId, { receiverId, message }) => {
  return await db.collection('Chats').add({ senderId, receiverId, message, timestamp: admin.firestore.FieldValue.serverTimestamp() });
};
exports.getHistory = async (userId, partnerId) => {
  // In production requires composite index
  const qs1 = await db.collection('Chats').where('senderId','==',userId).where('receiverId','==',partnerId).get();
  const qs2 = await db.collection('Chats').where('senderId','==',partnerId).where('receiverId','==',userId).get();
  const msgs = [...qs1.docs, ...qs2.docs].map(d => ({id: d.id, ...d.data()}));
  return msgs.sort((a,b) => (a.timestamp?.toMillis()||0) - (b.timestamp?.toMillis()||0));
};