const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getProfilePosts, deletePost } = require('../controllers/feedPostController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

router.post('/', verifyFirebaseToken, createPost);
router.get('/', getAllPosts);
router.get('/user/:userId', getProfilePosts);
router.delete('/:id', verifyFirebaseToken, deletePost);

module.exports = router;
