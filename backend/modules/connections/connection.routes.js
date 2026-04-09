const express = require('express');
const router = express.Router();
const connectionController = require('./connection.controller');
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');

router.get('/', verifyFirebaseToken, connectionController.getConnections);

module.exports = router;
