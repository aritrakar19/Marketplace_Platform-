const express = require('express');
const router = express.Router();
const { createStory, getActiveStories, deleteStory, markStoryAsViewed, reactToStory } = require('../controllers/storyController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

router.post('/', verifyFirebaseToken, createStory);
router.get('/', getActiveStories);
router.delete('/:id', verifyFirebaseToken, deleteStory);
router.post('/:id/view', verifyFirebaseToken, markStoryAsViewed);
router.post('/:id/react', verifyFirebaseToken, reactToStory);

module.exports = router;
