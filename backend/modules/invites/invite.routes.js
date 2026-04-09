const express = require('express');
const router = express.Router();
const inviteController = require('./invite.controller');
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');

// All routes require authentication
router.use(verifyFirebaseToken);

// POST /api/invites -> Create invite
router.post('/', inviteController.createInvite);

// GET /api/invites -> Get invites for user
router.get('/', inviteController.getInvites);

// PUT /api/invites/:id -> Update status
router.put('/:id', inviteController.updateInviteStatus);

module.exports = router;