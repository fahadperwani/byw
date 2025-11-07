const Joi = require("joi");

const createVenueHelperBodySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  phone: Joi.string().min(10).max(15).optional(),
  cost: Joi.number().min(0).optional(),
  email: Joi.string().email().required(),
  notes: Joi.string().max(500).allow(null, "").optional(),
  roles: Joi.array().items(Joi.string()).required(),
}).or("phone", "cost");

module.exports = { createVenueHelperBodySchema };
