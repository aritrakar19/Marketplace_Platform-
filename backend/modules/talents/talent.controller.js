const talentService = require('./talent.service');
const response = require('../../utils/response');
exports.createOrUpdate = async (req, res, next) => {
  try { await talentService.save(req.user.uid, req.body); response.success(res, null, 'Saved'); } catch(err) { next(err); }
};
exports.getById = async (req, res, next) => {
  try { response.success(res, await talentService.getById(req.params.id)); } catch(err) { next(err); }
};
exports.search = async (req, res, next) => {
  try { response.success(res, await talentService.search(req.query)); } catch(err) { next(err); }
};