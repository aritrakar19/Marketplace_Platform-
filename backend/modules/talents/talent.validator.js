const Joi = require('joi');
exports.talentValidator = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string().allow('', null),
  category: Joi.string().required(),
  subCategory: Joi.string().required()
}).unknown(true);