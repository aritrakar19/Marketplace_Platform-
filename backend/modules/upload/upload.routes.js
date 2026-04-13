const express = require('express');
const router = express.Router();
const uploadCtrl = require('./upload.controller');
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');

// Using verifyFirebaseToken as all authenticated users can upload files.
router.post('/upload', verifyFirebaseToken, uploadCtrl.uploadMiddleware, uploadCtrl.uploadFile);

// For getting the file, we can optionally protect it, but typically images might be served directly via URL in UI. 
// If they must be protected, we can keep it open but use unique unguessable IDs (Mongo ObjectIds are fairly safe, but could be exposed). Let's protect it just in case if UI sends token. 
// However, regular <img> src tags don't send auth headers automatically. So we leave GET open to allow simple img SRC rendering for now, or adapt based on needs.
router.get('/file/:id', uploadCtrl.getFile);

module.exports = router;
