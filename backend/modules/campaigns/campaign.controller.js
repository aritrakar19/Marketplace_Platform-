const svc = require('./campaign.service');
const { success } = require('../../utils/response');
exports.create = async (req, res, next) => {
  try { success(res, await svc.create(req.user.uid, req.body), 'Created', 201); } catch (e) { next(e); }
};
exports.getAll = async (req, res, next) => {
  try { success(res, await svc.getAll(req.query.status)); } catch (e) { next(e); }
};