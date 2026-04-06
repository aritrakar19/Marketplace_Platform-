const svc = require('./application.service');
const { success } = require('../../utils/response');
exports.apply = async (req, res, next) => {
  try { success(res, await svc.apply(req.params.campaignId, req.user.uid), 'Applied', 201); } catch (e) { next(e); }
};
exports.updateStatus = async (req, res, next) => {
  try { await svc.updateStatus(req.params.applicationId, req.body.status); success(res, null, 'Updated'); } catch (e) { next(e); }
};