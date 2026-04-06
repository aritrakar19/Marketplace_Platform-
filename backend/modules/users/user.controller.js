const userService = require('./user.service');
const response = require('../../utils/response');
exports.getAllUsers = async (req, res, next) => {
  try { response.success(res, await userService.getAllUsers()); } catch(err) { next(err); }
};