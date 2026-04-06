const router = require('express').Router();
const ctrl = require('./campaign.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
router.post('/', verifyToken, restrictTo('Brand'), ctrl.create);
router.get('/', ctrl.getAll);
module.exports = router;