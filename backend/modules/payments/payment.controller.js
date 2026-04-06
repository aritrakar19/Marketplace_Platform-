const svc = require('./payment.service');
const { success } = require('../../utils/response');
exports.createOrder = async (req, res, next) => {
  try { success(res, await svc.createOrder(req.user.uid, req.body)); } catch(e) { next(e); }
};
exports.verify = async (req, res, next) => {
  try { await svc.verify(req.body); success(res, null, 'Verified'); } catch(e) { next(e); }
};