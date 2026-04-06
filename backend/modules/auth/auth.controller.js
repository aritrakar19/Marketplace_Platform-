const authService = require('./auth.service');
const response = require('../../utils/response');
exports.register = async (req, res, next) => {
  try {
    await authService.register(req.body);
    response.success(res, null, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};
exports.me = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.uid);
    response.success(res, user);
  } catch (err) {
    next(err);
  }
};