const router = require('express').Router();
const ctrl = require('./campaign.controller');
const { verifyFirebaseToken } = require('../../middleware/authMiddleware');
const { restrictTo } = require('../../middleware/role.middleware');

router.post('/', verifyFirebaseToken, restrictTo('brand'), ctrl.create);
router.get('/', ctrl.getAll);
router.get('/count', ctrl.getCount);
router.get('/:id', ctrl.getById);

module.exports = router;