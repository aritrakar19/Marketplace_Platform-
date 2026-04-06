const { error } = require('../utils/response');
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return error(res, 'Permission denied', 403);
  next();
};
module.exports = { restrictTo };