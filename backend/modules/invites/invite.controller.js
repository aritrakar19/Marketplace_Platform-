const svc = require('./invite.service');
const { success } = require('../../utils/response');
exports.send = async (req, res, next) => {
  try { success(res, await svc.send(req.user.uid, req.body), 'Sent', 201); } catch (e) { next(e); }
};
exports.getTalentInvites = async (req, res, next) => {
  try { success(res, await svc.getTalentInvites(req.user.uid)); } catch (e) { next(e); }
};
exports.updateStatus = async (req, res, next) => {
  try { await svc.updateStatus(req.params.inviteId, req.user.uid, req.body.status); success(res, null, 'Updated'); } catch (e) { next(e); }
};