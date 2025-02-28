const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
});

const updateStatusSchema = Joi.object({
  favorite: Joi.string().required(),
});

module.exports = { addSchema, updateStatusSchema };
