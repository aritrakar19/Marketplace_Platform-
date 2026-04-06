const { error } = require('../utils/response');
const validate = (schema) => (req, res, next) => {
  const { error: err } = schema.validate(req.body, { abortEarly: false });
  if (err) return error(res, err.details.map((d) => d.message).join(', '), 400);
  next();
};
module.exports = validate;