const router = require('express').Router();
const ctrl = require('./chat.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
router.post('/', verifyToken, ctrl.send);
router.get('/:partnerId', verifyToken, ctrl.getHistory);
module.exports = router;