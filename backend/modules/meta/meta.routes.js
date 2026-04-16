const express = require('express');
const { startMetaOAuth, metaOAuthCallback } = require('./meta.controller');

const router = express.Router();

router.get('/meta', startMetaOAuth);
router.get('/meta/callback', metaOAuthCallback);

module.exports = router;
