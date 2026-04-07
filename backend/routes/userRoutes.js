const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

// POST /api/users/register
router.post('/register', registerUser);

// GET /api/users/me (Protected route)
router.get('/me', verifyFirebaseToken, getUserProfile);

// PUT /api/users/profile (Protected route)
router.put('/profile', verifyFirebaseToken, updateUserProfile);

module.exports = router;
