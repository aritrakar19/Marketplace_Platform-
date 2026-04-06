const Joi = require('joi');
exports.brandValidator = Joi.object({ companyName: Joi.string().required(), industry: Joi.string().required() }).unknown(true);