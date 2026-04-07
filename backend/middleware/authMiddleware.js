const User = require('../models/User');

/**
 * Decodes a Firebase JWT without verifying the signature.
 * This allows the app to work locally without a Firebase service account.
 * NOTE: For production, replace this with proper Firebase Admin SDK verification.
 */
const decodeFirebaseToken = (token) => {
  try {
    // Firebase JWTs are standard base64url-encoded JWTs (header.payload.signature)
    const payload = token.split('.')[1];
    // base64url → base64 → JSON
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    );
    return decoded;
  } catch (e) {
    return null;
  }
};

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized, token missing' });
    }

    const token = authHeader.split(' ')[1];

    // Decode the Firebase JWT to extract uid (skip signature verification for dev)
    const decoded = decodeFirebaseToken(token);

    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ success: false, message: 'Unauthorized, invalid token format' });
    }

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ success: false, message: 'Unauthorized, token expired' });
    }

    // Look up user in MongoDB
    const user = await User.findOne({ firebaseUid: decoded.user_id });

    // Attach to request
    req.user = {
      firebaseUid: decoded.user_id,
      email: decoded.email,
      ...(user ? user.toObject() : {})
    };

    next();
  } catch (error) {
    console.error('Token decode error:', error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized', error: error.message });
  }
};

module.exports = { verifyFirebaseToken };
