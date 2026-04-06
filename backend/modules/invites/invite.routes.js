const router = require('express').Router();
const ctrl = require('./invite.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
router.post('/', verifyToken, restrictTo('Brand'), ctrl.send);
router.get('/talent', verifyToken, restrictTo('Talent'), ctrl.getTalentInvites);
router.patch('/:inviteId/status', verifyToken, restrictTo('Talent'), ctrl.updateStatus);
module.exports = router;