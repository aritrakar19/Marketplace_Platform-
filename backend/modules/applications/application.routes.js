const router = require('express').Router();
const ctrl = require('./application.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
router.post('/:campaignId/apply', verifyToken, restrictTo('Talent'), ctrl.apply);
router.patch('/:applicationId/status', verifyToken, restrictTo('Brand'), ctrl.updateStatus);
module.exports = router;