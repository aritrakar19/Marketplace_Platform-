const router = require('express').Router();
const ctrl = require('./payment.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
router.post('/create-order', verifyToken, restrictTo('Brand'), ctrl.createOrder);
router.post('/verify', verifyToken, restrictTo('Brand'), ctrl.verify);
module.exports = router;