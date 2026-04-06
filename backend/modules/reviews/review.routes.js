const router = require('express').Router();
const ctrl = require('./review.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
router.post('/', verifyToken, restrictTo('Brand'), ctrl.add);
router.get('/talent/:talentId', ctrl.getTalentReviews);
module.exports = router;