const brandService = require('./brand.service');
const response = require('../../utils/response');
exports.createOrUpdate = async (req, res, next) => {
  try { await brandService.save(req.user.uid, req.body); response.success(res, null, 'Saved'); } catch(err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try { response.success(res, await brandService.getById(req.params.id)); } catch(err) { next(err); }
};