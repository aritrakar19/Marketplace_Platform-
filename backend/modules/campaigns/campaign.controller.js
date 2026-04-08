const svc = require('./campaign.service');
const { success } = require('../../utils/response');

exports.create = async (req, res, next) => {
  try { success(res, await svc.create(req.user.firebaseUid, req.body), 'Created', 201); } catch (e) { next(e); }
};

exports.getAll = async (req, res, next) => {
  try { success(res, await svc.getAll(req.query.status)); } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try { 
    const campaign = await svc.getById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Not found' });
    success(res, campaign); 
  } catch (e) { next(e); }
};

exports.getCount = async (req, res, next) => {
  try { success(res, { count: await svc.getCount(req.query.status) }); } catch (e) { next(e); }
};