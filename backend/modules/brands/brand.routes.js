const router = require('express').Router();
const brandCtrl = require('./brand.controller');
const { verifyToken } = require('../../middleware/auth.middleware');
const { restrictTo } = require('../../middleware/role.middleware');
const validate = require('../../middleware/validate.middleware');
const { brandValidator } = require('./brand.validator');
router.post('/', verifyToken, restrictTo('Brand'), validate(brandValidator), brandCtrl.createOrUpdate);
router.get('/:id', brandCtrl.getById);
module.exports = router;