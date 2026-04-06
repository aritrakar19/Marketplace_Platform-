const router = require('express').Router();
const authCtrl = require('./auth.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
router.post('/register', authCtrl.register);
router.get('/me', verifyToken, authCtrl.me);
module.exports = router;