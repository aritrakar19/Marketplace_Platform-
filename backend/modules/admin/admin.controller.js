const svc = require('./admin.service');
const { success } = require('../../utils/response');
exports.verifyTalent = async (req, res, next) => {
  try { await svc.verifyTalent(req.params.talentId, req.body.verified); success(res, null, 'Verified'); } catch(e) { next(e); }
};
exports.deleteUser = async (req, res, next) => {
  try { await svc.deleteUser(req.params.userId); success(res, null, 'Deleted'); } catch(e) { next(e); }
};