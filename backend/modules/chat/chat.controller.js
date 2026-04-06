const svc = require('./chat.service');
const { success } = require('../../utils/response');
exports.send = async (req, res, next) => {
  try { success(res, await svc.send(req.user.uid, req.body), 'Sent'); } catch(e) { next(e); }
};
exports.getHistory = async (req, res, next) => {
  try { success(res, await svc.getHistory(req.user.uid, req.params.partnerId)); } catch(e) { next(e); }
};