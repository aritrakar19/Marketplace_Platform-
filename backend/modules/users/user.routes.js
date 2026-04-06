const router = require('express').Router();
const userCtrl = require('./user.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
const { ROLES } = require('../../utils/constants');
router.get('/', verifyToken, restrictTo(ROLES.ADMIN), userCtrl.getAllUsers);
module.exports = router;