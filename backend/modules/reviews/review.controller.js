const svc = require('./review.service');
const { success } = require('../../utils/response');
exports.add = async (req, res, next) => {
  try { success(res, await svc.add(req.user.uid, req.body), 'Added', 201); } catch(e) { next(e); }
};
exports.getTalentReviews = async (req, res, next) => {
  try { success(res, await svc.getTalentReviews(req.params.talentId)); } catch(e) { next(e); }
};