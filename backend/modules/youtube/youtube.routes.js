const express = require('express');
const { startYouTubeOAuth, youtubeOAuthCallback } = require('./youtube.controller');

const router = express.Router();

router.get('/youtube', startYouTubeOAuth);
router.get('/youtube/callback', youtubeOAuthCallback);

module.exports = router;
