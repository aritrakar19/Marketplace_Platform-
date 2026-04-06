const { db, admin } = require('../../config/firebase');
exports.verifyTalent = async (talentId, verified) => {
  await db.collection('TalentProfiles').doc(talentId).update({ verified });
};
exports.deleteUser = async (userId) => {
  await db.collection('Users').doc(userId).delete();
  try { await admin.auth().deleteUser(userId); } catch (e) { console.warn('Auth deletion fail', e); }
};