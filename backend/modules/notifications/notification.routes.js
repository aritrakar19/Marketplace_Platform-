const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('./notification.controller');
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');

router.use(verifyFirebaseToken);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.patch('/:id', markAsRead);

module.exports = router;
