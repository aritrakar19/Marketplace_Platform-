const express = require('express');
const router = express.Router();
const chatController = require('./chat.controller');
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');

router.get('/', verifyFirebaseToken, chatController.getConversations);
router.get('/:id/messages', verifyFirebaseToken, chatController.getHistory);
router.post('/:id/messages', verifyFirebaseToken, chatController.sendMessage);

module.exports = router;