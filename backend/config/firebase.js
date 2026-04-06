const admin = require('firebase-admin');
require('dotenv').config();
let db;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  } else {
    admin.initializeApp();
  }
  db = admin.firestore();
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}
module.exports = { admin, db };
