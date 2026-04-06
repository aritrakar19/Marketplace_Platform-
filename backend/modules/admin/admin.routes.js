const router = require('express').Router();
const ctrl = require('./admin.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
router.use(verifyToken, restrictTo('Admin'));
router.patch('/users/:talentId/verify', ctrl.verifyTalent);
router.delete('/users/:userId', ctrl.deleteUser);
module.exports = router;