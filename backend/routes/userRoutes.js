const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile, updateUserProfile, getUserById } = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

// POST /api/users/register
router.post('/register', registerUser);

// GET /api/users/me (Protected route)
router.get('/me', verifyFirebaseToken, getUserProfile);

// GET /api/users/:id (Protected route)
router.get('/:id', verifyFirebaseToken, getUserById);

// PUT /api/users/profile (Protected route)
router.put('/profile', verifyFirebaseToken, updateUserProfile);

module.exports = router;
