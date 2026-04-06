const { admin, db } = require('../config/firebase');
const { error } = require('../utils/response');
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return error(res, 'No token provided', 401);
  try {
    req.user = await admin.auth().verifyIdToken(authHeader.split(' ')[1]);
    const userDoc = await db.collection('Users').doc(req.user.uid).get();
    if (userDoc.exists) req.user.role = userDoc.data().role;
    next();
  } catch (err) {
    return error(res, 'Invalid token', 401);
  }
};
module.exports = { verifyToken };